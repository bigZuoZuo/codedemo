import React, { useRef } from "react";
import { observer, useLocalStore } from "mobx-react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import { getAvatar, getQuery, getShareTpBySingerId } from "@src/lib/utils";
import NoData from "@src/components/nodata";
import VoteModal from "@src/components/modal/vote";
import PlayerPannel from "@src/components/player-pannel";
import Share from "@src/components/share/share";
import SupportRankItem from "@src/components/support-rank-item";
import System, { toast } from "@src/system";
import { BottomPannel2 } from "@src/components/bottom-pannel";
import {
  BannerLinkRule,
  BannerLinkPack,
  BottomBg,
} from "@src/components/banner/links";

import "./index.scoped.css";

const PlayFreePage = () => {
  const history = useHistory();
  const singerUid = getQuery("singer_uid");
  const playerRef = useRef();

  const store = useLocalStore(() => ({
    rankList: [],
    user: null,
    uid: singerUid,
    singerName: "",
    lose: false,
    get rankListSize() {
      return store.rankList.length;
    },
    get rankTopList() {
      return [];
      // const _list = store.rankListSize >= 3 ? store.rankList.slice(0, 3) : [];
      // if (_list.length !== 3) {
      //   return _list;
      // }

      // const top1 = _list.shift();
      // _list.splice(1, 0, top1);
      // return _list;
    },
    get rankRemainList() {
      return store.rankList;
      // return store.rankList.slice(store.rankListSize >= 3 ? 3 : 0);
    },
    onListLoaded(list, uid, name, lose) {
      store.rankList = list;
      store.uid = uid;
      store.singerName = name;
      store.lose = lose;
      store.user = list.filter((item) => +item.uid === +System.uid).shift();
    },
    onVote() {
      if (store.lose) {
        toast("遗憾淘汰");
        return;
      }

      if (+store.uid === +System.uid) {
        toast("不能给自己投票哦~");
        return;
      }

      VoteModal.show(
        {
          uid: store.uid,
          name: store.singerName,
        },
        playerRef.current && playerRef.current.refresh
      );
    },
    toFavorite() {
      history.push("/favorite-list");
    },
    onShare() {
      Share.show(getShareTpBySingerId(store.uid));
    },
  }));

  return (
    <div className="play-free-page">
      <Banner>
        <BannerLinkRule />
        <BannerLinkPack />
      </Banner>
      <div style={{ marginTop: "10px" }} />
      <CommonPannel title="随心听" column>
        <PlayerPannel
          ref={playerRef}
          showLike
          singerUid={singerUid}
          onListLoaded={store.onListLoaded}
        />
        <div className="btn-group">
          <div className="btn-invite" onClick={store.onShare} />
          <div
            className="btn-vote"
            data-lose={store.lose ? 1 : 0}
            onClick={store.onVote}
          />
        </div>
      </CommonPannel>
      <div style={{ marginTop: "32px" }} />
      <CommonPannel title="TA的应援榜" fixedbottom>
        {store.rankTopList.length ? (
          <div className="toplist">
            {store.rankTopList.map((item) => (
              <div
                key={item.uid}
                data-rank={item.rank}
                className="toplist-item"
              >
                <div className="avatar-box">
                  <img src={getAvatar(item.user.icon)} alt="" />
                </div>
                <div className="nickname">{item.user.name}</div>
                <div className="num">{item.vote_count}票</div>
              </div>
            ))}
          </div>
        ) : null}
        {store.rankListSize ? (
          store.rankRemainList.map((item) => (
            <SupportRankItem
              key={item.uid}
              uid={item.uid}
              icon={item.user.icon}
              nickname={item.user.name}
              rank={item.rank}
              ticket={item.vote_count || 0}
            />
          ))
        ) : (
          <NoData />
        )}
      </CommonPannel>
      {store.user && (
        <BottomPannel2
          rank={store.user.rank}
          icon={(store.user.user || {}).icon}
          nickname={(store.user.user || {}).name}
          ticket={store.user.vote_count}
        />
      )}
      <div className={clsx("bottom-space", store.user && "user")} />
      <span data-link="favorite" onClick={store.toFavorite} />
      <BottomBg haveBottom />
    </div>
  );
};

export default observer(PlayFreePage);
