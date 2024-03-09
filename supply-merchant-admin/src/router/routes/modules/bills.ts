import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const bills: AppRouteModule = {
  path: '/bills',
  name: 'Bills',
  component: LAYOUT,
  meta: {
    icon: 'ri:bill-line',
    title: '单据',
    orderNo: 100000,
    roles: [1],
  },
  children: [
    {
      path: 'purchase',
      name: 'Purchase',
      component: () => import('/@/views/bills/purchase/index.vue'),
      meta: {
        title: '采购订单',
        roles: [1],
      },
    },
    {
      path: 'return',
      name: 'Return',
      component: () => import('/@/views/bills/return/index.vue'),
      meta: {
        title: '退货单',
        roles: [1],
      },
    },
    {
      path: 'warehousing',
      name: 'Warehousing',
      component: () => import('/@/views/bills/warehousing/index.vue'),
      meta: {
        title: '入库单',
        roles: [1],
      },
    },
    {
      path: 'difference',
      name: 'Difference',
      component: () => import('/@/views/bills/difference/index.vue'),
      meta: {
        title: '差价单',
        roles: [1],
      },
    },
  ],
};

export default bills;
