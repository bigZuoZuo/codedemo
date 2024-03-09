import React, { useRef } from "react";
import { observer, useLocalStore } from "mobx-react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import SearchBox from "@src/components/search-box";
import SplitedTab from "@src/components/tab";
import RankItem from "@src/components/rank-item";
import NoData from "@src/components/nodata";
import System from "@src/system";
import SupportRankItem from "@src/components/support-rank-item";
import { BottomPannel1, BottomPannel2 } from "@src/components/bottom-pannel";
import {
  getSongs,
  getSingerRank,
  getUserRank,
  getPopularityRank,
  getPopularityGeneralRank,
  getCommonMatchSearch,
} from "@src/services";
import {
  BannerLinkPack,
  BannerLinkRule3,
  BannerLinkRule,
  BottomBg,
} from "@src/components/banner/links";

import "./index.scoped.css";

const bottom_txt = [
  ["根据活动期间歌手获得应援票数排序 (半决赛pk过程被淘汰的选手将不予晋级)"],
  ["根据用户在活动期间在活动页面付费送出的应援票数量排序"],
  ["日榜：根据歌手每日新增应援人数排序", "总榜：根据歌手获得总应援人数排序"],
  [""],
];

// 歌手合集
const singer_tabs = ["流行", "古风", "民谣", "rap", "其他"];
const singer_tab_keys = [1, 2, 3, 4, 5];
// 榜单合集
const rank_tabs = ["歌神榜", "应援总榜", "人气榜", "金牌音乐厅"];

const RanksPage = () => {
  const searchRef = useRef();
  const history = useHistory();
  const pathname = history.location.pathname;
  const isSingerPath = /\/singers/.test(pathname);

  const store = useLocalStore(() => ({
    currentKey: 0,
    _list: [],
    inputFocus: false,
    _searchList: [],
    set searchList(val) {
      store._searchList = val;
    },
    get searchList() {
      if (!isSingerPath) {
        return [];
      }

      return store._searchList.filter(Boolean);
    },
    get searchGroupTxt() {
      if (!store.hasSearchResult) {
        return "";
      }

      const index = store.searchList[0].style - 1;
      if (index < 0 || index >= singer_tabs.length) {
        return "";
      }

      return singer_tabs[index];
    },
    get user() {
      if (isSingerPath) {
        return null;
      }

      return store.list.filter((item) => +item.uid === +System.uid).shift();
    },
    get showGoldRule() {
      return !isSingerPath && store.currentKey === 3;
    },
    get hasSearchResult() {
      return store.searchList.length > 0;
    },
    get list() {
      if (store.showGoldRule) {
        return [];
      }

      if (store.hasSearchResult) {
        return store.searchList;
      }

      return store._list;
    },
    set list(_list) {
      store._list = _list;
    },
    // 0 不显示 1 日榜 2 总榜
    _popularTab: 0,
    get popularTab() {
      return store._popularTab;
    },
    set popularTab(val) {
      if (isSingerPath) {
        val = 0;
      }

      store._popularTab = val;
    },
    refresh() {
      store.tabChangeAction(store.currentKey);
    },
    tabChangeAction(key) {
      store.currentKey = key;
      store.searchList = [];
      if (searchRef.current && searchRef.current.clear) {
        searchRef.current.clear();
      }

      if (isSingerPath) {
        store.fetchSingerData(key);
        return;
      }

      if (key === 2) {
        store.fetchPopularRank();
        return;
      }

      store.popularTab = 0;

      if (key === 0) {
        store.fetchSingerRankData();
        return;
      }
      if (key === 1) {
        store.fetchSupportRank();
        return;
      }
      if (key === 3) {
        store.list = [];
      }
    },
    // 歌手合集
    async fetchSingerData(style = 1) {
      store.list = await getSongs(style);
    },
    // 榜单合集 歌神榜
    async fetchSingerRankData() {
      store.list = await getSingerRank();
    },
    // 榜单合集 应援榜
    async fetchSupportRank() {
      store.list = await getUserRank();
    },
    // 榜单合集 人气日榜
    async fetchPopularRank() {
      store.popularTab = 1;
      store.list = await getPopularityRank();
    },
    // 榜单合集 人气总榜
    async fetchPopularGeneralRank() {
      store.popularTab = 2;
      store.list = await getPopularityGeneralRank();
    },
    async search(val) {
      const params = {};
      if (/\d{9}/.test(val)) {
        params.uid = val;
      } else {
        params.user_name = val;
      }

      const data = await getCommonMatchSearch(params);
      store.searchList = [data];
    },
    easeSearchList() {
      store.searchList = [];
    },
    get listSize() {
      return store.list.length;
    },
    // 前三名
    get topList() {
      return [];
      // if (store.currentKey === 1 && !isSingerPath) {
      //   return [];
      // }

      // const _list = store.listSize >= 3 ? store.list.slice(0, 3) : [];
      // if (_list.length !== 3) {
      //   return _list;
      // }

      // const top1 = _list.shift();
      // _list.splice(1, 0, top1);
      // return _list;
    },
    // 除去前三名的
    get remainList() {
      return store.list;
      // if (store.currentKey === 1 && !isSingerPath) {
      //   return store.list;
      // }

      // return store.list.slice(store.listSize >= 3 ? 3 : 0);
    },
    onFocus() {
      store.inputFocus = true;
    },
    onBlur() {
      store.inputFocus = false;
    },
  }));

  const tabMode = isSingerPath ? "s" : "m";
  const tabs = isSingerPath ? singer_tabs : rank_tabs;
  const tabKeys = isSingerPath ? singer_tab_keys : null;
  const intro = isSingerPath
    ? ""
    : bottom_txt[store.currentKey][store.popularTab > 0 ? store.popularTab - 1 : 0];

  return (
    <div className="ranks-page">
      <Banner>
        {isSingerPath ? <BannerLinkRule /> : <BannerLinkRule3 />}
        <BannerLinkPack />
      </Banner>
      <CommonPannel
        title={isSingerPath ? "歌手合集" : "榜单合集"}
        column
        fixedbottom
      >
        {isSingerPath && (
          <SearchBox
            ref={searchRef}
            action={(val) => store.search(val)}
            easeAction={store.easeSearchList}
            onFocus={store.onFocus}
            onBlur={store.onBlur}
          />
        )}
        <div className="mar10" />
        {store.searchGroupTxt ? (
          <div className="search-group-title">{store.searchGroupTxt}</div>
        ) : (
          <SplitedTab
            size={tabMode}
            tabs={tabs}
            keys={tabKeys}
            onTabChanged={(key) => store.tabChangeAction(key)}
          />
        )}
        {store.popularTab > 0 && (
          <div className="popular-tabs">
            <div
              className={clsx(
                "popular-tab",
                store.popularTab === 1 && "active"
              )}
              data-tab={1}
              onClick={store.fetchPopularRank}
            >
              日榜
            </div>
            <div
              className={clsx(
                "popular-tab",
                store.popularTab === 2 && "active"
              )}
              data-tab={2}
              onClick={store.fetchPopularGeneralRank}
            >
              总榜
            </div>
          </div>
        )}
        {!isSingerPath && (
          <div className="intro" data-key={store.currentKey}>
            {intro}
          </div>
        )}
        {/* {store.topList.length ? (
          <div className="toplist">
            {store.topList.map((item) => (
              <TopListItem key={item.uid} {...item} refresh={store.refresh} />
            ))}
          </div>
        ) : (
        )} */}
        <div className="mar10" />
        {!store.listSize ? (
          store.showGoldRule ? (
            <div className="gold-room-rule">
              <table>
                <tbody>
                  <tr>
                    <td rowSpan={7}>奖励</td>
                    <td rowSpan={3}>冠军所属厅</td>
                    <td>冠军房间：aaaaaa</td>
                  </tr>
                  <tr>
                    <td>冠军音乐厅房间背景</td>
                  </tr>
                  <tr>
                    <td>5000热度卡*30天</td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>亚军所属厅</td>
                    <td>亚军音乐厅房间背景</td>
                  </tr>
                  <tr>
                    <td>3000热度卡*20天</td>
                  </tr>
                  <tr>
                    <td rowSpan={2}>季军所属厅</td>
                    <td>季军音乐厅房间背景</td>
                  </tr>
                  <tr>
                    <td>3000热度卡*10天</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <NoData />
          )
        ) : (
          store.remainList.map((item) =>
            store.currentKey === 1 && !isSingerPath ? (
              <SupportRankItem
                isRank
                key={item.uid}
                uid={item.uid}
                icon={item.user.icon}
                nickname={item.user.name}
                rank={item.rank}
                ticket={item.vote_count || 0}
              />
            ) : store.popularTab === 1 ? (
              <RankItem
                key={item.uid}
                uid={item.uid}
                url={item.url}
                lose={+item.state === 4}
                icon={(item.user || {}).icon || item.image}
                nickname={(item.user || {}).name}
                playTimes={item.broadcast_count || 0}
                supportTimes={item.num || 0}
                rank={item.rank}
                ticket={item.vote_count || 0}
                songName={item.name}
                refresh={store.refresh}
                iconBgThree={true}
              />
            ) : (
              <RankItem
                key={item.uid}
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
            )
          )
        )}
      </CommonPannel>
      {store.user &&
        !store.inputFocus &&
        (store.currentKey === 1 ? (
          <BottomPannel2
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
        ) : (
          <BottomPannel1
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
        ))}
      {/* <div className="bottom-space" data-user={store.user ? 1 : 0} /> */}
      {/* <BottomBg haveBottom /> */}
      <BottomBg />
    </div>
  );
};

export default observer(RanksPage);
