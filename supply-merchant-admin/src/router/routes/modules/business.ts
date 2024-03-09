import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const business: AppRouteModule = {
  path: '/business',
  name: 'Business',
  component: LAYOUT,
  meta: {
    icon: 'ant-design:setting-outlined',
    title: '业务',
    orderNo: 100000,
    roles: [2],
  },
  children: [
    {
      path: 'invoice',
      name: 'BusinessInvoice',
      component: () => import('/@/views/business/invoice/index.vue'),
      meta: {
        title: '发票管理',
        roles: [2],
      },
    },
    {
      path: 'transferAccount',
      name: 'BusinessTransferAccount',
      component: () => import('/@/views/business/transferAccount/index.vue'),
      meta: {
        title: '转账单管理',
        roles: [2],
      },
    },
  ],
};

export default business;
