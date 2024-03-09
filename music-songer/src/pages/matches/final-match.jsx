import React, { memo, useEffect } from "react";
import { useObserver, useLocalStore } from "mobx-react";
import RankItem from "@src/components/rank-item";
import UpgradeTab from "./upgrade-tab";
import { getRank } from "@src/services";
import NoData from "@src/components/nodata";
import FinalModal from "@src/components/modal/final-match";

import ImgMarkLittle from "@src/assets/mark-little.png";
import "./common.scoped.css";

const FinalMatch = memo(() => {
  const store = useLocalStore(() => ({
    list: [],
    user: {},
    // tabChangeAction(key) {
    //   store.fetchData();
    // },
    async fetchData() {
      store.list = await getRank({
        type: 4
      });
    },
  }));
  const _onStageTitleClick = () => {
    FinalModal.show();
  };
  useEffect(() => {
    store.fetchData();
  }, []);

  return useObserver(() => (
    <>
      {/* <div className="match-tip" data-final>
        决赛获得票数应援票三名 ，分别获得 35%、20%、10%钻石奖池
      </div> */}
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
          <div>
            官厅歌友赛：3月14日12:00～3月15日12:00期间，歌神榜单前10获得公演赛资格，公演赛现场由现场观众投票，选出公演赛前三歌手。前三歌手将获得官方海量奖励+决赛应援票加成。
          </div>
          <div style={{ marginTop: "5px" }}>
            决赛规则：半决赛晋级的25位歌手积分清0，按照决赛期间的应援票排序，决出冠、亚、季军。【给已淘汰的歌手投票不增加票数和幸运币】
          </div>
        </div>
      </div>
      <UpgradeTab tabs={["总榜"]} />

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
            refresh={store.fetchData}
            iconBgThree={true}
          />
        ))
      ) : (
        <NoData />
      )}
    </>
  ));
});

export default FinalMatch;
