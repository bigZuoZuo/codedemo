import React, { memo, useCallback, useMemo } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { getAvatar, normalizeSongUrl } from "@src/lib/utils";
import VoteModal from "@src/components/modal/vote";
import { usePlayerState } from "@src/hooks";
import System, { toast } from "@src/system";
import Star from "../star";

import "./index.scoped.css";

const PkItem = observer((props) => {
  const history = useHistory();
  const { left = {}, right = {} } = props;
  const leftUrl = normalizeSongUrl(left.url, `uid=${left.uid}`);
  const rightUrl = normalizeSongUrl(right.url, `uid=${right.uid}`);

  const playerState = usePlayerState();
 
  const _onVote = useCallback(
    (uid, nickname, lose) => () => {
      if (+uid === +System.uid) {
        toast("不能给自己投票哦~");
        return; 
      }

      VoteModal.show({ uid, name: nickname }, props.refresh);
    },
    []
  );

  const onTogglePlay = useCallback(
    (url, uid, icon, songName, nickname) => () => {
      if (!url) {
        toast("歌曲信息获取出错");
      }

      playerState.play(url, uid, icon, songName, nickname);
    },
    []
  );

  const _toPlayFree = useCallback(
    (uid) => () => {
      history.push(`/play-free?singer_uid=${uid}`);
    },
    [history]
  );

  const isLeftPlaying = useMemo(() => (playerState.src === leftUrl ? playerState.state : 0), [
    playerState.state,
    playerState.src,
    leftUrl,
  ]);

  const isRightPlaying = useMemo(() => (playerState.src === rightUrl ? playerState.state : 0), [
    playerState.state,
    playerState.src,
    rightUrl,
  ]);

  return (
    <div className="pk-item">
      <div className="pk-item-left">
        <Star list={left.startList} />
        <div className="pk-item-userinfo">
          <img
            src={getAvatar(left.icon)}
            onClick={_toPlayFree(left.uid)}
            className="avatar"
            alt=""
          />
          <div className="pk-item-userdetail">
            <div className="pk-item-username">{left.username || ""}</div>
            <div className="pk-player">
              <div
                className="pk-player-icon"
                data-play={isLeftPlaying}
                onClick={onTogglePlay(leftUrl, left.uid, left.icon, left.songName, left.username)}
              />
              <div className="rank-song-name">{left.songName || ""}</div>
            </div>
          </div>
        </div>
        <div className="pk-lastday-num" data-visible={props.showLastDay ? 1 : 0}>
          昨日得票{left.lastDayTicket || 0}
        </div>
        <div className="img-vote" onClick={_onVote(left.uid, left.username, left.lose)} />
        <div className="num">{left.ticket || 0}票</div>
      </div>
      <div className="pk-item-right">
        <Star list={right.startList} right />
        <div className="pk-item-userinfo">
          <img
            src={getAvatar(right.icon)}
            onClick={_toPlayFree(right.uid)}
            className="avatar"
            alt=""
          />
          <div className="pk-item-userdetail">
            <div className="pk-item-username">{right.username || ""}</div>
            <div className="pk-player">
              <div
                className="pk-player-icon"
                data-play={isRightPlaying}
                onClick={onTogglePlay(
                  rightUrl,
                  right.uid,
                  right.icon,
                  right.songName,
                  right.username
                )}
              />
              <div className="rank-song-name">{right.songName || ""}</div>
            </div>
          </div>
        </div>
        <div className="pk-lastday-num" data-visible={props.showLastDay ? 1 : 0}>
          昨日得票{right.lastDayTicket || 0}
        </div>
        <div className="img-vote" onClick={_onVote(right.uid, right.username, right.lose)} />
        <div className="num">{right.ticket || 0}票</div>
      </div>
    </div>
  );
});

export default memo(PkItem);
