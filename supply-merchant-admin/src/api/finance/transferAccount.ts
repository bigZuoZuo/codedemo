import { defHttp } from '/@/utils/http/axios';

// 获取转账单列表
export const getListApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/GetPage',
    data,
  });
// 删除转账单
export const deleteApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/Delete',
    data,
  });
// 审核转账单
export const submitApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/Submit',
    data,
  });
// 修改转账单
export const updateApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/Update',
    data,
  });
// 添加转账单
export const createApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/Create',
    data,
  });

// 添加转账单
export const transferAccCostItemListApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/TransferAccCostItemList',
    data,
  });

// 转账单审核通过（商户）
export const examineApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/Examine',
    data,
  });

// 转账单审核驳回（商户）
export const rejectApi = (data) =>
  defHttp.post({
    url: '/api/TransferAccount/TransferAccount/TransferAccount/Reject',
    data,
  });
