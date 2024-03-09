<template>
  <div>
    <BasicTable
      @register="registerTable"
      @rowDbClick="handleDetail"
    />

    <DetailModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import { getSettleAccountListApi } from '/@/api/finance/settlement';
import { useModal } from '/@/components/Modal';
import DetailModal from "./DetailModal.vue"
export default {
  name: 'Settlement'
}


</script>
<script lang="ts" setup>
const [registerTable] = useTable({
  api: getSettleAccountListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
});
const [registerModal, { openModal }] = useModal();
function handleDetail({ jieSuanNo }: Recordable) {
  openModal(true, {
    cSheetno: jieSuanNo
  });
}


</script>
