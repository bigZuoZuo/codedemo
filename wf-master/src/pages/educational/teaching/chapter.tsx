import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Popconfirm, Tree } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormTextArea,
  ProFormTreeSelect,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import './style.less';
import { DataNode, GithubIssueItem1 } from './data';

export default (props: {
  match: {
    params: {
      name: string;
      id: string | (() => string);
    };
  };
}) => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<GithubIssueItem1>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [parentId, setParentId] = useState<string>('0'); // 选中章节id

  const [form] = Form.useForm();
  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolChapter/' + id, {
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
  /** 新增/编辑提交操作 **/
  const onFinish = async (value: GithubIssueItem1) => {
    if (repeatIs) return;
    setRepeatIs(true);
    const urls = types === 'add' ? '/web/schoolChapter/add' : '/web/schoolChapter/edit';
    const res = await request<API.GeneralInterface>(urls, {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...value,
        parentId: value.parentId ? value.parentId : '0',
        version: formData.version,
        teachId: props.match.params.id,
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

  const columns: ProColumns<GithubIssueItem1>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '章节名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '类型别名',
      search: false,
      dataIndex: 'alias',
    },
    {
      title: '备注信息',
      search: false,
      dataIndex: 'remark',
      ellipsis: true,
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
    },
    {
      title: '更新时间',
      search: false,
      dataIndex: 'updateTime',
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setTypes('edit');
            handleModalVisible(true);
            setFormData(record);
            form.setFieldsValue({
              ...record,
              parentId: record.parentId && record.parentId != '0' ? record.parentId : undefined,
            });
          }}
        >
          修改
        </a>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
    {
      title: '章节名称',
      hideInTable: true,
      dataIndex: 'name',
    },
    {
      title: '章节别名',
      hideInTable: true,
      dataIndex: 'alias',
    },
  ];

  /** 请求列表数据 **/
  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<{
      code: number;
      data?: {
        list: GithubIssueItem1[];
        total: number;
      };
    }>('/web/schoolChapter/list', {
      method: 'GET',
      params: {
        ...datas,
        parentId: parentId,
        teachId: props.match.params.id,
      },
    });
    if (res && res.code === 200 && res.data) {
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

  /** 章节树数据 **/
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getSchoolChapter = async (parentId: string) => {
    const res = await request('/web/schoolChapter/tree', {
      method: 'GET',
      params: {
        parentId,
        teachId: props.match.params.id,
      },
    });
    if (res && res.code === 200) {
      const list = res.data.map((item: { id?: string; name?: string }) => {
        return {
          ...item,
          key: item.id,
          title: item.name,
        };
      });
      return list;
    }
    return [];
  };

  // 树结构展开触发事件
  const updateTreeData = (list: DataNode[], key: React.Key, children: DataNode[]): DataNode[] => {
    return list.map((node) => {
      if (node.key === key) {
        return {
          ...node,
          children,
        };
      }
      if (node.children) {
        return {
          ...node,
          children: updateTreeData(node.children, key, children),
        };
      }
      return node;
    });
  };

  const [treeData, setTreeData] = useState<any[]>([{ title: '章节', key: '0', id: '0' }]);

  /** 树结构触发事件 **/
  const onLoadData = ({ key, children }: any) =>
    new Promise<void>(async (resolve) => {
      if (children) {
        resolve();
        return;
      }
      const list = await getSchoolChapter(key);
      setTreeData((origin) => updateTreeData(origin, key, list));
      resolve();
    });

  const onSelect = (
    selectedKeys: any,
    e: { selected: boolean; selectedNodes: any; node: any; event: any },
  ) => {
    // console.log(selectedKeys, e.node.id, '--------------------------------');
    setParentId(e.node.id);
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <PageContainer>
      <div className="chapter_list">
        <div className="chapter_list_left">
          <Tree loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
        </div>
        <div className="chapter_list_right">
          <ProTable<GithubIssueItem1>
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
              // <Button key="button" type="primary">
              //   删除
              // </Button>,
            ]}
          />
        </div>
      </div>
      <ModalForm
        form={form}
        title={types === 'add' ? '章节新增' : '章节新增'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProForm.Item label="所属教材">
          <span>{props.match.params.name}</span>
        </ProForm.Item>
        <ProFormTreeSelect
          label="选择上级"
          name="parentId"
          // options={treeData}
          placeholder="请选择"
          request={async () => treeData}
          fieldProps={{
            fieldNames: {
              label: 'title',
              value: 'key',
              children: 'children',
            },
          }}
        />
        <ProFormText
          name="name"
          label="章节名称"
          rules={[
            {
              required: true,
              message: '章节名称为必填项',
            },
          ]}
          placeholder="请输入章节名称"
        />
        <ProFormText name="alias" label="别名" placeholder="请输入别名" />
        <ProFormDigit
          name="sort"
          label="排序"
          placeholder="请输入排序"
          // rules={[
          //   {
          //     required: true,
          //     message: '排序为必填项',
          //   },
          // ]}
        />
        <ProFormTextArea label="备注信息" name="remark" placeholder="请输入备注信息" />
      </ModalForm>
    </PageContainer>
  );
};
