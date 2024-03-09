import System, { toast } from "@src/system";
import qs from "qs";
import axios from "axios";
import history from "@src/history";
import ImgAvatar from "@src/assets/avatar.png"

function leftPad(number) {
  return +number < 10 ? `0${number}` : number;
}

function shortNumber(num, unit = "k") {
  function short(numTxt) {
    const arr = numTxt.split(".");
    if (arr[1] === "00") {
      numTxt = arr[0];
    }
    return numTxt;
  }

  if (unit === "k") {
    if (+num > 1000) {
      let numTxt = (+num / 1000).toFixed(2);
      return short(numTxt) + unit;
    }
  } else if (unit === "w") {
    if (+num > 10000) {
      let numTxt = (+num / 10000).toFixed(2);
      return short(numTxt) + unit;
    }
  }
  return num;
}

function getAvatar(icon, head150 = true) {
  // if (process.env.NODE_ENV === "development") {
  //   return "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fpic4.zhimg.com%2Fv2-b6eae3250bb62fadb3d2527f466cf033_b.jpg&refer=http%3A%2F%2Fpic4.zhimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1628308650&t=d1274df86043b2e4551580114c1954bc";
  // }

  if (!icon || /http/.test(icon)) {
    return icon || ImgAvatar;
  }

  return `${System.oss}/${icon}${head150 ? "!head150" : ""}`;
}

function formatDate(datetime) {
  if (!(datetime instanceof Date)) throw new Error("参数类型错误");
  let year = datetime.getFullYear();
  let month = datetime.getMonth() + 1;
  let date = datetime.getDate();
  return `${year}/${leftPad(month)}/${leftPad(date)}`;
}

function formatTime(datetime) {
  if (!(datetime instanceof Date)) throw new Error("参数类型错误");
  // let year = datetime.getFullYear();
  // let month = datetime.getMonth() + 1;
  // let date = datetime.getDate();

  let hours = datetime.getHours();
  let minutes = datetime.getMinutes();
  let seconds = datetime.getSeconds();
  return [hours, minutes, seconds].map(leftPad).join(":");
}

const padLeftZero = (str) => `00${str}`.substr(str.length);

const fmtDate = (date, fmt) => {
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      date
        .getFullYear()
        .toString()
        .substr(4 - RegExp.$1.length)
    );
  }
  const o = {
    "M+": date.getMonth() + 1,
    "d+": date.getDate(),
    "h+": date.getHours(),
    "m+": date.getMinutes(),
    "s+": date.getSeconds(),
  };

  for (const k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      const str = o[k].toString();
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length === 1 ? str : padLeftZero(str));
    }
  }
  return fmt;
};

/**
 * 复制粘贴
 * @param {String} str
 */
function doCopy(str) {
  if (!str) {
    toast("复制内容为空");
    return;
  }
  const input = document.createElement("input");
  input.setAttribute("readonly", "readonly");
  input.setAttribute("value", str);
  input.setSelectionRange(0, 9999);
  document.body.appendChild(input);
  input.select();
  if (document.execCommand("copy")) {
    document.execCommand("copy");
    toast("复制成功");
  } else {
    toast("复制失败,请手动复制");
  }
  document.body.removeChild(input);
}

function getQuery(name) {
  let pathQuery = qs.parse(window.location.search.substr(1));
  let hashQuery = qs.parse(history.location.search.substr(1));
  let query = { ...pathQuery, ...hashQuery };
  console.log(`query: `, query);
  return name ? query[name] : query;
}

// 发送测试token到本机
function sendToken(token, port = 8080) {
  let url = new URL(window.location.href);
  url.port = port;
  axios.get(url.toString(), { params: { token } });
}

// 获取UTC时间
function getUTCTime() {
  let date = new Date();
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds()
  ).getTime();
}

// 获取指定时区时间
function getTimeByZone(zone) {
  // UTC时间戳
  let utcTime = getUTCTime();
  // 算出zone时区时间
  return new Date(utcTime + zone * 60 * 60 * 1000);
}

// 将某一时区的时间转换成UTC时间
function transZoneTimeToUTC(zone, time) {
  return new Date(time - zone * 60 * 60 * 1000);
}

// 将UTC时间转换成当地时间
function transUTCTimeToLocale(UTCTime) {
  let timezoneOffset = -new Date().getTimezoneOffset() / 60;
  let localeTime = new Date(UTCTime.getTime() + timezoneOffset * 60 * 60 * 1000);
  return localeTime;
}

// 将某一时区的时间,转换成当地时间
function transZoneTimeToLocaleTime(zone, time) {
  let utc = transZoneTimeToUTC(zone, time);
  let localeTime = transUTCTimeToLocale(utc);
  return localeTime;
}

function getDiamond(diamond) {
  if (System.appName === "partying") {
    return diamond / 10;
  }
  return diamond;
}

function joinParams(params) {
  let query = "";
  Object.keys(params).forEach((key) => {
    if (params[key] === undefined) {
      return;
    }

    query += `&${key}=${params[key]}`;
  });

  return query;
}

const HOUR_TIME = 60 * 60;

const parseLeftTime = (lefttime) => {
  const totalHour = Math.floor(lefttime / HOUR_TIME);
  const day = Math.floor(totalHour / 24);
  const hour = totalHour - day * 24;
  const min = Math.floor(Math.floor(lefttime - HOUR_TIME * totalHour) / 60);
  const sec = Math.floor(lefttime - HOUR_TIME * hour) % 60;

  return [day, hour, min, sec]
    .map((item) => String(item))
    .map((item) => padLeftZero(item))
    .reduce((a, b) => (a.push(b.split("")), a), []);
};

const noop = () => { };

const normalizeSongUrl = (url, query = "") => {
  if (!url || /uid=(\d{9})/.test(url)) {
    return url;
  }

  if (!/^http/.test(url)) {
    url = System.oss + url;
  }

  const hasQuery = url.indexOf("?") !== -1;
  const hasExt = url[url.length - 1] === "&";
  if (hasQuery) {
    return url + (hasExt ? query : `&${query}`);
  }

  return url + `?${query}`;
};

const parsePlaySeconds = (seconds = 0) => {
  let minute = Math.floor(seconds / 60) || 0;
  let second = Math.floor(seconds % 60) || 0;
  return `${leftPad(minute)}:${leftPad(second)}`;
};

const getUidFromUrl = (url) => {
  const matches = /uid=(\d{9})/.exec(url);
  if (matches && matches[1]) {
    return +matches[1];
  }

  return 0;
};

const getShareTpBySingerId = (uid) => {
  return 24 + uid;
};

let shouldRedirectToEntry = () => {
  // 是否该重定向到预热页面
  if (new Date("2022/02/27 12:00").getTime() - Date.now() <= 0) {
    shouldRedirectToEntry = () => false;
    return false;
  }

  return true;
};

let canShowEntryBtn = () => {
  // 3月7日12：00：00之前都可以限时报名的按钮
  if (
    new Date(
      "2022/03/07 12:00"
    ).getTime() -
    Date.now() <=
    0
  ) {
    canShowEntryBtn = () =>
      false;
    return false;
  }

  return true;
};


let canShowSemifinalCountDown = () => {
  // 正式环境配置
  // if (
  //   new Date("2022/03/11 14:00").getTime() - Date.now() > 0 ||
  //   new Date("2022/03/12 14:00").getTime() - Date.now() > 0 ||
  //   new Date("2022/03/13 14:00").getTime() - Date.now() > 0
  // ) {
  //   canShowSemifinalCountDown = () => false;
  //   return false;
  // }

  return true;
};

const isFunction = (func) => func && typeof func === "function";

export {
  getDiamond,
  shortNumber, // 格式化数字
  formatTime,
  getAvatar, // 获取用户头像
  doCopy, // 复制文字
  formatDate, // 格式化日期
  getQuery, // 获取url参数
  leftPad,
  getTimeByZone,
  sendToken,
  transZoneTimeToLocaleTime,
  fmtDate,
  parseLeftTime,
  joinParams,
  noop,
  normalizeSongUrl,
  parsePlaySeconds,
  getUidFromUrl,
  getShareTpBySingerId,
  shouldRedirectToEntry,
  canShowEntryBtn,
  isFunction,
  canShowSemifinalCountDown,
};
