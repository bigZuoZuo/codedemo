import { defHttp } from '/@/utils/http/axios';

// 调价申请单列表
export const getEditGoodsPriceListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/EditGoodsPrice/GetEditGoodsPriceList',
    data,
  })
// 调价申请单明细
export const getEditGoodsPriceInfoApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/EditGoodsPrice/GetEditGoodsPriceInfo',
    data,
  })
// 添加调价申请单
export const addEditGoodsPriceApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/EditGoodsPrice/AddEditGoodsPrice',
    data,
  })
// 修改调价申请单
export const updateEditGoodsPriceApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/EditGoodsPrice/UpdateEditGoodsPrice',
    data,
  })
// 删除调价申请单
export const deleteEditGoodsPriceApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/EditGoodsPrice/DeleteEditGoodsPrice',
    data,
  })
// 提交调价申请单
export const submitGoodsPriceApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/EditGoodsPrice/SubmitGoodsPrice',
    data,
  })