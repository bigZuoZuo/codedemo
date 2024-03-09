import { defHttp } from '/@/utils/http/axios';

// 获取门店列表
export const getStoreListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/Store/GetStoreList',
    data,
  });

