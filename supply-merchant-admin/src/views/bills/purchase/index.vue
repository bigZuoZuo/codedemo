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


      <!-- <template #action="{ record }">
        <TableAction
          stopButtonPropagation
          :actions="[
            {
              label: '打印明细',
              onClick: () => handlePrint(record),
              loading: record.loading,
            },
          
          ]"
        />
      </template> -->

      <template #bSendTypeId="{ record }">
        <Switch
          :loading="record.switchLoading"
          :checked="record.bSendTypeId === 1"
          @change="handleAudit($event, record)"
          checked-children="已送货"
          un-checked-children="未送货"
        />
      </template>
    </BasicTable>

    <DetailModal @register="registerModal" />
  </div>
</template>
<script lang="ts">
import {
  BasicTable, useTable,
  // TableAction
} from '/@/components/Table';
import {
  getTableColumns, getTableFormConfig,
  // getDetailTableColumns
} from './data';
import {
  getPurchaseListApi,
  updateExaminApi
} from '/@/api/bills/purchase';
import { useModal } from '/@/components/Modal';
import DetailModal from "./DetailModal.vue"


import {
  DownloadOutlined,
  // PrinterOutlined 
} from '@ant-design/icons-vue';
// import { usePrint } from "/@/hooks/web/usePrint"
import { jsonToSheetXlsx } from '/@/components/Excel';
import { cloneDeep } from 'lodash-es';
import { useMessage } from '/@/hooks/web/useMessage';

import { Switch } from "ant-design-vue"
// import {
//   getPurchaseInfoApi
// } from '/@/api/bills/purchase';
export default {
  name: 'Purchase'
}
</script>
<script lang="ts" setup>
const [registerTable, { getDataSource, getColumns }] = useTable({
  api: getPurchaseListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
  // actionColumn: {
  //   width: 100,
  //   title: '操作',
  //   dataIndex: 'action',
  //   slots: { customRender: 'action' },
  // },
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
    await updateExaminApi({ no: record.cSheetNo, examin: newStatus })
    record.bSendTypeId = newStatus;
    createMessage.success('修改状态成功')
  } finally {
    record.switchLoading = false;
  }

}
// async function handlePrint(record) {

//   try {
//     record.loading = true;
//     const data = await getPurchaseInfoApi({ sheetNo: record.cSheetNo })

//     const columns = getDetailTableColumns()
//     const dataSource = data.map((item, index) => ({ ...item, index: index + 1 }))

//     usePrint([{ dataIndex: 'index', title: '序号' }, ...columns], dataSource, '采购订单明细')
//   } finally {
//     record.loading = false;
//   }
// }
function handleExportExcel() {
  const data = cloneDeep(getDataSource()
    .map((item, index) =>
      ({ ...item, index: index + 1, bSendTypeId: item.bSendTypeId === 1 ? '已送货' : '未送货' })));
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


  jsonToSheetXlsx({
    data,
    header,
    filename: '采购订单.xlsx',
  });
}
</script>
