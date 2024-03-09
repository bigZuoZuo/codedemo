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

      <Descriptions title="付款单明细信息">
        <DescriptionsItem label="付款单号">
          {{ record.jieSuanPayOffNo }}
        </DescriptionsItem>
        <DescriptionsItem label="门店">
          {{ record.cStore }}
        </DescriptionsItem>
        <DescriptionsItem label="供应商">
          {{ record.cSup }}
        </DescriptionsItem>
        <DescriptionsItem label="时间">
          {{ record.dDate }}
        </DescriptionsItem>
        <DescriptionsItem label="支付项目">
          {{ record.sPayOffStyle }}
        </DescriptionsItem>
        <DescriptionsItem label="备注说明">
          {{ record.cRemark }}
        </DescriptionsItem>
        <DescriptionsItem label="未付金额">
          {{ record.fMoneyArrearage }}
        </DescriptionsItem>

        <DescriptionsItem label="总金额">
          {{ record.fMoneyPayMent }}
        </DescriptionsItem>
        <DescriptionsItem label="已付金额">
          {{ record.fMoneyBlance }}
        </DescriptionsItem>
        <DescriptionsItem label="出纳员编号">
          {{ record.cashierNo }}
        </DescriptionsItem>
        <DescriptionsItem label="出纳员名称">
          {{ record.cashierName }}
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
import { getPaymentInfoApi } from '/@/api/finance/paymentOrder';
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

async function getDetailList({ jieSuanPayOffNo }) {
  setModalProps({ loading: true })
  title.value = `付款单明细-${jieSuanPayOffNo}`
  dataSource.value = await getPaymentInfoApi({ sheetno: jieSuanPayOffNo })
  setModalProps({ loading: false })
}
const getBindValues = computed(() => ({
  dataSource: unref(dataSource),
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
