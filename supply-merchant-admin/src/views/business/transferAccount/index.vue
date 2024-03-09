<template>
  <div>
    <BasicTable
      @register="registerTable"
      @rowDbClick="handleDetail"
    >
      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              disabled: record.transferStatus !== 1,
              label: '通过',
              onClick: () => handleExamine(record)
            },
            {
              disabled: record.transferStatus !== 1,
              label: '驳回',
              popConfirm: {
                title: '是否确认驳回',
                confirm: () => handleReject(record)
              },
            },
          ]"
        />
      </template>
    </BasicTable>

    <DetailModal @register="registerModal" />
  </div>
</template>

<script lang="ts">
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import { getListApi, examineApi, rejectApi } from '/@/api/finance/transferAccount';
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

const { createMessage } = useMessage()
async function handleExamine({ id }: Recordable) {
  await examineApi({ id })
  createMessage.success('转账单审核通过')
  reload()
}
async function handleReject({ id }: Recordable) {
  await rejectApi({ id })
  createMessage.success('转账单审核驳回')
  reload()
}
</script>
