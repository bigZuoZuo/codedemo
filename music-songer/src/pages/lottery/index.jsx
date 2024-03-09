import React, { useEffect, useRef } from "react";
import { observer, useLocalStore } from "mobx-react";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import Banner from "@src/components/banner";
import { postLotterynew, getUserIcon } from "@src/services";
import { toast } from "@src/system";
import AwardModal from "@src/components/modal/award";
import giftNameMap from "@src/lib/gift.constant";
import Image from "react-image-webp";
import {
  BannerLinkRule,
  BannerLinkPack,
  BottomBg,
} from "@src/components/banner/links";

import "./index.scoped.css";
import img21211 from "@src/assets/images/img21211.png";
import img21198 from "@src/assets/images/img21198.png";
import img21172 from "@src/assets/images/img21172.png";
import img2109 from "@src/assets/images/img2109.png";
import img21150 from "@src/assets/images/img21150.png";
import img21149 from "@src/assets/images/img21149.png";
import img21148 from "@src/assets/images/img21148.png";
import img21171 from "@src/assets/images/img21171.png";
import img21147 from "@src/assets/images/img21147.png";
import img21146 from "@src/assets/images/img21146.png";
import img20269 from "@src/assets/images/img20269.png";
import imgTanks from "@src/assets/images/img-thanks.png";

// right
const gift_list = [
  { id: 21211, imgs: [img21211] },
  { id: 21198, imgs: [img21198] },
  { id: 21172, imgs: [img21172] },
  { id: 2109, imgs: [img2109] },
  { id: 21150, imgs: [img21150] },
  { id: 21149, imgs: [img21149] },
  { id: 21148, imgs: [img21148] },
  { id: 21171, imgs: [img21171] },
  { id: 21147, imgs: [img21147] },
  { id: 21146, imgs: [img21146] },
  { id: 20269, imgs: [img20269] },
  { id: 0, imgs: [imgTanks] },
];


const maxSpeed = 300;
const minSpeed = 40;
const maxQuickRollTimes = 12;

const LotteryPage = () => {
  const history = useHistory();
  const timeRef = useRef();
  const multipleRef = useRef(false);

  const store = useLocalStore(() => ({
    prize_id: -1,
    coin: 0,
    activeIndex: -1,
    _speed: maxSpeed,
    quickRollTimes: 0,
    isLotterying: false,
    award_list: [],
    get maxLotteryTimes() {
      if (store.coin <= 0) {
        return 50;
      }

      return store.coin > 50 ? 50 : store.coin;
    },
    get speed() {
      return store._speed;
    },
    set speed(val) {
      if (val >= maxSpeed) {
        val = maxSpeed;
      }
      if (val <= minSpeed) {
        val = minSpeed;
      }

      store._speed = val;
    },
    async getUserIcon() {
      const data = await getUserIcon();
      store.coin = data.coin;
    },
    resetRollState() {
      store.quickRollTimes = 0;
      store.isLotterying = false;
      multipleRef.current = false;
      store.award_list = [];
    },
    async lottery(ev) {
      const multiple = +ev.target.dataset.multiple || 0;
      if (store.coin < 1) {
        toast("在活动页面每投出9张应援票可获得1枚幸运币");
        return;
      }

      if (store.isLotterying) {
        toast("抽奖中...");
        return;
      }
      try {
        this.resetRollState();
        store.isLotterying = true;
        if (multiple === 1) {
          multipleRef.current = true;
        }

        const dataNew = await postLotterynew(
          multipleRef.current ? store.maxLotteryTimes : 1
        );
        // const dataNew = {
        //   lottery_data: [
        //     {
        //       cid: 2109,
        //       num: 3,
        //     },
        //     {
        //       cid: 21172,
        //       num: 1,
        //     },
        //     {
        //       cid: 0,
        //       num: 10,
        //     },
        //   ],
        // };
        // const dataNew = {
        //   lottery_data: [
        //     {
        //       cid: 0,
        //       num: 1,
        //     },
        //   ],
        // };
        // const dataNew = {
        //   lottery_data: [
        //   ],
        // };
        var data = {};

        if (dataNew.lottery_data.length === 0) {
          data = {
            0: 1
          }
        } else {
          dataNew.lottery_data.forEach((item) => {
            data[item.cid] = item.num;
          })
        }
        console.log(data)

        // const data = await postLottery(
        //   multipleRef.current ? store.maxLotteryTimes : 1
        // );
        // const data = { 2109: 3, 21172: 1 };
        const keys = Object.keys(data);
        // console.log(keys)
        if (!keys || !keys.length || keys[0] === undefined) {
          toast("抽奖出错");
          return;
        }

        if (!multipleRef.current) {
          store.prize_id = +keys[0];
        } else {
          store.prize_id = 0;
          store.award_list = gift_list
            .filter((item) => !!data[item.id])
            .map((item) => ({
              name: `${giftNameMap[item.id]} * ${data[item.id]}`,
              img: item.imgs[0],
            }));
        }

        store.start();
      } catch (err) { }
    },
    start() {
      if (store.activeIndex !== -1) {
        store.activeIndex = -1;
      }

      store.isLotterying = true;
      store.lotteryAction();
    },
    showResultModal() {
      let list = [];
      if (multipleRef.current) {
        store.activeIndex = -1;
        list = store.award_list.map((item) => ({ ...item }));
      } else {
        list = gift_list
          .filter((item) => item.id === store.prize_id)
          .map((item) => ({
            name: giftNameMap[item.id] || "",
            img: item.imgs[0],
          }));
      }

      store.resetRollState();
      store.getUserIcon();

      if (list.length) {
        console.log(list)
        AwardModal.show(list);
        store.prize_id = -1;
        store.activeIndex = -1;
      }
    },
    lotteryAction() {
      // if (multipleRef.current) {
      // store.activeIndex = Math.floor(Math.random() * (11 + 1));
      // } else {
      store.activeIndex = (store.activeIndex + 1) % gift_list.length;
      // }

      if (store.quickRollTimes < maxQuickRollTimes && store.speed > minSpeed) {
        store.speed -= 20;
      } else {
        store.speed += 40;

        if (store.speed === maxSpeed && gift_list[store.activeIndex].id === store.prize_id) {
          clearTimeout(timeRef.current);
          store.showResultModal();
          return;
        }
      }

      if (store.speed === minSpeed) {
        store.quickRollTimes++;
      }

      timeRef.current = setTimeout(this.lotteryAction, store.speed);
    },
    toLotteryRecords() {
      history.push("/lottery-records");
    },
    toHome() {
      history.push("/");
    },
  }));

  useEffect(() => {
    store.getUserIcon();

    return () => {
      clearTimeout(timeRef);
    };
  }, []);

  return (
    <div className="lottery-page">
      <Banner>
        <BannerLinkRule />
        <BannerLinkPack />
      </Banner>
      <div className="lottery-pannel">
        <div className="lottery-layer">
          {gift_list.map((item, index) => (
            <div
              key={item.id}
              className={clsx(
                "lottery-item",
                store.activeIndex === index && "on"
              )}
            >
              {item.imgs.length > 1 ? (
                <Image
                  className="lottery-item-img"
                  src={item.imgs[0]}
                  webp={item.imgs[1]}
                />
              ) : (
                <img className="lottery-item-img" src={item.imgs[0]} alt="" />
              )}
            </div>
          ))}
        </div>
        <div className="lottery-info">
          <div className="lottery-info-left">
            <span className="lottery-coin-txt">我的幸运币:</span>
            <span className="lottery-info-coin">{store.coin}</span>
            <span className="lottery-btn-charge" onClick={store.toHome} />
          </div>
          <div
            className="lottery-info-right"
            onClick={store.toLotteryRecords}
          >
            抽奖记录 &gt;
          </div>
        </div>
        <div className="lottery-btn-group">
          <div
            className="lottery-btn1"
            data-multiple={0}
            onClick={store.lottery}
          >
            抽1次
          </div>
          <div
            className="lottery-btn2"
            data-multiple={1}
            onClick={store.lottery}
          >
            抽{store.maxLotteryTimes}次
          </div>
        </div>
        <div className="lottery-rule">
          <div className="lottery-rule-title">对应奖励名称</div>
          <div className="lottery-rule-row">浪漫星河*1 价值1314元</div>
          <div className="lottery-rule-row">恋爱物语*3 价值564元</div>
          <div className="lottery-rule-row">c位出道*1 价值3元</div>

          <div className="lottery-rule-row">蝶恋花-戒指*1 </div>
          <div className="lottery-rule-row">一见倾心-麦上光圈 1天</div>
          <div className="lottery-rule-row">一见倾心-主页装扮 1天</div>

          <div className="lottery-rule-row">一见倾心-入场特效 1天</div>
          <div className="lottery-rule-row">一见倾心-座驾 1小时</div>
          <div className="lottery-rule-row">一见倾心-聊天气泡 1小时</div>

          <div className="lottery-rule-row">一见倾心-头像框 1小时</div>
          <div className="lottery-rule-row">月球之恋-戒指 1个</div>
          <div className="lottery-rule-row">谢谢参与</div>
        </div>
      </div>
      <BottomBg />
    </div>
  );
};

export default observer(LotteryPage);
