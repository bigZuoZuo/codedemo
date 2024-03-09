import { defHttp } from '/@/utils/http/axios';

// // 获取供应商下拉框(商户添加供应商使用)
// export const getSupplyListWithRelation = (data) =>
//   defHttp.post({
//     url: '/api/Common/DropDownData/GetSupplyListWithRelation',
//     data,
//   });
// // 获取供应商在ERP中的编码(商户添加供应商使用)
// export const getSupListWithRelation = (data) =>
//   defHttp.post({
//     url: '/api/Common/DropDownData/GetSupListWithRelation',
//     data,
//   });


// // 供应商
// export const getSupplyListApi = (params) =>
//   defHttp.post({
//     url: '/api/Merchant/Merchant/GetSupplyList',
//     params,
//   });
// // 添加供应商
// export const createSupplyMerchantDetailApi = (params) =>
//   defHttp.post({
//     url: '/api/Merchant/Merchant/CreateSupplyMerchantDetail',
//     params,
//   });
// // 删除供应商
// export const deleteSupplyMerchantDetailApi = (params) =>
//   defHttp.post({
//     url: '/api/Merchant/Merchant/DeleteSupplyMerchantDetail',
//     params,
//   });

// 获取供应商列表
export const getSupplyAndErpSupCodeApi = (params) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/GetSupplyAndErpSupCode',
    params,
  });
// 移除供应商
export const deleteSupplyMerchantDetailApi = (params) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/DeleteSupplyMerchantDetail',
    params,
  });
// 修改供应商关联时间
export const updateSupplyMerchantDetailApi = (params) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/UpdateSupplyMerchantDetail',
    params,
  });
// export const getSupplyListApi = (params) =>
//   defHttp.post({
//     url: '/api/Merchant/Merchant/Merchant/GetSupplyList',
//     params,
//   });
// 关联ERP供应商
export const createSupplyMerchantDetailApi = (params) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/CreateSupplyMerchantDetail',
    params,
  });
// 添加供应商并创建账号
export const createSupplyAndUserApi = (params) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/CreateSupplyAndUser',
    params,
  });
