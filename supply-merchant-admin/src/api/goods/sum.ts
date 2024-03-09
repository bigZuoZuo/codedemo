import { defHttp } from '/@/utils/http/axios';

// 商品销售汇总
export const getGoodsSaleSumListApi = (data) =>
    defHttp.post({
        url: '/api/Sheets/Sheets/GoodsSaleSum/GetGoodsSaleSumList',
        data,
    })