import { defHttp } from '/@/utils/http/axios';

// 商品往来列表
export const getGoodsComeGoListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/GoodsComeGo/GetGoodsComeGoList',
    data,
  })