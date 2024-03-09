import request from '@/utils/umi-request';

/** 获取菜单信息 GET /api/currentUser */
export async function fetchMenuData() {
  return request('/getRouters', {
    method: 'GET',
  });
}
