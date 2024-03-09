import { defHttp } from '/@/utils/http/axios';

// 获取ERP供应商列表
export const getSupplierListApi = (data) =>
  defHttp.post({
    url: '/api/Sheets/Sheets/Supplier/GetSupplierList',
    data,
  });

// 解绑
export const deleteSupplyMerchantDetailApi = (data) =>
  defHttp.post({
    url: '/api/Merchant/Merchant/Merchant/DeleteSupplyMerchantDetail',
    data,
  });

