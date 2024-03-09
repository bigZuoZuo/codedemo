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

      <template #bReceiveTypeId="{ record }">
        <Switch
          :loading="record.switchLoading"
          :checked="record.bReceiveTypeId === 1"
          @change="handleAudit($event, record)"
          checked-children="已接收"
          un-checked-children="未接收"
        />
      </template>
    </BasicTable>
    <DetailModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getBackFactoryListApi,
  updateExaminApi
} from '/@/api/bills/return';
import { useModal } from '/@/components/Modal';
import DetailModal from "./DetailModal.vue"
import { Switch } from "ant-design-vue"

import {
  DownloadOutlined,
  //  PrinterOutlined 
} from '@ant-design/icons-vue';
// import { usePrint } from "/@/hooks/web/usePrint"
import { jsonToSheetXlsx } from '/@/components/Excel';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';

export default {
  name: 'Return'
}
</script>
<script lang="ts" setup>
const [registerTable, { getDataSource, getColumns }] = useTable({
  api: getBackFactoryListApi,
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
const { createMessage } = useMessage();

// 审核
async function handleAudit(checked, record) {
  try {
    record.switchLoading = true;
    const newStatus = checked ? 1 : 0;
    await updateExaminApi({ no: record.cSheetno, examin: newStatus })
    record.bReceiveTypeId = newStatus;
    createMessage.success('修改状态成功')
  } finally {
    record.switchLoading = false;
  }

}


// function handlePrint() {
//   const columns = getColumns()
//   const dataSource = getDataSource().map((item, index) => ({ ...item, index: index + 1 }))

//   usePrint([{ dataIndex: 'index', title: '序号' }, ...columns], dataSource, '退货单')
// }
function handleExportExcel() {
  const data = cloneDeep(getDataSource()
    .map((item, index) =>
      ({ ...item, index: index + 1, bReceiveTypeId: item.bReceiveTypeId === 1 ? '已接收' : '未接收' })));
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
    filename: '退货单.xlsx',
  });
}
</script>
