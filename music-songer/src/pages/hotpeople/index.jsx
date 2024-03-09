import React from "react";
import { BannerLinkBack } from "@src/components/banner/links";

import HotBanner from "./images/hot-banner.png";
import Icon1 from './images/icon_01.png';
import Icon2 from "./images/icon_02.png";
import Icon3 from "./images/icon_03.png";
import Icon4 from "./images/icon_04.png";
import Icon5 from "./images/icon_05.png";
import Icon6 from "./images/icon_06.png";

import "./index.scoped.css";

const HotPeople = (props) => {
  return (
    <div className="hotpeople-page">
      <BannerLinkBack top={props.backtop} />
      <img className="banner" src={HotBanner} alt="" />
      <div className="ques-one">
        <p>
          伴伴2022年度造星行动即刻起航！本次红人培养计划将在2022年3月份陆续开展。由官方选拔的第一批主播（20人）参与扶持计划。官方将通过单曲制作、个人形象打造、短视频ip孵化等帮助主播成为伴伴红人，并协助你在抖音、B站、音乐app等平台成功破圈。如果你喜欢唱歌，就
          加入我们吧～
        </p>
      </div>
      <div className="ques-two">
        <p>成功报名《伴伴最强音》活动，并通过点唱板块的选拔考核</p>
        <p>周有效开播时长大于14h</p>
        <p>形象好、气质佳、音色优质、人品好、努力</p>
      </div>
      <div className="ques-three">
        <div className="mudule">
          <img src={Icon1} alt="" />
          <span>伴伴唱将-定制勋章</span>
        </div>
        <div className="mudule">
          <img src={Icon2} alt="" />
          <span>个人单曲打造</span>
        </div>
        <div className="mudule">
          <img src={Icon3} alt="" />
          <span>红人人设打造</span>
        </div>
        <div className="mudule">
          <img src={Icon4} alt="" />
          <span>频道banner</span>
        </div>
        <div className="mudule">
          <img src={Icon5} alt="" />
          <span>短视频ip孵化</span>
        </div>
        <div className="mudule">
          <img src={Icon6} alt="" />
          <span>微博宣发</span>
        </div>
      </div>
      <div className="ques-four">
        <p>
          第一期红人主播选拔计划将从《伴伴最强音》活动中报名成功的主播选拔20位进入扶持计划。
        </p>
        <p>
          官方运营新一将会在活动结束后一周内联系被选中的红人主播开启红人计划
        </p>
      </div>
    </div>
  );
};

export default HotPeople;
