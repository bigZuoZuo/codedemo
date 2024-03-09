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

      <Descriptions
        title="转账单明细信息"
      >
        <DescriptionsItem label="转账金额(元)">
          {{ record.transferAmount }}
        </DescriptionsItem>
        <DescriptionsItem label="转账人名称">
          {{ record.transferUserName }}
        </DescriptionsItem>
        <DescriptionsItem label="转账银行账户">
          {{ record.transferBankAccount }}
        </DescriptionsItem>
        <DescriptionsItem label="接收银行账户">
          {{ record.receiveBankAccount }}
        </DescriptionsItem>
        <DescriptionsItem label="转账日期">
          {{ record.transferTime }}
        </DescriptionsItem>
        <DescriptionsItem label="创建时间">
          {{ record.createTime }}
        </DescriptionsItem>
        <DescriptionsItem label="修改时间">
          {{ record.modifyTime }}
        </DescriptionsItem>
        <DescriptionsItem label="提交时间">
          {{ record.submitTime }}
        </DescriptionsItem>
        <DescriptionsItem label="备注说明">
          {{ record.remark }}
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
import { transferAccCostItemListApi } from '/@/api/finance/transferAccount';
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
  getTransferAccCostItemList(data)
});

async function getTransferAccCostItemList({ id }) {
  setModalProps({ loading: true })
  title.value = `转账单明细-${id}`
  const data = await transferAccCostItemListApi({ id });
  dataSource.value = data;
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
