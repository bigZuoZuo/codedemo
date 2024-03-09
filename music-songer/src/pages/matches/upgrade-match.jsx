import React, { useEffect, useRef } from "react";
import { observer, useLocalStore } from "mobx-react";
import UpgradeTab from "./upgrade-tab";
import SearchBox from "@src/components/search-box";
import SplitedTab from "@src/components/tab";
import RankItem from "@src/components/rank-item";
import PkItem from "@src/components/pk-item";
import NoData from "@src/components/nodata";
import { getPks, getRank, getPkMatchSearch, getCommonMatchSearch } from "@src/services";
import { BottomPannel1 } from "@src/components/bottom-pannel";
import System from "@src/system";
import { fmtDate, parseLeftTime } from "@src/lib/utils";
import ImgMarkLittle from "@src/assets/mark-little.png";
import UpgradeModal from "@src/components/modal/upgrade-match";

import "./semifinal-match.scoped.css";
import "./common.scoped.css";

// 应该是3月10号12点前都应该显示危险区
const shouldCountDownShow = () => new Date("2022/03/10 12:00").getTime() - Date.now() > 0;

const nowDate = new Date();

const date_list = [
  new Date(fmtDate(nowDate, "yyyy/MM/dd 19:00:00")).getTime(),
  new Date(fmtDate(nowDate, "yyyy/MM/dd 19:30:00")).getTime(),
  new Date(fmtDate(nowDate, "yyyy/MM/dd 20:00:00")).getTime(),
  new Date(fmtDate(nowDate, "yyyy/MM/dd 20:30:00")).getTime(),
  new Date(fmtDate(nowDate, "yyyy/MM/dd 21:00:00")).getTime(),
  new Date(fmtDate(nowDate, "yyyy/MM/dd 21:30:00")).getTime(),
  new Date(fmtDate(nowDate, "yyyy/MM/dd 22:00:00")).getTime(),
  new Date(fmtDate(nowDate, "yyyy/MM/dd 22:30:00")).getTime(),
];
const time_title_list = [
  "距离本场PK开始还有",
  "距离本场PK结束还有",
  "距离下场PK开始还有",
  "距离本场PK结束还有",
  "距离下场PK开始还有",
  "距离本场PK结束还有",
  "距离下场PK开始还有",
  "距离本场PK结束还有",
];

// const day_num = +fmtDate(nowDate, "dd");

const day_num = () => {
  if (new Date("2022/03/08 12:00").getTime() - Date.now() > 0) {
    return 1
  }
  if (new Date("2022/03/09 12:00").getTime() - Date.now() > 0) {
    return 2;
  }
  if (new Date("2022/03/10 12:00").getTime() - Date.now() > 0) {
    return 3;
  }
}

const WARNING_START_LIST = [40, 30, 20];

const UpgradeMatch = () => {
  const searchRef = useRef();
  const timerRef = useRef();

  const store = useLocalStore(() => ({
    _user: null,
    _list: [],
    _searchList: [],
    // 0 总榜 1 pk榜
    mode: 0,
    currentKey: 0,
    currentSubKey: 1,
    _lefttime: 0,
    _timeStr: "",
    inputFocus: false,
    get user() {
      return store._user;
    },
    set user(val) {
      store._user = val;
    },
    set searchList(val) {
      store._searchList = val;
    },
    get searchGroupTxt() {
      if (!store.hasSearchResult || store.currentKey === 1) {
        return "";
      }

      return `第${store.searchList[0].group_id}组`;
    },
    get searchList() {
      return store._searchList.filter(Boolean);
    },
    get warnMe() {
      if (!store._user) {
        return false;
      }

      if (!store.showWarning) {
        return false;
      }

      return store.lastWarnList.filter((item) => +item.uid === +store.user.uid).length > 0;
    },
    get lefttime() {
      if (store.currentKey === 0) {
        return 0;
      }

      return store._lefttime;
    },
    set lefttime(val) {
      store._lefttime = val;
    },
    get timeStr() {
      const _time = parseLeftTime(store.lefttime)
        .slice(1)
        .join(":")
        .replace(/,/g, "");

      return `${store._timeStr} ${_time}`;
    },
    set timeStr(val) {
      store._timeStr = val;
    },
    get lastWarnList() {
      return store.list.slice(WARNING_START_LIST[day_num() - 1 || 0]);
    },
    get showWarning() {
      // console.log(shouldCountDownShow());
      // console.log(store.currentKey);

      if (!shouldCountDownShow() || store.currentKey !== 0) {
        return false;
      }

      return true;
    },
    get warningIndex() {
      if (store.showWarning) {
        return WARNING_START_LIST[day_num() - 1 || 0];
      }

      return -1;
    },
    get hasSearchResult() {
      return store.searchList.length > 0;
    },
    get listSize() {
      return store.list.length;
    },
    get list() {
      if (store.hasSearchResult) {
        return store.searchList;
      }

      return store._list;
    },
    set list(_list) {
      store._list = _list;
    },
    refresh() {
      if (store.currentKey !== 1) {
        store.subTabChanged(store.currentSubKey);
        return;
      }

      store.tabChanged(store.currentKey);
    },
    tabChanged(key) {
      store.currentKey = key;
      store.mode = key;
      store.list = [];
      store.searchList = [];
      if (searchRef.current && searchRef.current.clear) {
        searchRef.current.clear();
      }

      if (key === 1) {
        store.fetchPkData();
        return;
      }
    },
    subTabChanged(key) {
      store.currentSubKey = key;
      store.searchList = [];
      if (searchRef.current && searchRef.current.clear) {
        searchRef.current.clear();
      }

      if (store.mode === 0) {
        store.fetchTotalData(+key);
        return;
      }
    },
    async fetchPkData() {
      try {
        store.list = await getPks(1);
      } catch (err) {
        store.list = [];
      }
    },
    async fetchTotalData(group_id) {
      try {
        store.list = await getRank({
          group_id,
          type: 2,
        });
      } catch (err) {
        store.list = [];
      }
    },
    async searchPk(uid) {
      const data = await getPkMatchSearch(
        uid
      );
      // store.searchList = [data];
      store.searchList = data;
    },
    async search(val) {
      if (store.mode === 1) {
        store.searchPk(val);
        return;
      }

      const params = {
        type: 2,
      };
      if (/\d{9}/.test(val)) {
        params.uid = val;
      } else {
        params.user_name = val;
      }

      const data = await getCommonMatchSearch(params);
      store.searchList = [data];
    },
    async fetchBottomInfo() {
      const params = {
        type: 2,
        uid: System.uid,
      };

      const data = await getCommonMatchSearch(params);
      store.user = data;

      if (data) {
        const el = document.getElementById("bottom-space");
        el && el.classList.add("user");
      }
    },
    easeSearchList() {
      store.searchList = [];
    },
    decrease() {
      const now = new Date();
      let index = 0;
      let lefttime = 0;

      if (!shouldCountDownShow()) {
        clearInterval(timerRef.current);
        store.lefttime = 0;
        return;
      }

      for (; index < date_list.length; index++) {
        lefttime = date_list[index] - now.getTime();
        if (date_list[index] - now.getTime() > 0) {
          break;
        }
      }

      store.lefttime = Math.floor(lefttime / 1000);
      store.timeStr = time_title_list[index];
    },
    onFocus() {
      store.inputFocus = true;
    },
    onBlur() {
      store.inputFocus = false;
    },
  }));

  const _onStageTitleClick = () => {
    UpgradeModal.show();
  };

  useEffect(() => {
    timerRef.current = setInterval(store.decrease, 1000);
    store.fetchBottomInfo();
    return () => {
      clearInterval(timerRef.current);
    };
  }, []);

  return (
    <>
      {/* <div className="match-tip">晋级赛获得应援票第一名 ，可获得 3%钻石奖池</div> */}
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
          每日淘汰各组末尾10位歌手，最终每组胜出20位晋级
          <br />
          每晚19:00～23:00期间每个整点开启30分钟PK；每天共计4场PK，pk获胜方可获得额外应援票加成。非PK时间投票不增加票数。【给已淘汰的歌手投票不增加票数和幸运币】
        </div>
      </div>
      <UpgradeTab
        tabs={["总榜", "PK榜"]}
        mountFetch
        tabChangedCallback={(key) => store.tabChanged(key)}
      />
      <SearchBox
        ref={searchRef}
        action={(val) => store.search(val)}
        easeAction={store.easeSearchList}
        pkMode={store.mode === 1}
        onFocus={store.onFocus}
        onBlur={store.onBlur}
      />
      {store.mode === 0 && (
        <>
          <div className="marTop15" />
          {store.searchGroupTxt ? (
            <div className="search-group-title">{store.searchGroupTxt}</div>
          ) : (
            <SplitedTab
              tabs={["第一组", "第二组", "第三组", "第四组"]}
              keys={[1, 2, 3, 4]}
              onTabChanged={(key) => store.subTabChanged(key)}
            />
          )}
        </>
      )}
      <div className="marTop15" />
      {store.lefttime > 0 && <div className="countdown">{store.timeStr}</div>}
      {!store.list.length ? <NoData /> : null}
      {store.mode === 0 && store.list.length
        ? store.list.map((item, index) => (
          <RankItem
            key={item.uid}
            uid={item.uid}
            url={item.url}
            lose={+item.state === 4}
            icon={(item.user || {}).icon || item.image}
            showWarning={index === store.warningIndex}
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
        : null}
      {store.mode === 1 && store.list.length
        ? store.list.map((item, index) => (
          <PkItem
            key={item.uid + index}
            refresh={store.refresh}
            showLastDay
            left={{
              startList: (item.uid_pk_records || []).map((item) => !!item),
              uid: (item.user || {}).uid,
              url: (item.singer || {}).url,
              icon: (item.user || {}).icon,
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
              url: (item.to_singer || {}).url,
              username: (item.to_user || {}).name,
              songName: (item.to_singer || {}).name,
              lastDayTicket: item.to_uid_yesterday_vote_count,
              ticket: item.to_uid_vote,
              lose: item.loser_uid === (item.to_singer || {}).uid,
            }}
          />
        ))
        : null}
      {store.user && store.currentKey === 0 && !store.inputFocus && (
        <BottomPannel1
          showWarning={store.warnMe}
          group_id={store.user.group_id}
          uid={store.user.uid}
          url={store.user.url}
          icon={store.user.user.icon}
          nickname={store.user.user.name}
          playTimes={store.user.broadcast_count || 0}
          supportTimes={store.user.user_vote_count || 0}
          rank={store.user.rank}
          ticket={store.user.vote_count || 0}
          songName={store.user.name}
        />
      )}
    </>
  );
};

export default observer(UpgradeMatch);
