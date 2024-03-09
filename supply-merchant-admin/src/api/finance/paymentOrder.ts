import { defHttp } from '/@/utils/http/axios';

// 获取付款单
export const getPaymentListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/Payment/GetPaymentList',
    data,
  });
// 获取付款单明细
export const getPaymentInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/Payment/GetPaymentInfo',
    data,
  });

