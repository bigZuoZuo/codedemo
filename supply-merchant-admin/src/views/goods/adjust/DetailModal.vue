<template>
    <BasicModal
        v-bind="$attrs"
        @register="registerModal"
        :title="title"
        :width="1600"
        @ok="handlePrint"
        ok-text="打印"
        destroyOnClose
    >

        <div id="printBody">


            <Descriptions title="调价申请单明细信息">
                <DescriptionsItem label="日期">
                    {{ record.dDate }}
                </DescriptionsItem>
                <DescriptionsItem label="调价门店">
                    {{ record.cExeStoreNo }}
                </DescriptionsItem>
                <DescriptionsItem label="供应商">
                    {{ record.supNo }}
                </DescriptionsItem>
                <DescriptionsItem label="执行日期">
                    {{ record.dDateExe }}
                </DescriptionsItem>
                <DescriptionsItem label="备注">
                    {{ record.cBeiZhu1 }}
                </DescriptionsItem>

            </Descriptions>

            <BasicTable v-bind="getBindValues" />

        </div>
    </BasicModal>
</template>
<script lang="ts">
import { ref, unref, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicTable } from '/@/components/Table';

import {
    getEditGoodsPriceInfoApi
} from '/@/api/goods/adjust';
import printJS from "print-js"
import { Descriptions } from "ant-design-vue"
const DescriptionsItem = Descriptions.Item

</script>

<script lang="ts" setup>
const title = ref<string>('')
const dataSource = ref<Recordable[]>([])
const record = ref<Recordable>({})
const [registerModal, { setModalProps }] = useModalInner((data) => {
    record.value = data;
    getDetailList(data)
});

async function getDetailList({ cSheetNo }) {
    setModalProps({ loading: true })
    title.value = `调价申请单明细-${cSheetNo}`
    dataSource.value = await getEditGoodsPriceInfoApi({ sheetNo: cSheetNo })
    setModalProps({ loading: false })
}

const columns = [
    {
        title: '店内码',
        dataIndex: 'cGoodsNo',
    },
    {
        title: '商品名称',
        dataIndex: 'cGoodsName',
    },
    {
        title: '条形码',
        dataIndex: 'cBarcode',
    },
    {
        title: '合同价格',
        dataIndex: 'fckPrice',
    },
]
const getBindValues = computed(() => ({
    dataSource: unref(dataSource),
    columns,
    pagination: false,
    canResize: false
}))
function handlePrint() {
    printJS({
        printable: "printBody",
        type: 'html',
        header: null,
        targetStyles: ['*'],
        style: "@page {margin:0 10mm}",
        maxWidth: 9999
    })
}

</script>
