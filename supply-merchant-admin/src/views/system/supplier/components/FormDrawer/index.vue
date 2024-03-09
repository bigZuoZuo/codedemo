<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="register"
    :title="getTitle"
    @ok="handleSubmit"
    :width="600"
    showFooter
  >
    <BasicForm @register="registerForm" />

  </BasicDrawer>
</template>
<script lang="ts">

import { computed, reactive } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import { useMessage } from '/@/hooks/web/useMessage';

import dayjs from 'dayjs';
import {
  createApi,
  updateApi,
} from '/@/api/system/supplier';

</script>

<script lang="ts" setup>
const state = reactive({
  rowId: 0,
  isUpdate: false,
  uploading: false,
  file: {
    logoUrl: '',
    logoId: 0
  }
})
const { createMessage } = useMessage();
const emit = defineEmits(['success', 'register'])

const [register, { setDrawerProps, closeDrawer }] = useDrawerInner(async (data) => {
  state.isUpdate = data.isUpdate
  resetFields();
  if (data.isUpdate) {
    const {
      id,
      logoUrl,
      logoId,
      province,
      city,
      area,
      validityEndTime,
      validityStartTime,
    } = data.record
    state.rowId = id;
    state.file = {
      logoUrl,
      logoId
    }
    const region = [province, city, area]
    const fieldTime = [validityEndTime, validityStartTime]
    setFieldsValue({
      ...data.record,
      region,
      fieldTime,
    });
  }
});
const getTitle = computed(() => (state.isUpdate ? '编辑' : '添加'));



const schemas: FormSchema[] = [
  {
    field: 'companyName',
    component: 'Input',
    label: '公司名称',
    required: true,
  },
  {
    field: 'legalPerson',
    component: 'Input',
    label: '法人',
  },
  {
    field: 'taxNum',
    component: 'Input',
    label: '税号',
  },
  {
    field: 'email',
    component: 'Input',
    label: 'Email',
  },
  {
    field: 'tel',
    component: 'Input',
    label: '手机号',
  },
  {
    field: 'fax',
    component: 'Input',
    label: '传真',
  },
  {
    field: 'linkMan',
    component: 'Input',
    label: '联系人',
    required: true
  },
  {
    field: 'linkManPhone',
    component: 'Input',
    label: '联系人电话',
    required: true
  },


  {
    field: 'fieldTime',
    component: 'RangePicker',
    label: '商户有效期',
    componentProps: {
      showTime: {
        defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      },
      style: { width: '100%' },
    },

    required: true,
  },

];
const [
  registerForm,
  {
    setFieldsValue,
    resetFields,
    validateFields,
    getFieldsValue
  },
] = useForm({
  labelWidth: 112,
  schemas,
  fieldMapToTime: [['fieldTime', ['validityStartTime', 'validityEndTime'], 'YYYY-MM-DD HH:mm:ss']],
  showActionButtonGroup: false,
  baseColProps: {
    span: 24
  }
});


// 提交
async function handleSubmit() {

  try {

    await validateFields()
    const values = getFieldsValue()

    const data = {
      ...values,
      id: state.rowId,

    }
    setDrawerProps({ confirmLoading: true });
    if (state.isUpdate) {
      await updateApi(data)
    } else {
      await createApi(data)
    }
    createMessage.success('保存成功')
    closeDrawer();
    emit('success')
  } finally {
    setDrawerProps({ confirmLoading: false });
  }

}
</script>
