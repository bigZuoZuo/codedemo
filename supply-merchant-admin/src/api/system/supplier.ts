import { defHttp } from '/@/utils/http/axios';

// 商户列表
export const getPagedApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/GetPaged',
    params,
  });
// 审核
export const auditApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/Audit',
    params,
  });
// 添加
export const createApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/Create',
    params,
  });
// 修改
export const updateApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/Update',
    params,
  });
// 获取管理员列表
export const getManagerPagedApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/UserGetPaged',
    params,
  });
// 添加管理员
export const createManagerApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/UserCreate',
    params,
  });
// 修改管理员
export const updateManagerApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/UserUpdate',
    params,
  });

// 审核管理员
export const managerAuditApi = (params) =>
  defHttp.post({
    url: '/api/Supply/Supply/Supply/ManagerAudit',
    params,
  });
