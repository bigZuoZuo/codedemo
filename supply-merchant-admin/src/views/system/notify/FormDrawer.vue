<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="600"
    @ok="handleSubmit"
    showFooter
  >

    <BasicForm
      @register="registerForm"
      @submit="handleSubmit"
    />

  </BasicDrawer>

</template>
<script lang="ts">

import { computed, ref } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { createApi } from '/@/api/system/notify';
import { useMessage } from '/@/hooks/web/useMessage';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import dayjs from "dayjs"
import { getRelationSupplyListApi } from "/@/api/common"

</script>

<script lang="ts" setup>

const noticeType = ref(1)
const [registerDrawer, { closeDrawer, setDrawerProps }] = useDrawerInner((data) => {
  noticeType.value = data.noticeType;

  updateSchema([
    {
      field: 'supplierArr',
      ifShow: noticeType.value === 2,
    },
  ])
});

const { createMessage } = useMessage()


const title = computed(() => noticeType.value === 1 ? '添加公告' : '添加通知')

const schemas: FormSchema[] = [

  {
    field: 'noticeTitle',
    component: 'Input',
    label: '标题',
    required: true
  },
  {
    field: 'noticeContent',
    component: 'InputTextArea',
    label: '内容',
    required: true
  },
  // {
  //   field: 'noticeType',
  //   component: 'RadioButtonGroup',
  //   label: '类型',
  //   defaultValue: 1,
  //   componentProps: {
  //     options: [
  //       {
  //         label: '公告',
  //         value: 1,
  //       },
  //       {
  //         label: '通知',
  //         value: 2,
  //       },
  //     ],
  //     // onChange: (val) => {
  //     // nextTick(() => updateSchema([
  //     //   {
  //     //     field: 'supplierArr',
  //     //     ifShow: val === 2,
  //     //   },
  //     // ]))
  //     // }
  //   },
  //   required: true
  // },
  {
    field: 'supplierArr',
    label: '供应商',
    component: 'ApiSelect',
    componentProps: {
      api: getRelationSupplyListApi,
      labelField: 'companyName',
      valueField: 'id',
      mode: 'multiple',
      maxTagCount: 1,

    },

    required: true
  },
  {
    field: 'fieldTime',
    component: 'RangePicker',
    label: '有效期',
    componentProps: {
      showTime: {
        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      },
      style: { width: '100%' },
    },

    required: true,
  },
  // {
  //   field: 'supplierArr',
  //   label: '供应商列表',
  //   component: 'ApiSelect',
  //   componentProps: {
  //     api: getSupplierListApi,
  //     labelField: 'cSupName',
  //     valueField: 'cSupNo',
  //     mode: 'multiple',
  //     maxTagCount: 1
  //   },
  //   colProps: {
  //     span: 6,
  //   },
  //   required: true
  // },

];


const [registerForm, { validateFields, getFieldsValue, updateSchema }] = useForm({
  labelWidth: 100,
  schemas,
  baseColProps: {
    span: 24
  },
  showActionButtonGroup: false,
  fieldMapToTime: [['fieldTime', ['validBeginDate', 'valideEndDate'], 'YYYY-MM-DD HH:mm:ss']],
});

const emits = defineEmits(['success', 'register'])


async function handleSubmit() {
  try {

    await validateFields()
    const values = getFieldsValue()
    setDrawerProps({ confirmLoading: true })
    await createApi({ ...values, noticeType:noticeType.value })
    createMessage.success('添加成功')
    closeDrawer()
    emits('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}


</script>
