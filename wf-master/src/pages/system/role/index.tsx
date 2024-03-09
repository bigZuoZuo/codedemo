import React, { useRef, useState, useEffect } from 'react';
import { Button, message, Popconfirm, Form, Tree, Checkbox } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormDigit,
} from '@ant-design/pro-form';

import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import "./style.less";

const optionss = [
  {
    label: '展开/折叠',
    value: '1',
  },
  {
    label: '全选/取消',
    value: '2',
  },
  {
    label: '父子联动',
    value: '3',
  },
];

export default () => {
  const actionRef = useRef<ActionType>();

  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [treeData, setTreeData] = useState<any[]>([]); // 树结构数据
  const [checkStrictly, setCheckStrictly] = useState<boolean>(true);
  const [checkedKeys, setCheckedKeys] = useState<string[]>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<object>({});
  const [checkboxGroup, setCheckboxGroup] = useState<string[]>([]);
  const [repeatIs, setRepeatIs] = useState<boolean>(false);

  const [form] = Form.useForm();

  const deleteCl = async (id: string) => {
    const res: API.GeneralInterface = await request<API.GeneralInterface>('/system/role/' + id, {
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
      <a >{text}</a>
    </Popconfirm>
  );

  const columns: ProColumns<API.GithubIssueItems>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '角色人数',
      search: false,
      dataIndex: 'userNum',
    },
    {
      title: '角色备注',
      dataIndex: 'remark',
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
        if (record.roleKey === 'admin') {
          return;
        }
        const node = renderRemoveUser('删除', record.id);
        return [
          <a
            key="editable"
            onClick={() => {
              setRoleMenuTreeselect(record.id);
              setFormData(record);
              setTypes('edit');
              handleModalVisible(true);
              form.setFieldsValue(record);
            }}
          >
            修改
          </a>,
          node,
        ];
      },
    },
  ];

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res: API.RuleLists = await request<API.RuleLists>('/system/role/list', {
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

  const onCheck = (checkedKeysValue: any) => {
    let checkeds = [];
    if (checkStrictly) {
      checkeds = checkedKeysValue.checked;
    } else {
      checkeds = checkedKeysValue;
    }
    // console.log('onCheck', checkeds);
    setCheckedKeys(checkeds || []);
    form.setFieldsValue({
      menuIds: checkeds,
    });
  };
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };
  // 权限快捷操作
  const onChange = (checkedValue: any[]) => {
    if (checkedValue.includes('1') != checkboxGroup.includes('1')) {
      if (checkedValue.indexOf('1') != -1) {
        const list = dataProcessing(treeData, []);
        setExpandedKeys(list);
      } else {
        setExpandedKeys([]);
      }
    }
    if (checkedValue.includes('2') != checkboxGroup.includes('2')) {
      if (checkedValue.indexOf('2') != -1) {
        const list = dataProcessing(treeData, []);
        setCheckedKeys(list);
        form.setFieldsValue({
          menuIds: list,
        });
      } else {
        setCheckedKeys([]);
        form.setFieldsValue({
          menuIds: [],
        });
      }
    }
    if (checkedValue.includes('3') != checkboxGroup.includes('3')) {
      if (checkedValue.indexOf('3') != -1) {
        setCheckStrictly(false);
      } else {
        setCheckStrictly(true);
      }
    }
    setCheckboxGroup(checkedValue);
  };

  // 树结构数据处理函数
  const dataProcessing = (data: API.TrrTypes[], list: string[]) => {
    data.forEach((item: { id: string; children?: API.TrrTypes[] }) => {
      list.push(item.id);
      if (item.children) {
        dataProcessing(item.children, list);
      }
    });
    return list;
  };

  /** 树结构下拉数据 **/
  const setMenu = async () => {
    const res: { code: number; data: API.TrrTypes[] } = await request<{
      code: number;
      data: API.TrrTypes[];
    }>('/system/menu/list/2/0');
    // console.log(res, '------------------');
    if (res && res.code === 200) {
      setTreeData(res.data || []);
    }
  };

  /** 获取权限数据 **/
  const setRoleMenuTreeselect = async (id: string) => {
    const res: { code: number; data: { checkedKeys: any[] } } = await request<{
      code: number;
      data: { checkedKeys: any[] };
    }>('/system/menu/roleMenuTreeselect/' + id);
    // console.log(res, '------------------');
    if (res && res.code === 200) {
      // setTreeData(res.data || []);
      setCheckedKeys(res.data.checkedKeys || []);
      form.setFieldsValue({
        menuIds: res.data.checkedKeys,
      });
    }
  };

  /** 新增/编辑提交操作 **/
  const onFinish = async (value: API.GithubIssueItems) => {
    // console.log(value, '------------');
    if (repeatIs) return;
    setRepeatIs(true);
    const res: API.GeneralInterface = await request<API.GeneralInterface>('/system/role', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        sort: '1',
        status: '0',
        ...formData,
        ...value,
        handleType: types,
        formItems: undefined,
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
    setRepeatIs(false);
  };

  useEffect(() => {
    setMenu();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      setCheckStrictly(true);
      setExpandedKeys([]);
      setCheckedKeys([]);
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <div >
      <ProTable<API.GithubIssueItems>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
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
          <Button
            key="button"
            type="primary"
            onClick={() => {
              setTypes('add');
              handleModalVisible(true);
            }}
          >
            新增
          </Button>,
        ]}
      />

      <ModalForm
        form={form}
        title={types === 'add' ? '添加角色' : '编辑角色'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
        className='rolesModalForm'
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色名称为必填项',
            },
          ]}
          name="roleName"
          label="角色名称"
        />
        <Form.Item label="菜单权限" className="formItems" name="formItems">
          <Checkbox.Group options={optionss} onChange={onChange} />
        </Form.Item>
        <Form.Item
          // label="菜单权限"
          name="menuIds"
          rules={[
            {
              required: true,
              message: '菜单权限为必填项',
            },
          ]}
        >
          <Tree
            checkable
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            checkStrictly={checkStrictly}
            onCheck={onCheck}
            checkedKeys={checkedKeys}
            treeData={treeData}
            fieldNames={{ title: 'menuName', key: 'id' }}
            height={300}
          />
        </Form.Item>
        {/* <ProFormDigit
          rules={[
            {
              required: true,
              message: '排序为必填项',
            },
          ]}
          name="roleKey"
          label="排序"
        /> */}
        <ProFormTextArea name="remark" label="备注" />
      </ModalForm>
    </div>
  );
};
