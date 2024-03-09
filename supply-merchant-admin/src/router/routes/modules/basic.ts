import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const basic: AppRouteModule = {
  path: '/basic',
  name: 'Basic',
  component: LAYOUT,
  redirect: '/basic/store',
  meta: {
    icon: 'icon-park-outline:finance',
    title: '基础',
    orderNo: 100000,
    roles: [1, 2],
  },
  children: [
    {
      path: 'store',
      name: 'Store',
      component: () => import('/@/views/basic/store/index.vue'),
      meta: {
        title: '门店',
        roles: [1],
      },
    },
    {
      path: 'supplier',
      name: 'Supplier',
      component: () => import('/@/views/basic/supplier/index.vue'),
      meta: {
        title: '供应商',
        roles: [1],
      },
    },
    {
      path: 'supplyPersonnel',
      name: 'supplyPersonnel',
      component: () => import('/@/views/basic/supplyPersonnel/index.vue'),
      meta: {
        title: '人员管理',
        roles: [1],
      },
    },
    {
      path: 'setting',
      name: 'Setting',
      component: () => import('/@/views/basic/setting/index.vue'),
      meta: {
        title: '个人信息',
        roles: [1, 2],
        hideMenu: true
      },
    },
    {
      path: 'personnel',
      name: 'Personnel',
      component: () => import('/@/views/basic/personnel/index.vue'),
      meta: {
        title: '人员管理',
        roles: [2],
      },
    },
  ],
};

export default basic;
