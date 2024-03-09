<template>
  <CollapseContainer title="基本设置" :canExpan="false">
    <BasicForm @register="register" />
    <div style="margin-left: 100px;">
      <a-button @click="resetFields">重置</a-button>
      <a-button class="!ml-4" type="primary" :loading="loading" @click="handleSubmit">确认</a-button>
    </div>
  </CollapseContainer>
</template>
<script lang="ts">
import { ref } from "vue"
import { CollapseContainer } from '/@/components/Container';
import { BasicForm, useForm } from '/@/components/Form';
import { FormSchema } from '/@/components/Form';
import { useMessage } from "/@/hooks/web/useMessage";
import {
  updatePwdApi,
} from '/@/api/sys/user';
</script>
<script lang="ts" setup>

const formSchema: FormSchema[] = [
  {
    field: 'oldPwd',
    label: '当前密码',
    component: 'InputPassword',
    required: true, colProps: { span: 15 },
  },
  {
    field: 'newPwd',
    label: '新密码',
    component: 'StrengthMeter',
    componentProps: {
      placeholder: '新密码',
    },
    rules: [
      {
        required: true,
        message: '请输入新密码',
      },
    ], colProps: { span: 15 },
  },
  {
    field: 'repeatPassword',
    label: '确认密码',
    component: 'InputPassword',
    colProps: { span: 15 },
    dynamicRules: ({ values }) => {
      return [
        {
          required: true,
          validator: (_, value) => {
            if (value !== values.newPwd) {
              return Promise.reject('两次输入的密码不一致!');
            }
            return Promise.resolve();
          },
        },
      ];
    },
  },
];
const loading = ref(false)
const { createMessage } = useMessage()
const [register, { validate, resetFields }] = useForm({
  labelWidth: 100,
  showActionButtonGroup: false,
  schemas: formSchema,
});

async function handleSubmit() {
  try {
    const values = await validate();
    for (const key in values) {
      values[key] = window.btoa(values[key])
    }
    loading.value = true
    await updatePwdApi(values)
    createMessage.success('修改成功')
    resetFields()
  } finally {
    loading.value = false
  }
}
</script>