<template>

    <div>
        <BasicTable @register="registerTable">
            <template #toolbar>
                <AButton
                    type="primary"
                    @click="handleCreate"
                >添加</AButton>
            </template>
            <template #status="{ record }">
                <Switch
                    :loading="record.switchLoading"
                    :checked="record.status === 1"
                    @change="handleAudit($event, record)"
                />
            </template>
            <template #validTime="{ record: { validityStartTime, validityEndTime } }">
                <div>{{ validityStartTime }}</div>
                <div>{{ validityEndTime }}</div>
            </template>

            <template #action="{ record }">
                <TableAction :actions="[
                
                    {
                        label: '编辑',
                        onClick: () => handleEdit(record)
                    },
                    {
                        label: '重置密码',
                        popConfirm: {
                            title: `确定重置密码为${record.phone}吗(当前账号)？`,
                            confirm: () => handleResetPassWord(record),
                        },
                    },
                ]" />
            </template>
        </BasicTable>

        <BasicModal
            @register="registerModal"
            :title="state.isUpdate ? '编辑' : '添加'"
            @ok="handleSubmit"
            :width="600"
        >
            <BasicForm @register="registerForm"></BasicForm>
        </BasicModal>
    </div>

</template>
<script lang="ts">

import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { nextTick, reactive, ref } from "vue"
import { useMessage } from '/@/hooks/web/useMessage';

import {
    userGetPagedApi,
    userCreateApi,
    userUpdateApi,
    updateUserAuditApi,
    resetPassWordApi
} from '/@/api/basic/personnel';
import { BasicModal, useModal } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index'
import { getBasicColumns, getFormConfig, getFormSchema } from './data';
import { Switch } from "ant-design-vue"
</script>
<script lang="ts" setup>

const { createMessage } = useMessage();

const state = reactive({
    isUpdate: false,
})
const currentRow = ref({})
const [registerTable, { reload }] = useTable({
    api: userGetPagedApi,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    actionColumn: {
        width: 200,
        title: '操作',
        dataIndex: 'action',
        slots: { customRender: 'action' },
    },
    rowKey: 'id',
});


const [
    registerForm,
    {
        setFieldsValue,
        resetFields,
        validateFields,
        updateSchema,
        getFieldsValue
    },
] = useForm({
    labelWidth: 100,
    schemas: getFormSchema(),
    fieldMapToTime: [['fieldTime', ['validityStartTime', 'validityEndTime'], 'YYYY-MM-DD HH:mm:ss']],
    showActionButtonGroup: false,
    baseColProps: { span: 24 }
});

const [registerModal, { setModalProps }] = useModal()




// 审核
async function handleAudit(checked, record) {
    try {
        record.switchLoading = true;
        const newStatus = checked ? 1 : 2;
        await updateUserAuditApi({ id: record.id, status: newStatus })
        record.status = newStatus;
        createMessage.success('修改状态成功')
    } finally {
        record.switchLoading = false;
    }

}

// 提交
async function handleSubmit() {
    await validateFields()
    const values = getFieldsValue()

    const form = {
        ...currentRow.value,
        ...values
    }


    try {
        setModalProps({ confirmLoading: true })
        if (state.isUpdate) {
            await userUpdateApi(form)
        } else {
            await userCreateApi({
                ...form,
                password: window.btoa(values.password),
                repeatPassword: window.btoa(values.repeatPassword)
            })
        }

        setModalProps({ visible: false })
        createMessage.success('保存成功')
        reload()
    } finally {
        setModalProps({ confirmLoading: false })
    }

}

function setSchema() {
    updateSchema([
        {
            field: 'password',
            ifShow: !state.isUpdate,
        },
        {
            field: 'repeatPassword',
            ifShow: !state.isUpdate,
        },
        {
            field: 'phone',
            dynamicDisabled: state.isUpdate,
        },
        // {
        //   field: 'fieldTime',
        //   ifShow: !state.isUpdate,
        // },
    ]);
}

// 编辑
function handleEdit(record: Recordable) {
    currentRow.value = { ...record, merchantId: record.merchantInfoId }
    state.isUpdate = true

    setModalProps({ visible: true })
    nextTick(() => {
        setSchema()
        setFieldsValue(record)
    })
}
// 添加
function handleCreate() {
    currentRow.value = {};
    state.isUpdate = false
    setModalProps({ visible: true })
    nextTick(() => {
        setSchema()
        resetFields()
    })

}
// 重置密码
async function handleResetPassWord({ id }: Recordable) {
    await resetPassWordApi({ id })
    createMessage.success('重置成功')
}



</script>
