import { defHttp } from '/@/utils/http/axios';

// 获取入库单
export const getInStockListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/InStock/GetInStockList',
    data,
  });
// 获取入库单明细
export const getInStockInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/InStock/GetInStockInfo',
    data,
  });
