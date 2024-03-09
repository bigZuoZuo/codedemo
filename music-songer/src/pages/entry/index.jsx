import React from "react";
import { observer, useLocalStore } from "mobx-react";
import Banner from "@src/components/banner";
import Slider from "@src/components/slider";
import CommonPannel from "@src/components/common-pannel";
import SignupBtn from "@src/components/signup-btn";
import { useSignupStatusService } from "@src/hooks";
import {
  BannerLinkRedPeople,
} from "@src/components/banner/links";
import RewordList from '@src/components/reward'

import "./index.scoped.css";
import {
  AuditionRule,
  PromotionRule,
  HalfFinalRule,
  FinalRule,
} from "../rule/index";


const EntryPage = () => {
  const store = useLocalStore(() => ({
    stage: 0,
    onSlideChanged(key) {
      store.stage = key;
    },
  }));

  useSignupStatusService();

  return (
    <div className="entry-page">
      <Banner isEntry>
        <BannerLinkRedPeople />
      </Banner>
      <div className="singup">
        <SignupBtn isEntry />
      </div>
      <p className="sign-tips">报名成功可参与红人主播扶持计划哦～</p>
      <CommonPannel title="多重奖励 重磅来袭" row>
        <RewordList rewordkey="entrypage" />
      </CommonPannel>
      <div style={{ marginTop: "32px" }} />
      <CommonPannel title="赛程简介" column shadow grade>
        <Slider onSlideChanged={store.onSlideChanged} />
        <div className="competition">
          {store.stage === 0 && <AuditionRule path="entry" />}
          {store.stage === 1 && <PromotionRule path="entry" />}
          {store.stage === 2 && <HalfFinalRule path="entry" />}
          {store.stage === 3 && <FinalRule path="entry" />}
        </div>
      </CommonPannel>
      <div style={{ marginTop: "140px" }} />
    </div>
  );
};

export default observer(EntryPage);
