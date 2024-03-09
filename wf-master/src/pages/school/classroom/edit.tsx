/* eslint-disable @typescript-eslint/no-use-before-define */
import { Card, Col, Row, message, Button, Form, Select, Checkbox } from 'antd';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import ProForm, {
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormDatePicker,
  ProFormSwitch,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';

import styles from './style.less';

import request from '@/utils/umi-request';
import { Link, history } from 'umi';
import { DataSourceType, SchoolTeacher, CategorSelectyMajor, DataList } from './data';
import { RangePickerProps } from 'antd/lib/date-picker';
import moment from 'moment';

const { Option } = Select;

const AdvancedForm: FC<Record<string, any>> = (props) => {
  const [loadings, setLoadings] = useState<boolean>(false);
  const [form] = Form.useForm();

  const [schoolList, setSchoolList] = useState<API.ProFormSelectType[]>([]); // 学校数据
  const [schoolGradeList, setSchoolGradeList] = useState<{ name: string; id: string }[]>([]); // 年级数据
  const [nationTypeList, setNationTypeList] = useState<API.ProFormSelectType[]>([]); // 民族数据
  const [studentType, setStudentType] = useState<API.ProFormSelectType[]>([]); // 学生类型数据

  const [postList, setPostList] = useState<API.ProFormSelectType[]>([]); // 职务列表
  const [categorSelectyMajor, setCategorSelectyMajor] = useState<CategorSelectyMajor[]>([]); // 专业数据

  const [schoolTeacher, setSchoolTeacher] = useState<SchoolTeacher>({}); // 详情数据
  // const [roleList, setRoleList] = useState<API.ProFormSelectType[]>([]); // 角色列表
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '职务',
      key: 'jobId',
      dataIndex: 'jobId',
      renderFormItem: (text) => {
        return (
          <Select key={text.index + 'jobId'} allowClear placeholder="请选择职务">
            {postList.map((item) => {
              return (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '任职年级',
      key: 'gradeId',
      dataIndex: 'gradeId',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      renderFormItem: (text) => {
        return (
          <Select
            key={text.index + 'gradeId'}
            allowClear
            placeholder="请选择任职年级"
            onChange={async (val) => {
              const res = await request<DataList>('/web/schoolClass/list', {
                method: 'GET',
                params: {
                  pageNum: 1,
                  pageSize: 1000,
                  gradeId: val,
                },
              });
              if (res && res.code === 200) {
                const lists = form.getFieldValue('jobList');
                // console.log(lists, '============================');
                const idx = text.index || 0;
                lists[idx].classLists = res.data.list;
                lists[idx].classIds = undefined;
                form.setFieldsValue({
                  jobList: lists,
                  classIds: undefined,
                });
                if (res.data.list.length === 0) {
                  message.warning('该年级没有任职班级数据');
                }
              }
            }}
          >
            {schoolGradeList.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '任职班级',
      dataIndex: 'classIds',
      renderFormItem: (text, row) => {
        let disabled = false;
        if (row.record && row.record.jobId) {
          let objs = postList.find((item) => item.value == row.record?.jobId);
          if (
            objs?.label === '专业主任' ||
            objs?.value === '3670b52e4183473eb1f2b44f3660521b' ||
            objs?.label === '年级主任' ||
            objs?.value === '30934cff5dbc4d5eb46b662604b9cd91'
          ) {
            disabled = true;
          }
        } else {
          disabled = true;
        }
        // console.log(text, row, '----------------------');
        let classLists = row.record ? row.record.classLists || [] : [];
        classLists = classLists.map((item: { name: string; id: string }) => {
          return {
            ...item,
            label: item.name,
            value: item.id,
          };
        });
        // console.log(classLists, '-------------------');
        return <Checkbox.Group disabled={disabled} options={classLists} />;
      },
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
    },
    {
      title: '任职专业',
      key: 'majorId',
      dataIndex: 'majorId',
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      renderFormItem: (text, row) => {
        let disabled = false;
        if (row.record && row.record.jobId) {
          let objs = postList.find((item) => item.value == row.record?.jobId);
          if (
            objs?.label === '班主任' ||
            objs?.value === '53a2fe50d80e4eeca26dc0fff20b04b8' ||
            objs?.label === '年级主任' ||
            objs?.value === '30934cff5dbc4d5eb46b662604b9cd91'
          ) {
            disabled = true;
          }
        } else {
          disabled = true;
        }
        return (
          <Select
            key={text.index + 'majorId'}
            allowClear
            disabled={disabled}
            placeholder="请选择任职专业"
            onChange={async (val) => {
              if (!val) {
                return;
              }
              const objs = categorSelectyMajor.find((item) => item.id === val);
              const res = await request<API.NameIdType>('/web/schoolSubject/subjectSelect', {
                method: 'GET',
                params: {
                  categoryId: objs ? objs.categoryId : undefined,
                  majorId: objs ? objs.id : undefined,
                },
              });
              if (res && res.code === 200) {
                const lists = form.getFieldValue('jobList');
                // console.log(lists, '============================');
                const idx = text.index || 0;
                lists[idx].subjectLists = res.data;
                lists[idx].subjectId = undefined;
                form.setFieldsValue({
                  jobList: lists,
                });
              }
            }}
          >
            {categorSelectyMajor.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '任职学科',
      key: 'subjectId',
      dataIndex: 'subjectId',
      valueType: 'select',
      formItemProps: () => {
        return {
          rules: [{ required: true, message: '此项为必填项' }],
        };
      },
      renderFormItem: (text, row) => {
        let disabled = false;
        if (row.record && row.record.jobId) {
          let objs = postList.find((item) => item.value == row.record?.jobId);
          if (
            objs?.label === '班主任' ||
            objs?.value === '53a2fe50d80e4eeca26dc0fff20b04b8' ||
            objs?.label === '年级主任' ||
            objs?.value === '30934cff5dbc4d5eb46b662604b9cd91'
          ) {
            disabled = true;
          }
        } else {
          disabled = true;
        }
        const subjectLists = row.record ? row.record.subjectLists || [] : [];
        return (
          <Select
            key={text.index + 'subjectId'}
            allowClear
            disabled={disabled}
            placeholder="请选择任职学科"
          >
            {subjectLists.map((item) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '职务操作',
      valueType: 'option',
      width: 80,
      fixed: 'right',
    },
  ];

  const onFinish = async (values: Record<string, any>) => {
    console.log(values, '------------------------');
    const jobList = values.jobList.map(
      (item: {
        subjectId: string;
        jobId: string;
        gradeId: string;
        majorId: string;
        classIds: string;
      }) => {
        return {
          jobId: item.jobId, //职务id
          gradeId: item.gradeId, //任职年级id
          majorId: item.majorId, //任职学科id
          classIds: item.classIds ? item.classIds.toString() : undefined,
          subjectId: item.subjectId,
        };
      },
    );
    let picker = undefined;
    if (values.picker) {
      picker = values.picker[0].picker.replace('/question-api', '');
    }
    const data = {
      ...values,
      picker,
      isMarking: values.isMarking ? 1 : 0,
      isProposition: values.isProposition ? 1 : 0,
      jobList,
      id: schoolTeacher.id,
      // roleId: values.roleId.toString(),
      version: schoolTeacher.version,
    };
    if (loadings) return;
    setLoadings(true);
    const res = await request<API.GeneralInterface>('/web/schoolTeacher', {
      method: 'PUT',
      data: data,
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      history.push('/school/classroom');
    } else {
      message.error(res.msg);
    }
    setLoadings(false);
  };

  /** 专业数据 **/
  const getCategorSelectyMajor = async () => {
    const res = await request<{
      code: number;
      data: CategorSelectyMajor[];
    }>('/web/schoolMajor/findAllMajor', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
      },
    });
    if (res && res.code === 200) {
      setCategorSelectyMajor(res.data);
    }
  };

  /** 年级数据 **/
  const getSchoolGradeList = async () => {
    const res = await request<API.NameIdType>('/web/schoolGrade/gradeSelect', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setSchoolGradeList(res.data || []);
    }
  };

  /** 学校下拉接口 **/
  const getSchoolSelect = async () => {
    const res = await request<API.NameIdType>('/web/schoolDetails/schoolSelect', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setSchoolList(list);
    }
  };

  /** 数据字典列表 **/
  const getDictDataPage = async (it: {
    dictType: string;
    data: (arg0: { label: string; value: string }[]) => void;
  }) => {
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
      const list = res.data.list.map((item) => {
        return {
          label: item.dictLabel,
          value: item.id,
        };
      });
      it.data(list);
    }
  };
  /** 请求详情数据 **/
  const getSchoolTeacher = async () => {
    const res = await request('/web/schoolTeacher/' + props.match.params.id, {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setSchoolTeacher(res.data);
      form.setFieldsValue({
        ...res.data,
        jobList: res.data.jobList ? res.data.jobList : [],
        isMarking: res.data.isMarking == 1 ? true : false,
        isProposition: res.data.isProposition == 1 ? true : false,
        picker: res.data.picker
          ? [
              {
                status: 'done',
                picker: `/question-api${res.data.picker}`,
                url: `/question-api${res.data.picker}`,
              },
            ]
          : undefined,
        // roleId: res.data.roleId.split(','),
      });
    }
  };

  /** 请求职务数据 **/
  const schoolTeacherJob = async () => {
    const res = await request<API.NameIdType>('/web/schoolTeacherJob/list', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
        teacherId: props.match.params.id,
      },
    });
    if (res && res.code === 200 && res.data) {
      // const list = res.data.map((item) => {
      //   return {
      //     label: item.name,
      //     value: item.id,
      //   };
      // });
      // setSchoolList(list);
    }
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current > moment().endOf('day');
  };

  useEffect(() => {
    // getRoleList();
    getSchoolSelect();
    getSchoolGradeList();
    getCategorSelectyMajor();
    schoolTeacherJob();
    const list = [
      {
        dictType: 'nation_type',
        data: setNationTypeList,
      },
      {
        dictType: 'student_type',
        data: setStudentType,
      },
      {
        dictType: 'post_type',
        data: setPostList,
      },
    ];

    list.forEach((item) => {
      getDictDataPage(item);
    });
    getSchoolTeacher();
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
                // rules={[
                //   {
                //     required: true,
                //     message: '图片上传为必填项',
                //   },
                // ]}
                max={1}
                fieldProps={{
                  name: 'file',
                  listType: 'picture-card',
                  headers: {
                    // Authorization: `Bearer ${localStorage.getItem('headers_token')}`,
                  },
                }}
                action="/question-api/common/upload"
                onChange={handleChange}
              />
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="性别"
                  rules={[{ required: true, message: '请选择性别' }]}
                  name="sex"
                  options={[
                    { label: '未知', value: 0 },
                    { label: '男', value: 1 },
                    { label: '女', value: 2 },
                  ]}
                />
              </Col>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label="联系电话"
                  name="phone"
                  rules={[
                    { required: true, message: '请输入联系电话' },
                    { pattern: new RegExp(/^[1][3-9][\d]{9}$/), message: '请输入正确的联系电话' },
                  ]}
                  placeholder="请输入联系电话"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="身份证号"
                  name="idCard"
                  rules={[
                    { required: true, message: '请输入身份证号' },
                    {
                      pattern: new RegExp(/(^\d{18}$)|(^\d{17}(\d|X|x)$)/, 'g'),
                      message: '请输入正确的身份证号',
                    },
                  ]}
                  placeholder="请输入身份证号"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="民族"
                  rules={[{ required: true, message: '请选择民族' }]}
                  options={nationTypeList}
                  name="nation"
                  placeholder="请选择民族"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormDatePicker
                  label="出生年月"
                  rules={[{ required: true, message: '请选择出生年月' }]}
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
                    { required: true, message: '请输入邮箱' },
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
                  label="登录账号"
                  name="account"
                  rules={[{ required: true, message: '请输入登录账号' }]}
                  placeholder="请输入登录账号"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="微信"
                  name="wechat"
                  rules={[{ required: true, message: '请输入微信号' }]}
                  placeholder="请输入微信号"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="登录密码"
                  name="password"
                  // rules={[{ required: true, message: '请输入登录密码' }]}
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
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="现住地址"
                  name="site"
                  rules={[{ required: true, message: '请输入现住地址' }]}
                  placeholder="请输入现住地址"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="爱好"
                  name="hobby"
                  // rules={[{ required: true, message: '请输入爱好' }]}
                  placeholder="请输入爱好"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormDatePicker
                  label="入职日期"
                  rules={[{ required: true, message: '请选择入职日期' }]}
                  name="inductionTime"
                  placeholder="请选择入职日期"
                  fieldProps={{
                    disabledDate: disabledDate,
                  }}
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="类型"
                  rules={[{ required: true, message: '请选择类型' }]}
                  options={studentType}
                  name="type"
                  placeholder="请选择类型"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormDatePicker
                  label="离职日期"
                  // rules={[{ required: true, message: '请选择离职日期' }]}
                  name="quitTime"
                  placeholder="请选择离职日期"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormDatePicker
                  label="工作年份"
                  // rules={[{ required: true, message: '请选择工作年份' }]}
                  name="workTime"
                  placeholder="请选择工作年份"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormTextArea label="备注信息" name="remark" placeholder="请输入备注信息" />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="排序"
                  name="order"
                  rules={[{ required: true, message: '' }]}
                  placeholder=""
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <Row>
                  <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                    <ProFormSwitch label="阅卷老师" name="isMarking" />
                  </Col>
                  <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                    <ProFormSwitch label="命题老师" name="isProposition" />
                  </Col>
                </Row>
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="状态"
                  rules={[{ required: true, message: '请选择状态' }]}
                  options={[
                    { label: '正常', value: '1' },
                    { label: '关闭', value: '0' },
                  ]}
                  name="status"
                  placeholder="请选择状态"
                />
              </Col>
              <Col lg={24} md={24} sm={24}>
                <ProForm.Item
                  label="职务"
                  name="jobList"
                  trigger="onValuesChange"
                  //   rules={[{ required: true, message: '请添加职务' }]}
                >
                  <EditableProTable<DataSourceType>
                    rowKey="id"
                    toolBarRender={false}
                    columns={columns}
                    recordCreatorProps={{
                      newRecordType: 'dataSource',
                      position: 'bottom',
                      record: () => ({
                        id: Date.now(),
                      }),
                    }}
                    editable={{
                      type: 'multiple',
                      actionRender: (row, _, dom) => {
                        return [dom.delete];
                      },
                    }}
                  />
                </ProForm.Item>
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
              <Link to="/school/classroom">
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
