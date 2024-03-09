import DeviceInfo from "@src/lib/deviceinfo";
import System, { isDevelopment, isInApp } from "@src/system";
import React from "react";

import imgBanbanLogo from "./banban-logo.png";
import imgBanbanName from "./banban-name.png";
import imgTeammateLogo from "./teammate-logo.png";
import imgTeammateName from "./teammate-name.png";
import imgWhoLogo from "./who-logo.png";
import imgWhoName from "./who-name.png";
import imgPartyingLogo from "./partying-logo.png";
import imgPartyingName from "./partying-name.png";
import "./landing-banner.scoped.css";

const themes = {
  banban: {
    name: "伴伴",
    nameEn: "banban",
    imgLogo: imgBanbanLogo,
    imgName: imgBanbanName,
    notice: "如果你的伴伴没有自动打开请手动打开或重新安装",
    buttonOpenText: "打开伴伴",
    buttonInstallText: "安装伴伴",
    appId: "bfdc5d05f1b94f289ba47e89d5df80eb",
    iosApp: "banban://com.imbb.banban.android/message" + window.location.search, // 跳转iOS App
    androidApp: "banban://com.imbb.banban.android/message" + window.location.search, // 跳转Android App
    iosDownloadUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.imbb.banban.android", // iOS下载地址
    androidDownloadUrl: "http://a.app.qq.com/o/simple.jsp?pkgname=com.imbb.banban.android", // Android下载地址
  },
  teammate: {
    name: "皮队友",
    nameEn: "teammate",
    imgLogo: imgTeammateLogo,
    imgName: imgTeammateName,
    notice: "如果你的皮队友没有自动打开请手动打开或重新安装",
    buttonOpenText: "打开皮队友",
    buttonInstallText: "安装皮队友",
    appId: "341334b4291b4b48b16ce74223b1a2f9",
    iosApp: "teammate://com.im.teammate.android/message" + window.location.search, // 跳转iOS App
    androidApp: "teammate://com.im.teammate.android/message" + window.location.search, // 跳转Android App
    iosDownloadUrl: "https://apps.apple.com/cn/app/%E7%9A%AE%E9%98%9F%E5%8F%8B/id1475056760?l=en", // iOS下载地址
    androidDownloadUrl:
      "http://a.app.qq.com/o/simple.jsp?pkgname=com.im.teammate.android&ckey=CK14436409808", // Android下载地址
  },
  who: {
    name: "谁是凶手",
    nameEn: "who",
    imgLogo: imgWhoLogo,
    imgName: imgWhoName,
    notice: "如果你的谁是凶手没有自动打开请手动打开或重新安装",
    buttonOpenText: "打开谁是凶手",
    buttonInstallText: "安装谁是凶手",
    appId: "bafd52e6df194c45968d9a6452ce80ae",
    iosApp: "who://com.who.android/message" + window.location.search,
    androidApp: "who://com.rewan.who.ios/message" + window.location.search,
    iosDownloadUrl:
      "https://apps.apple.com/cn/app/%E8%B0%81%E6%98%AF%E5%87%B6%E6%89%8B-%E6%B5%B7%E9%87%8F%E4%BC%98%E8%B4%A8%E5%89%A7%E6%9C%AC%E6%9D%80%E5%89%A7%E6%9C%AC-%E7%9C%9F%E5%AE%9E%E6%A1%88%E4%BB%B6%E6%8E%A8%E7%90%86/id1483169890",
    androidDownloadUrl: "https://a.app.qq.com/o/simple.jsp?pkgname=com.who.android",
  },
  partying: {
    name: "Partying",
    nameEn: "partying",
    imgLogo: imgPartyingLogo,
    imgName: imgPartyingName,
    notice: "如果您的partying沒有自動打開請手動打開或重新安裝",
    buttonOpenText: "打開partying",
    buttonInstallText: "安裝partying",
    appId: "7acc569375a54bf9af70204c04e78313",
    iosApp: "olachat://com.ola.chat/message" + window.location.search,
    androidApp: "olachat://com.imbb.oversea.android/message" + window.location.search,
    iosDownloadUrl: "https://apps.apple.com/app/id1499589662",
    androidDownloadUrl: "https://partying.oss-ap-southeast-1.aliyuncs.com/partying/partying.apk",
  },
};

export default function LandingBanner() {
  if (isInApp || isDevelopment) return null;
  if (DeviceInfo.platform === "desktop") return null;
  const theme = themes[System.appName];
  const downloadUrl = {
    ios: theme.iosDownloadUrl,
    android: theme.androidDownloadUrl,
  }[DeviceInfo.system];
  return (
    <React.Fragment>
      <div className="placeholder" />
      <div className="container">
        <div className="app">
          <img src={theme.imgLogo} alt="" className="logo" />
          <img src={theme.imgName} alt="" className="name" />
        </div>
        <a id="app-download" className="download" href={downloadUrl}>
          立即下载
        </a>
      </div>
    </React.Fragment>
  );
}
