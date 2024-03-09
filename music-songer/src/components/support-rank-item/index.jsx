import React, { memo, useCallback } from "react";
import { observer } from "mobx-react";
import { getAvatar } from "@src/lib/utils";

import "./index.scoped.css";
import native from "@src/lib/native";

const SupportRankItem = observer((props) => {
  const _onClick = useCallback(() => {
    native.NativeShowImageScreen(+props.uid);
  }, []);

  return (
    <div className="list-item" data-rank={props.isRank ? 1 : 0}>
      <span className="rank">{props.rank}</span>
      <img src={getAvatar(props.icon)} onClick={_onClick} alt="" />
      <div className="nickname">{props.nickname}</div>
      <span className="num">{props.ticket}票</span>
    </div>
  );
}); 

export default memo(SupportRankItem);
