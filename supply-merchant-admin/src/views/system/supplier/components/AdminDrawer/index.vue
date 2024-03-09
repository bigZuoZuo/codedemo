<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    title="管理员列表"
    width="1200px"
  >
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Button
          type="primary"
          @click="handleCreate"
        >添加</Button>
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
  </BasicDrawer>
</template>
<script lang="ts">
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { nextTick, reactive } from "vue"
import { useMessage } from '/@/hooks/web/useMessage';

import {
  getManagerPagedApi,
  createManagerApi,
  updateManagerApi,
  managerAuditApi
} from '/@/api/system/supplier';
import { BasicModal, useModal } from '/@/components/Modal';
import { BasicForm, useForm } from '/@/components/Form/index'
import { getBasicColumns, getFormConfig, getFormSchema } from './table.data';
import { Switch, Button } from 'ant-design-vue';

</script>
<script lang="ts" setup>

const { createMessage } = useMessage();

const state = reactive({
  merchantId: 0,
  rowId: 0,
  isUpdate: false,
})

const [register] = useDrawerInner(({ record }) => {
  state.merchantId = record.id
});
const [registerTable, { reload }] = useTable({
  api: getManagerPagedApi,
  columns: getBasicColumns(),
  useSearchForm: true,
  formConfig: getFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  actionColumn: {
    width: 100,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
  rowKey: 'id',
  beforeFetch: (params) => ({ ...params, merchantId: state.merchantId }),
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
    await managerAuditApi({ id: record.id })
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
    ...values,
    merchantId: state.merchantId,
    id: state.rowId,
  }
  try {
    setModalProps({ confirmLoading: true })
    if (state.isUpdate) {
      await updateManagerApi(form)
    } else {
      await createManagerApi({
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
    {
      field: 'fieldTime',
      ifShow: !state.isUpdate,
    },
  ]);
}

// 编辑
function handleEdit(record: Recordable) {
  state.rowId = record.id
  state.isUpdate = true

  setModalProps({ visible: true })
  nextTick(() => {
    setSchema()
    setFieldsValue(record)
  })
}
// 添加
function handleCreate() {
  state.isUpdate = false
  setModalProps({ visible: true })
  nextTick(() => {
    setSchema()
    resetFields()
  })

}



</script>
