/* eslint-disable react/jsx-key */
import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Switch, Form } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link, history } from 'umi';
import { ModalForm, ProFormSelect } from '@ant-design/pro-form';

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState<API.GithubIssueItem>({ id: '' });
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [roleList, setRoleList] = useState<API.ProFormSelectType[]>([]);

  const deleteCl = async (id: string) => {
    const res: API.GeneralInterface = await request<API.GeneralInterface>('/system/user/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
  };

  const renderRemoveUser = (text: string, id: string) => (
    <Popconfirm
      key="popconfirm"
      title={`确认${text}吗?`}
      okText="是"
      cancelText="否"
      onConfirm={() => {
        // console.log(123456);
        deleteCl(id);
      }}
    >
      <a>{text}</a>
    </Popconfirm>
  );

  const columns: ProColumns<API.GithubIssueItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '用户姓名',
      dataIndex: 'name',
    },
    {
      title: '用户角色',
      dataIndex: 'roleName',
      search: false,
    },
    {
      title: '手机号码',
      dataIndex: 'phonenumber',
    },
    {
      title: '登录账号',
      search: false,
      dataIndex: 'userName',
    },
    {
      title: '最近登录时间',
      search: false,
      dataIndex: 'loginDate',
    },
    {
      title: '用户状态',
      search: false,
      dataIndex: 'status',
      render: (text, record) => (
        <Switch
          defaultChecked
          checked={text == '0' ? true : false}
          onClick={(val) => statusCh(val, record)}
        />
      ),
    },
    {
      title: '创建时间',
      search: false,
      dataIndex: 'createTime',
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => {
        const node: any = renderRemoveUser('删除', record.id);
        return [
          <a
            key="editable"
            onClick={() => {
              history.push('/system/user/edit/' + record.id);
            }}
          >
            修改
          </a>,
          node,
          <Popconfirm
            key="popconfirm"
            title={`确认重置密码吗?`}
            okText="是"
            cancelText="否"
            onConfirm={async () => {
              // console.log(123456);
              const res = await request<API.GeneralInterface>('/system/user/resetPwd', {
                method: 'PUT',
                data: {
                  id: record.id,
                  password: '123456',
                },
              });
              if (res && res.code === 200) {
                message.success(res.msg);
                handleModalVisible(false);
                if (actionRef.current) {
                  actionRef.current.reload();
                }
              } else {
                message.error(res.msg);
              }
            }}
          >
            <a>重置密码</a>
          </Popconfirm>,
          <a
            onClick={() => {
              setFormData(record);
              handleModalVisible(true);
              form.setFieldsValue({
                roleIds: record.roleId ? record.roleId.split(',') : [],
              });
            }}
          >
            分配角色
          </a>,
        ];
      },
    },
    {
      title: '用户状态',
      width: 80,
      hideInTable: true,
      dataIndex: 'status',
      // initialValue: '0',
      valueEnum: {
        0: { text: '正常' },
        1: { text: '关闭', status: 'Default' },
      },
    },
    {
      title: '用户角色',
      dataIndex: 'roleId',
      hideInTable: true,
      valueType: 'select',
      request: async () => {
        const res = await request('/system/role/list', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 1000,
          },
        });
        let list = [];
        if (res && res.code === 200) {
          list = res.data.list.map((item: { roleName: string; id: string }) => {
            return {
              label: item.roleName,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
  ];

  const getDataList = async (datas: API.GetDataList) => {
    const res: any = await request<API.RuleList>('/system/user/list', {
      method: 'GET',
      params: {
        ...datas,
      },
    });
    if (res && res.code === 200) {
      return {
        total: res.data.total,
        data: res.data.list,
        success: true,
      };
    } else {
      return {
        total: 0,
        data: [],
        success: false,
      };
    }
  };

  const onFinish = async (value: { roleIds: string[] }) => {
    console.log(value);
    if (repeatIs) return;
    setRepeatIs(true);
    const res: API.GeneralInterface = await request<API.GeneralInterface>(
      '/system/user/addRoleUser',
      {
        method: 'POST',
        data: {
          userId: formData.id,
          roleId: value.roleIds.toString(),
        },
      },
    );
    if (res && res.code === 200) {
      message.success(res.msg);
      handleModalVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };
  const statusCh = async (val: boolean, data: API.GithubIssueItem) => {
    console.log(val);
    console.log(data);
    const res = await request<API.GeneralInterface>('/system/user/changeStatus', {
      method: 'PUT',
      data: {
        version: data.version,
        status: val ? '0' : '1',
        id: data.id,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
  };
  /** 角色列表 **/
  const getRoleList = async () => {
    const res: any = await request<API.RoleList>('/system/role/list', {
      method: 'GET',
      params: {
        // ...datas,
        pageNum: 1,
        pageSize: 1000,
      },
    });
    if (res && res.code === 200) {
      const list: API.ProFormSelectType[] = res.data.list.map(
        (item: { roleName?: string; id: string }) => {
          return {
            label: item.roleName || '',
            value: item.id,
          };
        },
      );
      setRoleList(list);
    }
  };

  useEffect(() => {
    getRoleList();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      setFormData({ id: '' });
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <>
      <ProTable<API.GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          // console.log(params, sort, filter, '------------------------');
          const datas: { pageNum: number; pageSize: number } = {
            ...params,
            pageNum: params.current || 1,
            pageSize: params.pageSize || 10,
          };
          return getDataList(datas);
        }}
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Link to="/system/user/add">
            <Button key="button" icon={<PlusOutlined />} type="primary">
              新增
            </Button>
          </Link>,
        ]}
      />
      <ModalForm
        form={form}
        title="分配角色"
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <ProFormSelect
          label="角色选择"
          name="roleIds"
          mode="tags"
          options={roleList}
          placeholder="请选择角色选择"
          rules={[
            {
              required: true,
              message: '角色选择为必填项',
            },
          ]}
        />
      </ModalForm>
    </>
  );
};
