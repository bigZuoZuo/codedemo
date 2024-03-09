<template>
  <LoginFormTitle
    v-show="getShow"
    class="enter-x"
  />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem
      name="userType"
      class="enter-x"
    >
      <RadioGroup
        v-model:value="formData.userType"
        button-style="solid"
        class="w-full"
      >
        <RadioButton class="w-1/2 text-center" :value="1">供应商用户</RadioButton>
        <RadioButton class="w-1/2 text-center" :value="2">商户用户</RadioButton>
      </RadioGroup>
    </FormItem>
    <FormItem
      name="username"
      class="enter-x"
    >
      <Input
        size="large"
        v-model:value="formData.username"
        placeholder="手机号"
        class="fix-auto-fill"
      />
    </FormItem>
    <FormItem
      name="password"
      class="enter-x"
    >
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <ARow
      class="enter-x code"
      :gutter="10"
    >
      <ACol :span="12">
        <FormItem name="code">
          <Input
            size="large"
            v-model:value="formData.code"
            placeholder="验证码"
            class="fix-auto-fill"
          />
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem>
          <AImage
            @click="init"
            :src="img"
            :preview="false"
            fallback="data:image/png;base64,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"
          />
        </FormItem>
      </ACol>
    </ARow>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox
            v-model:checked="rememberMe"
            size="small"
          >{{ t('sys.login.rememberMe') }}</Checkbox>
        </FormItem>
      </ACol>
      <!-- <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <Button
            type="link"
            size="small"
            @click="setLoginState(LoginStateEnum.RESET_PASSWORD)"
          >{{ t('sys.login.forgetPassword') }}</Button>
        </FormItem>
      </ACol>-->
    </ARow>

    <FormItem class="enter-x">
      <Button
        type="primary"
        size="large"
        block
        @click="handleLogin"
        :loading="loading"
      >{{ t('sys.login.loginButton') }}</Button>
      <Button
        size="large"
        class="mt-4 enter-x"
        block
        @click="setLoginState(LoginStateEnum.REGISTER)"
      >注册供应商</Button>
    </FormItem>

    <!-- <ARow class="enter-x">
      <ACol :md="8" :xs="24">
        <Button
          block
          @click="setLoginState(LoginStateEnum.MOBILE)"
        >{{ t('sys.login.mobileSignInFormTitle') }}</Button>
      </ACol>
      <ACol :md="8" :xs="24" class="!my-2 !md:my-0 xs:mx-0 md:mx-2">
        <Button
          block
          @click="setLoginState(LoginStateEnum.QR_CODE)"
        >{{ t('sys.login.qrSignInFormTitle') }}</Button>
      </ACol>
      <ACol :md="7" :xs="24">
        <Button
          block
          @click="setLoginState(LoginStateEnum.REGISTER)"
        >{{ t('sys.login.registerButton') }}</Button>
      </ACol>
    </ARow>-->

    <!-- <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider> -->

    <!-- <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>-->
  </Form>
</template>
<script lang="ts" setup>
import { reactive, ref, unref, computed } from 'vue';

import { Checkbox, Form, Input, Row, Col, Button, Image as AImage, Radio } from 'ant-design-vue';
// import {
//   GithubFilled,
//   WechatFilled,
//   AlipayCircleFilled,
//   GoogleCircleFilled,
//   TwitterCircleFilled,
// } from '@ant-design/icons-vue';
import LoginFormTitle from './LoginFormTitle.vue';

import { useI18n } from '/@/hooks/web/useI18n';
import { useMessage } from '/@/hooks/web/useMessage';

import { useUserStore } from '/@/store/modules/user';
import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
import { useDesign } from '/@/hooks/web/useDesign';
import { getVerificationCodeImg } from "/@/api/sys/user"
import { onMounted } from "vue"
const RadioGroup = Radio.Group;
const RadioButton = Radio.Button;
const ACol = Col;
const ARow = Row;
const FormItem = Form.Item;
const InputPassword = Input.Password;
const { t } = useI18n();
const { notification, createErrorModal } = useMessage();
const { prefixCls } = useDesign('login');
const userStore = useUserStore();

const { setLoginState, getLoginState } = useLoginState();
const { getFormRules } = useFormRules();

const formRef = ref();
const loading = ref(false);
const rememberMe = ref(false);

const img = ref()

const formData = reactive({
  userType: 1,
  username: '',
  password: '',
  code: '',
  codeKey: ''
});

const { validForm } = useFormValid(formRef);

//onKeyStroke('Enter', handleLogin);

const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

async function handleLogin() {
  const data = await validForm();

  if (!data) return;
  try {
    loading.value = true;
    const userInfo = await userStore.login({
      ...data,
      password: window.btoa(formData.password),
      codeKey: formData.codeKey,
      mode: 'none', //不要默认的错误提示
    });
    rememberMe.value ? localStorage.setItem('username', data.username) : localStorage.removeItem('username')

    if (userInfo) {
      notification.success({
        message: t('sys.login.loginSuccessTitle'),
        description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
        duration: 3,
      });
    }
  } catch (error) {
    createErrorModal({
      title: t('sys.api.errorTip'),
      content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
      getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
    });
    init()
  } finally {
    loading.value = false;
  }
}

async function init() {
  const username = localStorage.getItem('username')
  if (username) {
    rememberMe.value = true;
    formData.username = username
  }
  const data = await getVerificationCodeImg()

  formData.codeKey = data.codeKey
  img.value = data.img;
}
onMounted(() => init())
</script>
<style lang="less">
.code {
  input {
    min-width: 200px !important;
  }

  .ant-image {
    height: 40px;
    width: 100%;
    overflow: hidden;
    border-radius: 2px;
    cursor: pointer;

    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
