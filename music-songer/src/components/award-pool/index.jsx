import React, { memo, useEffect } from "react";
import { observer, useLocalStore } from "mobx-react";
import CommonPannel from "@src/components/common-pannel";
import CountDown from "@src/components/count-down";
import { getLotteryPool } from "@src/services";
import { isInApp } from "@src/system";
import ImgMark from "@src/assets/mark.png"
import AwardPoolModal from "@src/components/modal/award-pool";

import "./index.scoped.css";

const AwardPool = observer(() => {
  const store = useLocalStore(() => ({
    lefttime: Math.floor((new Date("2022/03/17 12:00:00").getTime() - Date.now()) / 1000),
    votes: 0,
    diamonds: 0,
    async fetchData() {
      if (!isInApp) {
        return;
      }

      const data = await getLotteryPool();
      store.votes = data.votes;
      store.diamonds = data.diamonds;
    },
  }));
  const _onStageTitleClick = () => {
    AwardPoolModal.show();
  };
  
  useEffect(() => {
    store.fetchData();
  }, []);

  return (
    <CommonPannel title="应援投票 瓜分钻石">
      <img
        className="img-mark"
        src={ImgMark}
        alt=""
        onClick={_onStageTitleClick}
      />
      <div className="count-down-layer">
        <CountDown lefttime={store.lefttime} action={store.fetchData} />
      </div>
      <div className="score-pannel">
        <div className="score-pannel-left">
          <span data-txt="left" />
          <span>{store.diamonds} 钻</span>
        </div>
        <div className="score-pannel-right">
          <span data-txt="right" />
          <span>{store.votes} 票</span>
        </div>
        <span data-decorator />
      </div>
    </CommonPannel>
  );
});



export default memo(AwardPool);
