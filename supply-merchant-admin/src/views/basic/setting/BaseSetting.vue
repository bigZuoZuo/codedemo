<template>
  <CollapseContainer
    title="基本设置"
    :canExpan="false"
  >
    <Row>
      <Col>
      <BasicForm @register="register" />
      </Col>
    </Row>
    <!-- <Button
      type="primary"
      @click="handleSubmit"
      :loading="loading"
      style="margin-left:100px;"
    >更新基本信息</Button> -->
  </CollapseContainer>
</template>
<script lang="ts">
import { Button, Row, Col } from 'ant-design-vue';
import { onMounted, ref } from 'vue';
import { BasicForm, useForm } from '/@/components/Form/index';
import { CollapseContainer } from '/@/components/Container';
import { useMessage } from '/@/hooks/web/useMessage';
import { useUserStore } from '/@/store/modules/user';
import {
  userUpdateApi,
} from '/@/api/basic/personnel';
import { FormSchema } from '/@/components/Form/index';

export default {
  name: 'Setting'
}
</script>

<script lang="ts" setup>
const { createMessage } = useMessage();
const userStore = useUserStore();
const loading = ref(false)
// 基础设置 form
const baseSetschemas: FormSchema[] = [
  {
    field: 'phone',
    component: 'Input',
    label: '用户名',
    colProps: { span: 15 },
    componentProps: {
      disabled: true
    },
  },
  {
    field: 'realName',
    component: 'Input',
    componentProps: {
      disabled: true
    },
    label: '姓名',
    colProps: { span: 15 },
  },
  // {
  //   field: 'lastLoginTime',
  //   component: 'Input',
  //   componentProps: {
  //     disabled: true
  //   },
  //   label: '最后登录时间',
  //   colProps: { span: 15 },
  // },
  {
    field: 'createTime',
    component: 'Input',
    componentProps: {
      disabled: true
    },
    label: '创建时间',
    colProps: { span: 15 },
  },

];


const [register, { setFieldsValue, getFieldsValue }] = useForm({
  labelWidth: 100,
  schemas: baseSetschemas,
  showActionButtonGroup: false,
});

onMounted(() => {
  setFieldsValue({ ...userStore.getUserInfo });
});
async function handleSubmit() {
  try {
    loading.value = true;
    const form = getFieldsValue()
    await userUpdateApi({
      ...userStore.getUserInfo,
      ...form,
    })
    createMessage.success('更新成功')
  } finally {
    loading.value = false;
  }
}
</script>