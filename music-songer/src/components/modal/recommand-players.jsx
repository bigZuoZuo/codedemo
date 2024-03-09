import React, { useEffect, useCallback } from "react";
import { useModal, useMask, usePlayerState } from "@src/hooks";
import RankItem from "@src/components/rank-item/index";

import "./recommand-players.scoped.css";

const RecommandPlayers = () => {
  const [visible, setVisible, args = []] = useModal(RecommandPlayers);
  const playerState = usePlayerState();

  const list = args[0] || [];

  const _onClose = useCallback(() => {
    setVisible(false);
  }, []);

  const _onPlayFirst = useCallback(() => {
    playerState.play(playerState.currentPlayList[0], playerState.uid);
    _onClose();
  }, [list]);

  useMask(visible);

  useEffect(() => {
    if (!visible) {
      return;
    }
  }, [visible]);

  if (!visible) {
    return null;
  }

  return (
    <div className="modal-wrapper">
      <div className="content-wrapper">
        <div className="recommand-players-modal">
          <span data-title />
          <h6 className="new-title">今日推荐歌手</h6>
          {list.map((item) => (
            <RankItem
              key={item.uid}
              uid={item.uid}
              url={item.url}
              icon={(item.user || {}).icon || item.image}
              nickname={(item.user || {}).name}
              playTimes={0}
              supportTimes={0}
              rank={item.rank}
              ticket={0}
              songName="歌曲"
              isModal
            />
          ))}
          <span className="btn-receive-more" onClick={_onPlayFirst} />
        </div>
        <span className="modal-btn-close" onClick={_onClose} />
      </div>
    </div>
  );
};

export default RecommandPlayers;
