<template>
  <div>
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
        <TableAction :dropDownActions="[
          {
            label: '编辑',
            onClick: () => handleEdit(record)
          },
          {
            label: '管理员',
            onClick: () => handleAdmin(record)
          },
        ]" />
      </template>
    </BasicTable>

    <FormDrawer
      @register="registerFormDrawer"
      @success="reload"
    />
    <AdminDrawer @register="registerAdminDrawer" />

  </div>
</template>
<script lang="ts">
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getBasicColumns, getFormConfig } from './data';
import { Switch, Button } from 'ant-design-vue';
import {
  getPagedApi,
  auditApi,
} from '/@/api/system/supplier';

import { useDrawer } from '/@/components/Drawer';
import FormDrawer from "./components/FormDrawer/index.vue"
import AdminDrawer from "./components/AdminDrawer/index.vue"

import { useMessage } from '/@/hooks/web/useMessage';
export default {
  name: 'Supplier'
}
</script>
<script lang="ts" setup>
const [registerTable, { reload }] = useTable({
  api: getPagedApi,
  columns: getBasicColumns(),
  useSearchForm: true,
  formConfig: getFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  actionColumn: {
    width: 50,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
  rowKey: 'id'
});
const [registerFormDrawer, { openDrawer: openFormDrawer }] = useDrawer();
const [registerAdminDrawer, { openDrawer: openAdminDrawer }] = useDrawer();

const { createMessage } = useMessage()
function handleEdit(record) {
  openFormDrawer(true, {
    isUpdate: true,
    record
  });
}
function handleCreate() {
  openFormDrawer(true, {
    isUpdate: false,
  });
}
function handleAdmin(record) {
  openAdminDrawer(true, {
    record
  })
}



// 审核
async function handleAudit(checked, record) {
  try {
    record.switchLoading = true;
    const newStatus = checked ? 1 : 2;
    await auditApi({ id: record.id })
    record.status = newStatus;
    createMessage.success('修改状态成功')
  } finally {
    record.switchLoading = false;
  }

}
</script>
