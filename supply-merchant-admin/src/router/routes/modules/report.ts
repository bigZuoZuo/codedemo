import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const report: AppRouteModule = {
  path: '/report',
  name: 'Report',
  component: LAYOUT,
  meta: {
    icon: 'wpf:statistics',
    title: '报表',
    orderNo: 100000,
    roles: [1],
  },
  children: [
    {
      path: 'arrivalRate',
      name: 'ArrivalRate',
      component: () => import('/@/views/bills/arrivalRate/index.vue'),
      meta: {
        title: '订单到货率',
        roles: [1],
      },
    },
  ],
};

export default report;
