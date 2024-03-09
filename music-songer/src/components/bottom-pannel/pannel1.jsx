import React, { memo, useMemo, useCallback } from "react";
import { observer } from "mobx-react";
import { useHistory } from "react-router-dom";
import { getAvatar, normalizeSongUrl, getShareTpBySingerId } from "@src/lib/utils";
import { usePlayerState } from "@src/hooks";
import { toast } from "@src/system";
import Share from "@src/components/share/share";
import { LazyLoadImage } from "react-lazy-load-image-component";
import clsx from "clsx";

import "./pannel1.scoped.css";

export const BottomPannel1 = memo(
  observer((props) => {
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
      history.push(`/play-free?singer_uid=${props.uid}`);
    }, [history]);

    const _onShare = useCallback(() => {
      Share.show(getShareTpBySingerId(props.uid));
    }, []);

    return (
      <>
        <div
          className={clsx(
            "bottom-pannel",
            "icon-bg" + props.rank
          )}
        >
          {(props.group_id || props.showWarning) && (
            <div className="bottom-pannel-group">
              <div className="group">第{props.group_id}组</div>
              {props.showWarning && <div className="will-lose">预淘汰</div>}
            </div>
          )}
          <div className="bottom-pannel-avatar" onClick={_toPlayFree}>
            <LazyLoadImage
              src={getAvatar(props.icon)}
              className="avatar-img"
            />
          </div>
          <div className="bottom-pannel-content">
            <div className="nickname">{props.nickname}</div>
            <div className="bottom-player">
              <div
                className="bottom-player-icon"
                data-play={isPlaying}
                onClick={onTogglePlay}
              />
              <div className="bottom-song-name">{props.songName}</div>
            </div>
            <div className="extra-info">
              <span className="play-info">
                <span>播放</span>
                {props.playTimes}次
              </span>
              <span className="support-info">
                <span>应援</span>
                {props.supportTimes}次
              </span>
            </div>
          </div>
          <div className="bottom-pannel-vote" onClick={_onShare} />
          <div className="bottom-no" data-rank={props.rank}>
            {+props.rank <= 0 ? "99+" : props.rank}
          </div>
          <div className="bottom-ticket">{props.ticket}票</div>
        </div>
      </>
    );
  })
);
