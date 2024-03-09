<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    :title="title"
    :width="1600"
    :footer="null"
  >
    <Tabs v-model:activeKey="tabActiveKey">
      <TabPane
        v-for="(item, index) in tableListProps"
        :key="index"
        :tab="item.title"
      >
        <BasicTable v-bind="item" />
      </TabPane>
    </Tabs>
  </BasicModal>
</template>
<script lang="ts">
import { Tabs } from 'ant-design-vue';
import { ref, unref, computed } from 'vue';
import { BasicModal, useModalInner } from '/@/components/Modal';
import { BasicTable, BasicColumn } from '/@/components/Table';
import { getDetailTableColumns } from './data';
import { getSettleAccountInfoApi } from '/@/api/finance/settlement';
const { TabPane } = Tabs
</script>

<script lang="ts" setup>

const tabActiveKey = ref(0)
const title = ref<string>('')
const dataSourceList = ref<Array<Recordable[]>>([])
const [registerModal, { setModalProps }] = useModalInner((data) => {
  getDetailList(data)
});

async function getDetailList({ cSheetno }) {
  setModalProps({ loading: true })
  title.value = `结算单明细-${cSheetno}`
  dataSourceList.value = await getSettleAccountInfoApi({ sheetno: cSheetno })
  setModalProps({ loading: false })
}
interface TableListProps {
  dataSource: Recordable[],
  columns: BasicColumn[],
  title: string,
  pagination: boolean,
  canResize: boolean
}
const tableListProps = computed(() => {
  const list: TableListProps[] = []
  const columnsList = getDetailTableColumns()

  for (const key in unref(dataSourceList)) {
    list.push({
      dataSource: unref(dataSourceList)[key],
      columns: columnsList[key].data,
      title: columnsList[key].title,
      pagination: false,
      canResize: false
    })
  }
  return list
})


</script>
