import React, { memo } from "react";
import { BannerLinkBack } from "./links";
import GlobalPlayer from "@src/components/global-player";

import "./index.scoped.css";

const Banner = (props) => {
  return (
    <>
      <div className="banner" data-ignore="1">
        {props.isEntry ? (
          <div className="open-time">2月25日12:00-3月7日12:00</div>
        ) : (
          <div className="open-time">3月4日12:00:00-3月16日23:59:59</div>
        )}
        {props.children}
        <BannerLinkBack top={props.backtop} />
      </div>
      <GlobalPlayer />
    </>
  );
};

export default memo(Banner);
