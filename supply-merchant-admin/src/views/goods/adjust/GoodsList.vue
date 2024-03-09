<template>
    <BasicModal
        @register="registerModal"
        title="商品列表"
        :width="1200"
        @ok="handleConfirm"
    >
        <BasicTable
            @register="registerTable"
            :rowSelection="rowSelection"
        >


            <!-- <template #action="{ record }">
                <TableAction :actions="[
                    {
                        label: '选择',
                        onClick: () => confirm(record)
                    },
                ]" />
            </template> -->
        </BasicTable>
    </BasicModal>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

// import { getStoreListApi } from "/@/api/common"
import {
    getValidSupplyGoodsPageApi,
} from '/@/api/goods/available';

import { BasicModal, useModalInner } from '/@/components/Modal';
import { ref } from "vue"
</script>
<script lang="ts" setup>

function getTableColumns(): BasicColumn[] {
    return [
        {
            title: '门店',
            dataIndex: 'cStoreNo',
        },
        {
            title: '门店名称',
            dataIndex: 'cStoreName',
        },
        {
            title: '店内码',
            dataIndex: 'cGoodsNo',
        },
        {
            title: '条形码',
            dataIndex: 'cBarcode',
        },
        {
            title: '商品名称',
            dataIndex: 'cGoodsName',
        },
        {
            title: '单位',
            dataIndex: 'cUnit',
        },
        {
            title: '规格',
            dataIndex: 'cSpec',
        },
        {
            title: '合同价',
            dataIndex: 'fContract',
        }
    ];
}

function getTableFormConfig(): Partial<FormProps> {

    return {
        labelWidth: 60,
        schemas: [
            {
                field: 'csheetno',
                label: '单号',
                component: 'Input',
                colProps: {
                    span: 6,
                },
            },
            // {
            //     field: 'storeDetail',
            //     label: '门店',
            //     component: 'ApiSelect',
            //     componentProps: {
            //         api: getStoreListApi,
            //         labelField: 'cStoreName',
            //         valueField: 'cStoreNo',
            //         mode: 'multiple',
            //         maxTagCount: 1
            //     },
            //     colProps: {
            //         span: 6,
            //     },
            // },
        ],

    };
}
const checkedKeys = ref<(string | number)[]>([])
const rowSelection: any = {
    type: 'checkbox',
    columnWidth: 40,
    selectedRowKeys: checkedKeys,
    onChange: onSelectChange,
};
function onSelectChange(selectedRowKeys: (string | number)[]) {
    checkedKeys.value = selectedRowKeys;
}
const emits = defineEmits(['confirm', 'register'])
const searchInfo = {
    supNos: [],
    storeDetail: []
}
const [registerTable, { reload, getDataSource }] = useTable({
    api: getValidSupplyGoodsPageApi,
    columns: getTableColumns(),
    useSearchForm: true,
    formConfig: getTableFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    // actionColumn: {
    //     width: 80,
    //     title: '操作',
    //     dataIndex: 'action',
    //     slots: { customRender: 'action' },
    // },
    immediate: false,
    canResize: false,
    searchInfo,
    rowKey: 'cGoodsNo'
});
const [registerModal] = useModalInner(({ supNos, storeDetail }) => {

    if (supNos[0] !== searchInfo.supNos[0] || storeDetail[0] !== searchInfo.storeDetail[0]) {
        searchInfo.supNos = supNos
        searchInfo.storeDetail = storeDetail
        reload()
    }
})
// function confirm(record: Recordable) {
//     emits('confirm', record)
// }
function handleConfirm() {
    const data = getDataSource().filter(item => checkedKeys.value.includes(item.cGoodsNo))
    emits('confirm', data)

}
</script>
