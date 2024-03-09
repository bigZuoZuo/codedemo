import request from "@src/lib/request";
import { joinParams } from "@src/lib/utils";
import System from "@src/system";

/**
 * 获取中奖码
 */
export const getLuckyCodes = () => {
  return request({ url: "/singer/getLuckyCodes" });
};

/**
 * 歌友会列表
 */
export const getSubscribeList = (page = 1) => {
  return request({ url: `/singer/subscribeList?page=${page}` });
};

/**
 * 歌友会预约
 */
export const postSubscribe = (rid) => {
  return request({
    url: "/singer/subscribe",
    method: "POST",
    data: { room_id: rid },
  });
};

/**
 * 金牌音乐厅
 */
export const getGoldRooms = () => {
  return request({ url: "/singer/getGoldRooms" });
};

/**
 * 获取推荐歌曲
 */
export const getRecommendSingers = () => {
  return request({ url: "/singer/getRecommendSingers" });
};

/**
 * 奖池信息
 */
export const getLotteryPool = () => {
  return request({ url: "/singer/pool" });
};

/**
 * 预约公演赛
 */
export const postSubscribeScene = () => {
  return request({ url: "/singer/subscribeScene", method: "POST" });
};

/**
 * 收藏列表
 */
export const getLikeLogs = () => {
  return request({ url: "/singer/likeLogs" });
};

/**
 * 收藏/取消收藏歌曲
 */
export const postSingerLike = (singer_uid, state) => {
  return request({
    url: "/singer/like",
    method: "POST",
    data: {
      singer_uid,
      state,
    },
  });
};

/**
 * 随心听
 */
export const getSongList = (singer_id) => {
  return request({ url: `/singer/getSong?singer_uid=${singer_id}` });
};

/**
 * 播放歌曲
 */
export const postBroadcase = (singer_uid) => {
  return request({
    url: "/singer/broadcast",
    method: "POST",
    data: { singer_uid },
  });
};

/**
 * 获取用户幸运币数量
 */
export const getUserIcon = () => {
  return request({ url: "/singer/getUserCoin" });
};

/**
 * 晋级赛pk搜索
 */
export const getPkMatchSearch = (uid) => {
  return request({ url: `/singer/searchPk?uid=${uid}` });
};

/**
 * 海选赛、晋级赛、歌手合集搜索
 */
export const getCommonMatchSearch = ({ user_name, song_name, uid, type }) => {
  return request({
    url: `/singer/search?${joinParams({ user_name, song_name, uid, type })}`,
  });
};

/**
 * 获取抽奖记录
 */
export const getLotteryLogs = (page = 1) => {
  return request({ url: `/singer/getLotteryLogs?page=${page}` });
};

export const getLotteryLogsnew = (page = 1) => {
  return request({ url: `/common/lotteryLog?box_id=50&page_index=${page}` });
};

/**
 * 抽奖
 */
export const postLottery = (num) => {
  return request({ url: "/singer/lottery", method: "POST", data: { num } });
};

export const postLotterynew = (num) => {
  return request({
    url: "/common/lottery",
    method: "POST",
    data: {
      box_id: 50,
      pool_id: 143,
      num,
    },
  });
};

/**
 * 获取用户抽奖码
 */
export const getLotteryCode = () => {
  return request({ url: "/singer/getLotteryCode" });
};

/**
 * 应援锦鲤领取奖励
 */
export const postReceiveReward = (type) => {
  return request({
    url: "/singer/receiveReward",
    method: "POST",
    data: { type },
  });
};

/**
 * 获取用户应援锦鲤信息
 */
export const getUserSupport = () => {
  return request({ url: "/singer/getUserSupport" });
};

/**
 * 获取用户投票记录
 */
export const getUserVoteLog = (page = 1) => {
  return request({ url: `/singer/getUserVoteLog?page=${page}` });
};

/**
 * 获取显示限时礼包购买
 */
export const getGiftPack = () => {
  return request({ url: "/singer/getGiftPack" });
};

/**
 * 获取人气日榜
 */
export const getPopularityRank = () => {
  return request({ url: "/singer/getPopularityRank" });
};

/**
 * 获取人气总榜
 */
export const getPopularityGeneralRank = () => {
  return request({ url: "/singer/getPopularityGeneralRank" });
};

/**
 * 获取应援榜
 */
export const getUserRank = () => {
  return request({ url: "/singer/getUserRank" });
};

/**
 * 获取歌神榜
 */
export const getSingerRank = () => {
  return request({ url: "/singer/getSingerRank" });
};

/**
 * 获取歌手合集
 * @param {Number} style 风格 1:流行 2:古风 3:民谣 4:rap 5:其它
 */
export const getSongs = (style) => {
  return request({ url: `/singer/getSongs?style=${style}` });
};

/**
 * 获取晋级赛、半决赛pk
 */
export const getPks = (type) => {
  return request({ url: `/singer/getPks?type=${type}` });
};

/**
 * 获取海选赛，晋级赛，半决赛，决赛榜单列表
 */
export const getRank = ({ group_id, type, state }) => {
  return request({
    url: `/singer/getRank?${joinParams({ group_id, type, state })}`,
  });
};

/**
 * 用户报名
 * @param {number} uid
 * @param {FormData} formData
 * @returns
 */
export const signup = (
  name_refer,
  intro_refer,
  style_refer,
  url_refer,
  image_refer,
  name,
  intro,
  style,
  url,
  image
) => {
  return request({
    method: "post",
    url: "/singer/signUp",
    params: { uid: System.uid },
    data: {
      name_refer,
      intro_refer,
      style_refer,
      url_refer,
      image_refer,
      name,
      intro,
      style,
      url,
      image,
    },
  });
};

/**
 * 用户上传文件
 * @param {FormData} formData
 * @returns
 */
export const uploadFile = (formData) => {
  return request({
    method: "post",
    url: "/singer/upload",
    data: formData,
  });
};

const DIAMOND_PRICE = 100;

const domainMap = {
  development: "https://dev.iambanban.com",
  production: "https://api.iambanban.com",
  alpha: "https://alpha.yinjietd.com",
};

/**
 * 付费投票
 * @param {Number} to 歌手uid
 * @param {Number} giftId 礼物id
 * @param {Number} giftNum 礼物数量
 */
export const postVote = (to, giftNum) => {
  // TODO 更改domain
  if (!to || !giftNum) {
    throw new Error("参数有误");
  }

  const params = {
    to,
    giftId: 389,
    giftNum,
  };

  return request({
    domain: domainMap[System.server_env],
    forceDomain: true,
    method: "post",
    url: "/pay/create",
    data: {
      platform: "available",
      type: "chat-gift",
      money: DIAMOND_PRICE * giftNum,
      params: JSON.stringify(params),
    },
  });
};

/**
 * 购买限时礼包
 */
export const postPackBuy = () => {
  // TODO 更改domain
  const params = {
    consume_type: "singer_buy_package",
    money: 52000,
  };

  return request({
    domain: domainMap[System.server_env],
    forceDomain: true,
    method: "post",
    url: "/pay/create",
    data: {
      platform: "available",
      type: "activity-buy",
      money: 52000,
      params: JSON.stringify(params),
    },
  });
};

/**
 * 获取是否报名
 */
export const getSingerInfo = () => {
  return request({
    url: "/singer/getSingerInfo",
    method: "get",
  });
};

/**
 * 获取用户钻石数
 */
export const getUserMoney = () => {
  return request({ url: "/singer/getUserMoney" });
};
