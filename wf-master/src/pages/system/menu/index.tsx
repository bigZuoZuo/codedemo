import { useState, useEffect, useRef } from 'react';
import { Button, Form, message, Modal, Switch } from 'antd';
import request from '@/utils/umi-request';
import { PageContainer } from '@ant-design/pro-layout';
import './index.less';
import {
  ModalForm,
  ProFormDigit,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { ExclamationCircleOutlined } from '@ant-design/icons';

import { FormData, MenuList, GithubIssueItem, CheckMenuCodeUnique } from './data';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({});
  const [trrData, setTrrData] = useState<any[]>([]);
  const [form] = Form.useForm();

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '菜单名称',
      dataIndex: 'menuName',
    },
    {
      title: '图标',
      dataIndex: 'icon',
    },
    {
      title: '排序',
      dataIndex: 'treeSort',
    },
    {
      title: '路由',
      dataIndex: 'path',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (text, record) => (
        <Switch
          onClick={(val) => onFinish({ ...record, status: val })}
          defaultChecked
          checked={text == '0' ? true : false}
        />
      ),
    },
    {
      title: '操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record) => [
        <a onClick={() => editBtnClick(record)}>修改</a>,
        <a onClick={() => removeBtnClick(record)}>删除</a>,
        <a onClick={() => addBtnClick(record)}>新增</a>,
      ],
    },
  ];
  const menuListHandle = (list: any[]) => {
    return list.map((item) => {
      if (item.children?.length) {
        item.children = menuListHandle(item.children);
      } else {
        item.children = undefined;
      }
      return item;
    });
  };
  const getDataList = async () => {
    const res: MenuList = await request<MenuList>('/system/menu/list/4/0', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setTrrData(res.data);
      const list = menuListHandle(res.data);
      return {
        data: list,
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

  const deleteCl = async (id: string) => {
    const res: API.GeneralInterface = await request<API.GeneralInterface>('/system/menu/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg || '删除失败');
    }
  };

  // 新增或修改确认事件
  const onFinish = async (value: GithubIssueItem) => {
    // console.log(value, '---------------------');
    // console.log(formData, 'formData---------------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request<API.GeneralInterface>('/system/menu', {
      method: 'POST',
      data: {
        version: types === 'add' ? undefined : formData.version,
        ...value,
        status: value.status ? '0' : '1',
        parentId: value.parentId ? value.parentId : '0',
      },
    });
    if (res && res.code === 200) {
      handleModalVisible(false);
      if (value.version) {
        message.success('状态修改成功');
      }else{
        message.success(types === 'add' ? '新增成功' : '修改成功');
      }
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };

  // 添加
  const addBtnClick = (val: GithubIssueItem) => {
    // console.log(val);
    setTypes('add');
    setFormData(val);
    form.setFieldsValue({
      parentId: val.id,
      status: true,
    });
    handleModalVisible(true);
  };
  // 编辑
  const editBtnClick = (val: GithubIssueItem) => {
    // console.log(val);
    setTypes('edit');
    setFormData(val);
    handleModalVisible(true);
    form.setFieldsValue({
      ...val,
      status: val.status == '1' ? false : true,
      parentId: val.parentId == '0' ? undefined : val.parentId,
    });
  };
  // 删除按钮点击事件
  const removeBtnClick = (item: GithubIssueItem) => {
    Modal.confirm({
      title: '操作提醒',
      icon: <ExclamationCircleOutlined />,
      content: '确定删除吗？',
      okText: '确认',
      cancelText: '取消',
      className: 'removeBtns',
      centered: true,
      onOk: () => {
        // console.log(12345678)
        deleteCl(item.id);
      },
    });
  };
  // 菜单code验证是否存在
  const isEmailRepeatfnCode = async (
    value: string,
    callback: { (error?: string | undefined): void; (arg0: string | undefined): void },
  ) => {
    if (!value) {
      callback();
      return;
    }
    const res = await request<CheckMenuCodeUnique>('/system/menu/checkMenuCodeUnique', {
      method: 'GET',
      params: {
        menuCode: value,
        id: types === 'add' ? undefined : formData.id,
      },
    });
    if (res && res.code === 200 && res.data.code === '2') {
      callback('菜单code已存在');
      return;
    }
    callback();
  };

  // 菜单名称验证是否存在
  const isEmailRepeatfnName = async (
    value: string,
    callback: { (error?: string | undefined): void; (arg0: string | undefined): void },
  ) => {
    if (!value) {
      callback();
      return;
    }
    const res = await request<CheckMenuCodeUnique>('/system/menu/checkMenuNameUnique', {
      method: 'GET',
      params: {
        menuName: value,
        id: types === 'add' ? undefined : formData.id,
        parentId: types === 'add' ? formData.id || '0' : formData.parentId,
      },
    });
    if (res && res.code === 200 && res.data.code === '2') {
      callback('菜单名称已存在');
      return;
    }
    callback();
  };

  useEffect(() => {
    if (!createModalVisible) {
      handleModalVisible(false);
      setFormData({});
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <PageContainer>
      <ProTable<GithubIssueItem>
        // dataSource={tableListDataSource}
        actionRef={actionRef}
        rowKey="id"
        pagination={{
          showQuickJumper: true,
        }}
        columns={columns}
        search={false}
        request={async (params = {}) => {
          return getDataList();
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            type="primary"
            onClick={() => {
              setTypes('add');
              form.setFieldsValue({
                status: true,
              });
              handleModalVisible(true);
            }}
          >
            新增
          </Button>,
        ]}
      />
      <ModalForm
        form={form}
        title={types === 'add' ? '菜单信息新增' : '菜单信息修改'}
        width={600}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '菜单code为必填项',
            },
            {
              validator: (rule, value, callback) => {
                isEmailRepeatfnCode(value, callback);
              },
            },
          ]}
          name="menuCode"
          label="菜单code"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '菜单名称为必填项',
            },
            {
              validator: (rule, value, callback) => {
                isEmailRepeatfnName(value, callback);
              },
            },
          ]}
          name="menuName"
          label="菜单名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '路由地址为必填项',
            },
          ]}
          name="path"
          label="路由地址"
        />
        <ProFormSelect
          name="menuType"
          label="菜单类型"
          valueEnum={{
            M: '目录',
            C: '菜单',
            F: '按钮',
          }}
          placeholder="请选择菜单类型"
          rules={[{ required: true, message: '菜单类型为必填' }]}
        />
        <ProFormTreeSelect
          label="上级目录"
          name="parentId"
          placeholder="请选择上级目录"
          allowClear
          secondary
          request={async () => {
            return trrData;
          }}
          fieldProps={{
            treeNodeFilterProp: 'menuName',
            fieldNames: {
              label: 'menuName',
              value: 'id',
            },
          }}
        />
        <ProFormDigit
          rules={[
            {
              required: true,
              message: '排序为必填项',
            },
          ]}
          name="treeSort"
          label="排序"
        />
        <ProFormText name="icon" label="菜单图标" />
        <ProFormSwitch name="status" label="状态" />
      </ModalForm>
    </PageContainer>
  );
};
