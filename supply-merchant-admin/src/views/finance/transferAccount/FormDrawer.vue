<template>
  <BasicDrawer
    v-bind="$attrs"
    @register="registerDrawer"
    :title="title"
    :width="800"
    @ok="handleSubmit"
    showFooter
  >


    <BasicForm @register="registerForm">
      <template #imgUrl>
        <UploadImg
          v-model:imgUrl="file.imgUrl"
          v-model:imgId="file.imgId"
        />
      </template>
    </BasicForm>


    <ATable
      v-bind="getBindValues"
      :rowSelection="rowSelection"
    />




  </BasicDrawer>

</template>
<script lang="ts">

import { ref, unref, computed, reactive, nextTick } from 'vue';
import { BasicDrawer, useDrawerInner } from '/@/components/Drawer';
import { updateApi, createApi, transferAccCostItemListApi } from '/@/api/finance/transferAccount';
import { useMessage } from '/@/hooks/web/useMessage';
import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
import { getDetailTableColumns } from './data';
import { UploadImg } from "/@/components/UploadImg"
</script>

<script lang="ts" setup>
const state = reactive({
  isUpdate: false,
  rowId: 0
})
const checkedKeys = ref<(string | number)[]>([])
const rowSelection: any = {
  type: 'checkbox',
  columnWidth: 40,
  selectedRowKeys: checkedKeys,
  onChange: onSelectChange,
};
const file = ref({
  imgUrl: '',
  imgId: '',
})
const dataSource = ref<Recordable[]>([])
const [registerDrawer, { closeDrawer, setDrawerProps }] = useDrawerInner(({ isUpdate, record }) => {



  state.rowId = record?.id;
  state.isUpdate = isUpdate;
  getTransferAccCostItemList()
  if (isUpdate) {
    setFieldsValue({ ...record });
    checkedKeys.value = record.costItems
    unref(file).imgUrl = record.imgUrl
  } else {
    nextTick(() => resetFields())
  }
});



/**
 * 选择事件
 */
function onSelectChange(selectedRowKeys: (string | number)[]) {
  checkedKeys.value = selectedRowKeys;
}

async function getTransferAccCostItemList() {
  const data = await transferAccCostItemListApi({ id: state.rowId });

  dataSource.value = data;
}
const { createMessage } = useMessage()




const title = computed(() => state.isUpdate ? '修改' : '添加')

const schemas: FormSchema[] = [

  {
    field: 'transferAmount',
    component: 'Input',
    label: '转账金额',
    required: true
  },
  {
    field: 'transferUserName',
    component: 'Input',
    label: '转账人名称',
    required: true
  },
  {
    field: 'transferBankAccount',
    component: 'Input',
    label: '转账银行账户',
    required: true,
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (value === values.receiveBankAccount) {
              return Promise.reject('接收银行账户与转账银行账户不能相同!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    field: 'receiveBankAccount',
    component: 'Input',
    label: '接收银行账户',
    required: true,
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (value === values.transferBankAccount) {
              return Promise.reject('接收银行账户与转账银行账户不能相同!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
  {
    field: 'transferTime',
    label: '转账日期',
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
    field: 'imgUrl',
    component: 'Input',
    label: '图片',
    slot: 'imgUrl',
  },

  {
    field: 'remark',
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


const getBindValues = computed(() => ({
  rowKey: 'serNo',
  dataSource: unref(dataSource),
  columns,
  pagination: false,
  scroll: {
    x: true,
    y: 500
  }
}))

const emits = defineEmits(['success', 'register'])
async function handleSubmit() {

  const values = await validateFields()

  try {
    setDrawerProps({ confirmLoading: true })
    const form = {
      costItems: unref(checkedKeys),
      ...values,
      ...unref(file),
      id: state.rowId
    }
    state.isUpdate ? await updateApi(form) : await createApi(form)
    createMessage.success('添加成功')
    closeDrawer()
    emits('success')
  } finally {
    setDrawerProps({ confirmLoading: false })
  }
}


</script>
