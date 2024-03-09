<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <AButton type="primary" @click="handleCreate">添加</AButton>
      </template>
      <template #status="{ record }">
        <Switch
          :loading="record.switchLoading"
          :checked="record.status === 1"
          @change="handleAudit($event, record)"
        />
      </template>
      <template #validTime="{ record: { validityStartTime, validityEndTime } }">
        <div>{{ validityStartTime }}</div>
        <div>{{ validityEndTime }}</div>
      </template>

      <template #action="{ record }">
        <TableAction
          :actions="[
            {
              label: '编辑',
              onClick: () => handleEdit(record),
            },
            {
              label: '重置密码',
              popConfirm: {
                title: `确定重置密码为${record.phone}吗(当前账号)？`,
                confirm: () => handleResetPassWord(record),
              },
            },
            {
              label: '商户管理',
              onClick: () => handleStoreChoose(record),
            },
          ]"
        />
      </template>
    </BasicTable>

    <BasicModal
      @register="registerModal"
      :title="state.isUpdate ? '编辑' : '添加'"
      @ok="handleSubmit"
      :width="600"
    >
      <BasicForm @register="registerForm" />
    </BasicModal>

    <BasicModal
      @register="registerNewModal"
      title="分配商户"
      @ok="handleStoreSub(record)"
      :width="600"
    >
      <a-checkbox
        @change="changechoose($event, item.merchantId, index)"
        :checked="checklist.includes(item.merchantId)"
        v-for="(item, index) in storelist"
        :key="item.merchantId"
      >
        {{ item.merchantName }}
      </a-checkbox>
    </BasicModal>
  </div>
</template>
<script lang="ts">
  import { BasicTable, useTable, TableAction } from '/@/components/Table';
  import { nextTick, onMounted, reactive, ref } from 'vue';
  import { Checkbox } from 'ant-design-vue';
  import { useMessage } from '/@/hooks/web/useMessage';
  // import { useUserStore } from '/@/store/modules/user';
  import {
    userGetPagedApi,
    userCreateApi,
    userUpdateApi,
    updateUserAuditApi,
    resetPassWordApi,
    getSupplyMerchantListApi,
    AddSupplyUserMerchantDetailByUserApi,
    getSupplyUserMerchantDetailByUserApi,
  } from '/@/api/basic/supplyPersonnel';
  import { getUserMerchantListApi } from '/@/api/sys/user';
  import { BasicModal, useModal } from '/@/components/Modal';
  import { BasicForm, useForm } from '/@/components/Form/index';
  import { getBasicColumns, getFormConfig, getFormSchema } from './data';
  import { Switch } from 'ant-design-vue';
  // import { log } from 'console';
  // import Storecheckbox from "./storecheckbox.vue"
</script>
<script lang="ts" setup>
  const ACheckbox = Checkbox;
  const { createMessage } = useMessage();
  const state = reactive({
    isUpdate: false,
  });
  const storelist = ref([]);
  let checklist = ref([]);
  let ID: Number;
  const currentRow = ref({});
  const [registerTable, { reload }] = useTable({
    api: userGetPagedApi,
    columns: getBasicColumns(),
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    showIndexColumn: true,
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
    rowKey: 'id',
  });

  const [
    registerForm,
    { setFieldsValue, resetFields, validateFields, updateSchema, getFieldsValue },
  ] = useForm({
    labelWidth: 100,
    schemas: getFormSchema(),
    fieldMapToTime: [
      ['fieldTime', ['validityStartTime', 'validityEndTime'], 'YYYY-MM-DD HH:mm:ss'],
    ],
    showActionButtonGroup: false,
    baseColProps: { span: 24 },
  });

  const [registerModal, { setModalProps }] = useModal();
  const [registerNewModal, { setModalProps: setNewModalProps }] = useModal();

  onMounted(() => {
    getSupplyMerchantList();
  });

  // 审核
  async function handleAudit(checked, record) {
    try {
      record.switchLoading = true;
      const newStatus = checked ? 1 : 2;
      await updateUserAuditApi({ id: record.id, status: newStatus });
      record.status = newStatus;
      createMessage.success('修改状态成功');
    } finally {
      record.switchLoading = false;
    }
  }

  // 提交
  async function handleSubmit() {
    await validateFields();
    const values = getFieldsValue();

    const form = {
      ...currentRow.value,
      ...values,
    };
    try {
      setModalProps({ confirmLoading: true });
      if (state.isUpdate) {
        await userUpdateApi(form);
      } else {
        await userCreateApi({
          ...form,
          password: window.btoa(values.password),
          repeatPassword: window.btoa(values.repeatPassword),
        });
      }

      setModalProps({ visible: false });
      createMessage.success('保存成功');
      reload();
    } finally {
      setModalProps({ confirmLoading: false });
    }
  }

  // 提交商户关系
  function handleStoreSub(record) {
    addSupplyUserMerchantDetailByUser({
      supplyUserInfoId: ID,
      merchantInfoIds: [...checklist.value],
    });
    setNewModalProps({ visible: false });
    createMessage.success('修改成功');
  }
  function setSchema() {
    updateSchema([
      {
        field: 'password',
        ifShow: !state.isUpdate,
      },
      {
        field: 'repeatPassword',
        ifShow: !state.isUpdate,
      },
      {
        field: 'phone',
        dynamicDisabled: state.isUpdate,
      },
      // {
      //   field: 'fieldTime',
      //   ifShow: !state.isUpdate,
      // },
    ]);
  }

  // 编辑
  function handleEdit(record: Recordable) {
    currentRow.value = { ...record, merchantId: record.merchantInfoId };

    state.isUpdate = true;

    setModalProps({ visible: true });
    nextTick(() => {
      setSchema();
      setFieldsValue(record);
    });
  }
  // 添加
  function handleCreate() {
    currentRow.value = {};
    state.isUpdate = false;
    setModalProps({ visible: true });
    nextTick(() => {
      setSchema();
      resetFields();
    });
  }
  // 获取选中商户id
  function changechoose(e, key, index) {
    if (e.target.checked == true) {
      checklist.value.splice(index, 0, key);
    } else {
      checklist.value = checklist.value.filter((l) => l !== key);
    }
  }

  function handleStoreChoose(record: Recordable) {
    getSupplyUserMerchantDetailByUser({ id: record.id });

    setNewModalProps({ visible: true });
  }
  // 重置密码
  async function handleResetPassWord({ id }: Recordable) {
    await resetPassWordApi({ id });
    createMessage.success('重置成功');
  }

  // const  getUserMerchantList=async(id:any)=>{
  //     let result =await  getUserMerchantListApi({id})
  // }

  async function addSupplyUserMerchantDetailByUser({ merchantInfoIds, supplyUserInfoId }) {
    let res = AddSupplyUserMerchantDetailByUserApi({
      merchantInfoIds,
      supplyUserInfoId,
    });
  }

  async function getSupplyUserMerchantDetailByUser(id) {
    let res = await getSupplyUserMerchantDetailByUserApi(id);
    checklist.value = [...res];
    ID = id.id;
  }

  const getSupplyMerchantList = async () => {
    let res = await getSupplyMerchantListApi();
    res.forEach((l: any, i: any) => {
      storelist.value.push({
        merchantName: l.merchantName,
        merchantId: l.merchantId,
      });
    });
  };
</script>
