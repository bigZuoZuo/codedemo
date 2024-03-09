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
  getValidSupplyGoodsPageApi,
} from '/@/api/goods/available';
export default {
  name: 'Available'
}
</script>
<script lang="ts" setup>
const [registerTable] = useTable({
  api: getValidSupplyGoodsPageApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  // pagination: false,
});


</script>
