<template>

    <div>
        <BasicTable @register="registerTable">
            <template #toolbar>
                <AButton
                    type="primary"
                    @click="handleCreate"
                >添加关联关系</AButton>
            </template>
            <!-- <template #validTime="{ record: { validityStartTime, validityEndTime } }">
                <div>{{ validityStartTime }}</div>
                <div>{{ validityEndTime }}</div>
            </template> -->
            <template #expandedRowRender="{ record }">
                <Table
                    :dataSource="record.erpSupList"
                    :columns="columns"
                    :pagination="false"
                >
                    <template #action="row">
                        <TableAction :actions="[
                            {
                                label: '编辑',
                                onClick: () => handleEdit(record, row)
                            },
                            {
                                label: '解绑',
                                popConfirm: {
                                    title: '确定解绑该供应商吗？',
                                    confirm: () => handleDelete(record, row),
                                },
                            },
                        ]" />
                    </template>
                </Table>
            </template>
        </BasicTable>
        <BasicDrawer
            @register="registerDrawer"
            :title="isUpdate ? '修改关联时间' : '添加关联关系'"
            @ok="handleSubmit"
            :width="600"
            showFooter
        >
            <BasicForm @register="registerForm" />


        </BasicDrawer>
    </div>

</template>

<script lang="ts" setup>
import { BasicDrawer, useDrawer } from '/@/components/Drawer';
import {
    BasicTable,
    useTable,
    TableAction
} from '/@/components/Table';
import { BasicForm, useForm } from '/@/components/Form/index'
import { getSupplyAndErpSupCodeApi, createSupplyMerchantDetailApi, deleteSupplyMerchantDetailApi, updateSupplyMerchantDetailApi } from '/@/api/supplier/supplier-list';

import { getTableColumns, getTableFormConfig, getFormSchema } from './data';
import { nextTick, ref } from "vue"
import { useMessage } from '/@/hooks/web/useMessage';
import { Table } from "ant-design-vue"
const columns = [
    {
        dataIndex: 'index',
        title: '序号',
        customRender: ({ index }) => index + 1
    },
    {
        dataIndex: 'supNo',
        title: 'ERP供应商编号'
    },
    {
        dataIndex: 'supName',
        title: 'ERP供应商名称'
    },
    {
        dataIndex: 'validTime',
        title: '有效期',
        customRender: ({ record }) => `${record.validityStartTime} - ${record.validityEndTime}`
    },

    {
        dataIndex: 'action',
        title: '操作',
        width: 150,
        slots: { customRender: 'action' },
    },
]

const { createMessage } = useMessage();

const isUpdate = ref(false)

// 添加
function handleCreate() {
    isUpdate.value = false;
    openDrawer()
    nextTick(() => {
        resetFields()
        handleUpdateSchema()
    })
}
// 编辑
function handleEdit(record, row) {
    isUpdate.value = true;
    openDrawer()
    nextTick(() => {
        setFieldsValue({
            supplyInfoId: record.id,
            erpSupplyCode: row.record.supNo,
            fieldTime: [row.record.validityStartTime, row.record.validityEndTime]
        })
        handleUpdateSchema()
    })
}
function handleUpdateSchema() {
    updateSchema([
        {
            field: 'supplyInfoId',
            dynamicDisabled: isUpdate.value,
        },
        {
            field: 'erpSupplyCode',
            dynamicDisabled: isUpdate.value,
        },
    ])
}

async function handleDelete(record, row) {
    await deleteSupplyMerchantDetailApi({ id: row.record.id })
    record.erpSupList.splice(row.index, 1)
    createMessage.success('解绑成功')
}


const [registerDrawer, { openDrawer, closeDrawer, setDrawerProps }] = useDrawer();

const [
    registerForm,
    {
        resetFields,
        validateFields,
        getFieldsValue,
        setFieldsValue,
        updateSchema
    },
] = useForm({
    labelWidth: 150,
    schemas: getFormSchema(),
    fieldMapToTime: [['fieldTime', ['validityStartTime', 'validityEndTime'], 'YYYY-MM-DD HH:mm:ss']],
    showActionButtonGroup: false,
    baseColProps: { span: 24 }
});


// 提交
async function handleSubmit() {
    await validateFields()
    const values = getFieldsValue()
    try {
        setDrawerProps({ confirmLoading: true })
        isUpdate.value ? await updateSupplyMerchantDetailApi(values) : await createSupplyMerchantDetailApi(values)
        closeDrawer()
        createMessage.success('保存成功')
        reload();
    } finally {
        setDrawerProps({ confirmLoading: false })
    }

}


const [registerTable, { reload }] = useTable({
    api: getSupplyAndErpSupCodeApi,
    columns: getTableColumns(),
    useSearchForm: false,
    formConfig: getTableFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    pagination: false,
    // actionColumn: {
    //     width: 160,
    //     title: '操作',
    //     dataIndex: 'action',
    //     slots: { customRender: 'action' },
    // },
});

</script>
