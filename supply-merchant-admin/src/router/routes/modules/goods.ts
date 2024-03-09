import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const goods: AppRouteModule = {
  path: '/goods',
  name: 'Goods',
  component: LAYOUT,
  meta: {
    icon: 'ep:goods',
    title: '商品',
    orderNo: 100000,
    roles: [1],
  },
  children: [
    {
      path: 'available',
      name: 'Available',
      component: () => import('/@/views/goods/available/index.vue'),
      meta: {
        title: '可供商品',
        roles: [1],
      },
    },
    {
      path: 'sale',
      name: 'Sale',
      component: () => import('/@/views/goods/sale/index.vue'),
      meta: {
        title: '商品销售',
        roles: [1],
      },
    },
    {
      path: 'exchange',
      name: 'Exchange',
      component: () => import('/@/views/goods/exchange/index.vue'),
      meta: {
        title: '商品往来',
        roles: [1],
      },
    },
    {
      path: 'sum',
      name: 'Sum',
      component: () => import('/@/views/goods/sum/index.vue'),
      meta: {
        title: '商品销售汇总',
        roles: [1],
      },
    },
    {
      path: 'stock',
      name: 'Stock',
      component: () => import('/@/views/goods/stock/index.vue'),
      meta: {
        title: '商品库存',
        roles: [1],
      },
    },
    {
      path: 'new',
      name: 'New',
      component: () => import('/@/views/goods/new/index.vue'),
      meta: {
        title: '新品申报',
        roles: [1],
      },
    },
    {
      path: 'adjust',
      name: 'Adjust',
      component: () => import('/@/views/goods/adjust/index.vue'),
      meta: {
        title: '调价申请单',
        roles: [1],
      },
    },
  ],
};

export default goods;
