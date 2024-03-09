import { defHttp } from '/@/utils/http/axios';

// 获取商户管理员
export const userGetPagedApi = (data) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/UserGetPaged',
    data,
  });
// 添加商户管理员
export const userCreateApi = (data) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/UserCreate',
    data,
  });
// 修改商户管理员
export const userUpdateApi = (data) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/UserUpdate',
    data,
  });
// 修改商户管理员状态
export const updateUserAuditApi = (data) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/UpdateUserAudit',
    data,
  });

// 重置密码
export const resetPassWordApi = (data) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/ResetPassWord',
    data,
  });

