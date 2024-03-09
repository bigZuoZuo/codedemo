<template>
  <div>
    <BasicTable
      @register="registerTable"
      @rowDbClick="handleDetail"
    >
      <!-- <template #expandedRowRender="{ record }">
        <Table
          :dataSource="record.goodsComeGoDtlDtos"
          :columns="columns"
          :pagination="false"
        />
      </template> -->
      <template #toolbar>

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
  getGoodsComeGoListApi,
} from '/@/api/goods/exchange';
// import { Table } from "ant-design-vue"
import {
  DownloadOutlined,
  // PrinterOutlined
} from '@ant-design/icons-vue';
import DetailModal from "./DetailModal.vue"
import { useModal } from '/@/components/Modal';
import { jsonToSheetXlsx } from '/@/components/Excel';
import { cloneDeep } from "lodash-es"
export default {
  name: 'Exchange'
}
</script>
<script lang="ts" setup>
const [registerTable, { getDataSource, getColumns }] = useTable({
  api: getGoodsComeGoListApi,
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
    filename: '商品往来.xlsx',
  });
}
</script>
