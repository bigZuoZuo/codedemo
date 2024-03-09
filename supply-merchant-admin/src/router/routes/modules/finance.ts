import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const finance: AppRouteModule = {
  path: '/finance',
  name: 'Finance',
  component: LAYOUT,
  meta: {
    icon: 'icon-park-outline:finance',
    title: '财务',
    orderNo: 100000,
    roles: [1],
  },
  children: [
    {
      path: 'paymentOrder',
      name: 'PaymentOrder',
      component: () => import('/@/views/finance/paymentOrder/index.vue'),
      meta: {
        title: '付款单',
        roles: [1],
      },
    },
    {
      path: 'settlement',
      name: 'Settlement',
      component: () => import('/@/views/finance/settlement/index.vue'),
      meta: {
        title: '结算单',
        roles: [1],
      },
    },
    {
      path: 'invoice',
      name: 'Invoice',
      component: () => import('/@/views/finance/invoice/index.vue'),
      meta: {
        title: '发票',
        roles: [1],
      },
    },
    {
      path: 'transferAccount',
      name: 'TransferAccount',
      component: () => import('/@/views/finance/transferAccount/index.vue'),
      meta: {
        title: '转账单',
        roles: [1],
      },
    },
  ],
};

export default finance;
