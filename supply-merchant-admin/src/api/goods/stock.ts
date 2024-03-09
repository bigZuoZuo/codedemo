import { defHttp } from '/@/utils/http/axios';

// 商品库存
export const getGoodsStockListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/GoodsStock/GetGoodsStockPage',
    data,
  })