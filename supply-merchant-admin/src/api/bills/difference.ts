import { defHttp } from '/@/utils/http/axios';

// 获取差价单
export const getDifferencePriceListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/DifferencePrice/GetDifferencePriceList',
    data,
  });
// 获取差价单明细
export const getDifferencePriceInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/DifferencePrice/GetDifferencePriceInfo',
    data,
  });

