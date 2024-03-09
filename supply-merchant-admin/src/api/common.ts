import { defHttp } from '/@/utils/http/axios';

// 获取门店下拉框
export const getStoreListApi = (data) =>
  defHttp.post({
    url: '/api/Common/Common/DropDownData/GetStoreList',
    data,
  });
// 获取供应商下拉框 ERP数据
export const getSupplierListApi = (data) =>
  defHttp.post({
    url: '/api/Common/Common/DropDownData/GetSupplierList',
    data,
  });
// 通用下拉框接口
export const getEnumListApi = (data) =>
  defHttp.post({
    url: '/api/SysItemBase/SysItemBase/SysItemBase/GetList',
    data,
  });
// ERP供应商数据
export const getSupplyListWithRelationApi = (data) =>
  defHttp.post({
    url: '/api/Common/Common/DropDownData/GetSupplyListWithRelation',
    data,
  });
// ERP供应商编码
export const getSupListWithRelationApi = (data) =>
  defHttp.post({
    url: '/api/Common/Common/DropDownData/GetSupListWithRelation',
    data,
  });

// 供应商信息
export const getRelationSupplyListApi = (data) =>
  defHttp.post({
    url: '/api/Common/Common/DropDownData/GetRelationSupplyList',
    data,
  });

// 系统选择项 1抵押分类
export const getListApi = (data) =>
  defHttp.post({
    url: '/api/SysItemBase/SysItemBase/SysItemBase/GetList',
    data,
  });

