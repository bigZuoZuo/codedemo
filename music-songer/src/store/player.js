import { makeAutoObservable } from "mobx";
import { postBroadcase } from "@src/services";
import { getAvatar, normalizeSongUrl, getUidFromUrl } from "@src/lib/utils";
import { isInApp } from "@src/system";

export default class PlayerState {
  // 当前歌曲
  _src = "";
  // volume: 0.50
  volume = 0.5;
  // 0 未播放 1 播放 2 暂停
  _state = 0;
  // 播放列表
  playlist = [];
  // 歌手封面
  iconMap = {};
  // songName-singerName
  infoMap = {};
  // 歌曲时长
  _duration = 0;
  // 歌曲当前进度
  _progress = 0;

  get state() {
    return this._state;
  }
  set state(val) {
    this._state = val;
  }

  get icon() {
    return this.iconMap[this.uid] || "";
  }
  get title() {
    return this.infoMap[this.uid] || "";
  }

  get uid() {
    return getUidFromUrl(this.src);
  }

  get src() {
    return this._src;
  }
  set src(url) {
    const prevIndex = this.playlist.indexOf(this._src);
    this._src = url;

    const index = this.playlist.indexOf(url);
    if (url && index === -1) {
      this.playlist.splice(prevIndex + 1, 0, url);
    }

    if (this.player) {
      // 同一首歌去除后缀
      this.player.src = url
        .replace(/\uid=\d{9}/, "")
        .replace(/&$/, "")
        .replace(/\?$/, "");
    }

    // this._state = 0;
    // this._progress = 0;
  }
  get playlistLen() {
    return this.playlist.length;
  }
  get player() {
    return document.getElementById("player");
  }
  get duration() {
    if (!this.player) {
      return 0;
    }

    return this._duration || this.player.duration || 0;
  }
  set duration(val) {
    this._duration = val || 0;
  }
  get progress() {
    return this._progress;
  }
  set progress(val) {
    if (val > 1) {
      val = 1;
    } else if (val < 0) {
      val = 0;
    }

    this._progress = val;
  }
  // 简化当前列表，不对已存在歌曲的新增做特殊处理
  get currentPlayList() {
    const index = this.playlist.indexOf(this.src);
    if (index <= 0) {
      return this.playlist;
    }

    return this.playlist.slice(index).concat(this.playlist.slice(0, index));
  }

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  getPrevSong() {
    return this.currentPlayList[this.playlistLen - 1] || this.currentPlayList[0];
  }

  getNextSong() {
    return this.currentPlayList[1] || this.currentPlayList[0];
  }

  playNext() {
    if (!this.playlistLen) {
      return;
    }

    // 下一个或者重新播放
    const nextSongUrl = this.getNextSong();
    const uid = getUidFromUrl(nextSongUrl);
    this.stop();
    this.play(nextSongUrl, getUidFromUrl(nextSongUrl));
    return uid;
  }

  playPrev() {
    if (!this.playlistLen) {
      return;
    }

    // 上一个或者重新播放
    const prevSongUrl = this.getPrevSong();
    const uid = getUidFromUrl(prevSongUrl);
    this.stop();
    this.play(prevSongUrl, getUidFromUrl(prevSongUrl));
    return uid;
  }

  async play(url, uid, icon, name = "", singer = "") {
    if (!this.player) {
      return;
    }

    // 没得url
    if (!url && !this.src) {
      return;
    }

    // 播放中且同一首歌，暂停
    if (this.state === 1 && this.src === url) {
      this.pause();
      return;
    }

    // 同一首歌不改变url
    const isSameUrl = this.src === url;
    if (!isSameUrl) {
      this.src = url;
    }

    this.player.volume = this.volume;
    // this.state = 1;
    uid = uid || getUidFromUrl(url);

    if (icon) {
      this.iconMap[uid] = getAvatar(icon);
    }
    if (name && singer) {
      this.infoMap[uid] = name + "-" + singer;
    }

    try {
      if ((this.state === 0 || !isSameUrl) && isInApp) {
        await postBroadcase(uid);
      }

      this.player.play();
    } catch (err) {}
  }

  seekByPercent(percent) {
    const target = Math.floor(this.duration * percent);
    if (Number.isNaN(target)) {
      return;
    }

    this.seek(target);
  }

  seek(duration) {
    if (!this.player || this.state === 0) {
      return;
    }

    // 进度合法性校验
    if (typeof duration !== "number") {
      return;
    }
    if (duration < 0 || duration > this.duration) {
      return;
    }
    this.player.currentTime = duration;
    // this.play(this.src);
  }

  pause() {
    // this.state = 2;

    if (this.player) {
      this.player.pause();
    }
  }

  stop() {
    if (this.state === 0) {
      return;
    }

    this.state = 0;
    // this.src = "";
    this.duration = 0;
    this.progress = 0;

    if (this.player) {
      this.player.stop && this.player.stop();
    }
  }

  addSongToList({ url, uid, icon, name = "", singer = "" }) {
    url = normalizeSongUrl(url, `uid=${uid}`);

    if (url && this.playlist.indexOf(url) === -1) {
      this.playlist.push(url);
    }

    if (icon) {
      this.iconMap[uid] = getAvatar(icon);
    }
    if (name && singer) {
      this.infoMap[uid] = name + "-" + singer;
    }
  }

  addRecommandSongs(list) {
    list.forEach((item) => {
      this.addSongToList({
        url: item.url,
        uid: item.uid,
        icon: (item.user || {}).icon || item.image,
        name: item.name,
        singer: (item.user || {}).name || "",
      });
    });

    this.src = this.currentPlayList[0];
  }
}
