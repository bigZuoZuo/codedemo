import React, { useEffect, useRef, useState } from 'react';
import { Button, Popconfirm, Form, message, Tree, Select, TreeSelect } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import ProForm, {
  ModalForm,
  ProFormText,
  // ProFormSelect,
  ProFormTextArea,
} from '@ant-design/pro-form';
import './style.less';
import { GithubIssueItem, DataNode, GithubIssueItem1, TableListData } from './data';

const { Option } = Select;

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<GithubIssueItem>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [parentId, setParentId] = useState<string>('0'); // 选中章节id

  const [subjectSelect, setSubjectSelect] = useState<API.Category[]>([]); // 学科数据

  const [treeData, setTreeData] = useState<DataNode[]>([{ title: '知识点', key: '0', id: '0' }]);
  const [treeData1, setTreeData1] = useState<DataNode[]>([{ title: '知识点', key: '0', id: '0' }]);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolKnowledge/' + id, {
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
  const ancestorsHe = (list: DataNode[], id: string, data: string[]) => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      data.push(item.id || '');
      if (item.children) {
        ancestorsHe(item.children, id, data);
      }
      if (item.id != id && (!item.children || item.children.length === 0)) {
        // eslint-disable-next-line no-param-reassign
        data = [];
      }
      if (item.id === id) {
        break;
      }
    }
    return data;
  };

  /** 新增/编辑提交操作 **/
  const onFinish = async (value: GithubIssueItem1) => {
    // console.log(value, '------------');
    const ancestors = ancestorsHe(treeData1, value.parentId || '', []);
    // console.log(ancestors, '----------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request<API.GeneralInterface>('/web/schoolKnowledge', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        // ...formData,
        ...value,
        parentId: value.parentId,
        ancestors: ancestors.toString(),
        isCatalogue: value.parentId != '0' ? 1 : 0,
        version: formData.version,
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

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '知识点名称',
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
      // copyable: true,
      ellipsis: true,
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
          key={'editable' + record.id}
          onClick={() => {
            setFormData(record);
            setTypes('edit');
            form.setFieldsValue(record);
            handleModalVisible(true);
          }}
        >
          修改
        </a>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
    {
      title: '知识点名称',
      dataIndex: 'name',
      // copyable: true,
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '知识点别名',
      dataIndex: 'alias',
      // copyable: true,
      ellipsis: true,
      hideInTable: true,
    },
  ];

  /** 请求列表数据 **/
  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<TableListData>('/web/schoolKnowledge/list', {
      method: 'GET',
      params: {
        ...datas,
        id: parentId,
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
  const getSchoolChapter = async (parentId: string, subjectId?: string) => {
    const res = await request<{
      code: number;
      data: DataNode[];
    }>('/web/schoolKnowledge/tree', {
      method: 'GET',
      params: {
        parentId,
        subjectId: subjectId ? subjectId : form1.getFieldValue('subjectId') || undefined,
      },
    });
    if (res && res.code === 200) {
      const list = res.data.map((item) => {
        return {
          ...item,
          key: item.id || '',
          title: item.name || '',
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
  /** 获取所有学科 **/
  const findAllSubject = async () => {
    const res = await request<API.NameIdType>('/web/schoolSubject/findAllSubject', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      setSubjectSelect(res.data);
    }
  };
  /** 选择学科触发 **/
  const subjectSelectCh = async () => {
    // console.log(val);
    // getSchoolChapter('0');
    const list = await getSchoolChapter('0');
    setTreeData((origin) => updateTreeData(origin, '0', list));
    if (list.length === 0) {
      message.warning('该学科没有知识点数据');
    }
  };
  /** 选择学科触发 **/
  const subjectSelectCh1 = async (val: string) => {
    // console.log(val);
    // getSchoolChapter('0');
    form.setFieldsValue({
      parentId: undefined,
    });
    let list: any = [];
    const res = await request<{
      code: number;
      data: DataNode[];
    }>('/web/schoolKnowledge/tree', {
      method: 'GET',
      params: {
        parentId: '0',
        subjectId: val,
      },
    });
    if (res && res.code === 200) {
      list = res.data.map((item) => {
        return {
          ...item,
          key: item.id || '',
          title: item.name || '',
        };
      });
    }
    setTreeData1((origin) => updateTreeData(origin, '0', list));
    // if (list.length === 0) {
    //   message.warning('该学科没有知识点数据');
    // }
  };
  const onLoadData1 = ({ id }: any) =>
    new Promise<void>(async (resolve) => {
      const subjectId = form.getFieldValue('subjectId');
      if (!subjectId) {
        message.error('请选择所属学科');
        resolve();
        return;
      }
      if (!subjectId) return;
      const list = await getSchoolChapter(id, subjectId);
      setTreeData1((origin) => updateTreeData(origin, id, list));
      resolve();
    });

  useEffect(() => {
    findAllSubject();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <div className="knowledge_list">
      <div className="knowledge_list_left">
        <ProForm form={form1} submitter={false}>
          <Form.Item name="subjectId" label="学科">
            <Select allowClear onChange={subjectSelectCh} placeholder="选择学科">
              {subjectSelect.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
        </ProForm>
        <p>知识点</p>
        <div className="knowledge_list_tree">
          <Tree loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
        </div>
      </div>
      <div className="knowledge_list_right">
        <ProTable<GithubIssueItem>
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
      </div>

      <ModalForm
        form={form}
        title={types === 'add' ? '新增知识点' : '修改知识点'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <Form.Item name="subjectId" label="所属学科">
          <Select allowClear placeholder="选择所属学科" onChange={subjectSelectCh1}>
            {subjectSelect.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item name="parentId" label="上级知识点">
          <TreeSelect
            treeDataSimpleMode
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={treeData1}
            fieldNames={{ label: 'title', value: 'id' }}
            placeholder="请选择上级知识点"
            loadData={onLoadData1}
          />
        </Form.Item>
        <ProFormText
          rules={[
            {
              required: true,
              message: '知识点名称为必填项',
            },
          ]}
          name="name"
          label="知识点名称"
          placeholder="请输入知识点名称"
        />
        <ProFormText name="alias" label="别名" />
        <ProFormTextArea label="备注信息" name="remark" placeholder="" />
      </ModalForm>
    </div>
  );
};
