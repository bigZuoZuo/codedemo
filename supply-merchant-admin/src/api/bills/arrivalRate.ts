import { defHttp } from '/@/utils/http/axios';

// 订单到货率
export const getOrderArrivalRateListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/OrderArrivalRate/GetOrderArrivalRateList',
    data,
  });

