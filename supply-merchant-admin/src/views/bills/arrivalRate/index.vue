<template>
  <div>
    <BasicTable @register="registerTable" />
  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getOrderArrivalRateListApi,
} from '/@/api/bills/arrivalRate';
export default {
  name: 'ArrivalRate'
}
</script>
<script lang="ts" setup>
const [registerTable] = useTable({
  api: getOrderArrivalRateListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
});


</script>
