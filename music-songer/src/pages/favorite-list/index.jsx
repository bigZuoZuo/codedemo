import React, { useEffect } from "react";
import { observer, useLocalStore } from "mobx-react";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import RankItem from "@src/components/rank-item";
import NoData from "@src/components/nodata";
import { getLikeLogs } from "@src/services";
import { BannerLinkRule, BannerLinkPack, BottomBg } from "@src/components/banner/links";

import "./index.scoped.css";

const VoteRecordsPage = () => {
  const store = useLocalStore(() => ({
    list: [],
    async fetchData() {
      store.list = await getLikeLogs();
    },
  }));

  useEffect(() => {
    store.fetchData();
  }, []);

  return (
    <div className="vote-records-page">
      <Banner>
        <BannerLinkRule />
        <BannerLinkPack />
      </Banner>
      <CommonPannel title="我的收藏" column fixedbottom>
        {store.list.length ? (
          store.list.map((item, index) => (
            <RankItem
              key={item.uid}
              uid={item.uid}
              url={item.url}
              icon={(item.user || {}).icon || item.image}
              lose={+item.state === 4}
              nickname={(item.user || {}).name}
              playTimes={item.broadcast_count || 0}
              supportTimes={item.user_vote_count || 0}
              rank={item.rank || index + 1}
              ticket={item.vote_count || 0}
              songName={item.name}
              refresh={store.fetchData}
              showAsk
            />
          ))
        ) : (
          <NoData />
        )}
      </CommonPannel>
      <BottomBg />
    </div>
  );
};

export default observer(VoteRecordsPage);
