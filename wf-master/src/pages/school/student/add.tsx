import { Card, Col, Row, message, Button, Form, Select } from 'antd';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';

import styles from './style.less';

import request from '@/utils/umi-request';
import { Link, history } from 'umi';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';
const { Option } = Select;

const AdvancedForm: FC<Record<string, any>> = () => {
  const [loadings, setLoadings] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [schoolList, setSchoolList] = useState<API.ProFormSelectType[]>([]); // 学校数据
  const [schoolGradeList, setSchoolGradeList] = useState<API.ProFormSelectType[]>([]); // 年级数据
  const [majorSelect, setMajorSelect] = useState<API.Category[]>([]); // 专业数据
  const [schoolClassList, setSchoolClassList] = useState<API.ProFormSelectType[]>([]); // 班级数据

  const [nationTypeList, setNationTypeList] = useState<API.ProFormSelectType[]>([]); // 民族数据
  const [graduationType, setGraduationType] = useState<API.ProFormSelectType[]>([]); // 毕业类型数据

  const [studentType, setStudentType] = useState<API.ProFormSelectType[]>([]); // 学生类型数据

  const onFinish = async (values: Record<string, any>) => {
    // console.log(values, '------------------------');
    // return;
    if (loadings) return;
    setLoadings(true);
    const picker = values.picker && values.picker.length ? values.picker[0].picker : undefined;
    const res = await request<API.GeneralInterface>('/web/schoolStudent', {
      method: 'POST',
      data: {
        ...values,
        picker,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      history.push('/school/student');
    } else {
      message.error(res.msg);
    }
    setLoadings(false);
  };

  /** 专业数据 **/
  const provinceChange = async () => {
    const res = await request<{
      code: number;
      msg?: string;
      data: API.Category[];
    }>('/web/schoolMajor/findAllMajor', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setMajorSelect(res.data);
    }
  };

  /** 班级数据 **/
  const getSchoolClassList = async () => {
    const res = await request<{
      code: number;
      data?: {
        list: API.Category[];
      };
    }>('/web/schoolClass/list', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
      },
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.list.map((item: { name?: string; id?: string }) => {
        return {
          label: item.name || '',
          value: item.id || '',
        };
      });
      setSchoolClassList(list);
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

  /** 数据字典列表 **/
  const getDictDataPage = async (it: { dictType: string; data: (arg0: any) => void }) => {
    const res = await request<{
      code: number;
      data?: {
        list: { dictLabel: string; id: string }[];
      };
    }>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
        dictType: it.dictType,
      },
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.list.map((item: { dictLabel: string; id: string }) => {
        return {
          label: item.dictLabel,
          value: item.id,
        };
      });
      it.data(list);
    }
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  useEffect(() => {
    getSchoolSelect();
    getSchoolGradeList();
    getSchoolClassList();
    provinceChange();
    const list = [
      {
        dictType: 'nation_type',
        data: setNationTypeList,
      },
      {
        dictType: 'graduation_type',
        data: setGraduationType,
      },
      {
        dictType: 'student_type',
        data: setStudentType,
      },
    ];

    list.forEach((item) => {
      getDictDataPage(item);
    });
  }, []);

  const handleChange = (info: { file: any; fileList: any }) => {
    let fileList = [...info.fileList];
    // console.log(info, '----------------');
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        fileList = fileList.slice(-1);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fileList = fileList.map((file) => {
          if (file.response) {
            file.picker = file.response.fileName;
          }
          return file;
        });
      } else if (info.fileList && info.fileList.length) {
        message.error(info.file.response.msg || '上传失败！');
        info.fileList = [];
      }
    } else if (info.file.status === 'error' && info.fileList.length) {
      message.error(info.file.response.msg || '上传失败！');
      info.fileList = [];
    }
  };
  return (
    <ProForm layout="vertical" form={form} hideRequiredMark submitter={false} onFinish={onFinish}>
      <PageContainer>
        <Card title="" className={styles.card} bordered={false}>
          <div className="padding40">
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label="姓名"
                  name="name"
                  rules={[{ required: true, message: '请输入姓名' }]}
                  placeholder="请输入姓名"
                />
              </Col>
              <ProFormUploadButton
                name="picker"
                label="用户头像"
                
                max={1}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                }}
                action="/question-api/common/upload"
                onChange={handleChange}
              />
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="性别"
                  options={[
                    { label: '未知', value: 0 },
                    { label: '男', value: 1 },
                    { label: '女', value: 2 },
                  ]}
                  name="sex"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="民族"
                  options={nationTypeList}
                  name="nation"
                  placeholder="请选择民族"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="身份证号"
                  name="idCard"
                  rules={[
                    {
                      pattern: new RegExp(/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, 'g'),
                      message: '请输入正确的身份证号',
                    },
                  ]}
                  placeholder="请输入身份证号"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormDatePicker
                  label="出生年月"
                  name="birthday"
                  placeholder="请选择出生年月"
                  fieldProps={{
                    disabledDate: disabledDate,
                  }}
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormText
                  label="邮箱"
                  rules={[
                    {
                      pattern: new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/),
                      message: '请输入正确企业邮箱',
                    },
                  ]}
                  name="mail"
                  placeholder="请输入邮箱"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="文丰学号"
                  name="schoolNumber"
                  placeholder="请输入文丰学号"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="微信"
                  name="wechat"
                  placeholder="请输入微信号"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="登录密码"
                  name="password"
                  rules={[{ required: true, message: '请输入登录密码' }]}
                  placeholder="请输入登录密码"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="学校"
                  rules={[{ required: true, message: '请选择学校' }]}
                  options={schoolList}
                  name="schoolId"
                  placeholder="请选择学校"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="年级"
                  rules={[{ required: true, message: '请选择年级' }]}
                  options={schoolGradeList}
                  name="gradeId"
                  placeholder="请选择年级"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="现住地址"
                  name="site"
                  placeholder="请输入现住地址"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProForm.Item
                  label="专业"
                  name="majorId"
                  rules={[{ required: true, message: '专业为必填' }]}
                >
                  <Select allowClear placeholder="选择专业">
                    {majorSelect.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </ProForm.Item>
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="爱好特长"
                  name="hobby"
                  placeholder="请输入爱好特长"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="班级"
                  rules={[{ required: true, message: '请选择班级' }]}
                  options={schoolClassList}
                  name="classId"
                  placeholder="请选择班级"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="家长姓名"
                  name="parentName"
                  placeholder="请输入家长姓名"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="类型"
                  options={studentType}
                  name="type"
                  placeholder="请选择类型"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="家长电话"
                  name="parentPhone"
                  rules={[
                    { pattern: new RegExp(/^[1][3-9][\d]{9}$/), message: '请输入正确的家长电话' },
                  ]}
                  placeholder="请输入家长电话"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="毕业类型"
                  options={graduationType}
                  name="graduationType"
                  placeholder="请选择毕业类型"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormDatePicker
                  label="入学日期"
                  rules={[{ required: true, message: '请选择入学日期' }]}
                  name="enterTime"
                  placeholder="请选择入学日期"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormTextArea label="备注信息" name="remark" placeholder="请输入备注信息" />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormDatePicker
                  label="毕业日期"
                  name="overTime"
                  placeholder="请选择毕业日期"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="准考证号"
                  name="admissionNumber"
                  placeholder="请输入准考证号"
                  rules={[
                    { pattern: new RegExp(/^[0-9]+[0-9]*$/), message: '请输入正确的准考证号' },
                  ]}
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="学籍号"
                  name="studentNumber"
                  placeholder="请输入学籍号"
                />
              </Col>
            </Row>
          </div>
          <Row gutter={16}>
            <Col lg={24} md={24} sm={24} style={{ textAlign: 'center' }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={loadings}
                style={{ marginRight: '20px' }}
              >
                提交
              </Button>
              <Link to="/school/School">
                <Button>返回</Button>
              </Link>
            </Col>
          </Row>
        </Card>
      </PageContainer>
    </ProForm>
  );
};

export default AdvancedForm;
