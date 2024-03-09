<template>
  <div>
    <BasicTable
      @register="registerTable"
      @rowDbClick="handleDetail"
    >
      <template #toolbar>
        <!-- <AButton
          type="primary"
          @click="handlePrint"
        >
          <PrinterOutlined />
          打印
        </AButton> -->
        <AButton
          type="primary"
          @click="handleExportExcel"
        >
          <DownloadOutlined />
          导出Excel
        </AButton>
      </template>
    </BasicTable>
    <DetailModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getInStockListApi,
} from '/@/api/bills/warehousing';
import { useModal } from '/@/components/Modal';
import DetailModal from "./DetailModal.vue"


import {
  DownloadOutlined,
  // PrinterOutlined
} from '@ant-design/icons-vue';
// import { usePrint } from "/@/hooks/web/usePrint"
import { jsonToSheetXlsx } from '/@/components/Excel';
import { cloneDeep } from 'lodash-es';
export default {
  name: 'Warehousing'
}
</script>
<script lang="ts" setup>
const [registerTable, { getDataSource, getColumns }] = useTable({
  api: getInStockListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
});
const [registerModal, { openModal }] = useModal();
function handleDetail(data: Recordable) {

  openModal(true, data);
}

// function handlePrint() {
//   const columns = getColumns()
//   const dataSource = getDataSource().map((item, index) => ({ ...item, index: index + 1 }))

//   usePrint([{ dataIndex: 'index', title: '序号' }, ...columns], dataSource, '入库单')
// }
function handleExportExcel() {
  const data = cloneDeep(getDataSource().map((item, index) => ({ ...item, index: index + 1 })));
  const columns = [{ dataIndex: 'index', title: '序号' }, ...getColumns()].filter(item => item.dataIndex);
  const header = {};

  columns.forEach((column) => {

    column.dataIndex !== 'action' && (header[column.dataIndex as string] = column.title);
  });

  data.map((item) => {
    for (const key in item) {
      if (!header.hasOwnProperty(key)) {
        delete item[key];
      }
    }
  });
  console.log(data,
    header);

  jsonToSheetXlsx({
    data,
    header,
    filename: '入库单.xlsx',
  });
}
</script>
