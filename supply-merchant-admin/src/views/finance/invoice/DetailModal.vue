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

            <Descriptions title="发票明细信息">
                <DescriptionsItem label="发票号码">
                    {{ record.invoiceNo }}
                </DescriptionsItem>
                <DescriptionsItem label="发票代码">
                    {{ record.invoiceCode }}
                </DescriptionsItem>
                <DescriptionsItem label="抵押分类">
                    {{ record.mortgageType }}
                </DescriptionsItem>
                <DescriptionsItem label="发票状态">
                    {{ record.invoiceStatus === 1 ? '审核' : '录入' }}
                </DescriptionsItem>
                <DescriptionsItem label="审核时间">
                    {{ record.examineTime }}
                </DescriptionsItem>
                <DescriptionsItem label="未开金额">
                    {{ record.outMoney }}
                </DescriptionsItem>
                <DescriptionsItem label="未税金额">
                    {{ record.outTaxMoney }}
                </DescriptionsItem>

                <DescriptionsItem label="销售税额">
                    {{ record.taxMoney }}
                </DescriptionsItem>
                <DescriptionsItem label="销售金额">
                    {{ record.saleMoney }}
                </DescriptionsItem>
                <DescriptionsItem label="备注说明">
                    {{ record.remarks }}
                </DescriptionsItem>
                <DescriptionsItem label="创建时间">
                    {{ record.createTime }}
                </DescriptionsItem>
                <DescriptionsItem label="最后修改时间">
                    {{ record.modifyTime }}
                </DescriptionsItem>
                <DescriptionsItem label="结算单号">
                    {{ record.settleAccountNo }}
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
    title.value = `发票-${data.invoiceNo}`
});


const getBindValues = computed(() => ({
    dataSource: unref(record).invoiceDetailDtos,
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
