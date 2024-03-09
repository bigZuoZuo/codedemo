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

            <Descriptions title="商品往来明细信息">
                <DescriptionsItem label="店内码">
                    {{ record.cGoodsNo }}
                </DescriptionsItem>
                <DescriptionsItem label="商品名称">
                    {{ record.cGoodsName }}
                </DescriptionsItem>
                <DescriptionsItem label="条形码">
                    {{ record.cBarcode }}
                </DescriptionsItem>
                <DescriptionsItem label="最近进价">
                    {{ record.fckPrice }}
                </DescriptionsItem>
                <DescriptionsItem label="合同价格">
                    {{ record.fPriceContract }}
                </DescriptionsItem>
                <DescriptionsItem label="销售价格">
                    {{ record.fNormalPrice }}
                </DescriptionsItem>
                <DescriptionsItem label="供应商编号">
                    {{ record.cSupNo }}
                </DescriptionsItem>

                <DescriptionsItem label="供应商名称">
                    {{ record.cSupName }}
                </DescriptionsItem>
                <DescriptionsItem label="商品类别编号">
                    {{ record.cGoodsTypeNo }}
                </DescriptionsItem>
                <DescriptionsItem label="商品类别名称">
                    {{ record.cGoodsTypeName }}
                </DescriptionsItem>
                <DescriptionsItem label="单位">
                    {{ record.cUnit }}
                </DescriptionsItem>
                <DescriptionsItem label="规格">
                    {{ record.cSpec }}
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
import { getDetailTableColumns } from './data';
import printJS from "print-js"
import { Descriptions } from "ant-design-vue"
const DescriptionsItem = Descriptions.Item

</script>

<script lang="ts" setup>
const title = ref<string>('')

const record = ref<Recordable>({})
const [registerModal] = useModalInner((data) => {
    record.value = data;
    title.value = `商品往来明细-${data.cGoodsName}`
});


const getBindValues = computed(() => ({
    dataSource: unref(record).goodsComeGoDtlDtos,
    columns: getDetailTableColumns(),
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
