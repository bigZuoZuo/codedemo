import { defHttp } from '/@/utils/http/axios';

// 商品销售
export const getGoodsSaleListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/GoodsSale/GetGoodsSaleList',
    data,
  })