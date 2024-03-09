<template>
    <Tooltip placement="top">
        <template #title>
            <span>打印</span>
        </template>
        <PrinterOutlined @click="print" />
    </Tooltip>
</template>

<script lang="ts" setup>
import { Tooltip } from 'ant-design-vue';
import { PrinterOutlined } from "@ant-design/icons-vue"

import printJS from 'print-js';

import { useTableContext } from '../../hooks/useTableContext';
const table = useTableContext();

function print() {

    const dataSource = table.getDataSource();
    const columns = table.getColumns()
    const properties = columns.map(column => column.dataIndex).filter(item => item && item !== 'action');
    const header = columns.filter(item => properties.includes(item.dataIndex)).map(column => column.title)

    const fields = {}
    properties.map((dataIndex, i) => {
        header.map((title, j) => {
            if (i === j) {
                fields[dataIndex as string] = title
            }

        })
    })
    dataSource.map(item => {
        for (const key in fields) {
            item[fields[key]] = item[key]
        }
    })

    printJS({
        printable: dataSource,
        properties: header,
        type: 'json',
    });

}
</script>

