<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="800"
    @ok="handleSubmit"
    showFooter
  >

    <BasicForm @register="registerForm" />

    <ATable v-bind="getBindValues">

      <template #goodsName="{ record }">
        <AInput v-model:value="record.goodsName" />
      </template>

      <template #unit="{ record }">
        <AInput v-model:value="record.unit" />
      </template>

      <template #specs="{ record }">
        <AInput v-model:value="record.specs" />
      </template>

      <template #saleNum="{ record }">
        <AInput v-model:value.number="record.saleNum" />
      </template>

      <template #sumMoney="{ record }">
        <AInput v-model:value="record.sumMoney" />
      </template>

      <template #tax="{ record }">
        <AInput v-model:value.number="record.tax" />
      </template>

      <!-- <template #mortgageType="{ record }">
        <AInput v-model:value="record.mortgageType" />
      </template> -->

      <template #remarks="{ record }">
        <AInput v-model:value.number="record.remarks" />
      </template>
      <template #action="{ index }">
        <AButton @click="dataSource.splice(index, 1)">删除</AButton>
      </template>


    </ATable>
    <AButton
      @click="handleAdd"
      type="primary"
      block
    >添加</AButton>

    <template #appendFooter>

      <AButton
        @click="handleSubmitAndExamine"
        type="primary"
      >确认并提交</AButton>


    </template>

  </BasicDrawer>

</template>
<script lang="ts">

import { ref, unref, computed, reactive, nextTick } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { updateApi, createApi } from '/@/api/finance/invoice';
import { getListApi } from '/@/api/common';
import { useMessage } from '/@/hooks/web/useMessage';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import { getDetailTableColumns } from './data';
</script>

<script lang="ts" setup>
const state = reactive({
  isUpdate: false,
  rowId: 0
})

const dataSource = ref<Recordable[]>([])
const [registerDrawer, { closeDrawer, setDrawerProps }] = useDrawerInner(({ isUpdate, record }) => {
  resetFields()
  dataSource.value = []
  if (record) {
    dataSource.value = record.invoiceDetailDtos
    nextTick(() => setFieldsValue(record))
    state.rowId = record.id;
  }

  state.isUpdate = isUpdate;
});

const { createMessage } = useMessage()


const title = computed(() => state.isUpdate ? '修改' : '添加')

const schemas: FormSchema[] = [

  {
    field: 'invoiceNo',
    component: 'Input',
    label: '发票号码',
    required: true
  },
  {
    field: 'invoiceCode',
    component: 'Input',
    label: '发票代码',
    required: true
  },

  // {
  //   field: 'invoiceStatus',
  //   component: 'RadioButtonGroup',
  //   label: '发票状态',
  //   componentProps: {
  //     options: [
  //       {
  //         label: '录入',
  //         value: 0,
  //       },
  //       {
  //         label: '提交',
  //         value: 1,
  //       },
  //     ],

  //   },
  //   required: true
  // },

  {
    field: 'mortgageType',
    label: '抵押分类',
    component: 'ApiSelect',
    componentProps: {
      api: getListApi,
      labelField: 'itemName',
      valueField: 'id',
      params: {
        itemType: 1
      },
    },

    required: true
  },

  // {
  //   field: 'settleAccountNo',
  //   component: 'Input',
  //   label: '结算单号',
  //   required: true
  // },
  {
    field: 'remarks',
    component: 'InputTextArea',
    label: '备注说明',
  },

];


const [registerForm, { validateFields, setFieldsValue, resetFields }] = useForm({
  labelWidth: 100,
  schemas,
  baseColProps: {
    span: 24
  },
  showActionButtonGroup: false,
});


const columns = getDetailTableColumns()
function handleAdd() {
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
        return createMessage.error(`最后一条商品【${record?.title}】属性不能为空`)
      }


    }

  }


  const keys = columns.map(item => item.dataIndex)
  const record = {}
  keys.map((key: string) => record[key] = '')
  const newDataSource = [...unref(dataSource), { ...record }]
  dataSource.value = newDataSource
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

const emits = defineEmits(['success', 'register'])

function handleSubmitAndExamine() {
  handleSubmit({ invoiceStatus: 1 })
}

async function handleSubmit(data: Recordable) {

  const values = await validateFields()

  try {
    setDrawerProps({ confirmLoading: true })
    const form = {
      invoiceDetailParams: unref(dataSource),
      ...values,
      id: state.rowId,
      ...data
    }
    state.isUpdate ? await updateApi(form) : await createApi(form)
    createMessage.success('保存成功')
    emits('success')
    closeDrawer()
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}


</script>
