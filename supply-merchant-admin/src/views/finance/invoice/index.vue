<template>
  <div>
    <BasicTable
      @register="registerTable"
      @rowDbClick="handleDetail"
    >
      <template #toolbar>
        <AButton
          type="primary"
          @click="handleExportExcel"
        >
          <DownloadOutlined />
          导出Excel
        </AButton>
        <AButton
          type="primary"
          @click="handleCreate"
        >添加</AButton>
      </template>
      <template #action="{ record }">
        <TableAction :actions="[
          {
            disabled: record.invoiceStatus !== 0,
            label: '编辑',
            onClick: () => handleEdit(record)
          },
          {
            disabled: record.invoiceStatus !== 0,
            label: '删除',
            popConfirm: {
              title: '是否确认删除',
              confirm: () => handleDelete(record)
            },
          },
          // {
          //   disabled: record.invoiceStatus === 1,
          //   label: '提交',
          //   popConfirm: {
          //     title: '是否确认提交该发票',
          //     confirm: () => handleExamine(record)
          //   },
          // },
        ]" />
      </template>
    </BasicTable>

    <FormDrawer
      @register="registerDrawer"
      @success="reload"
    />
    <DetailModal @register="registerModal" />
  </div>
</template>

<script lang="ts">
import { BasicTable, useTable, TableAction } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import {
  getListApi, deleteApi,
  // examineApi
} from '/@/api/finance/invoice';
import { useDrawer } from '/@/components/Drawer';
import FormDrawer from "./FormDrawer.vue"
import DetailModal from "./DetailModal.vue"
import { useModal } from '/@/components/Modal';
import { useMessage } from '/@/hooks/web/useMessage';
import { cloneDeep } from "lodash-es"
import { jsonToSheetXlsx } from '/@/components/Excel';
import {
  DownloadOutlined,
  //  PrinterOutlined 
} from '@ant-design/icons-vue';
export default {
  name: 'Invoice'
}
</script>
<script lang="ts" setup>
const [registerTable, { reload, getColumns, getDataSource }] = useTable({
  api: getListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  // pagination: false,
  actionColumn: {
    width: 150,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
});
const [registerDrawer, { openDrawer }] = useDrawer();
const { createMessage } = useMessage()
function handleCreate() {
  openDrawer(true, {
    isUpdate: false
  });
}

function handleEdit(record: Recordable) {
  openDrawer(true, {
    isUpdate: true,
    record
  });

}
async function handleDelete({ id }: Recordable) {
  await deleteApi({ id })
  createMessage.success('删除成功')
  reload()
}
// async function handleExamine({ id }: Recordable) {
//   await examineApi({ id })
//   createMessage.success('提交成功')
//   reload()
// }
const [registerModal, { openModal }] = useModal();
function handleDetail(data: Recordable) {
  openModal(true, data);
}

function handleExportExcel() {
  const data = cloneDeep(getDataSource()).map((item, index) => ({
    ...item,
    index: index + 1,
    mortgageType: item.mortgageType === 1 ? '货物抵扣' : '费用抵扣',
    invoiceStatus: item.invoiceStatus === 1 ? '审核' : '录入'
  }))
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
    filename: '发票.xlsx',
  });
}
</script>
