import { defHttp } from '/@/utils/http/axios';

// 通知列表
export const getListApi = (params) =>
    defHttp.post({
        url: '/api/Notice/Notice/NoticeInfo/GetPage',
        params,
    });

// 添加通知
export const createApi = (params) =>
    defHttp.post({
        url: '/api/Notice/Notice/NoticeInfo/Create',
        params,
    });

