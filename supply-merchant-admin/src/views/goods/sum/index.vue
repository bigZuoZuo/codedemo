<template>
  <div>
    <BasicTable
      @register="registerTable"
    />
  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getGoodsSaleSumListApi,
} from '/@/api/goods/sum';
export default {
  name: 'Sum'
}
</script>
<script lang="ts" setup>
const [registerTable] = useTable({
  api: getGoodsSaleSumListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
});


</script>
