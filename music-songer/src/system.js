import native from "@src/lib/native.js";
import DeviceInfo from "./lib/deviceinfo";
import { getQuery, sendToken } from "./lib/utils";
import { getAppByHostname, getAppByPackage } from "./apps/index";
import Toast from "light-toast";

// 判断是否在app环境中
export const isInApp = Boolean(window.NativeProxy);
// 判断是否是本地开发模式
export const isLocal = window.location.hostname === "localhost";
// 是否在开发模式
export const isDevelopment = process.env.NODE_ENV === "development";
// 是否在线上模式
export const isProduction = process.env.NODE_ENV === "production";
// toast提示
export const toast = (title) => Toast.info(title, 1800);

export default class System {
  static lan = window.navigator.language;
  static token = null;
  static uid = null;
  static server_env = process.env.NODE_ENV;
  static pkg = null;
  static appName = null;
  static oss = null;
  static domain = null;
  static api_domain = null;
  static thinkingdata = null;
  static mac = null;
  static clientScreenMode = getQuery("clientScreenMode");
  static width = (document.documentElement || document.body).clientWidth;
  static height = (document.documentElement || document.body).clientHeight;

  static async init() {
    let app = isInApp ? await this.initInApp() : this.initOutApp();
    Object.keys(app).forEach((key) => (this[key] = app[key]));
    let root = document.getElementById("root");
    root.classList.add(this.appName, this.lan);
  }

  static async initInApp() {
    let {
      lan,
      token,
      uid,
      package: pkg,
      server_env,
      reportInfo,
    } = await native.NativeGetUserInfo();
    let app = getAppByPackage(pkg);

    if (isDevelopment) sendToken(token); // 取测试token

    return {
      lan: (getQuery("lan") || lan || this.lan).toLowerCase().replace(/-/g, "_"),
      token: token,
      uid: +uid,
      server_env: server_env || this.server_env,
      pkg: pkg,
      appName: app.appName,
      oss: app.oss,
      domain: app.domain,
      api_domain: app.api_domain[server_env],
      thinkingdata: app.thinkingdata,
      mac: JSON.parse(reportInfo).mac,
    };
  }

  static initOutApp() {
    let { lan, token, uid, pkg, server_env } = getQuery();
    let app = getAppByHostname();

    if (isDevelopment) {
      if (!lan) lan = app.mock.lan;
      if (!server_env) server_env = app.mock.server_env;
      if (!token) token = app.mock.token[server_env];
      if (!uid) uid = app.mock.uid[server_env];
      if (!pkg) pkg = app.mock.pkg;
    }

    return {
      lan: (lan || this.lan).toLowerCase().replace(/-/g, "_"),
      token: token || this.token,
      uid: +uid || this.uid,
      server_env: server_env || this.server_env,
      pkg: pkg || app.pkg[DeviceInfo.system]?.[0] || this.pkg,
      mac: this.mac,
      appName: app.appName,
      oss: app.oss,
      domain: app.domain,
      api_domain: app.api_domain[server_env],
      thinkingdata: app.thinkingdata,
    };
  }
}
