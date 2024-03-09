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


      <Descriptions title="采购单明细信息">
        <DescriptionsItem label="门店编码">
          {{ record.store }}
        </DescriptionsItem>
        <DescriptionsItem label="门店名称">
          {{ record.cStoreName }}
        </DescriptionsItem>
        <DescriptionsItem label="供应商">
          {{ record.supplier }}
        </DescriptionsItem>
        <DescriptionsItem label="仓库">
          {{ record.wareHouse }}
        </DescriptionsItem>
        <DescriptionsItem label="编号">
          {{ record.cSheetNo }}
        </DescriptionsItem>
        <DescriptionsItem label="日期">
          {{ record.dDate }}
        </DescriptionsItem>
        <DescriptionsItem label="订单金额">
          {{ record.fMoney }}
        </DescriptionsItem>
        <DescriptionsItem label="订单周期">
          {{ record.iDays }}
        </DescriptionsItem>
        <DescriptionsItem label="到期时间">
          {{ record.dDeadLine }}
        </DescriptionsItem>
        <DescriptionsItem label="备注">
          {{ record.cBeiZhu1 }}
        </DescriptionsItem>
        <DescriptionsItem label="总采购量">
          {{ record.fQty }}
        </DescriptionsItem>
        <DescriptionsItem label="送货状态">
          {{ record.bSend }}
        </DescriptionsItem>
        <DescriptionsItem label="验货状态">
          {{ record.bReceive }}
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
import {
  getPurchaseInfoApi
} from '/@/api/bills/purchase';
import printJS from "print-js"
import { Descriptions } from "ant-design-vue"
const DescriptionsItem = Descriptions.Item

</script>

<script lang="ts" setup>
const title = ref<string>('')
const record = ref<Recordable>({})
const dataSource = ref<Recordable[]>([])
const [registerModal, { setModalProps }] = useModalInner((data) => {
  record.value = data;
  getDetailList(data)
});

async function getDetailList({ cSheetNo }) {
  setModalProps({ loading: true })
  title.value = `采购订单明细-${cSheetNo}`
  dataSource.value = await getPurchaseInfoApi({ sheetNo: cSheetNo })
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
