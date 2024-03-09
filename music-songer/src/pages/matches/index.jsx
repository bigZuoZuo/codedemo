import React, { useMemo, useCallback } from "react";
import { observer, useLocalStore } from "mobx-react";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import Banner from "@src/components/banner";
import CommonPannel from "@src/components/common-pannel";
import Slider, { getCurrentStage } from "@src/components/slider";
import MassElectionMatch from "./mass-election-match";
import UpgradeMatch from "./upgrade-match";
import SemifinalMatch from "./semifinal-match";
import FinalMatch from "./final-match";
// import MassElectionModal from "@src/components/modal/mass-election-match";
// import UpgradeModal from "@src/components/modal/upgrade-match";
// import SemifinalModal from "@src/components/modal/semifinal-match";
import AwardPool from "@src/components/award-pool";
// import SignupBtn from "@src/components/signup-btn";
import { useSignupStatusService, useUserinfoState } from "@src/hooks";

import { canShowEntryBtn } from "@src/lib/utils";
import {
  BannerLinkRule,
  BannerLinkLucky,
  BannerLinkLeft2,
  BannerLinkLeft3,
  BannerLinkRight1,
  BannerLinkRight2,
  BannerLinkRight3,
  BannerLinkRedPeople,
  BottomBg
} from "@src/components/banner/links";

import "./common.css";
import "./index.scoped.css";
// import imgMassElectionTitle from "./images/mass-election-title.png";
// import imgUpgradeTitle from "./images/upgrade-title.png";
// import imgSemifinalTitle from "./images/semifinal-title.png";

// const matchTitleMap = [imgMassElectionTitle, imgUpgradeTitle, imgSemifinalTitle];

const MathesPage = () => {
  const history = useHistory();
  // 主要是给按钮状态，是投票中，还是审核中等...
  const userInfoState = useUserinfoState();
  const store = useLocalStore(() => ({
    stage: getCurrentStage() || 0,
    changeStage(key) {
      store.stage = key;
    },
  }));

  const _toRelationPage = useCallback(
    (ev) => {
      const classNames = ev.target.className;
      if (/final-match/.test(classNames)) {
        history.push("/final-scene");
        return;
      }

      history.push("/appointment");
    },
    [history]
  );

  // 新版本的弹框，放在每个组件里面单独弹出来
  // const _onStageTitleClick = useCallback(() => {
  //   if (store.stage === 0) {
  //     MassElectionModal.show();
  //     return;
  //   }

  //   if (store.stage === 1) {
  //     UpgradeModal.show();
  //     return;
  //   }

  //   if (store.stage === 2) {
  //     SemifinalModal.show();
  //     return;
  //   }
  // }, []);

  const showFinalScene = useMemo(() => {
    if (
      store.stage !==
      3
    ) {
      return false;
    }
    // 测试的时间
    // return (
    //   new Date(
    //     "2022/02/14 12:00"
    //   ).getTime() -
    //   Date.now() <=
    //   0
    // );
    // 线上的时间   规定可以进入页面的时间
    return new Date("2022/03/15 18:00").getTime() - Date.now() <= 0;
  }, [store.stage]);

  useSignupStatusService();

  return (
    <div className="matches-page">
      <Banner backtop>
        <BannerLinkRule />
        <BannerLinkLucky />
        <BannerLinkLeft2 />
        <BannerLinkLeft3 />
        <BannerLinkRight1 />
        <BannerLinkRight2 />
        <BannerLinkRedPeople/>
        {store.stage > 1 || !canShowEntryBtn() ? null : <BannerLinkRight3 />}
      </Banner>
      <AwardPool />
      <div
        className={clsx("support", showFinalScene && "final-match")}
        onClick={_toRelationPage}
      >
        <div className="btn-date-now" />
      </div>
      <CommonPannel title="赛程简介" column shadow grade fixedbottom>
        {/* {store.stage < 3 && (
          <img
            className="stage-title"
            data-stage={store.stage}
            src={matchTitleMap[store.stage]}
            onClick={_onStageTitleClick}
            alt=""
          />
        )} */}
        <div className="match-tip">
          {
            {
              0: "海选总榜第一名可获得：钻石奖池瓜分：2%",
              1: "晋级赛总榜第一名可获得：钻石奖池瓜分：3%",
              2: "半决赛总榜第一名可获得：钻石奖池瓜分：5%",
            }[store.stage]
          }
        </div>

        <Slider
          onSlideChanged={store.changeStage}
          initStage={store.stage}
          isMatch
        />
        {/* 海选赛 */}
        {store.stage === 0 && <MassElectionMatch />}
        {/* 晋级赛 */}
        {store.stage === 1 && <UpgradeMatch />}
        {/* 半决赛 */}
        {store.stage === 2 && <SemifinalMatch />}
        {/* 决赛 */}
        {store.stage === 3 && <FinalMatch />}
      </CommonPannel>
      {/* {store.stage < 2 &&
        canShowEntryBtn() &&
        userInfoState.signupStatus !== 2 && (
          <div className="form-submit">
            <SignupBtn />
          </div>
        )} */}
      <div id="bottom-space" />
      <BottomBg haveBottom={true} />
    </div>
  );
};

export default observer(MathesPage);
