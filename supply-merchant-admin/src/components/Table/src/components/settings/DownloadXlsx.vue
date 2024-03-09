<template>
  <Tooltip placement="top">
    <template #title>
      <span>导出excel</span>
    </template>
    <DownloadOutlined @click="download" />
  </Tooltip>
</template>

<script lang="ts" setup>
  import { Tooltip } from 'ant-design-vue';
  import { DownloadOutlined } from '@ant-design/icons-vue';
  import { jsonToSheetXlsx } from '/@/components/Excel';
  import { useTableContext } from '../../hooks/useTableContext';
  import { cloneDeep } from 'lodash-es';
  const table = useTableContext();

  function download() {
    const data = cloneDeep(table.getDataSource());
    const columns = table.getColumns();
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
      filename: '表格导出.xlsx',
    });
  }
</script>
