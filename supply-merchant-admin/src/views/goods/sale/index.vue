<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getGoodsSaleListApi,
} from '/@/api/goods/sale';
export default {
  name: 'Sale'
}
</script>
<script lang="ts" setup>
const [registerTable] = useTable({
  api: getGoodsSaleListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
});


</script>
