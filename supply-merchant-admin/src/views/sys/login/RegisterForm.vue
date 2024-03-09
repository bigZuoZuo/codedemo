<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form
      class="p-4 enter-x"
      :model="formData"
      :rules="getFormRules"
      ref="formRef"
    >
      <FormItem
        name="companyName"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.companyName"
          placeholder="公司名称"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem
        name="legalPerson"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.legalPerson"
          placeholder="法人"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem
        name="taxNum"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.taxNum"
          placeholder="税号"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem
        name="email"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.email"
          placeholder="邮箱(非必填)"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem
        name="tel"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.tel"
          @input="input"
          placeholder="手机号"
          class="fix-auto-fill"
        />
      </FormItem>

      <FormItem
        name="smsVerificationCode"
        class="enter-x"
      >
        <CountdownInput
          size="large"
          class="fix-auto-fill"
          v-model:value="formData.smsVerificationCode"
          :placeholder="t('sys.login.smsCode')"
          :sendCodeApi="onSendCode"
        />
      </FormItem>

      <FormItem
        name="fax"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.fax"
          placeholder="传真(非必填)"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem
        name="linkMan"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.linkMan"
          placeholder="联系人"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem
        name="linkManPhone"
        class="enter-x"
      >
        <Input
          size="large"
          v-model:value="formData.linkManPhone"
          placeholder="联系人电话"
          class="fix-auto-fill"
        />
      </FormItem>
      <FormItem
        name="loginPwd"
        class="enter-x"
      >
        <StrengthMeter
          size="large"
          v-model:value="formData.loginPwd"
          :placeholder="t('sys.login.password')"
        />
      </FormItem>
      <FormItem
        name="repeatPassword"
        class="enter-x"
      >
        <InputPassword
          size="large"
          visibilityToggle
          v-model:value="formData.repeatPassword"
          :placeholder="t('sys.login.confirmPassword')"
        />
      </FormItem>

      <!-- <FormItem class="enter-x" name="policy">
        <Checkbox
          v-model:checked="formData.policy"
          size="small"
        >{{ t('sys.login.policy') }}</Checkbox>
      </FormItem>-->

      <Button
        type="primary"
        class="enter-x"
        size="large"
        block
        @click="handleRegister"
        :loading="loading"
      >{{ t('sys.login.registerButton') }}</Button>
      <Button
        size="large"
        block
        class="mt-4 enter-x"
        @click="handleBackLogin"
      >{{ t('sys.login.backSignIn') }}</Button>
    </Form>
  </template>
</template>
<script lang="ts" setup>
import { reactive, ref, unref, computed } from 'vue';
import LoginFormTitle from './LoginFormTitle.vue';
import { Form, Input, Button, /*Checkbox*/ } from 'ant-design-vue';
import { StrengthMeter } from '/@/components/StrengthMeter';
import { CountdownInput } from '/@/components/CountDown';
import { useI18n } from '/@/hooks/web/useI18n';
import { useLoginState, useFormRules, useFormValid, LoginStateEnum } from './useLogin';
import { sendRegisterVerificationCode, registerSupplyInfo } from "/@/api/sys/user"
import { useMessage } from '/@/hooks/web/useMessage';

const { createErrorModal, createSuccessModal, createMessage } = useMessage();
const FormItem = Form.Item;
const InputPassword = Input.Password;
const { t } = useI18n();
const { handleBackLogin, getLoginState } = useLoginState();

const formRef = ref();
const loading = ref(false);

const formData = reactive({
  companyName: '',
  legalPerson: '',
  taxNum: '',
  email: '',
  tel: '',
  fax: '',
  linkMan: '',
  linkManPhone: '',

  loginPwd: '',
  repeatPassword: '',

  smsVerificationCode: '',
  // policy: false,
});

const { getFormRules } = useFormRules(formData);
const { validForm } = useFormValid(formRef);

function input(){
  console.log(formData);
  
}

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.REGISTER);
async function onSendCode() {

  if (!(/^1[3456789]\d{9}$/.test(formData.tel))) {
    createErrorModal({
      title: '提示',
      content: '请输入正确手机号',
      getContainer: () => document.body,
    });
    return false
  }

  await sendRegisterVerificationCode({ phoneNumber: formData.tel }, 'modal')
  createMessage.success('验证码发送成功，请注意查收')
  return true
}
async function handleRegister() {
  const data = await validForm();
  try {
    loading.value = true;
    await registerSupplyInfo({
      ...data,
      loginPwd: window.btoa(data.loginPwd),
      repeatPassword: window.btoa(data.repeatPassword),
    }, 'modal');
    createSuccessModal({
      title: '提示',
      content: '注册成功',
      getContainer: () => document.body,
      okText: '去登录',
      onOk: () => handleBackLogin(),
    });
  } finally {
    loading.value = false;
  }
}
</script>
