import Taro from "@tarojs/taro";
import userStore from "../store/user";
import moment from "moment";
import { isOldVersion } from "./common";
import { isEmpty, get} from 'lodash'

/**
 * 是否为正式版
 */
export let isRelease: boolean = isEmpty(Taro.getStorageSync('colorEgg')) ? __wxConfig.envVersion === "release" : Taro.getStorageSync('colorEgg') === 'pro';
// 用于切换环境
export function setEnvironment(bRelease: boolean) {
  isRelease = bRelease
  carWebSite = `${baseUrl}`.replace("cn", isRelease ? "com" : "cn");
  webSite = `${baseUrl}/meijing-research-web/${moment().valueOf()}/#/`.replace("cn", isRelease ? "com" : "cn");
  aliyunOssUrl = isRelease ? "https://mp.cdn.meijingdata.com" : "https://md.cdn.meijingdata.cn";
}

export const baseUrl = "https://cloud.meijingdata.cn";
export const aichangUrl = "https://construction.ichang360.cn"

export const carUrl = "meijing-spcar-user-web";
export const eventReviewUrl = "meijing-ai-examine-web";
export const caituUrl = "meijing-collected-figure-assistant-web";
export const contructionUrl = "meijing-construction-web";

export const rootSourceBaseUrl =
  "https://mpr.cdn.meijingdata.com/mini-programs/meijing-applet";

export const rootConstructionSourceBaseUrl =
  "https://mpr.cdn.meijingdata.com/mini-programs/meijing-applet-construction";

export const rootResearchWebSourceBaseUrl =
  "https://mpr.cdn.meijingdata.com/mini-programs/meijing-research-web"

function getWebSite() {
  return `${isOldVersion() ? baseUrl : aichangUrl}/meijing-research-web/${moment().valueOf()}/#/`.replace("cn", isRelease ? "com" : "cn");
}
export let webSite = getWebSite()
export const setWebSite = () => { 
  webSite = getWebSite()
  carWebSite = `${isOldVersion() ? baseUrl : aichangUrl}`.replace(
    "cn",
    isRelease ? "com" : "cn"
  );
}

export let aliyunOssUrl: string = isRelease ? "https://meijing-pro.oss-cn-hangzhou.aliyuncs.com" : "https://meijing-dev.oss-cn-hangzhou.aliyuncs.com";

export let carWebSite = `${baseUrl}`.replace(
  "cn",
  isRelease ? "com" : "cn"
);

export const getUserAvatarUrl = function (userId: number): string {
  const baseAvatarUrl = aliyunOssUrl;
  return baseAvatarUrl + `/users/wechat/avatar/${Math.floor(userId / 1000)}/${userId}`;
}

export const constructionApiSite = aichangUrl.replace(
  "cn",
  isRelease ? "com" : "cn"
);

export const generateStamp = moment().valueOf();

const authInterceptor = function (chain) {
  let { url, header, ...otherParams } = chain.requestParams;
  const isEnvOldVersion = isOldVersion()

  if (!url.startsWith("http")) {
    url = (isEnvOldVersion ? carWebSite : constructionApiSite) + url;
  }

  const { token, userDetails } = userStore;
  const TenantTypeCode = isEnvOldVersion ? 'mj360' : 'construction'
  const newHeader = {
    "MJ-TenantVersion": "V2",
    "X-Authenticated-TenantTypeCode": TenantTypeCode,
    "MJ-TenantTypeCode": TenantTypeCode,
  }

  header = {
    "content-type": "application/json",
    ...newHeader,
    ...header
  };
  if (isEnvOldVersion && userDetails) {
    //@ts-ignore
    // header["MJ-TenantCode"] = userDetails.divisionCode;
  }
  else if ((userDetails && userDetails.tenant)) {
    // header["MJ-TenantCode"] = userDetails.tenant.code;
  }
  if (token) {
    header["Authorization"] = token;
  }

  const requestParams = { url, header, ...otherParams };
  return chain.proceed(requestParams).then(res => {
    return res;
  });
};

export const codeMessage: Object = {
  200: "请求成功",
  400: "错误请求",
  401: "未授权，请求要求身份验证",
  403: "服务器拒绝请求",
  404: "服务器找不到请求的资源",
  405: "禁用请求中指定的方法",
  500: "服务器错误,服务器遇到错误，无法完成请求",
  502: "网关错误",
  503: "服务不可用，服务器暂时过载或维护",
  504: "网关超时"
};

const responseInterceptor = function (chain) {
  const requestParams = chain.requestParams;

  return chain.proceed(requestParams).then(res => {
    switch (res.statusCode) {
      case 401:
        if (get(res, 'data.code') === 80001) {
          userStore.logout();
          Taro.reLaunch({
            url: "/pages/login/login"
          });
        }
        else if (get(res, 'data.code') === 80004) {
          Taro.redirectTo({ url: '/pages/user_request_verify/index' });
        } else {
          Taro.showToast({
            title: get(res, 'data.message'),
            mask: true,
            icon: "none",
            duration: 3000
          })
          userStore.logout();
          Taro.reLaunch({
            url: "/pages/login/login"
          });
        }
        break;
      case 404:
        Taro.showToast({
          title: codeMessage[404],
          mask: true,
          icon: "none",
          duration: 3000
        });
        return Promise.reject(res);
      case 400:
      case 403:
      case 405:
      case 500:
        const errortext =
          (res.data && res.data.message) || codeMessage[res.statusCode];
        if (res.data && res.data.code != "1001" && res.data.code != "1002" && res.data.code != "1003" && res.data.code != "2002") {
          if (errortext.length > 24) {
            Taro.showModal({
              title: '提示',
              content: errortext,
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                  console.log('用户点击确定')
                }
              }
            });
          } else {
             Taro.showToast({
              title: errortext,
              mask: true,
              icon: "none",
              duration: 2000
            });
          }
        }
        return Promise.reject(res);
      default:
        break;
    }
    return res;
  });
};

Taro.addInterceptor(authInterceptor);
Taro.addInterceptor(responseInterceptor);
