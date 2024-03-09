import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, Tree, Select, Radio, Table,Modal ,message ,Checkbox  } from 'antd';
import type { ActionType } from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import BraftEditor from 'braft-editor'
import 'braft-editor/dist/index.css'

import './style.less';
import {ProForm} from '@ant-design/pro-form';
import type { DataNode, GithubIssueItem1 } from './data';
import { RequestOptionsType } from '@ant-design/pro-utils';

// 题目类型组件
import TopicSelect from './components/TopicSelect'; // 单选、多选
import TopicJudge from './components/TopicJudge';  // 判断
import TopicCloze from './components/TopicCloze';  // 填空
import TopicSimpleAns from './components/TopicSimpleAns';   // 简答
import TopicRead from './components/TopicRead';  // 阅读理解


const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const BraftEditorControls = ['font-size','line-height','text-color','bold','italic','underline','strike-through','hr','list-ul','list-ol','media']

export default () => {
  const actionRef = useRef<ActionType>();
  // const [formData, setFormData] = useState<object>({});
  const [parentId, setParentId] = useState<string>('0'); // 选中章节id
  const [subjectSelect, setSubjectSelect] = useState<API.Category[]>([]); // 学科数据
  const [teachingMaterial, setTeachingMaterial] = useState<API.Category[]>([]); // 教材数据

  const [radioValue, setRadioValue] = useState<string>('1');

  const [treeData, setTreeData] = useState<DataNode[]>([{ title: '知识点', key: '0', id: '0' }]);

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


  useEffect(() => {
    majorSelectCh();
  }, []);



  // 已选知识点
  const options = [];
  for (let i = 0; i < 100000; i++) {
    const value = `${i.toString(36)}${i}`;
    options.push({
      label: value,
      value,
      disabled: i === 10,
    });
  }
  const handleChange = (value: string[]) => {
    console.log(`selected ${value}`);
  };

  // 题型选择
  const [topicType,setTopicType] = useState(6)
  const topicTypeChange = (e: RadioChangeEvent) => {
    // console.log('radio checked', e.target.value);
    setTopicType(e.target.value);
  };

  // 难度选择
  const [topicClass,setTopicClass] = useState(0)
  const topicClassChange = (e: RadioChangeEvent) => {
    // console.log('radio checked', e.target.value);
    setTopicClass(e.target.value);
  };

  // 题目归属
  const [topicOwner,setTopicOwner] = useState(0)
  const topicOwnerChange = (e: RadioChangeEvent) => {
    // console.log('radio checked', e.target.value);
    setTopicOwner(e.target.value);
  };

  // 大题题干
  const [bigTopicTitle ,setBigTopicTitle] = useState("");
  const bigTopicTitleChange = (editorState) => {
    setBigTopicTitle({ editorState })
  }
  const bigTopicTitleSave=()=>{
    console.log(editorState)
  }

  // 题目解析
  const [topicAnalyse ,setTopicAnalyse] = useState("");
  const topicAnalyseChange = (editorState) => {
    setTopicAnalyse({ editorState })
  }
  const topicAnalyseSave=()=>{
    console.log(editorState)
  }

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
        <br />
        <Button type='primary' style={{marginRight:'10px'}}>确定</Button>
        <Button>取消</Button>
      </div>
      <div className="knowledge_list_right addPageKonw_right">
        <div className='saveBox'>
                <Button type='primary'>保存</Button>
        </div>
        <div className='title'>已选知识点（xx个）</div>
        <div className='selectKonwItemBox'>
        <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择知识点"
                defaultValue={[]}
                onChange={handleChange}
                options={options}
              />
        </div>
        <div className='title'>已选章节（xx个）</div>
        <div className='selectKonwItemBox'>
        <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder="请选择章节"
                defaultValue={[]}
                onChange={handleChange}
                options={options}
              />
        </div>

        <div className='checkedBoxItem'>
              <span className='title'>题型选择</span>
              <Radio.Group onChange={topicTypeChange} value={topicType}>
                <Radio value={1}>单选题</Radio>
                <Radio value={2}>多选题</Radio>
                <Radio value={3}>判断题</Radio>
                <Radio value={4}>填空题</Radio>
                <Radio value={5}>简答题（单一）</Radio>
                <Radio value={6}>阅读理解（包含两个以上的小题）</Radio>
                <Radio value={7}>作文题</Radio>
              </Radio.Group>
          </div>
        <div className='checkedBoxItem'>
              <span className='title'>难度选择</span>
              <Radio.Group onChange={topicClassChange} value={topicClass}>
                <Radio value={1}>一般</Radio>
                <Radio value={2}>中等</Radio>
                <Radio value={3}>困难</Radio>
              </Radio.Group>
          </div>
        <div className='checkedBoxItem'>
            <span className='title'>题目归属</span>
            <Radio.Group onChange={topicOwnerChange} value={topicOwner}>
                <Radio value={1}>公共试题库</Radio>
                <Radio value={2}>文丰试题库</Radio>
              </Radio.Group>
          </div>

          {/* 大题题干 */}
          <div className='braftEditorBox'>
            <span className='title'>大题题干</span>
            <BraftEditor
              value={bigTopicTitle}
              onChange={bigTopicTitleChange}
              onSave={bigTopicTitleSave}
              controls={BraftEditorControls}
              className='braftEditor'
            />
          </div>

          {/* 题目解析 */}
          <div className='braftEditorBox'>
            <span className='title'>题目解析</span>
            <BraftEditor
              value={topicAnalyse}
              onChange={topicAnalyseChange}
              onSave={topicAnalyseSave}
              controls={BraftEditorControls}
              className='braftEditor'
            />
          </div>

          {/* 题型组件 */}
          {![7,6].includes(topicType) &&
          <div className='braftEditorBox'>
            <span className='title'>
              {topicType === 5 ? '答案' : '题目选项'}</span>
                {topicType === 1 && <TopicSelect />}
                {topicType === 2 && <TopicSelect />}
                {topicType === 3 && <TopicJudge />}
                {topicType === 4 && <TopicCloze />}
                {topicType === 5 && <TopicSimpleAns />}
          </div>
          }
          {/* 阅读理解 */}
          {topicType === 6 &&
            <div className='braftEditorBox'>
              <TopicRead />
            </div>
          }





      </div>
   </div>
  )


}
