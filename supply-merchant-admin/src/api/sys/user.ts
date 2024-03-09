import { defHttp } from '/@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/userModel';

import { ErrorMessageMode } from '/#/axios';

enum Api {
  Login = '/login',
  Logout = '/logout',
  GetUserInfo = '/getUserInfo',
  GetPermCode = '/getPermCode',
}
// 获取菜单列表
export const getUserMenuApi = () =>
  defHttp.post({
    url: '/api/Common/Common/Home/GetUserMenu',
  }, {
    isNotMerchantId: true
  });
// 修改密码
export const updatePwdApi = (data) =>
  defHttp.post({
    url: '/api/Common/Common/Login/UpdatePwd',
    data
  }, {
    isNotMerchantId: true
  });
// 获取用户信息(商户)
export const getUserInfoApi = () =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/GetUserInfo',
  }, {
    isNotMerchantId: true
  });
// 获取用户信息(供应商)
export const getSupplyUserInfoApi = () =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/GetUserInfo',
  }, {
    isNotMerchantId: true
  });
// 获取商户列表
export const getUserMerchantListApi = () =>
  defHttp.post({
    url: '/api/Common/Common/Home/GetUserMerchantList',
  }, {
    isNotMerchantId: true
  });

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post(
    {
      url: '/api/Common/Common/Login/Login',
      params,
    },
    {
      errorMessageMode: mode,
      isNotMerchantId: true
    },
  );
}
/**
 * @description: 获取图片验证码
 */
export function getVerificationCodeImg() {
  return defHttp.post(
    { url: '/api/Common/Common/Login/GetVerificationCodeImg' },
    {
      errorMessageMode: 'none',
      isNotMerchantId: true
    },
  );
}
/**
 * @description: 发送手机验证码
 */
export function sendRegisterVerificationCode(params, mode) {
  return defHttp.post(
    { url: '/api/Supply/Supply/Supply/SendRegisterVerificationCode', params },
    {
      errorMessageMode: mode,
      isNotMerchantId: true
    },
  );
}
/**
 * @description: 注册
 */
export function registerSupplyInfo(params, mode) {
  return defHttp.post(
    { url: '/api/Supply/Supply/Supply/RegisterSupplyInfo', params },
    {
      errorMessageMode: mode,
      isNotMerchantId: true
    },
  );
}
// /**
//  * @description: 发送手机验证码
//  */
// export function sendRegisterVerificationCode(params, mode) {
//   return defHttp.post(
//     { url: '/api/Common/Common/Login/SendRegisterVerificationCode', params },
//     {
//       errorMessageMode: mode,
//       isNotMerchantId: true
//     },
//   );
// }
// /**
//  * @description: 注册
//  */
// export function register(params, mode) {
//   return defHttp.post(
//     { url: '/api/Common/Common/Login/Register', params },
//     {
//       errorMessageMode: mode,
//       isNotMerchantId: true
//     },
//   );
// }

/**
 * @description: getUserInfo
 */

export function getUserInfo() {
  return defHttp.post<GetUserInfoModel>(
    { url: '/api/Common/Home/GetUserDetailInfo' },
    {
      errorMessageMode: 'none',
      isNotMerchantId: true
    },
  );
}
/**
 * @description: 获取消息
 */

export function getNotifyPage(data) {
  return defHttp.post(
    { url: '/api/Notice/Notice/NoticeUserDetail/GetPage', data },
    {
      isNotMerchantId: true
    },
  );
}
/**
 * @description: 阅读消息
 */

export function readNotice(data) {
  return defHttp.post(
    { url: '/api/Notice/Notice/NoticeUserDetail/ReadNotice', data },
    {
      isNotMerchantId: true
    },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}
