<template>
  <div>
    <BasicTable @register="registerTable" />

  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getSupplierListApi,
} from '/@/api/basic/supplier';

export default {
  name: 'Supplier'
}
</script>
<script lang="ts" setup>
const [registerTable] = useTable({
  api: getSupplierListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,

});

</script>
