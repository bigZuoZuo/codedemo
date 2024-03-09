import { Card, message, Select, Form, Button } from 'antd';
import ProForm, {
  ProFormDatePicker,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import request from '@/utils/umi-request';
import './style.less';
import { Link, history } from 'umi';

import { Major } from './data';

const { Option } = Select;

const BasicForm: FC<Record<string, any>> = (props) => {
  const [form] = Form.useForm();
  const [schoolList, setSchoolList] = useState<API.ProFormSelectType[]>([]); // 学校数据
  const [schoolGradeList, setSchoolGradeList] = useState<API.ProFormSelectType[]>([]); // 年级数据
  const [categorSelectyMajor, setCategorSelectyMajor] = useState<Major[]>([]); // 专业数据
  const [subjectList, setSubjectList] = useState<API.ProFormSelectType[]>([]); // 学科数据
  const [topicTypeList, setTopicTypeList] = useState<API.ProFormSelectType[]>([]); // 题目类型数据
  const [loadings, setLoadings] = useState<boolean>(false);
  const [version, setVersion] = useState<any>(undefined);
  const [schoolOfflineTest, setSchoolOfflineTest] = useState<any[]>([]);

  const onFinish = async (values: Record<string, any>) => {
    // console.log(values, '------');
    // return;
    if (loadings) return;
    setLoadings(true);
    const res = await request<API.GeneralInterface>('/web/schoolOfflineTest/edit', {
      method: 'PUT',
      data: {
        version,
        id: props.match.params.id,
        name: values.name,
        testDate: values.testDate,
        testRelVOList: {
          schoolId: values.schoolId ? values.schoolId.toString() : undefined,
          gradeId: values.gradeId ? values.gradeId.toString() : undefined,
          majorId: values.majorId ? values.majorId.toString() : undefined,
          subjectId: values.subjectId ? values.subjectId.toString() : undefined,
        },
        questionList: values.questionList || undefined,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      history.push('/educational/offline');
    } else {
      message.error(res.msg);
    }
    setLoadings(false);
  };

  /** 学校下拉接口 **/
  const getSchoolSelect = async () => {
    const res = await request<API.NameIdType>('/web/schoolDetails/schoolSelect', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item: { name: string; id: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setSchoolList(list);
    }
  };

  /** 年级数据 **/
  const getSchoolGradeList = async () => {
    const res = await request<API.NameIdType>('/web/schoolGrade/gradeSelect', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item: { name: string; id: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setSchoolGradeList(list);
    }
  };

  /** 请求专业数据 **/
  const getCategorSelectyMajor = async () => {
    const res = await request<{
      code: number;
      data?: Major[];
    }>('/web/schoolMajor/findAllMajor', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setCategorSelectyMajor(res.data || []);
    }
  };

  /** 选择专业触发 **/
  const majorSelectChs1 = async () => {
    const res = await request<API.NameIdType>('/web/schoolSubject/findAllSubject', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item: { name: string; id: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setSubjectList(list);
    }
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
      const list = res.data.list.map((item: { dictLabel?: string; id?: string }) => {
        return {
          label: item.dictLabel || '',
          value: item.id || '',
        };
      });
      setTopicTypeList(list);
    }
  };

  /** 请求详情数据 **/
  const schoolTemplateMajor = async () => {
    const res: any = await request('/web/schoolOfflineTest/' + props.match.params.id, {
      method: 'GET',
    });
    if (res && res.data) {
      setVersion(res.data.version);
      form.setFieldsValue({
        ...res.data,
        schoolId: res.data.testRelVO.schoolId.split(","),
        gradeId: res.data.testRelVO.schoolId.split(","),
        majorId: res.data.testRelVO.schoolId.split(","),
        subjectId: res.data.testRelVO.schoolId.split(","),
      });
    }
  };

  /** 请求题目题号数据 **/
  const getNum = async () => {
    const res = await request('/web/schoolOfflineTest/getNum', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      const list = res.data.map((item: any) => {
        return {
          label: item + '',
          value: item + '',
        };
      });
      setSchoolOfflineTest(list);
    }
  };

  useEffect(() => {
    getSchoolSelect();
    getSchoolGradeList();
    getCategorSelectyMajor();
    getTopicTypeList();
    majorSelectChs1();
    schoolTemplateMajor();
    getNum();
  }, []);

  return (
    <PageContainer>
      <Card bordered={false}>
        <ProForm
          style={{ margin: 'auto', marginTop: 8, maxWidth: 700 }}
          name="basic"
          layout="horizontal"
          onFinish={onFinish}
          form={form}
          submitter={false}
        >
          <ProFormText
            width="md"
            label="考试名称"
            name="name"
            placeholder="给目标起个名字"
            rules={[{ required: true, message: '这是必填项' }]}
          />
          <ProFormDatePicker
            label="考试日期"
            rules={[{ required: true, message: '请选择考试日期' }]}
            name="testDate"
            placeholder="请选择考试日期"
            width={330}
          />
          <ProFormSelect
            label="考试年级"
            rules={[{ required: true, message: '请选择考试年级' }]}
            name="gradeId"
            width={330}
            options={schoolGradeList}
            mode="multiple"
          />
          <ProFormSelect
            label="考试学校"
            rules={[{ required: true, message: '请选择考试学校' }]}
            name="schoolId"
            width={330}
            options={schoolList}
            mode="multiple"
          />
          <Form.Item
            name="majorId"
            label="考试专业"
            rules={[{ required: true, message: '请选择考试专业' }]}
          >
            <Select
              allowClear
              // onChange={(val) => majorSelectChs1(val)}
              placeholder="选择学科"
              style={{ width: '330px' }}
              mode="multiple"
            >
              {categorSelectyMajor.map((item) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>
          <ProFormSelect
            label="考试学科"
            rules={[{ required: true, message: '请选择考试学科' }]}
            name="subjectId"
            width={330}
            options={subjectList}
            mode="multiple"
          />
          <ProFormList
            name="questionList"
            label="试卷题型"
            rules={[
              {
                validator: async (_, value) => {
                  console.log(value);
                  if (value && value.length > 0) {
                    return;
                  }
                  throw new Error('至少要有一项！');
                },
              },
            ]}
            creatorButtonProps={{
              position: 'bottom',
            }}
          >
            <ProFormGroup key="group">
              <ProFormSelect
                label="题目类型"
                rules={[{ required: true, message: '请选择题目类型' }]}
                name="type"
                options={topicTypeList}
                width={200}
              />
              <ProFormSelect
                label="题目题号"
                // rules={[{ required: true, message: '请选择题目题号' }]}
                name="questions"
                options={schoolOfflineTest}
                width={200}
              />
            </ProFormGroup>
          </ProFormList>
          <ProForm.Item style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadings}
              style={{ marginRight: '20px' }}
            >
              提交
            </Button>
            <Link to="/educational/template">
              <Button>返回</Button>
            </Link>
          </ProForm.Item>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
