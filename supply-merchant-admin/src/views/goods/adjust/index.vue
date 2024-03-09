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
            label: '编辑',
            onClick: () => handleEdit(record)
          },
          {
            label: '删除',
            popConfirm: {
              title: '是否确认删除',
              confirm: () => handleDelete(record)
            },
          },
          {
            disabled: record.bExaminType != 2,
            label: '提交',
            popConfirm: {
              title: '是否确认提交该调价单',
              confirm: () => handleSubmit(record)
            },
          },
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
  getEditGoodsPriceListApi,
  deleteEditGoodsPriceApi,
  submitGoodsPriceApi
} from '/@/api/goods/adjust';
import { useDrawer } from '/@/components/Drawer';
import FormDrawer from "./FormDrawer.vue"
import { useMessage } from '/@/hooks/web/useMessage';
import {
  DownloadOutlined,
  //  PrinterOutlined 
} from '@ant-design/icons-vue';
import DetailModal from "./DetailModal.vue"
// import { usePrint } from "/@/hooks/web/usePrint"
import { jsonToSheetXlsx } from '/@/components/Excel';
import { cloneDeep } from 'lodash-es';
import { useModal } from '/@/components/Modal';
export default {
  name: 'Adjust'
}
</script>
<script lang="ts" setup>
const { createMessage } = useMessage()
const [registerTable, { reload,
  getDataSource,
  getColumns,
  // , getForm, setProps 
}] = useTable({
  api: getEditGoodsPriceListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(
    //   {
    //   supNoOptionsChange: (options) => {

    //     const form = getForm()
    //     const [first] = options;
    //     if (!first) return
    //     const parmas = { supNo: first.value }
    //     setProps({
    //       searchInfo: parmas
    //     })

    //     form.setFieldsValue(parmas)
    //     reload()
    //   }
    // }
  ),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  pagination: false,
  actionColumn: {
    width: 160,
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
  },
  immediate: false
});
const [registerDrawer, { openDrawer }] = useDrawer();
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

async function handleSubmit({ cSheetNo }: Recordable) {
  await submitGoodsPriceApi({ sheetNo: cSheetNo })
  createMessage.success('提交成功')
  reload()
}

async function handleDelete({ cSheetNo }: Recordable) {
  await deleteEditGoodsPriceApi({ sheetNo: cSheetNo })
  createMessage.success('删除成功')
  reload()
}

const [registerModal, { openModal }] = useModal();
function handleDetail(data: Recordable) {
  openModal(true, data);
}
function handleExportExcel() {
  const data = cloneDeep(getDataSource()
    .map((item, index) =>
      ({ ...item, index: index + 1 })));
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
    filename: '调价申请单.xlsx',
  });
}
</script>
