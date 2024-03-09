import { defHttp } from '/@/utils/http/axios';

// 获取可供商品列表
export const getValidSupplyGoodsListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/ValidSupplyGoods/GetValidSupplyGoodsList',
    data,
  })
// 获取可供商品分页
export const getValidSupplyGoodsPageApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/ValidSupplyGoods/GetValidSupplyGoodsPage',
    data,
  })