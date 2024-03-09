import React, { useCallback } from "react";
import { observer } from "mobx-react";
import PlayerPannel from "@src/components/player-pannel";
import { getQuery } from "@src/lib/utils";
import { useUpdatePlayerProgress } from "@src/hooks";

import "./index.scoped.css";

const SharePage = () => {
  const singerUid = getQuery("singer_uid");
  const _onClick = useCallback(() => {
    const $download = document.getElementById("app-download");
    if (!$download) {
      return;
    }

    $download.click();
  }, []);

  useUpdatePlayerProgress();

  return (
    <div className="share-page">
      <div className="layer">
        <PlayerPannel singerUid={singerUid} />
      </div>
      <div className="btn-group">
        <div className="btn-share" onClick={_onClick} />
        <div className="btn-like" onClick={_onClick} />
      </div>
    </div>
  );
};

export default observer(SharePage);
