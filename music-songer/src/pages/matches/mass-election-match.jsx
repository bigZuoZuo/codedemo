import React, { useEffect, memo, useRef } from "react";
import { useObserver, useLocalStore } from "mobx-react";
import SearchBox from "@src/components/search-box";
import SplitedTab from "@src/components/tab";
import RankItem from "@src/components/rank-item";
import { getRank, getCommonMatchSearch } from "@src/services";
import NoData from "@src/components/nodata";
import { BottomPannel1 } from "@src/components/bottom-pannel";
import RewordList from "@src/components/reward";
import ImgMarkLittle from "@src/assets/mark-little.png";
import MassElectionModal from "@src/components/modal/mass-election-match";

import System from "@src/system";

import "./common.scoped.css";

const MassElectionMatch = memo(() => {
  const searchRef = useRef();

  const store = useLocalStore(() => ({
    _list: [],
    _searchList: [],
    user: null,
    currentKey: 0,
    inputFocus: false,
    get searchGroupTxt() {
      if (!store.hasSearchResult) {
        return "";
      }

      return `第${store.searchList[0].group_id}组`;
    },
    get hasSearchResult() {
      return store.searchList.length > 0;
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
    set searchList(val) {
      store._searchList = val;
    },
    get searchList() {
      return store._searchList.filter(Boolean);
    },
    refresh() {
      store.tabChangeAction(store.currentKey);
    },
    tabChangeAction(key) {
      store.currentKey = +key;
      store.searchList = [];
      if (searchRef.current && searchRef.current.clear) {
        searchRef.current.clear();
      }

      store.fetchData(+key);
    },
    async fetchData(group_id) {
      try {
        const data = await getRank({
          group_id,
          type: 1,
        });
        store.list = data
      } catch (err) {
        store.list = [];
      }
    },
    async search(val) {
      const params = {
        type: 1,
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
      // console.log('find mine')
      const params = {
        type: 1,
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
    onFocus() {
      store.inputFocus = true;
    },
    onBlur() {
      store.inputFocus = false;
    },
  }));

  const _onStageTitleClick = () => {
    MassElectionModal.show();
  };


  useEffect(() => {
    store.fetchBottomInfo();
  }, []);

  return useObserver(() => (
    <>
      <div className="singer-reword">
        <p className="h6">歌手奖励</p>
        <p className="h6-tips">晋级时累计得票即可获得以下奖励</p>
        <RewordList rewordkey="mass" />
        <img
          className="img-mark-little"
          src={ImgMarkLittle}
          alt=""
          onClick={_onStageTitleClick}
          style={{ top: "6vw" }}
        />
      </div>
      <SearchBox
        ref={searchRef}
        action={(val) => store.search(val)}
        easeAction={store.easeSearchList}
        onFocus={store.onFocus}
        onBlur={store.onBlur}
      />
      <div className="marTop15" />
      {store.searchGroupTxt ? (
        <div className="search-group-title">{store.searchGroupTxt}</div>
      ) : (
        <SplitedTab
          tabs={["第一组", "第二组", "第三组", "第四组"]}
          keys={[1, 2, 3, 4]}
          onTabChanged={(key) => store.tabChangeAction(key)}
        />
      )}
      <div className="marTop15" />
      {store.list.length ? (
        store.list.map((item) => (
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
        ))
      ) : (
        <NoData />
      )}
      {store.user && !store.inputFocus && (
        <BottomPannel1
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
  ));
});

export default MassElectionMatch;
