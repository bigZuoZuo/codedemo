/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useState } from 'react';
import {
  ExclamationCircleOutlined,
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Menu, Spin, Form, message, Modal } from 'antd';
import { history, useModel } from 'umi';
// import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import styles from './index.less';
// import { outLogin } from '@/services/ant-design-pro/api';
import type { MenuInfo } from 'rc-menu/lib/interface';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import request from '@/utils/umi-request';
const { confirm } = Modal;

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

/**
 * 退出登录，并且将当前的 url 保存
 */
const loginOut = async () => {
  // await outLogin();
  const { query = {} } = history.location;
  const { redirect } = query;
  // Note: There may be security issues, please note
  if (window.location.pathname !== '/user/login' && !redirect) {
    history.replace({
      pathname: '/user/login',
      // search: stringify({
      //   redirect: pathname,
      // }),
    });
  }
};

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState');
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [form] = Form.useForm();

  /** 学科、新增/编辑提交操作 **/
  const onFinish = async (value: any) => {
    // console.log(value, formData, '------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request('/system/user/profile/updatePwd', {
      method: 'PUT',
      params: {
        ...value,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      handleModalVisible(false);
      // setTimeout(() => {
      //   setInitialState((s: any) => ({ ...s, currentUser: undefined }));
      //   localStorage.removeItem('headers_token');
      //   // loginOut();
      // }, 1000);
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };

  const onMenuClick = useCallback(
    (event: MenuInfo) => {
      const { key } = event;
      if (key === 'logout') {
        confirm({
          title: '是否确认退出?',
          icon: <ExclamationCircleOutlined />,
          content: '',
          onOk() {
            setInitialState((s: any) => ({ ...s, currentUser: undefined }));
            localStorage.removeItem('headers_token');
            // loginOut();
            setTimeout(() => {
              history.replace({
                pathname: '/user/login',
              });
            }, 0);
          },
        });
        return;
      }
      if (key === 'password') {
        form.resetFields();
        handleModalVisible(true);
        return;
      }
      // history.push(`/account/${key}`);
    },
    [setInitialState],
  );

  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;
  if (!currentUser || (currentUser && currentUser.user && !currentUser.user.userName)) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {/* {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )} */}
      {menu && (
        <Menu.Item key="password">
          <SettingOutlined />
          修改密码
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <div>
      <HeaderDropdown overlay={menuHeaderDropdown}>
        <span className={`${styles.action} ${styles.account}`}>
          <Avatar
            size="small"
            className={styles.avatar}
            src={currentUser.user && currentUser.user.avatar}
            alt="avatar"
          />
          <span className={`${styles.name} anticon`}>
            {currentUser.user && currentUser.user.userName}
          </span>
        </span>
      </HeaderDropdown>
      <ModalForm
        form={form}
        title="修改密码"
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
        autoComplete="off"
      >
        <ProFormText.Password
          rules={[
            {
              required: true,
              message: '原密码为必填项',
            },
          ]}
          name="oldPassword"
          label="原密码"
        />
        <ProFormText.Password
          label="新密码"
          name="newPassword"
          rules={[
            {
              required: true,
              message: '新密码为必填项',
            },
          ]}
        />
      </ModalForm>
    </div>
  );
};

export default AvatarDropdown;
