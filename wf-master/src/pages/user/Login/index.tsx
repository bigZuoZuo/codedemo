import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { message, Button } from 'antd';
import React, { useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, FormattedMessage, useModel } from 'umi';
import { login } from '@/services/ant-design-pro/api';
import styles from './index.less';
const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<boolean>(false);
  // const [type, setType] = useState<string>('account');
  const [loadings, setLoadings] = useState<boolean>(false);
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    // console.log(userInfo, '----------------------');
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    // const { query } = history.location;
    // const { redirect } = query as { redirect: string };
    // history.push(redirect || '/');
    setLoadings(true);
    try {
      // const secret = await getSecret({ userName: values.username });
      // console.log(secret);
      // values.password = CryptoJs.encrypt(values.password, secret.data);
      // console.log('values.password', values.password);
      // 登录
      const msg = await login({ ...values });
      console.log(msg);
      if (msg.code === 200) {
        localStorage.setItem('headers_token', msg.token);
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        // await setInitialState({})
        setLoadings(false);
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        // 主动刷新菜单

        // const { query } = history.location;
        // const { redirect } = query as { redirect: string };
        history.push('/');
        return;
      } else {
        // const defaultLoginFailureMessage = intl.formatMessage({
        //   id: 'pages.login.failure',
        //   defaultMessage: msg.msg,
        // });
        message.error(msg.msg);
      }
      // console.log(msg);
      // 如果失败去设置用户错误信息
      // setUserLoginState(true);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      message.error(defaultLoginFailureMessage);
      setLoadings(false);
    }
    setLoadings(false);
  };
  // const { status, type: loginType } = userLoginState;
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.content_lefts} />
        <div className={styles.content_LoginForm + ' loginFormDiv'}>
          <div className={styles.LoginForm_img} />
          <div>
            <LoginForm
              onFinish={async (values) => {
                console.log(values);
                if (loadings) return;
                await handleSubmit(values as API.LoginParams);
              }}
              submitter={false}
            >
              <ProFormText
                name="username"
                className="username134"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入账号"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入账号!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="请输入密码"
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
              <div
                style={{
                  textAlign: 'right',
                }}
              >
                {/* <a style={{ textDecoration: 'underline' }}>
                  <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码" />
                </a> */}
              </div>
              <div className={styles.LoginForm_bot}>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loadings}
                  className={styles.LoginForm_buttom}
                >
                  登录
                </Button>
                {/* <ProFormCheckbox noStyle name="autoLogin">
                  <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录" />
                </ProFormCheckbox> */}
              </div>
            </LoginForm>
          </div>
          <div
            className={styles.error_Display}
            style={{ display: userLoginState ? 'block' : 'none' }}
          >
            The username and password entered are incorrect. Please try again.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
