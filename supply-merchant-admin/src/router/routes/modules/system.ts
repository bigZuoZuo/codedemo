
import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const system: AppRouteModule = {
    path: '/system',
    name: 'System',
    component: LAYOUT,
    meta: {
        icon: 'ant-design:setting-outlined',
        title: '系统',
        orderNo: 100000,
        roles: [2],
    },
    children: [
        // {
        //     path: 'supplier',
        //     name: 'Supplier',
        //     component: () => import('/@/views/system/supplier/index.vue'),
        //     meta: {
        //         title: '供应商管理',
        //     },
        // },
        {
            path: 'notify',
            name: 'Notify',
            component: () => import('/@/views/system/notify/index.vue'),
            meta: {
                title: '通知',
                roles: [2],
            },
        },
    ],
};

export default system;
