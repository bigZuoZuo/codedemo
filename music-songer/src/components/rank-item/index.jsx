import React, { memo, useMemo, useCallback } from "react";
import { observer } from "mobx-react";
import clsx from "clsx";
import { useHistory } from "react-router-dom";
import { getAvatar, normalizeSongUrl, getShareTpBySingerId } from "@src/lib/utils";
import { usePlayerState } from "@src/hooks";
import System, { toast } from "@src/system";
import VoteModal from "@src/components/modal/vote";
import Share from "@src/components/share/share";
import RecommandPlayers from "@src/components/modal/recommand-players";
import { LazyLoadImage } from "react-lazy-load-image-component";

import "./index.scoped.css";

export const parseTimesNum = (times) => {
  if (times < 10000) {
    return times;
  }

  return (times / 10000).toFixed(2) + "w";
};

const RankItem = observer((props) => {
  const history = useHistory();
  const url = normalizeSongUrl(props.url, `uid=${props.uid}`);
  const playerState = usePlayerState();

  const isPlaying = useMemo(() => (playerState.src === url ? playerState.state : 0), [
    playerState.state,
    playerState.src,
    url,
  ]);

  const onTogglePlay = useCallback(() => {
    if (!url) {
      toast("歌曲信息获取出错");
    }

    playerState.play(url, props.uid, props.icon, props.songName, props.nickname);
  }, [url]);

  const _toPlayFree = useCallback(() => {
    if(history){
      history.push(`/play-free?singer_uid=${props.uid}`);
    }
  }, [history, props.uid]);

  const _onVote = useCallback(() => {
    if (props.isModal) {
      RecommandPlayers.hide();
    }

    if (+props.uid === +System.uid) {
      toast("不能给自己投票哦~");
      return;
    }

    if (props.lose) {
      return;
    }

    VoteModal.show({ uid: props.uid, name: props.nickname }, props.refresh);
  }, []);

  const _onShare = useCallback(() => {
    Share.show(getShareTpBySingerId(props.uid));
  }, []);

  return (
    <>
      {props.showWarning && <div className="warning" />}
      <div
        className={clsx(
          "rank-item",
          props.isModal && "in-modal",
          props.unnormal && "un-normal" + props.rank,
          props.iconBgThree && "icon-bg" + props.rank 
        )}
      >
        <div className="rank-item-avatar" onClick={_toPlayFree}>
          <LazyLoadImage src={getAvatar(props.icon)} className="avatar-img" />
        </div>
        <div className="rank-item-content">
          <div className="nickname">{props.nickname}</div>
          <div className="rank-player">
            <div
              className="rank-player-icon"
              data-play={isPlaying}
              onClick={onTogglePlay}
            />
            <div className="rank-song-name">{props.songName}</div>
          </div>
          {!props.isModal && (
            <div className="extra-info">
              <span className="play-info">
                <span>播放</span>
                {parseTimesNum(props.playTimes)}次
              </span>
              <span className="support-info">
                <span>应援</span>
                {props.supportTimes}次
              </span>
            </div>
          )}
        </div>
        <div className="rank-item-vote">
          <span
            className="rank-btn-vote"
            data-lose={props.lose ? 1 : 0}
            onClick={_onVote}
          />
          {props.showAsk && (
            <span className="rank-btn-askvote" onClick={_onShare} />
          )}
        </div>
        {!props.isModal && (
          <>
            <div className="rank-no" data-rank={props.rank}>
              {+props.rank <= 0 || !props.rank ? "99+" : props.rank}
            </div>
            <div className="rank-ticket">{props.ticket}票</div>
          </>
        )}
      </div>
    </>
  );
});

export default memo(RankItem);
