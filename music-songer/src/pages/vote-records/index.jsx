import React, { useCallback, useRef } from "react";
import { observer } from "mobx-react";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import RankItem from "@src/components/rank-item";
import { getUserVoteLog } from "@src/services";
import NoData from "@src/components/nodata";
import { useLoadMore } from "@src/hooks";
import {
  BannerLinkRule,
  BannerLinkPack,
  BottomBg,
} from "@src/components/banner/links";

import "./index.scoped.css";

const VoteRecordsPage = () => {
  const bottomRef = useRef();

  const _fetchData = useCallback(async (page) => {
    return await getUserVoteLog(page);
  }, []);

  const [list, refresh] = useLoadMore(_fetchData, bottomRef);

  return (
    <div className="vote-records-page">
      <Banner>
        <BannerLinkRule />
        <BannerLinkPack />
      </Banner>
      <CommonPannel title="我的投票记录" column>
        {list.length ? (
          list.map((item, index) => (
            <RankItem
              key={item.uid + index}
              uid={item.uid}
              url={item.url}
              lose={+item.state === 4}
              icon={(item.user || {}).icon || item.image}
              nickname={(item.user || {}).name}
              playTimes={item.broadcast_count || 0}
              supportTimes={item.user_vote_count || 0}
              rank={item.rank || index + 1}
              ticket={item.vote_count || 0}
              songName={item.name}
              refresh={refresh}
              showAsk
            />
          ))
        ) : (
          <NoData />
        )}
        <div id="modal-message-bottom" ref={bottomRef} />
      </CommonPannel>
      <BottomBg/>
    </div>
  );
};

export default observer(VoteRecordsPage);
