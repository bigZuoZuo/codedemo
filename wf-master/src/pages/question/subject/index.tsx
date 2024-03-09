import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Tree, Select, Radio, Table,Modal ,message   } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';

import './style.less';
import {ProForm} from '@ant-design/pro-form';
import type { DataNode, GithubIssueItem1 } from './data';
import { RequestOptionsType } from '@ant-design/pro-utils';
import { history } from 'umi';


const { Option } = Select;
const { confirm } = Modal;

export default () => {
  const actionRef = useRef<ActionType>();
  // const [formData, setFormData] = useState<object>({});
  const [parentId, setParentId] = useState<string>('0'); // 选中章节id
  const [subjectSelect, setSubjectSelect] = useState<API.Category[]>([]); // 学科数据
  const [teachingMaterial, setTeachingMaterial] = useState<API.Category[]>([]); // 教材数据

  const [radioValue, setRadioValue] = useState<string>('1');

  const [treeData, setTreeData] = useState<DataNode[]>([{ title: '知识点', key: '0', id: '0' }]);

  // 详情弹框显示
  const [detailVisible,setDetailVisible] = useState<boolean>(false)
  // 详情框里面的内容
  const [detailDb,setDetailDb] = useState<Object>({})
  // table列表选中的后的id
  const [tabSelectedIdList,setTabSelectedIdList] = useState<API.Category[]>([])

  const [form] = Form.useForm();

  const ancestorsHe = (list: any[], id: string, data: string[]) => {
    for (let index = 0; index < list.length; index++) {
      const item = list[index];
      data.push(item.id);
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

  const columns: ProColumns<GithubIssueItem1>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '题目名称',
      dataIndex: 'name',
      // search: false,
      render:(text,item)=>{
        return <a onClick={()=>this.getSchoolQuestion(item.id)}>{text}</a>
      }
    },
    {
      title: '题目类型',
      // search: false,
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
      title: '题目答案',
      ellipsis: true,
      width:150,
      dataIndex:'answer',
      search: false,
    },

    {
      title: '来源',
      dataIndex:'source',
      // 直接写死  1-个人题库；2-公共题库；3-文丰题库
      valueEnum:{
        1:'个人题库',
        2:'公共题库',
        3:'文丰题库'
      }
    },
    {
      title: '难易度',
      dataIndex: 'difficultyValue',
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
      title: '查重状态',
      // search: false,
      dataIndex: 'repeatState',
      // 直接写死  重复-1，正常-0
      valueEnum:{
        1:'重复',
        0:'正常'
      }
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
    {
      title: '查重状态',
      search: false,
      dataIndex: 'alias1',
    },
    {
      title: '组卷次数',
      search: false,
      dataIndex:'count'
    },
    {
      title: '更新时间',
      search: false,
      dataIndex:'updateTime'
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      width: 150,
      render: (text, record) => [
        <a onClick={()=>getSchoolQuestion(record.id)} key="view">查看</a>,
        <a key="update">修改</a>,
        <a key="del" onClick={()=>delItem(record.id)}>删除</a>
    ],
    },
  ];

  // 删除数据
  const delItem= async (id: string)=>{
    if(!id && !tabSelectedIdList.length){
      message.error('请选择需要删除的内容')
      return ;
    }

    confirm({
      content: '确认要删除选中数据？',
      async onOk() {
        // 如果id 有值，优先删除id
        let delId = id
        if(!id){
          delId = tabSelectedIdList.join(',')
        }
        const res = await request('/web/schoolQuestion/'+delId,{
          method:'DELETE'
        })
        if(res && res.code === 200){
          message.success('删除成功！')
          this.getDataList()
        }else{
          message.error(res.msg)
        }
      },
      onCancel() {

      },
    });
  }

  /** 请求列表数据 **/
  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    return {
      total: 0,
      data: [],
      success: false,
    };
    // todo  需要拿到知识点的信息才能对列表渲染，否则直接返回空
    const res = await request<{
      code: number;
      data: {
        list: GithubIssueItem1[];
        total: number;
      };
    }>('/web/schoolChapter/list', {
      method: 'GET',
      params: {
        ...datas,
        // parentId,
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
    const res = await request<API.NameIdType>('/web/schoolKnowledge/tree', {
      method: 'GET',
      params: {
        parentId,
        subjectId: subjectId ? subjectId : form.getFieldValue('subjectId') || undefined,
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
    // console.log(val);
    setTreeData([{ title: '知识点', key: '0', id: '0' }]);
    if (radioValue === '1') {
      getSchoolChapter('0');
    } else {
      if (!subjectId) {
        setTeachingMaterial([]);
        return;
      }
      // console.log(subjectId,"-------------")
      const res = await request<API.NameIdType>('/web/schoolTeach/teachSelect', {
        method: 'GET',
        params: {
          subjectId: subjectId,
        },
      });
      // console.log(res.data,"-----------------------------")
      if (res && res.code === 200 && res.data) {
        setTeachingMaterial(res.data);
      }
    }
  };

  // 获取查看题目详情接口
  const getSchoolQuestion=async (id: string) => {
    if(!id){
      message.error("id不能为空")
      return;
    }
    // todo 有问题，没法拉到数据 ，详情弹框未对接
    const res = await request(`/web/schoolQuestion/${id}`,{
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if(res && res.code === 200 && res.data){
      setDetailDb(res.data)
      setDetailVisible(true)
    }else{
      message.error(res.msg)
    }
  }


  useEffect(() => {
    majorSelectCh();
  }, []);

  return (
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
              setRadioValue(e.target.value);
              subjectSelectCh(form.getFieldValue('categoryId'));
            }}
            style={{ margin: '0 0 10px 0' }}
          >
            <Radio.Button value="1">知识点</Radio.Button>
            <Radio.Button value="2">教材</Radio.Button>
          </Radio.Group>
          {radioValue === '2' ? (
            <Form.Item name="teachingMaterial">
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
        <p>知识点</p>
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
            // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
            // 注释该行则默认不显示下拉选项
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
            onChange: (val) => {
              console.log(val, '-----------------------------选择的id--')
              setTabSelectedIdList(val)
            },
          }}
          scroll={{ x: 1300 }}
          dateFormatter="string"
          toolBarRender={() => [
            <Button key="button" type="primary" onClick={()=>{history.push('/question/subject/add')}}>新增</Button>,
            <Button key="button" type="primary" onClick={()=>delItem()}>删除</Button>,
            <Button key="button" type="primary">导出</Button>,
            <Button key="button" type="primary">导入 </Button>
          ]}
        />
      </div>

      <Modal
      title="查看"
      visible={detailVisible}
      onOk={()=>setDetailVisible(false)}
      onCancel={()=>{setDetailVisible(false)}}
      footer={null}
      >
        <div className='detailVisibleModal'>
          <div className='item'>
            <span className='title'>题目类型</span>
            <span className='con'>单选题</span>
          </div>
          <div className='item'>
            <span className='title'>题干</span>
            <span className='con'>单选题11111</span>
          </div>
          <div className='item'>
            <span className='title'>正确答案</span>
            <span className='con'>单选题11111</span>
          </div>
          <div className='item'>
            <span className='title'>题目解析</span>
            <span className='con'>单选题11111</span>
          </div>

          <Button type="primary" className='closeBtn' onClick={()=>setDetailVisible(false)}>关闭</Button>
        </div>
      </Modal>
    </div>
  );
};
