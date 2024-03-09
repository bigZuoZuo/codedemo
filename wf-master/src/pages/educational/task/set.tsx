import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Tree, Select, Radio, Table, message } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';

import './style.less';
import ProForm from '@ant-design/pro-form';
import { DataNode, GithubIssueItem1 } from './data';

const { Option } = Select;

export default (props: { match: { params: { id: string } } }) => {
  const actionRef = useRef<ActionType>();
  // const [formData, setFormData] = useState<object>({});
  const [parentId, setParentId] = useState<string>('0'); // 选中章节id
  const [subjectSelect, setSubjectSelect] = useState<API.Category[]>([]); // 学科数据
  const [teachingMaterial, setTeachingMaterial] = useState<API.Category[]>([]); // 教材数据
  const [radioValue, setRadioValue] = useState<string>('1');
  const [treeData, setTreeData] = useState<DataNode[]>([{ title: '知识点', key: '0', id: '0' }]);
  const [form] = Form.useForm();
  const [lisyEditableKeys, setLisyEditableKeys] = useState<any[]>([]);
  const [loadings, setLoadings] = useState<boolean>(false);

  const columns: ProColumns<GithubIssueItem1>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
    },
    {
      title: '题目名称',
      dataIndex: 'title',
      ellipsis: true,
    },
    {
      title: '题目类型',
      dataIndex: 'typeValue',
      search: false,
      ellipsis: true,
    },
    {
      title: '题目答案',
      search: false,
      dataIndex: 'answer',
      ellipsis: true,
    },
    {
      title: '题目答案',
      dataIndex: 'difficultyValue',
      search: false,
      ellipsis: true,
    },
    {
      title: '来源',
      search: false,
      dataIndex: 'source',
      ellipsis: true,
    },
    {
      title: '查重状态',
      search: false,
      dataIndex: 'repeatState',
    },
    {
      title: '组卷次数',
      search: false,
      dataIndex: 'count',
    },
    {
      title: '更新时间',
      search: false,
      dataIndex: 'updateTime',
      ellipsis: true,
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 100,
      render: (text, record) => [
        <a key={record.id} onClick={() => optionClick(record)}>
          {lisyEditableKeys.indexOf(record.id) != -1 ? '取消选择' : '选择题目'}
        </a>,
      ],
    },
    {
      title: '题目类型',
      hideInTable: true,
      dataIndex: 'type',
      request: async () => {
        const res = await request<API.DictData>('/system/dict/data/page', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 5000,
            dictType: 'topic_type',
          },
        });
        let list: { label: string; value: string }[] = [];
        if (res && res.code === 200 && res.data && res.data.list) {
          list = res.data.list.map((item) => {
            return {
              label: item.dictLabel || '',
              value: item.id || '',
            };
          });
        }
        return list;
      },
    },
    {
      title: '难易度',
      dataIndex: 'name1',
      // search: false,
      request: async () => {
        const res = await request<API.DictData>('/system/dict/data/page', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 5000,
            dictType: 'facility_value',
          },
        });
        let list: { label: string; value: string }[] = [];
        if (res && res.code === 200 && res.data && res.data.list) {
          list = res.data.list.map((item) => {
            return {
              label: item.dictLabel || '',
              value: item.id || '',
            };
          });
        }
        return list;
      },
    },
    {
      title: '创建来源',
      hideInTable: true,
      request: async () => {
        const res = await request<API.DictData>('/system/dict/data/page', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 5000,
            dictType: 'create_source',
          },
        });
        let list: { label: string; value: string }[] = [];
        if (res && res.code === 200 && res.data && res.data.list) {
          list = res.data.list.map((item) => {
            return {
              label: item.dictLabel || '',
              value: item.id || '',
            };
          });
        }
        return list;
      },
    },
  ];

  const optionClick = (data: GithubIssueItem1) => {
    let number = lisyEditableKeys.indexOf(data.id);
    if (number != -1) {
      const list = [...lisyEditableKeys];
      list.splice(number, 1);
      setLisyEditableKeys(list);
    } else {
      setLisyEditableKeys([...lisyEditableKeys, data.id]);
    }
  };

  /** 请求列表数据 **/
  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<{
      code: number;
      data: {
        list: GithubIssueItem1[];
        total: number;
      };
    }>('/web/schoolQuestion/list', {
      method: 'GET',
      params: {
        ...datas,
        subjectId: form.getFieldValue('subjectId') || undefined,
        teachId: form.getFieldValue('teachId') || undefined,
        knowledgeId: radioValue == '1' ? (parentId != '0' ? parentId : undefined) : undefined,
        chapterId: radioValue == '1' ? (parentId != '0' ? parentId : undefined) : undefined,
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

  /** 章节或知识点数据 **/
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getSchoolChapter = async (parentId: string, subjectId?: string) => {
    let urls = radioValue == '1' ? '/web/schoolKnowledge/tree' : '/web/schoolChapter/tree';
    const res = await request<API.NameIdType>(urls, {
      method: 'GET',
      params: {
        parentId,
        subjectId: subjectId ? subjectId : form.getFieldValue('subjectId') || undefined,
        teachId: form.getFieldValue('teachId') || undefined,
      },
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item: { id: string; name: string }) => {
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
  /** 请求学科数据 **/
  const majorSelectCh = async () => {
    const res = await request<API.NameIdType>('/web/schoolSubject/findAllSubject', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      setSubjectSelect(res.data);
    }
  };
  /** 选择学科触发 **/
  const subjectSelectCh = async (subjectId: string) => {
    if (radioValue === '1') {
      const list = await getSchoolChapter('0');
      setTreeData((origin) => updateTreeData(origin, '0', list));
    } else {
      form.setFieldsValue({
        teachId: undefined,
      });
      setTreeData((origin) => updateTreeData(origin, '0', []));
      if (!subjectId) {
        setTeachingMaterial([]);
        return;
      }
      const res = await request<API.NameIdType>('/web/schoolTeach/teachSelect', {
        method: 'GET',
        params: {
          subjectId: subjectId,
        },
      });
      if (res && res.code === 200 && res.data) {
        setTeachingMaterial(res.data);
      }
    }
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };
  /** 发布按钮操作 **/
  const onFinish = async () => {
    if (lisyEditableKeys.length === 0) {
      message.error('请选择题目');
      return;
    }
    if (loadings) return;
    setLoadings(true);
    const question = lisyEditableKeys.map((item, index) => {
      return {
        questionId: item,
        sort: index + 1,
      };
    });
    const res = await request<API.GeneralInterface>('/web/schoolTask/push', {
      method: 'POST',
      data: {
        id: props.match.params.id,
        question,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      history.back();
    } else {
      message.error(res.msg);
    }
    setLoadings(false);
  };

  useEffect(() => {
    majorSelectCh();
  }, []);

  return (
    <>
      <div className="knowledge_list">
        <div className="knowledge_list_left">
          <ProForm form={form} submitter={false}>
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
            <Radio.Group
              buttonStyle="solid"
              value={radioValue}
              onChange={(e) => {
                form.setFieldsValue({
                  teachId: undefined,
                });
                const list = [...treeData];
                list[0].title = e.target.value == '1' ? '知识点' : '章节';
                setTreeData(list);
                setRadioValue(e.target.value);
                subjectSelectCh(form.getFieldValue('subjectId'));
              }}
              style={{ margin: '0 0 10px 0' }}
            >
              <Radio.Button value="1">知识点</Radio.Button>
              <Radio.Button value="2">教材</Radio.Button>
            </Radio.Group>
            {radioValue === '2' ? (
              <Form.Item name="teachId">
                <Select allowClear placeholder="选择教材">
                  {teachingMaterial.map((item) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            ) : null}
          </ProForm>
          <p>{radioValue == '1' ? '知识点' : '章节'}</p>
          <div className="knowledge_list_tree">
            <Tree loadData={onLoadData} treeData={treeData} onSelect={onSelect} />
          </div>
        </div>
        <div className="knowledge_list_right">
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
            rowSelection={{
              selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
              selectedRowKeys: lisyEditableKeys,
              onChange: (selectedRowKeys, selectedRows) => setLisyEditableKeys(selectedRowKeys),
            }}
            // scroll={{ x: 1300 }}
            toolBarRender={() => [<Button type="primary">加入</Button>]}
          />
        </div>
      </div>
      <div className="knowledge_bottom">
        <Button type="primary" onClick={() => onFinish()}>
          发布
        </Button>
        <Button type="primary">预览</Button>
        <Button>返回</Button>
      </div>
    </>
  );
};
