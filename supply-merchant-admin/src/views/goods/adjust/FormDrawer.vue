<template>

  <div>
    <BasicDrawer
      @register="registerDrawer"
      :title="title"
      :width="800"
      @ok="handleSubmit"
      showFooter
    >

      <BasicForm
        @register="registerForm"
        @submit="handleSubmit"
      />

      <AButton
        class="mt-10px"
        type="primary"
        block
        @click="handleSelectGoods"
      >添加商品</AButton>
      <ATable v-bind="getBindValues">

        <template #fPriceContract="{ record }">
          <AInput v-model:value="record.fPriceContract" />
        </template>
        <template #action="{ index }">
          <AButton
            danger
            @click="dataSource.splice(index, 1)"
          >删除</AButton>
        </template>
      </ATable>

    </BasicDrawer>

    <GoodsList
      @register="DrawerregisterGoodsListModal"
      @confirm="handleSelectGoodsConfirm"
    />
  </div>
</template>
<script lang="ts">
import { ref, unref, computed, reactive } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { useModal } from '/@/components/Modal';
import { useMessage } from '/@/hooks/web/useMessage';
import { getStoreListApi, getSupplierListApi } from "/@/api/common"
import GoodsList from "./GoodsList.vue"
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import {
  getEditGoodsPriceInfoApi,
  addEditGoodsPriceApi,
  updateEditGoodsPriceApi,
} from '/@/api/goods/adjust';
import { uniqBy } from 'lodash-es';
</script>
      @click="handleAdd"
<script lang="ts" setup>

const dataSource = ref<Recordable[]>([])
const state = reactive({
  isUpdate: false,
  cSheetNo: ''
})
const title = computed(() => state.isUpdate ? '修改调价申请单' : '添加调价申请单')

const [registerDrawer, { closeDrawer, setDrawerProps }] = useDrawerInner(({ isUpdate, record }) => {
  dataSource.value = [];
  resetFields()
  state.isUpdate = isUpdate
  state.cSheetNo = isUpdate ? record?.cSheetNo : ''

  if (isUpdate) {
    setFieldsValue({
      ...record,
      supNo: record.cSupNo
    })
    getEditGoodsPriceInfo();
  }

});

async function getEditGoodsPriceInfo() {
  setDrawerProps({ loading: true })
  const data = await getEditGoodsPriceInfoApi({ sheetNo: state.cSheetNo })
  dataSource.value = data.map(item => ({
    ...item,
    fPriceContract: item.fckPrice
  }))
  setDrawerProps({ loading: false })
}

const [DrawerregisterGoodsListModal, { openModal: openGoodsListModal, closeModal: closeGoodsListModal }] = useModal()
const { createMessage } = useMessage()


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
    dataIndex: 'fPriceContract',
    slots: { customRender: 'fPriceContract' },
  },
  {
    title: '操作',
    dataIndex: 'action',
    slots: { customRender: 'action' },
    width: 80
  },
]
const emits = defineEmits(['success', 'register'])

const getBindValues = computed(() => ({
  dataSource: unref(dataSource),
  columns,
  pagination: false,
  scroll: {
    x: true,
    y: 500
  }
}))

function handleSelectGoodsConfirm(data: Recordable[]) {
  // const current = unref(dataSource).find(item => item.cGoodsNo === record.cGoodsNo);
  // if (current) return createMessage.error('已选择该商品')
  const values = data.map(item => ({ ...item, fPriceContract: item.fContract }))

  dataSource.value = uniqBy([...dataSource.value, ...values], 'cGoodsNo')

  closeGoodsListModal()
}
function handleSelectGoods() {
  const { supNo, cExeStoreNo } = getFieldsValue()
  if (!cExeStoreNo) return createMessage.error("请选择调价门店")
  if (!supNo) return createMessage.error("请选择供应商")
  openGoodsListModal(true, { supNos: [supNo], storeDetail: [cExeStoreNo] })
}

async function handleSubmit() {

  const values = await validateFields()

  if (!unref(dataSource).length) return createMessage.error("请选择商品")
  const index = unref(dataSource).findIndex(item => !item.fPriceContract)

  if (index !== -1) {
    return createMessage.error(`第${index + 1}条商品合同价格不能为0或空`)
  }


  try {
    setDrawerProps({ confirmLoading: true })

    const form = {
      eitGoodsPriceDtlParams: unref(dataSource),
      supNo: values.supNo,
      editGoodsPriceParam: {
        cSheetNo: state.cSheetNo,
        ...values
      }
    }


    state.isUpdate ? await updateEditGoodsPriceApi(form) : await addEditGoodsPriceApi(form)


    createMessage.success('保存成功')
    closeDrawer()
    emits('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}


const schemas: FormSchema[] = [

  // {
  //   field: 'dDate',
  //   label: '日期',
  //   component: 'DatePicker',
  //   componentProps: {
  //     valueFormat: 'YYYY-MM-DD',
  //     style: {
  //       width: '100%'
  //     }
  //   },
  // },
  {
    field: 'cExeStoreNo',
    label: '调价门店',
    component: 'ApiSelect',
    componentProps: {
      api: getStoreListApi,
      labelField: 'cStoreName',
      valueField: 'cStoreNo',
      onChange: () => {
        dataSource.value = []
      }
    },
    required: true
  },
  {
    field: 'supNo',
    label: '供应商',
    component: 'ApiSelect',
    componentProps: {
      api: getSupplierListApi,
      labelField: 'cSupName',
      valueField: 'cSupNo',
      onChange: () => {
        dataSource.value = []
      }
    },
    required: true
  },
  {
    field: 'dDateExe',
    label: '执行日期',
    component: 'DatePicker',
    componentProps: {
      valueFormat: 'YYYY-MM-DD',
      style: {
        width: '100%'
      }
    },
    required: true
  },
  {
    field: 'cBeiZhu1',
    label: '备注',
    component: 'InputTextArea',
  },

];


const [registerForm, { getFieldsValue, setFieldsValue, validateFields, resetFields }] = useForm({
  labelWidth: 100,
  schemas,
  baseColProps: {
    span: 24
  },
  showActionButtonGroup: false,
});

</script>
