import { defHttp } from '/@/utils/http/axios';

// 获取商户管理员
export const userGetPagedApi = (data) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/UserGetPaged',
    data,
  });
// 添加商户管理员
export const userCreateApi = (data) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/UserCreate',
    data,
  });
// 修改商户管理员
export const userUpdateApi = (data) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/UserUpdate',
    data,
  });
// 修改商户管理员状态
export const updateUserAuditApi = (data) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/UpdateUserAudit',
    data,
  });

// 重置密码
export const resetPassWordApi = (data) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/ResetPassWord',
    data,
  });

// 获取商户
export const getSupplyUserMerchantDetailByUserApi = (data) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/GetSupplyUserMerchantDetailByUser',
    data,
  });

// 获取供应商
export const getSupplyMerchantListApi = () => {
  return defHttp.post({
    url: '/api/Supply/Supply/Supply/GetSupplyMerchantList',
  });
};

//
export const AddSupplyUserMerchantDetailByUserApi = (data) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/AddSupplyUserMerchantDetailByUser',
    data,
  });
