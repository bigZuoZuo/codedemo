import { defHttp } from '/@/utils/http/axios';

// 获取结算单
export const getSettleAccountListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/SettleAccount/GetSettleAccountList',
    data,
  });
// 获取结算单明细
export const getSettleAccountInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/SettleAccount/GetSettleAccountInfo',
    data,
  });

