import React, { memo, useEffect, useLayoutEffect, useRef } from "react";
import { observer, useLocalStore } from "mobx-react";
import { useHistory } from "react-router-dom";
import { usePlayerState, useUpdatePlayerProgress } from "@src/hooks";
import { parsePlaySeconds } from "@src/lib/utils";
import System from "@src/system";

import "./index.scoped.css";

const [initX, initY] = [5, 240];
const minLeftOffset = 85;
const maxLeftOffset = 256;
const initPosition = [initX, initY].join("|");

const GLOBAL_PLAYER_POSITION = "global.player.position";

const GlobalPlayer = observer(() => {
  const avatarRef = useRef();
  const controlRef = useRef();
  const playerState = usePlayerState();
  const history = useHistory();
  const touchStartRef = useRef();
  const positionStartRef = useRef();
  const pathname = history.location.pathname;

  useLayoutEffect(() => {
    const position = (localStorage.getItem(GLOBAL_PLAYER_POSITION) || initPosition)
      .split("|")
      .map((item) => +item);

    positionStartRef.current = position;
    store.resetPosition();
  }, [pathname]);

  const showGlobalPlayer = !/play-free/.test(pathname);

  const store = useLocalStore(() => ({
    moving: false,
    _showDetail: false,
    position: { x: initX, y: initY },
    get duration() {
      return playerState.duration;
    },
    set duration(val) {
      playerState.duration = val;
    },
    get progress() {
      if (store.state !== 0) {
        return playerState.progress;
      }

      return 0;
    },
    get state() {
      return playerState.state;
    },
    get showDetail() {
      return store._showDetail;
    },
    set showDetail(val) {
      if (val) {
        store.position = {
          x: Math.min(Math.max(store.position.x, 10), System.width - maxLeftOffset),
          y: store.position.y,
        };
      }
      store._showDetail = val;
    },
    get rightSpace() {
      return store.showDetail ? maxLeftOffset : minLeftOffset;
    },
    get positionStyles() {
      return { left: `${store.position.x}px`, top: `${store.position.y}px` };
    },
    resetPosition() {
      store.position = {
        x: positionStartRef.current[0],
        y: positionStartRef.current[1],
      };
    },
    play() {
      playerState.play(playerState.currentPlayList[0], playerState.uid);
    },
    onTouchMove(ev) {
      store.moving = true;
      const touchX = ev.touches[0].clientX;
      const left = ev.target.getBoundingClientRect().left;
      const width = ev.target.clientWidth;

      playerState.progress = (touchX - left) / width;
    },
    onTouchEnd() {
      playerState.seekByPercent(playerState.progress);
      store.moving = false;
    },
    hideDetail() {
      if (store.showDetail) {
        store.showDetail = false;
      }
    },
    toggleDetail(ev) {
      ev.stopPropagation();
      if (!store.showDetail) {
        store.showDetail = true;
        if (store.state !== 1) {
          playerState.play(playerState.currentPlayList[0], playerState.uid);
        }
      } else {
        history.push(`/play-free?singer_uid=${playerState.uid}`);
      }
      return false;
    },
    onLayerTouchStart(ev) {
      touchStartRef.current = ev.touches[0] || {};
    },
    onLayerTouchMove(ev) {
      const offsetX = ev.touches[0].clientX - touchStartRef.current.clientX;
      const offsetY = ev.touches[0].clientY - touchStartRef.current.clientY;

      const x = Math.min(
        Math.max(positionStartRef.current[0] + offsetX, 10),
        System.width - store.rightSpace
      );
      const y = Math.min(Math.max(positionStartRef.current[1] + offsetY, 10), 400);

      store.position = {
        x,
        y,
      };
    },
    onLayerTouchEnd() {
      positionStartRef.current = [store.position.x, store.position.y];
      localStorage.setItem(GLOBAL_PLAYER_POSITION, positionStartRef.current.join("|"));
    },
  }));

  const packUpOutsideClick = (ev) => {
    const $el = ev.target;
    if (!$el || !controlRef.current) {
      return;
    }

    if (avatarRef.current && avatarRef.current.contains($el)) {
      return;
    }

    if (!controlRef.current.contains($el)) {
      store.hideDetail();
    }
  };

  useEffect(() => {
    document.addEventListener("click", packUpOutsideClick);

    return () => {
      document.removeEventListener("click", packUpOutsideClick);
    };
  }, []);

  useUpdatePlayerProgress();

  if (!playerState.icon || !playerState.src || !showGlobalPlayer) {
    return null;
  }

  return (
    <div className="global-player" data-ignore="1" style={store.positionStyles}>
      <div
        className="avatar-box"
        ref={avatarRef}
        onClick={store.toggleDetail}
        onTouchStart={store.onLayerTouchStart}
        onTouchMove={store.onLayerTouchMove}
        onTouchEnd={store.onLayerTouchEnd}
      >
        <img src={playerState.icon} data-play={store.state} className="global-player-icon" alt="" />
      </div>
      {store.showDetail && (
        <div className="global-player-controls">
          <div id="global-player-control" className="control-box" ref={controlRef}>
            <div className="song-title">{playerState.title}</div>
            <div className="song-info">
              <span className="song-current">
                {parsePlaySeconds(store.duration * store.progress)}
              </span>
              <div
                className="progress"
                onTouchStart={store.onTouchMove}
                onTouchMove={store.onTouchMove}
                onTouchEnd={store.onTouchEnd}
              >
                <div className="progress-bar" style={{ width: `${store.progress * 100}%` }} />
              </div>
              <span className="song-total">{parsePlaySeconds(store.duration)}</span>
            </div>
            <div className="player-btn-group">
              <div className="player-prev-icon" onClick={playerState.playPrev} />
              <div className="player-icon" data-play={store.state} onClick={store.play} />
              <div className="player-next-icon" onClick={playerState.playNext} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

export default memo(GlobalPlayer);
