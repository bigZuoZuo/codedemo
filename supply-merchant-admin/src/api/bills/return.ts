import { defHttp } from '/@/utils/http/axios';

// 获取退货单
export const getBackFactoryListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/BackFactory/GetBackFactoryList',
    data,
  });
// 获取退货单明细
export const getBackFactoryInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/BackFactory/GetBackFactoryInfo',
    data,
  });
// 获取退货单明细
export const updateExaminApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/BackFactory/UpdateExamin',
    data,
  });
