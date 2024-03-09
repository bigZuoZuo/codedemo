import {
  Card,
  Col,
  Row,
  message,
  Button,
  Form,
  Select,
  Tree,
  Cascader,
  Descriptions,
  Tabs,
} from 'antd';
import type { FC, SetStateAction } from 'react';
import { useState, useEffect } from 'react';
import ProForm, { ModalForm } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import request from '@/utils/umi-request';
import { Link, history } from 'umi';
import './style.less';
import { PlusOutlined } from '@ant-design/icons';
import Currency from './components/currency';
import Fine from './components/fine';
import { CategorSelectyMajor, TreeData } from './data';

const { Option } = Select;
const { TabPane } = Tabs;

const AdvancedForm: FC<Record<string, any>> = (props) => {
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const [loadings, setLoadings] = useState<boolean>(false);
  const [testPaperType, setTestPaperType] = useState<API.ProFormSelectType[]>([]);

  const [subjectSelect, setSubjectSelect] = useState<API.Category[]>([]); // 学科数据
  const [treeData, setTreeData] = useState<TreeData[]>([{ title: '知识点', key: '0', id: '0' }]); // 知识点数据
  const [dataList, setDataList] = useState<any[]>([]);
  const [activeKey, setActiveKey] = useState<any>(0); // tab选中状态
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  const [totalScore, setTotalScore] = useState<number>(0); // 总分数
  const [commonCarry, setCommonCarry] = useState<number>(0); // 共多少题

  const [topicTypeList, setTopicTypeList] = useState<API.DictDataListItem[]>([]); // 题目类型数据
  const [facilityValue, setFacilityValue] = useState<API.DictDataListItem[]>([]); // 难易度数据

  const [version, setVersion] = useState(undefined);

  const onFinish = async () => {
    // console.log(dataList, '------------------------');
    let urls = '';
    let objs: {
      id: string;
      totalScore: number;
      majorVOList?: any[];
      fineList?: any[];
      version?: any;
    } = {
      id: props.match.params.id,
      totalScore: totalScore,
      version: version,
    };
    if (props.match.params.tempType == '0') {
      urls = '/web/schoolTemplateMajor/addCommon';
      objs.majorVOList = dataList;
    } else {
      urls = '/web/schoolTemplateMajor/addFine';
      objs.fineList = dataList;
    }
    if (!commonCarry) {
      message.error('请添加学科和题');
      return;
    }
    // return;
    if (loadings) return;
    setLoadings(true);
    const res = await request<API.GeneralInterface>(urls, {
      method: 'POST',
      data: objs,
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      history.push('/educational/template');
    } else {
      message.error(res.msg);
    }
    setLoadings(false);
  };

  /** 试卷类型列表 **/
  const getTestPaperType = async () => {
    const res = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 200,
        dictType: 'test_paper_type',
      },
    });
    if (res && res.code === 200) {
      const list = res.data.list.map((item: { dictLabel?: string; id?: string }) => {
        return {
          label: item.dictLabel || '',
          value: item.id || '',
        };
      });
      setTestPaperType(list);
    }
  };

  /** 请求学科数据 **/
  const findAllSubject = async () => {
    const res = await request<API.NameIdType>('/web/schoolSubject/findAllSubject', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setSubjectSelect(res.data || []);
    }
  };

  /** 请求详情数据 **/
  const schoolTemplateMajor = async () => {
    const res = await request('/web/schoolTemplateMajor/' + props.match.params.id, {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setVersion(res.data.version);
      // const data = res.data;
      // // console.log(data, '----------------');
      // setDataList(data.majorVOList);
      // setTotalScore(data.totalScore);
    }
  };
  /** 知识点树结构数据 **/
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getSchoolChapter = async (parentId: string, subjectId?: string) => {
    const res = await request<{
      code: number;
      data?: TreeData[];
    }>('/web/schoolKnowledge/tree', {
      method: 'GET',
      params: {
        parentId,
        subjectId: subjectId ? subjectId : form.getFieldValue('subjectId') || undefined,
      },
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item: { id?: string; name?: string }) => {
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
  const updateTreeData = (list: any[], key: React.Key, children: any[]): any[] => {
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

  /** 选择学科触发 **/
  const subjectSelectCh = async () => {
    // console.log(val);
    getSchoolChapter('0');
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onChange = (activeKey: any) => {
    setActiveKey(activeKey);
  };
  const onEdit = (targetKey: any, action: string) => {
    // console.log(targetKey, action, '-------------');
    if (action === 'add') {
      handleModalVisible(true);
    }
  };

  const schoolKnowledge = async (subjectId: string) => {
    const res = await request('/web/schoolKnowledge/knowledgeSelect', {
      method: 'GET',
      params: {
        subjectId,
      },
    });
    // console.log(res, '============');
    if (res && res.code === 200) {
      return res.data;
    }
    return [];
  };
  // 新增学科数据
  const onFinishModal = async (value: any) => {
    // console.log(value, '--------------');
    const obj = subjectSelect.find((item) => item.id === value.subjectId);
    const schoolKnowledgeList = await schoolKnowledge(value.subjectId);
    // console.log(schoolKnowledgeList, '------------------------');
    let list: any = {
      subjectId: value.subjectId,
      subjectName: obj ? obj.name : '',
      key: dataList.length,
    };
    if (props.match.params.tempType == '0') {
      list = {
        ...list,
        score: 0,
        commonList: [
          {
            id: '0',
            type: undefined,
            difficulty: undefined,
            medium: undefined,
            easy: undefined,
            score: undefined,
          },
        ], // 题型数据
        knowledgeList: [], // 选中知识点数据
        knowledgePoints: schoolKnowledgeList || [],
      };
      setCommonCarry(commonCarry + 1);
      // setTotalScore(dataList.length);
    } else {
      list = {
        ...list,
        typeVOList: [],
        knowledgePoints: schoolKnowledgeList || [],
      };
    }
    setDataList([...dataList, list]);
    handleModalVisible(false);
  };

  // 精细知识变化触发
  const fineChange = (val: any) => {
    // console.log(val, '---------------');
    const dataLists = [...dataList];
    dataLists[activeKey].typeVOList = val;
    setDataList(dataLists);
    let totalScore = 0;
    let commonCarry = 0;
    dataLists.forEach((item) => {
      if (item.typeVOList) {
        item.typeVOList.forEach((it: { score: any; counts: any }) => {
          totalScore = totalScore + (it.score || 0);
          commonCarry = commonCarry + (it.counts || 0);
        });
      }
    });
    setTotalScore(totalScore);
    setCommonCarry(commonCarry);
  };

  /** 通用知识点数据变化触发事件 **/
  const currencyChange = (type: string, value: any) => {
    // console.log(type, '===---------------')
    // console.log(value, '++++--------');
    const dataLists = [...dataList];
    dataLists[activeKey][type] = value;
    // console.log(dataLists, '-------------------------');
    setDataList(dataLists);
    let totalScore = 0;
    let commonCarry = 0;
    dataLists.forEach((item) => {
      if (item.commonList) {
        item.commonList.forEach((it: { difficulty: any; medium: any; easy: any; score: any }) => {
          const num = (it.difficulty || 0) + (it.medium || 0) + (it.easy || 0);
          totalScore = totalScore + num * (it.score || 0);
          commonCarry = commonCarry + num;
        });
      }
    });
    setTotalScore(totalScore);
    setCommonCarry(commonCarry);
  };

  /** 请求题目类型数据 **/
  const getTopicTypeList = async () => {
    const res = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
        dictType: 'topic_type',
      },
    });
    if (res && res.code === 200) {
      setTopicTypeList(res.data.list);
    }
  };

  /** 难易度数据 **/
  const getFacilityValue = async () => {
    const res: any = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
        dictType: 'facility_value',
      },
    });
    if (res && res.code === 200) {
      setFacilityValue(res.data.list);
    }
  };

  useEffect(() => {
    getTopicTypeList();
    getTestPaperType();
    findAllSubject();
    schoolTemplateMajor();
    if (props.match.params.tempType == '1') {
      getFacilityValue();
    }
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      form1.resetFields();
    }
  }, [createModalVisible]);

  return (
    <>
      <PageContainer>
        <Card title="" bordered={false}>
          <Row gutter={22}>
            <Col lg={6} md={6} sm={24}>
              <ProForm
                layout="vertical"
                form={form}
                hideRequiredMark
                submitter={false}
                // onFinish={onFinish}
              >
                <div>
                  <Form.Item name="subjectId" label="学科">
                    <Select allowClear onChange={subjectSelectCh} placeholder="选择学科">
                      {subjectSelect.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.name}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                  <p>知识点</p>
                  <div className="set_list_tree">
                    <Tree loadData={onLoadData} treeData={treeData} />
                  </div>
                </div>
              </ProForm>
            </Col>
            <Col lg={18} md={18} sm={24}>
              <div className="set_list_right">
                <Descriptions>
                  <Descriptions.Item label="总计">{commonCarry} 道题</Descriptions.Item>
                  <Descriptions.Item label="总分">{totalScore} 分</Descriptions.Item>
                </Descriptions>
                {dataList.length === 0 ? (
                  <Button
                    icon={<PlusOutlined onClick={() => handleModalVisible(true)} />}
                    size="large"
                  />
                ) : null}
                {dataList.length ? (
                  <div>
                    <Tabs
                      type="editable-card"
                      onChange={onChange}
                      activeKey={activeKey}
                      onEdit={onEdit}
                    >
                      {dataList.map((pane, index) => (
                        <TabPane
                          tab={pane.subjectName || '11'}
                          key={index}
                          closable={pane.closable}
                        >
                          {pane.content}
                        </TabPane>
                      ))}
                    </Tabs>

                    {props.match.params.tempType == '0' ? (
                      <div>
                        <Currency
                          data={dataList[activeKey]}
                          currencyChange={currencyChange}
                          topicTypeList={topicTypeList}
                        />
                      </div>
                    ) : null}
                    {props.match.params.tempType == '1' ? (
                      <div>
                        <Fine
                          data={dataList[activeKey]}
                          fineChange={fineChange}
                          topicTypeList={topicTypeList}
                          facilityValue={facilityValue}
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                loading={loadings}
                style={{ marginRight: '20px' }}
                onClick={onFinish}
              >
                提交
              </Button>
              <Link to="/educational/template">
                <Button>返回</Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </PageContainer>
      <ModalForm
        form={form1}
        title="新增"
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinishModal}
      >
        <Form.Item name="subjectId" label="学科" rules={[{ required: true, message: '选择学科' }]}>
          <Select allowClear placeholder="选择学科">
            {subjectSelect.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </ModalForm>
    </>
  );
};

export default AdvancedForm;
