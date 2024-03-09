import System, {isLocal, toast } from "@src/system";
// import UserInfo from "@src/userInfo";
import axios from "axios";
import qs from "qs";
// import { proxy } from "../../package.json";
import { formatTime } from "./utils";

// 商业活动项目组域名
const activityDomainMap = {
  banban: {
    development: "https://dev-activity.iambanban.com",
    alpha: "https://alpha.yinjietd.com/_activity",
    production: "https://api.iambanban.com/_activity",
  },
  partying: {
    development: "http://test.overseaban.com/_activity",
    production: "https://api.partying.sg/_activity",
  },
  teammate: {
    development: "https://dev.iambanban.com/_activity",
    production: "https://api.imhotplay.com/_activity",
  },
};

// 管理系统组域名
// const helpDomainMap = {
//   banban: {
//     development: "https://dev.iambanban.com",
//     production: "https://help.iambanban.com",
//   },
//   partying: {
//     development: "http://test.overseaban.com",
//     production: "https://help.partying.sg",
//   },
//   teammate: {
//     development: "https://dev.iambanban.com",
//     production: "https://help.imhotplay.com",
//   },
// };

axios.interceptors.response.use(function(response) {
  if (!isLocal) console.log(formatTime(new Date()), response.config.url, response);
  return response;
});

export default async function request({
  domain = System.api_domain,
  url,
  params,
  method = "get",
  data,
  headers,
  notice = true,
  forceDomain = false,
  ...rest
}) {
  if (!forceDomain) {
    domain = activityDomainMap[System.appName][System.server_env];
  }

  // if (proxy && isDevelopment && domain !== proxy) toast("proxy域名与api域名不一致");
  let response = null;
  try {
    // todo: show loading
    response = await axios({
      baseURL: domain,
      url,
      params,
      // params: {
      //   uid: 118433435,
      //   ...params,
      // },
      method,
      data: data instanceof FormData ? data : qs.stringify(data),
      headers: {
        // "User-Language": UserInfo.area,
        "user-token": System.token,
        ...headers,
      },
      ...rest,
    });
  } catch (error) {
    // 请求操作错误或失败
    toast(error.message);
    throw error;
  } finally {
    // todo: hide loading
  }

  // 业务操作错误或失败
  let { success, msg, message } = response.data;
  if (success === false) {
    notice && toast(`${msg || message || "unknow"}`);
    const error = new Error(msg || message);
    error.response = response;
    throw error;
  }
  return [response.data.content, response.data.result, response.data.data, response.data].find(
    (item) => item !== undefined
  );
}
