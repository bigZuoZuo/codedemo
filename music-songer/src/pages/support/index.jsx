import React, { useEffect, memo } from "react";
import { observer, useObserver, useLocalStore } from "mobx-react";
import clsx from "clsx";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import {
  getUserSupport,
  postReceiveReward,
  getLuckyCodes,
} from "@src/services";
import LotteryCodeModal from "@src/components/modal/lottery-code";
import imgFishLeft from "@src/assets/fish-left.png";
import imgFishRight from "@src/assets/fish-right.png";
import RewordList from "@src/components/reward";

import { toast } from "@src/system";
import {
  BannerLinkRule,
  BannerLinkPack,
  BottomBg,
} from "@src/components/banner/links";

import "./index.scoped.css";

import imgLotteryTicket from "@src/assets/images/img-lottery-ticket.png";
import imgSweetBubble from "@src/assets/images/img-sweet-bubble.png";
import imgSweetCar from "@src/assets/images/img-sweet-car.png";
import imgSweetCircle from "@src/assets/images/img-sweet-circle.png";
import imgSweetEntry from "@src/assets/images/img-sweet-entry.png";
import imgSweetHome from "@src/assets/images/img-sweet-home.png";
import imgIphone from "@src/assets/images/img-iphone.jpg";
import imgSideGift from "@src/assets/images/img-side-gift.png";
import imgAirpods from "@src/assets/images/img-airpods.jpg";

const award_list = [
  {
    img: imgIphone,
    name: "iPhone12Pro Max",
    font: 9,
  },
  {
    img: imgAirpods,
    name: "airPods",
  },
  {
    img: imgSideGift,
    name: "伴伴周边3个",
  },
];

const list1 = [
  {
    expired: 2,
    img: imgLotteryTicket,
    name: "决赛抽奖券*1",
    type: 1,
  },
  {
    expired: 4,
    img: imgSweetBubble,
    name: "cpdd-聊天气泡*3天",
    type: 2,
  },
  {
    expired: 6,
    img: imgLotteryTicket,
    name: "决赛抽奖券*2",
    type: 3,
  },
  {
    expired: 8,
    img: imgSweetCar,
    name: "cpdd-座驾*3天",
    type: 4,
  },
  {
    expired: 11,
    img: imgLotteryTicket,
    name: "决赛抽奖券*3",
    type: 5,
  },
];

const list2 = [
  {
    expired: 300,
    img: imgLotteryTicket,
    name: "决赛抽奖券*1",
    type: 6,
  },
  {
    expired: 600,
    img: imgSweetEntry,
    name: "cpdd-入场特效*3天",
    type: 7,
  },
  {
    expired: 1000,
    img: imgLotteryTicket,
    name: "决赛抽奖券*1",
    type: 8,
  },
];

const list3 = [
  {
    expired: 1500,
    img: imgSweetHome,
    name: "cpdd-主页装扮*3天",
    type: 9,
  },
  {
    expired: 2100,
    img: imgSweetCircle,
    name: "cpdd-头像框*3天",
    type: 10,
  },
  {
    expired: 3000,
    img: imgLotteryTicket,
    name: "决赛抽奖券*3",
    type: 11,
  },
];

const getAwardNameByLevel = (level) => {
  const item = award_list[level - 1];
  if (!item) {
    return "";
  }

  return item.name;
};

const AwardListItem = memo((props) => {
  const store = useLocalStore(
    (sources) => ({
      // 0 不展示 1 未领取 2 已领取
      get status() {
        if (store.received) {
          return 2;
        }

        if (sources.comp >= sources.expired) {
          return 1;
        }

        return 0;
      },
      received: sources.received,
      async postReceive() {
        if (store.received) {
          return;
        }

        try {
          await postReceiveReward(props.type);
          toast("领取成功");
          store.received = true;
        } catch (err) { }
      },
      updateReceived(val) {
        store.received = val;
      },
    }),
    props
  );

  useEffect(() => {
    store.updateReceived(props.received);
  }, [props.received]);

  return useObserver(() => (
    <div className={clsx("list-item-layer")}>
      <div className="list-item-key">
        {props.expired}
        {props.ext}
      </div>
      <div className={clsx("list-item-dot", store.status !== 0 && "active")} />
      <div className="list-item-award">
        <img src={props.img} alt="" />
        {store.status !== 0 && (
          <div
            className={clsx("receive-status", store.received && "completed")}
            onClick={store.postReceive}
          >
            {store.received ? "已领取" : "领取"}
          </div>
        )}
      </div>
      <div className="list-item-name">{props.name}</div>
    </div>
  ));
});

const SupportPage = () => {
  const store = useLocalStore(() => ({
    vote: 0,
    voteDay: 0,
    receivedList: [],
    choosedUserList: [],
    async fetchData() {
      try {
        const data = await getUserSupport();
        if (data.user) {
          store.vote = data.user.vote_count;
          store.voteDay = data.user.vote_day_count;
        }

        store.receivedList = data.reward_logs.map((item) => +item.type);
      } catch (err) { }

      try {
        // 以下为mock数据
        // const data = [
        //   {
        //     user: {
        //       name: "12121",
        //     },
        //     code: "121212",
        //     level: 1,
        //   },
        // ];
        // store.choosedUserList = data;

        store.choosedUserList = await getLuckyCodes();
      } catch (err) { }
    },
    showLotteryCode() {
      LotteryCodeModal.show();
    },
  }));

  useEffect(() => {
    store.fetchData();
  }, [store]);

  return (
    <div className="support-page">
      <Banner>
        <BannerLinkRule />
        <BannerLinkPack />
      </Banner>
      <CommonPannel title="累计应援天数奖励" column>
        <div className="has-support">我已应援{store.voteDay}天</div>
        <div className="daily-award">
          <div className="award-list">
            {list1.map((item) => (
              <AwardListItem
                key={item.name + item.expired}
                {...item}
                ext="天"
                comp={store.voteDay}
                received={store.receivedList.indexOf(item.type) !== -1}
              />
            ))}
          </div>
        </div>
      </CommonPannel>
      <div style={{ marginTop: "32px" }} />
      <CommonPannel title="累计投票数奖励" column>
        <div className="has-support">我已投出{store.vote}票</div>
        <div className="daily-award center">
          <div className="award-list">
            {list2.map((item) => (
              <AwardListItem
                key={item.name + item.expired}
                {...item}
                ext="票"
                comp={store.vote}
                received={store.receivedList.indexOf(item.type) !== -1}
              />
            ))}
          </div>
          <div style={{ marginTop: "4px" }} />
          <div className="award-list">
            {list3.map((item) => (
              <AwardListItem
                key={item.name + item.expired}
                {...item}
                ext="票"
                comp={store.vote}
                received={store.receivedList.indexOf(item.type) !== -1}
              />
            ))}
          </div>
        </div>
      </CommonPannel>
      <div style={{ marginTop: "32px" }} />

      <CommonPannel title="锦鲤大奖" column>
        <img src={imgFishLeft} alt="" className="img-left" />
        <img src={imgFishRight} alt="" className="img-right" />
        <div className="award-desc">
          用户通过在活动页面歌参赛选手赠票获得决赛抽奖券。该抽奖券可在3月16日晚19:00-21:00开展的歌手公演赛现场幸运开奖（共8名幸运用户）。
        </div>
        <div className="award-lucky-list">
          <RewordList rewordkey="fish" />
        </div>
        <div className="lottery-code" onClick={store.showLotteryCode}>
          我的抽奖码
        </div>
        {store.choosedUserList.length ? (
          <>
            <div className="choosed-users-title">锦鲤中奖名单公布：</div>
            <div className="choosed-item header">
              <span className="nickname">用户</span>
              <span className="code">中奖码</span>
              <span className="award">获得奖品</span>
            </div>
            {store.choosedUserList.map((info, index) => (
              <div key={info.code + index} className="choosed-item">
                <span className="nickname">{(info.user || {}).name}</span>
                <span className="code">{info.code}</span>
                <span className="award">
                  {getAwardNameByLevel(info.level)}
                </span>
              </div>
            ))}
            <div className="choosed-tip">
              （奖励会在活动结束后5个工作日内发放）
            </div>
          </>
        ) : null}
      </CommonPannel>
      <BottomBg />
    </div>
  );
};

export default observer(SupportPage);
