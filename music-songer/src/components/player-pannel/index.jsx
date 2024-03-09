import React, { useEffect, useRef, forwardRef, useImperativeHandle, useMemo } from "react";
import { observer, useLocalStore } from "mobx-react";
import { getAvatar, parsePlaySeconds, normalizeSongUrl, noop } from "@src/lib/utils";
import { usePlayerState } from "@src/hooks";
import { getSongList, postSingerLike } from "@src/services";
import { toast, isInApp } from "@src/system";

import "./index.scoped.css";
import native from "@src/lib/native";

const PlayerPannel = (props, ref) => {
  const playerState = usePlayerState();
  const timerRef = useRef();
  const singerUid = props.singerUid;
  const onListLoaded = props.onListLoaded || noop;

  const store = useLocalStore(() => ({
    poster: "",
    playTimes: 0,
    supportTimes: 0,
    songName: "",
    songUrl: "",
    intro: "",
    singerName: "",
    moving: false,
    uid: props.singerUid,
    isLiked: false,
    get duration() {
      if (store.isCurrentSong) {
        return playerState.duration;
      }

      return 0;
    },
    get isCurrentSong() {
      return store.songUrl === playerState.src;
    },
    get progress() {
      if (store.isCurrentSong && store.state !== 0) {
        return playerState.progress;
      }

      return 0;
    },
    get state() {
      if (store.isCurrentSong) {
        return playerState.state;
      }

      return 0;
    },
    async fetchData(updatedUid) {
      const data = await getSongList(updatedUid || singerUid);
      onListLoaded(data.user_rank, data.uid, (data.user || {}).name, +data.state === 4);

      store.isLiked = data.is_like;
      store.poster = getAvatar((data.user || {}).icon || data.image);
      store.singerName = (data.user || {}).name;
      store.playTimes = data.broadcast_count;
      store.supportTimes = data.user_vote_count;
      store.songName = data.name;
      store.intro = data.intro;
      store.uid = data.uid;
      store.songUrl = normalizeSongUrl(data.url, `uid=${data.uid}`);

      playerState.addSongToList({
        url: store.songUrl,
        uid: store.uid,
        icon: store.poster,
        name: store.songName,
        singer: store.intro,
      });
    },
    onTogglePlay() {
      if (!store.songUrl) {
        toast("歌曲信息获取出错");
      }

      playerState.play(store.songUrl);
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
    async postLike(ev) {
      const { like } = ev.target.dataset;
      const state = 1 - like;

      try {
        await postSingerLike(singerUid, state);
        toast(state === 1 ? "收藏成功" : "取消收藏");
        store.isLiked = state;
      } catch (err) {}
    },
    playPrev() {
      const uid = playerState.playPrev();
      if (!uid) {
        return;
      }

      store.fetchData(uid);
    },
    playNext() {
      const uid = playerState.playNext();
      if (!uid) {
        return;
      }

      store.fetchData(uid);
    },
    toProfile() {
      if (!isInApp) {
        return;
      }

      native.NativeShowImageScreen(store.uid);
    },
  }));

  useEffect(() => {
    store.fetchData();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh() {
      store.fetchData();
    },
  }));

  return (
    <div className="share-page">
      <div className="player-pannel">
        <div className="avatar-box" onClick={store.toProfile}>
          <img src={getAvatar(store.poster)} alt="" />
        </div>
        <span className="singer-name">{store.singerName}</span>
        <div className="song-intro">{store.intro}</div>
        <div className="song-info">
          <span className="song-name">{store.songName}</span>
          {props.showLike && (
            <span
              className="icon-like"
              data-like={store.isLiked ? 1 : 0}
              onClick={store.postLike}
            />
          )}
        </div>
        <div
          className="song-progress"
          onTouchStart={store.onTouchMove}
          onTouchMove={store.onTouchMove}
          onTouchEnd={store.onTouchEnd}
        >
          <div className="song-progress-bar" style={{ width: `${store.progress * 100}%` }} />
        </div>
        <div className="song-duration">
          <span className="song-current">{parsePlaySeconds(store.duration * store.progress)}</span>
          {store.isCurrentSong && (
            <span className="song-totoal">{parsePlaySeconds(store.duration)}</span>
          )}
        </div>
        <div className="song-btn-group">
          <div className="song-play-prev" onClick={store.playPrev} />
          <div className="song-play" data-play={store.state} onClick={store.onTogglePlay} />
          <div className="song-play-next" onClick={store.playNext} />
        </div>
        <div className="extra-info">
          <span className="play-times">
            <span>播放</span>
            {store.playTimes}次
          </span>
          <span className="support-times">
            <span>应援</span>
            {store.supportTimes}次
          </span>
        </div>
      </div>
    </div>
  );
};

export default observer(forwardRef(PlayerPannel));
