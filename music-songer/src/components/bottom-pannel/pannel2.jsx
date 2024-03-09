import React, { memo } from "react";
import { getAvatar } from "@src/lib/utils";

import "./pannel2.scoped.css";

export const BottomPannel2 = memo((props) => {
  return (
    <div className="user-info">
      <span className="rank">{props.rank}</span>
      <img src={getAvatar(props.icon)} alt="" />
      <div className="nickname">{props.nickname}</div>
      <span className="num">{props.ticket}票</span>
    </div>
  );
});
