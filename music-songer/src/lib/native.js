import qs from "qs";
import { isInApp } from "@src/system";

function callAppMethod(funcType, data) {
  if (!isInApp) return console.log(`不支持调用Native方法: ${funcType},`, data);
  let cbFunName = "nativeCB" + new Date().getTime() + parseInt(Math.random() * 100);
  let queryData = { cb: cbFunName };
  if (data) queryData.param = JSON.stringify(data);
  const message = `banban://${funcType}?${qs.stringify(queryData)}`;
  return new Promise((resolve) => {
    window[cbFunName] = function(result) {
      delete window[cbFunName];
      console.log(`Native方法${funcType}调用成功:`, result);
      resolve(result);
    };
    window.NativeProxy.postMessage(message);
  });
}

function listenAppMethod(funcType, callback) {
  window[funcType] = function(result) {
    callback && callback(result);
  };
}

export default {
  NativeGetUserInfo: function() {
    //获取用户信息
    return callAppMethod("getUserInfo");
  },
  // 跳转客户端登录
  NativeLogin: function() {
    return callAppMethod("login");
  },
  // 进入指定房间
  NativeOpenRoom: function(rid) {
    return callAppMethod("openRoom", { rid: Number(rid) });
  },
  // 进入指定大神的订单邀约界面
  NativeOpenOrderScreen: function(toUid) {
    return callAppMethod("openOrderScreen", { uid: toUid });
  },
  // 设置页面标题
  NativeSetTitle: function(title) {
    window.document.title = title;
    return callAppMethod("setTitle", { title });
  },
  // 签到/补签
  NativeCheckin: function(params) {
    return callAppMethod("checkin", params);
  },
  // 领取奖励
  NativeGetAward: function(params) {
    return callAppMethod("getAward", params);
  },
  // 客户端重新回到H5
  NativeReturnToWeb: function(callback) {
    return listenAppMethod("onReturnToWeb", callback);
  },
  // 分享图片
  NativeShareByImage: function(type, tp, imgUrl) {
    return callAppMethod("shareDirect", { type, tp, imgUrl });
  },
  // 分享到微信
  NativeShareWechat: function(tp) {
    return callAppMethod("shareDirect", { type: "wechat", tp });
  },
  // 分享到朋友圈
  NativeShareWechatMoment: function(tp) {
    return callAppMethod("shareDirect", { type: "moment", tp });
  },
  // 分享到QQ
  NativeShareQQ: function(tp) {
    return callAppMethod("shareDirect", { type: "qq", tp });
  },
  // 分享到QQ空间
  NativeShareQZone: function(tp) {
    return callAppMethod("shareDirect", { type: "qzone", tp });
  },
  // 分享到facebook
  NativeShareFacebook: function(tp) {
    return callAppMethod("shareDirect", { type: "facebook", tp });
  },
  // 分享到twitter
  NativeShareTwitter: function(tp) {
    return callAppMethod("shareDirect", { type: "twitter", tp });
  },
  // 分享到line
  NativeShareLine: function(tp) {
    return callAppMethod("shareDirect", { type: "line", tp });
  },
  // 跳转到我的字符页
  NativeShowVipMall: function() {
    return callAppMethod("showVipMall");
  },
  // 跳转到我的字符页榜单
  NativeShowRank: function(param) {
    return callAppMethod("showRank", param);
  },
  // 跳转到web页
  NativeShowScreen: function(path) {
    return callAppMethod("showCommonWebScreen", {
      url: encodeURIComponent(window.location.origin + window.location.pathname + "#" + path),
    });
  },
  // 跳转到个人主页
  NativeShowImageScreen: function(uid) {
    uid = +uid;
    return callAppMethod("showImageScreen", { uid: Number(uid) });
  },
  // 进入附近
  NativeShowNearby: function() {
    return callAppMethod("showNearby");
  },
  // 进入粉丝列表
  NativeShowFansList: function() {
    return callAppMethod("showFansList");
  },
  // 进入首页
  NativeShowHomePage: function() {
    return callAppMethod("showHomePage");
  },
  // 进入发现-娱乐房列表
  NativeShowJoyRoom: function() {
    return callAppMethod("showJoyRoom");
  },
  // 进入余额充值
  NativeShowChargeBalance: function() {
    return callAppMethod("showChargeBalance");
  },
  // 进入身份验证
  NativeShowChargeOrBindPhoneNumber: function() {
    return callAppMethod("showChargeOrBindPhoneNumber");
  },
  // 进入选择你要创建的类型页面
  NativeShowCreateRoom: function() {
    return callAppMethod("showCreateRoom");
  },
  // 随机进入画猜、卧底、狼人杀房间
  NativeShowSocialGame: function() {
    return callAppMethod("showSocialGame");
  },
  // 随机进入画猜、卧底、狼人杀、娱乐房
  NativeShowSocialGameAndJoyRoom: function() {
    return callAppMethod("showSocialGameAndJoyRoom");
  },
  // 进入朋友圈
  NativeShowMoment: function() {
    return callAppMethod("showMoment");
  },
  // 进入与指定好友聊天界面
  NativeShowPrivateChat: function(params) {
    return callAppMethod("showPrivateChat", params);
  },
  // 身份验证剧本杀
  NativeIdAuth: function() {
    return callAppMethod("idAuth");
  },
  // 剧本杀首页
  NativeJuben: function() {
    return callAppMethod("juben");
  },
  // 小游戏 游戏id
  NativeLittleGame: function(params) {
    return callAppMethod("littleGame", params);
  },
  // 消息Tab关注列表
  NativeShowFollowList: function() {
    return callAppMethod("showFollowList");
  },
  // 发现页
  NativeShowDiscoveryPage: function() {
    return callAppMethod("showDiscoveryPage");
  },
  // 剧本库列表
  NativeJubenList: function() {
    return callAppMethod("jubenList");
  },
  // 跳转话题页
  NativeOpenTopicDetail: function(params) {
    return callAppMethod("openTopicDetail", params);
  },
  // 获取系统信息
  NativeGetSystemInfoSync: function() {
    return callAppMethod("getSystemInfoSync");
  },

  // 返回
  NativeNavigateBack: function() {
    return callAppMethod("navigateBack");
  },

  // 跳转到首页某个tab
  NativeShowHomePageWithTab(tab) {
    return callAppMethod("showHomePageWithTab", { tabType: tab });
  },

  getHeader(data) {
    return {
      "Content-Type": "application/x-www-form-urlencoded",
      "user-token": encodeURIComponent(data.token),
    };
  },
};
