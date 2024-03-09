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


      <Descriptions title="差价单明细信息">
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
          {{ record.cSheetno }}
        </DescriptionsItem>
        <DescriptionsItem label="日期">
          {{ record.dDate }}
        </DescriptionsItem>
        <DescriptionsItem label="原金额">
          {{ record.fMoneyOld }}
        </DescriptionsItem>
        <DescriptionsItem label="差异金额">
          {{ record.fMoneyDiff }}
        </DescriptionsItem>
        <DescriptionsItem label="新金额">
          {{ record.fMoneyNow }}
        </DescriptionsItem>
        <DescriptionsItem label="总数量">
          {{ record.fQty }}
        </DescriptionsItem>
        <DescriptionsItem label="备注">
          {{ record.cBeiZhu1 }}
        </DescriptionsItem>
        <DescriptionsItem label="审核状态">
          {{ record.bSend }}
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
  getDifferencePriceInfoApi
} from '/@/api/bills/difference';

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

async function getDetailList({ cSheetno }) {
  setModalProps({ loading: true })
  title.value = `差价单明细-${cSheetno}`
  dataSource.value = await getDifferencePriceInfoApi({ sheetNo: cSheetno })
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
