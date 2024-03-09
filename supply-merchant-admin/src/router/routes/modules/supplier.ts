
import type { AppRouteModule } from '/@/router/types';
import { LAYOUT } from '/@/router/constant';

const supplier: AppRouteModule = {
    path: '/supplier',
    name: 'Supplier',
    component: LAYOUT,
    meta: {
        icon: 'ant-design:setting-outlined',
        title: '供应商管理',
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
            path: 'supplier-list',
            name: 'SupplierList',
            component: () => import('/@/views/supplier/supplier-list/index.vue'),
            meta: {
                title: '供应商列表',
                roles: [2],
            },
        },
    ],
};

export default supplier;
