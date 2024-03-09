import React, { useEffect, useRef, memo } from "react";
import { observer, useLocalStore } from "mobx-react";
import { parseLeftTime, fmtDate } from "@src/lib/utils";
import UpgradeTab from "./upgrade-tab";
import PkItem from "@src/components/pk-item";
import RankItem from "@src/components/rank-item";
import NoData from "@src/components/nodata";
import { getPks, getRank } from "@src/services";
import ImgMarkLittle from "@src/assets/mark-little.png";
import SemifinalModal from "@src/components/modal/semifinal-match";

import "./semifinal-match.scoped.css";
import "./common.scoped.css";

const open2FinishTime = 79200;
const upgradeKey = 4;

// 在3月11日14:00 ---- 14日12:00 需要进行倒计时按钮功能的显示
const showLeftTime = () => {
  if (
    new Date("2022/03/11 14:00").getTime() - Date.now() <= 0 &&
    new Date("2022/03/14 12:00").getTime() - Date.now() >= 0
  ) {
    return true;
  }
  return false
}
const getLeftTime = () => {
  if (
    new Date(fmtDate(new Date(), "yyyy/MM/dd 11:59:59")).getTime() -
    Date.now() >=
    0
  ) {
    return Math.floor(
      (new Date(fmtDate(new Date(), "yyyy/MM/dd 11:59:59")).getTime() -
        Date.now()) /
      1000
    );
  } else {
    return Math.floor(
      (new Date(fmtDate(new Date(), "yyyy/MM/dd 23:59:59")).getTime() -
        Date.now()) /
      1000 + 43200
    );
  }
}

// 是否展示晋级组，即半决赛最后一天进行头部按钮的置换
const shouldUpgradedGroupShow = () =>
  new Date("2022/03/13 14:00").getTime() - Date.now() <= 0;

// 头部按钮是否展示,3月11日14:00以后，头部按钮就都要展示
const shouldTabShow = () => {
  if (
    new Date("2022/03/11 14:00").getTime() - Date.now() <= 0
  ) {
    return true;
  }
  return false;
}

// 此时给后端传type =4  展示所有的pk列表数据
// const showAllPks = () => {
//   if (
//     new Date("2022/03/11 14:00").getTime() - Date.now() <= 0 &&
//     new Date("2022/03/12 12:00").getTime() - Date.now() >= 0
//   ) {
//     return true;
//   }
//   if (
//     new Date("2022/03/12 14:00").getTime() - Date.now() <= 0 &&
//     new Date("2022/03/13 12:00").getTime() - Date.now() >= 0
//   ) {
//     return true;
//   }
//   return false
// }

const SemifinalMatch = observer(() => {
  const timerRef = useRef();

  const store = useLocalStore(() => ({
    list: [],
    _lefttime: getLeftTime(),
    currentKey: 0,
    showUpgradedGroup: shouldUpgradedGroupShow(),
    get lefttime() {
      if (!showLeftTime()) {
        return 0;
      }

      if (store._lefttime >= open2FinishTime) {
        return 0;
      }

      return store._lefttime;
    },
    set lefttime(val) {
      store._lefttime = val;
    },
    get isFinish() {
      return store.lefttime <= 0;
    },
    get timeStr() {
      return parseLeftTime(store.lefttime).slice(1).join(":").replace(/,/g, "");
    },
    decrease() {
      store.showUpgradedGroup = shouldUpgradedGroupShow();
      if (store.lefttime <= 0) {
        clearInterval(timerRef.current);
        return;
      }

      store.lefttime--;
    },
    refresh() {
      store.tabChangeAction(store.currentKey);
    },
    tabChangeAction(key) {
      store.currentKey = +key;

      // 晋级组
      if (key === upgradeKey) {
        store.fetchRankData();
        return;
      }

      store.fetchData(key);
    },
    async fetchRankData() {
      try {
        store.list = await getRank({
          type: 3,
          state: 1
        });
      } catch (err) { }
    },
    async fetchData(type) {
      try {
        store.list = await getPks(type);
      } catch (err) {
        store.list = [];
      }
    },
  }));

  const _onStageTitleClick = () => {
    SemifinalModal.show();
  }

  useEffect(() => {
    timerRef.current = setInterval(store.decrease, 1000);

    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      <div className="upgrade-rule">
        <div className="upgrade-rule-header">
          <span>晋级规则</span>
          {/* <span className="icon-question" /> */}
        </div>
        <div className="upgrade-rule-content">
          <img
            className="img-mark-little"
            src={ImgMarkLittle}
            alt=""
            onClick={_onStageTitleClick}
          />
          所有歌手进行1V1PK，连胜3场则晋级，失败2场则淘汰每天14:00:00至第二天11:59:59为一个pk周期，4天共进行4场PK，胜方可获得官方赠票。【给已淘汰的歌手投票不增加票数和幸运币】
        </div>
      </div>
      <div
        style={{
          visibility: shouldTabShow() ? "visible" : "hidden",
          height: shouldTabShow() ? "auto" : 0,
        }}
      >
        <UpgradeTab
          tabs={[store.showUpgradedGroup ? "晋级组" : "获胜组", "待定组"]}
          keys={[store.showUpgradedGroup ? upgradeKey : 2, 3]}
          tabChangedCallback={store.tabChangeAction}
        />
      </div>
      {store.lefttime > 0 && (
        <div className="countdown">
          距离本场PK结束还有&nbsp;{store.timeStr}
        </div>
      )}
      {store.list.length ? (
        store.showUpgradedGroup && store.currentKey === upgradeKey ? (
          store.list.map((item,idx) => (
            <RankItem
              key={idx+'rank'}
              uid={item.uid}
              url={item.url}
              lose={+item.state === 4}
              icon={(item.user || {}).icon || item.image}
              nickname={(item.user || {}).name}
              playTimes={item.broadcast_count || 0}
              supportTimes={item.user_vote_count || 0}
              rank={item.rank}
              ticket={item.vote_count || 0}
              songName={item.name}
              refresh={store.refresh}
              iconBgThree={true}
            />
          ))
        ) : (
          store.list.map((item, index) => (
            <PkItem
              key={index+'pk'}
              refresh={store.refresh}
              left={{
                startList: (item.uid_pk_records || []).map((item) => !!item),
                uid: (item.user || {}).uid,
                icon: (item.user || {}).icon,
                url: (item.singer || {}).url,
                username: (item.user || {}).name,
                songName: (item.singer || {}).name,
                lastDayTicket: item.uid_yesterday_vote_count,
                ticket: item.uid_vote,
                lose: item.loser_uid === (item.singer || {}).uid,
              }}
              right={{
                startList: (item.to_uid_pk_records || []).map(
                  (item) => !!item
                ),
                uid: (item.to_user || {}).uid,
                icon: (item.to_user || {}).icon,
                username: (item.to_user || {}).name,
                url: (item.to_singer || {}).url,
                songName: (item.to_singer || {}).name,
                lastDayTicket: item.to_uid_yesterday_vote_count,
                ticket: item.to_uid_vote,
                lose: item.loser_uid === (item.to_singer || {}).uid,
              }}
            />
          ))
        )
      ) : (
        <NoData />
      )}
    </>
  );
});

export default memo(SemifinalMatch);
