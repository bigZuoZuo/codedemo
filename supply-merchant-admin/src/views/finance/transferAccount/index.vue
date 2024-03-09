<template>
  <div>
    <BasicTable
      @register="registerTable"
      @rowDbClick="handleDetail"
    >
      <template #toolbar>
        <AButton
          type="primary"
          @click="handleCreate"
        >添加</AButton>
      </template>
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '详情',
              onClick: () => handleDetail(record)
            },
          ]"
          :dropDownActions="[
            {
              disabled: !!record.submitTime,
              label: '提交',
              popConfirm: {
                title: '是否确认提交',
                confirm: () => handleSubmit(record)
              },
            },
            {
              // disabled: !!record.submitTime,
              label: '编辑',
              onClick: () => handleEdit(record)
            },
            {
              disabled: !!record.submitTime,
              label: '删除',
              popConfirm: {
                title: '是否确认删除',
                confirm: () => handleDelete(record)
              },
            },
          ]"
        />
      </template>
    </BasicTable>

    <FormDrawer
      @register="registerDrawer"
      @success="reload"
    />
    <DetailModal @register="registerModal" />
  </div>
</template>

<script lang="ts">
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import { getListApi, deleteApi, submitApi } from '/@/api/finance/transferAccount';
import { useDrawer } from '/@/components/Drawer';
import FormDrawer from "./FormDrawer.vue"
import { useMessage } from '/@/hooks/web/useMessage';
import { useModal } from '/@/components/Modal';
import DetailModal from './DetailModal.vue';
export default {
  name: 'TransferAccount'
}
</script>
<script lang="ts" setup>
const [registerTable, { reload }] = useTable({
  api: getListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  // pagination: false,
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
});

const [registerModal, { openModal, }] = useModal();
function handleDetail(record?: Recordable) {
  openModal(true, record);
}

const [registerDrawer, { openDrawer }] = useDrawer();
const { createMessage } = useMessage()
function handleCreate() {
  openDrawer(true, {
    isUpdate: false
  });
}

function handleEdit(record: Recordable) {
  openDrawer(true, {
    isUpdate: true,
    record
  });

}
async function handleDelete({ id }: Recordable) {
  await deleteApi({ id })
  createMessage.success('删除成功')
  reload()
}
async function handleSubmit({ id }: Recordable) {
  await submitApi({ id })
  createMessage.success('提交成功')
  reload()
}
</script>
