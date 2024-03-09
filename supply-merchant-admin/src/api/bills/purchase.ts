import { defHttp } from '/@/utils/http/axios';

// 获取采购订单
export const getPurchaseListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/Purchase/GetPurchaseList',
    data,
  });
// 获取采购订单明细
export const getPurchaseInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/Purchase/GetPurchaseInfo',
    data,
  });
// 修改接收状态
export const updateExaminApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/Purchase/UpdateExamin',
    data,
  });

