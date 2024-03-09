<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="请先选择供应商"
    :width="400"
    @ok="handleSubmit"
    :footer="null"
    :minHeight="100"
    centered
  >


    <ApiSelect
      class="w-full"
      placeholder="请选择供应商"
      v-model:value="cSupNo"
      labelField="cSupName"
      valueField="cSupNo"
      :api="getSupplierListApi"
      showSearch
    />

    <AButton
      class="mt-20px"
      type="primary"
      block
      @click="handleSupConfirm"
    >确定</AButton>
  </BasicModal>
  <BasicModal
    @register="registerFormModal"
    title="添加新品"
    :width="1200"
    @ok="handleSubmit"
  >

    <ATable v-bind="getBindValues">


      <template #cBarcode="{ record }">
        <InputSearch
          @search="handleSearch(record)"
          @pressEnter="handleSearch(record)"
          v-model:value="record.cBarcode"
        />
      </template>
      <template #cGoodsName="{ record }">
        <AInput v-model:value="record.cGoodsName" />
      </template>

      <template #cProductUnit="{ record }">
        <AInput v-model:value="record.cProductUnit" />
      </template>

      <template #cSpec="{ record }">
        <AInput v-model:value="record.cSpec" />
      </template>

      <template #cUnit="{ record }">
        <AInput v-model:value="record.cUnit" />
      </template>

      <template #fPriceContract="{ record }">
        <AInput v-model:value="record.fPriceContract" />
      </template>

      <template #fNormalPrice="{ record }">
        <AInput v-model:value="record.fNormalPrice" />
      </template>

      <template #fFreshDays="{ record }">
        <AInput v-model:value="record.fFreshDays" />
      </template>

      <template #fPackRatio="{ record }">
        <AInput v-model:value="record.fPackRatio" />
      </template>
      <template #action="{ index }">
        <AButton
          danger
          @click="dataSource.splice(index, 1)"
        >删除</AButton>
      </template>

    </ATable>
    <AButton
      @click="handleAdd"
      type="primary"
      block
    >添加</AButton>
  </BasicModal>
</template>
<script lang="ts">
import { ref, unref, computed } from 'vue';
import { BasicModal, useModalInner, useModal } from '/@/components/Modal';
import { getDetailTableColumns } from './data';
import { addNewGoodsInfoApi, checkGoodsBarcodeApi } from '/@/api/goods/new';
import { useMessage } from '/@/hooks/web/useMessage';
import { ApiSelect } from '/@/components/Form';
import { getSupplierListApi } from "/@/api/common"
import { Input } from "ant-design-vue"

const InputSearch = Input.Search
</script>
   
<script lang="ts" setup>

const dataSource = ref<Recordable[]>([])
const [registerModal, { closeModal: closeSupModal }] = useModalInner();
const [registerFormModal, { openModal, closeModal, setModalProps }] = useModal();
const { createMessage } = useMessage()

const emits = defineEmits(['success', 'register'])

const cSupNo = ref('')
const columns = getDetailTableColumns()

function validate() {
  return new Promise((resolve, reject) => {

    if (unref(dataSource).length) {
      const last = unref(dataSource)[unref(dataSource).length - 1];
      const emptyKeys: string[] = []
      for (const key in last) {
        if (last[key] === '') {
          emptyKeys.push(key)
        }
      }

      if (emptyKeys.length) {
        const [lastKey] = emptyKeys;
        const record = columns.find(item => item.dataIndex === lastKey && item.dataIndex !== 'action');
        if (record) {
          const message = `最后一条商品【${record?.title}】属性不能为空`
          reject(message)
          return createMessage.error(message)
        }

      }

    }
    resolve('success')
  })
}

async function handleAdd() {

  await validate()


  const keys = columns.map(item => item.dataIndex)
  const record = {}
  keys.map((key: string) => record[key] = '')
  const newDataSource = [...unref(dataSource), { ...record }]
  dataSource.value = newDataSource
}
async function handleSearch({ cBarcode }) {
  if (!cBarcode) return;
  const data = await checkGoodsBarcodeApi({ cBarcode })
  if (!data) {
    createMessage.error('该条形码已存在')
  } else {
    createMessage.success('暂无该条码，可申报添加')
  }
}

const getBindValues = computed(() => ({
  dataSource: unref(dataSource),
  columns,
  pagination: false,
  scroll: {
    x: true,
    y: 500
  }
}))
async function handleSubmit() {


  try {

    if (!unref(dataSource).length) {
      return createMessage.error('请添加商品')
    }

    await validate()

    setModalProps({ confirmLoading: true })
    // const newGoodsInfos = unref(dataSource).map(item => ({
    //   ...item,
    //   cSupNo: unref(cSupNo)
    // }))
    await addNewGoodsInfoApi({ newGoodsInfos: unref(dataSource), supNo: unref(cSupNo) })
    createMessage.success('添加成功')
    dataSource.value = []
    cSupNo.value = ""
    closeModal()
    emits('success')
  } finally {
    setModalProps({ confirmLoading: false })
  }
}
function handleSupConfirm() {
  if (!unref(cSupNo)) return createMessage.error('请选择供应商')
  closeSupModal()
  openModal()
}

</script>
