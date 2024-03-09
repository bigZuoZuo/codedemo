import { defHttp } from '/@/utils/http/axios';

// 新品列表
export const getNewGoodsListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/NewGoods/GetNewGoodsList',
    data,
  })
// 添加新品
export const addNewGoodsInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/NewGoods/AddNewGoodsInfo',
    data,
  })
// 检查商品是否存在
export const checkGoodsBarcodeApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/NewGoods/CheckGoodsBarcode',
    data,
  })