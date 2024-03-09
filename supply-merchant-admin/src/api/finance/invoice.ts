import { defHttp } from '/@/utils/http/axios';

// 获取发票列表
export const getListApi = (data) =>
    defHttp.post({
        url: '/api/Invoice/Invoice/Invoice/GetPage',
        data,
    });
// 删除发票
export const deleteApi = (data) =>
    defHttp.post({
        url: '/api/Invoice/Invoice/Invoice/Delete',
        data,
    });
// 审核发票
// export const examineApi = (data) =>
//     defHttp.post({
//         url: '/api/Invoice/Invoice/Invoice/Examine',
//         data,
//     });
// 修改发票
export const updateApi = (data) =>
    defHttp.post({
        url: '/api/Invoice/Invoice/Invoice/Update',
        data,
    });
// 添加发票
export const createApi = (data) =>
    defHttp.post({
        url: '/api/Invoice/Invoice/Invoice/Create',
        data,
    });

// 审核发票(商户)
export const examineApi = (data) =>
    defHttp.post({
        url: '/api/Invoice/Invoice/Invoice/Examine',
        data,
    });

// 驳回发票(商户)
export const rejectApi = (data) =>
    defHttp.post({
        url: '/api/Invoice/Invoice/Invoice/Reject',
        data,
    });

