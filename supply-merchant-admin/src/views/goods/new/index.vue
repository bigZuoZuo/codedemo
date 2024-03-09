<template>
  <div>
    <BasicTable
      @register="registerTable"
    >
      <template #toolbar>
        <AButton type="primary" @click="handleCreate">添加</AButton>
      </template>
    </BasicTable>

    <FormModal @register="registerModal" />

  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getNewGoodsListApi,
} from '/@/api/goods/new';
import { useModal } from '/@/components/Modal';
import FormModal from "./FormModal.vue"
export default {
  name: 'New'
}
</script>
<script lang="ts" setup>
const [registerTable] = useTable({
  api: getNewGoodsListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
});
const [registerModal, { openModal }] = useModal();
function handleCreate() {
  openModal(true);
}


</script>
