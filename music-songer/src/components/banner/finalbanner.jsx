import React, { memo } from "react";
import { BannerLinkBack, BannerLinkRule2,BannerLinkLucky } from "./links";
import GlobalPlayer from "@src/components/global-player";

import "./index.scoped.css";

const BannerFinal = (props) => {
  return (
    <>
      <div className="banner-final" data-ignore="1">
        <div className="open-time">3月4日12:00:00-3月16日23:59:59</div>
        {props.children}
        <BannerLinkBack />
        {props.rule && <BannerLinkRule2 />}
        {props.rule && <BannerLinkLucky />}
      </div>
      <GlobalPlayer />
    </>
  );
};

export default memo(BannerFinal);
