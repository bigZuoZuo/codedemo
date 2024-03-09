/* eslint-disable @typescript-eslint/no-use-before-define */
import {
  Card,
  Col,
  Row,
  message,
  Button,
  Form,
  Select,
  Popconfirm,
  Input,
  notification,
} from 'antd';
import type { FC, Key } from 'react';
import { useState, useEffect } from 'react';
import ProForm, { ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';

import styles from './style.less';

import request from '@/utils/umi-request';
import { Link, history } from 'umi';
import { DataSourceType, NameCode } from './data';
import { totalNumber } from './utils';

const { Option } = Select;

const AdvancedForm: FC<Record<string, any>> = () => {
  const [loadings, setLoadings] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => {
    const list = form.getFieldValue('examInfoList') || [];
    return list.map((item: { id: string | number }) => item.id);
  });
  const [provinceList, setProvinceList] = useState<NameCode[]>([]); // 省
  const [cityList, setCityList] = useState<NameCode[]>([]); // 市
  const [districtList, setDistrictList] = useState<NameCode[]>([]); // 区
  const [dictTypeList, setDictTypeList] = useState<API.ProFormSelectType[]>([]); // 数据字典
  const [schoolList, setSchoolList] = useState<{ name: string; id: string }[]>([]); // 学校数据

  const [columns, setColumns] = useState<ProColumns<DataSourceType>[]>([
    {
      title: '学年',
      key: 'year',
      dataIndex: 'year',
      valueType: 'select',
      valueEnum: {},
    },
    {
      title: '参加考人数',
      dataIndex: 'examinationCount',
      valueType: 'digit',
    },
    {
      title: '机械类',
      dataIndex: 'machinery',
      valueType: 'digit',
    },
    {
      title: '财经类',
      dataIndex: 'business',
      valueType: 'digit',
    },
    {
      title: '计算机类',
      dataIndex: 'computer',
      valueType: 'digit',
    },
    {
      title: '旅游类',
      dataIndex: 'tourist',
      valueType: 'digit',
    },
    {
      title: '农学类',
      dataIndex: 'agronomy',
      valueType: 'digit',
    },
    {
      title: '护理专业',
      dataIndex: 'nursingProfession',
      valueType: 'digit',
    },
    {
      title: '电气电子类',
      dataIndex: 'electrical',
      valueType: 'digit',
    },
    {
      title: '建筑技术类',
      dataIndex: 'constructionTechnology',
      valueType: 'digit',
    },
    {
      title: '汽车维修类',
      dataIndex: 'autoMaintenance',
      valueType: 'digit',
    },
    {
      title: '学前教育类',
      dataIndex: 'preschoolEducation',
      valueType: 'digit',
    },
    {
      title: '合计上线人数',
      dataIndex: 'fraction',
      readonly: true,
      key: 'fraction',
      renderFormItem: (text, record) => {
        let number = totalNumber(record.recordKey);
        return number;
      },
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id || '');
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="popconfirm"
          title={`删除此行？`}
          onConfirm={() => {
            // console.log(record.id, '-----------------------');
            const dataList = form.getFieldValue('examInfoList') || [];
            let index: number | undefined = undefined;
            // console.log(dataList, '-----------------------------');
            dataList.forEach((item: { id: string }, idx: number) => {
              if (item.id === record.id) {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                index = idx;
              }
            });
            if (index == undefined) return;
            dataList.splice(index, 1);
            form.setFieldsValue({
              examInfoList: dataList,
            });
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ]);

  /** 学年数据 **/
  const dataPage = async () => {
    const res = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
        dictType: 'school_year',
      },
    });
    if (res && res.code === 200 && res.data) {
      const list = {};
      res.data.list.forEach((item: { dictLabel?: string; id?: string }) => {
        list[item.dictLabel || ''] = item.dictLabel;
      });
      const columnss = [...columns];
      columnss[0].valueEnum = list;
      setColumns(columnss);
    }
  };

  const onFinish = async (values: Record<string, any>) => {
    // if (loadings) return;
    setLoadings(true);
    // console.log(values, '------------------------');
    // return;
    const examInfoList = values.examInfoList.map((item: any) => {
      return {
        ...item,
        id: undefined,
        fraction: totalNumber(item),
      };
    });
    const res = await request<API.GeneralInterface>('/web/schoolDetails', {
      method: 'POST',
      data: {
        ...values,
        examInfoList,
        viewSchoolId: values.viewSchoolId ? values.viewSchoolId.toString() : undefined,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      history.push('/school/School');
    } else {
      message.error(res.msg);
    }
    setLoadings(false);
  };

  /** 省下拉框选择触发事件 **/
  const provinceChange = async (val: string) => {
    form.setFieldsValue({
      cityCode: undefined,
      districtCode: undefined,
    });
    const list = await getRoleList(val);
    setCityList(list);
    setDistrictList([]);
  };
  /** 市下拉框选择触发事件 **/
  const cityChange = async (val: string) => {
    form.setFieldsValue({
      districtCode: undefined,
    });
    const list = await getRoleList(val);
    setDistrictList(list);
  };

  /** 市、区、县下拉 **/
  const getRoleList = async (id: string | undefined) => {
    const res = await request<{
      code: number;
      data: NameCode[];
    }>('/web/schoolRegion/citySelect', {
      method: 'GET',
      params: {
        parentId: id,
      },
    });
    if (res && res.code === 200) {
      return res.data;
    }
    return [];
  };

  /** 省级数据 **/
  const getProvinceSelectList = async () => {
    const res = await request<{
      code: number;
      data: NameCode[];
    }>('/web/schoolRegion/provinceSelect', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setProvinceList(res.data);
    }
  };

  /** 字典列表 **/
  const getDictTypeList = async () => {
    const res = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
        dictType: 'school_type',
      },
    });
    if (res && res.code === 200) {
      const list = res.data.list.map((item: { dictLabel?: string; id?: string }) => {
        return {
          label: item.dictLabel || '',
          value: item.id || '',
        };
      });
      setDictTypeList(list);
    }
  };

  /** 学校下拉接口 **/
  const getSchoolSelect = async () => {
    const res = await request<API.NameIdType>('/web/schoolDetails/schoolSelect', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      setSchoolList(res.data || []);
    }
  };

  useEffect(() => {
    getSchoolSelect();
    getProvinceSelectList();
    getDictTypeList();
    dataPage();
  }, []);

  return (
    <ProForm layout="vertical" form={form} hideRequiredMark submitter={false} onFinish={onFinish}>
      <PageContainer>
        <Card title="" className={styles.card} bordered={false}>
          <div className="padding40">
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label="学校名称"
                  name="schoolName"
                  rules={[{ required: true, message: '请输入学校名称' }]}
                  placeholder="请输入学校名称"
                />
              </Col>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label="学校简称"
                  name="schoolAlias"
                  // rules={[{ required: true, message: '请输入学校简称' }]}
                  placeholder="请输入学校简称"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormText
                  label="学校编号"
                  name="schoolCode"
                  rules={[{ required: true, message: '请输入学校编号' }]}
                  placeholder="请输入学校编号"
                />
              </Col>

              <Col lg={12} md={12} sm={24}>
                <ProForm.Item label="地区选择" style={{ margin: '0px' }}>
                  <Row gutter={20}>
                    <Col lg={8} md={8} sm={8}>
                      <ProForm.Item name="provinceCode" style={{ margin: '0px' }}>
                        <Select allowClear onChange={provinceChange} placeholder="请选择省">
                          {provinceList.map((item) => {
                            return (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </ProForm.Item>
                    </Col>
                    <Col lg={8} md={8} sm={8}>
                      <ProForm.Item name="cityCode" style={{ margin: '0px' }}>
                        <Select allowClear onChange={cityChange} placeholder="请选择市">
                          {cityList.map((item) => {
                            return (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </ProForm.Item>
                    </Col>
                    <Col lg={8} md={8} sm={8}>
                      <ProForm.Item name="districtCode" style={{ margin: '0px' }}>
                        <Select allowClear placeholder="请选择区">
                          {districtList.map((item) => {
                            return (
                              <Option key={item.code} value={item.code}>
                                {item.name}
                              </Option>
                            );
                          })}
                        </Select>
                      </ProForm.Item>
                    </Col>
                  </Row>
                </ProForm.Item>
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormText label="学校地址" name="schoolSite" placeholder="请输入学校地址" />
              </Col>
              <Col lg={12} md={12} sm={24}>
                <ProFormText label="联系人" name="contacts" placeholder="请输入联系人" />
              </Col>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label="固定电话"
                  name="fixedPhone"
                  placeholder="请输入固定电话"
                  rules={[
                    {
                      pattern: new RegExp(/^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/),
                      message: '请输入正确的固定电话',
                    },
                  ]}
                />
              </Col>
              <Col lg={12} md={12} sm={24}>
                <ProFormText
                  label="联系手机"
                  rules={[
                    { pattern: new RegExp(/^[1][3-9][\d]{9}$/), message: '请输入正确的联系手机' },
                  ]}
                  name="telephone"
                  placeholder="请输入联系手机"
                />
              </Col>

              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="学校类型"
                  rules={[{ required: true, message: '请选择学校类型' }]}
                  options={dictTypeList}
                  name="type"
                />
              </Col>
              <Col xl={{ span: 12, offset: 0 }} lg={{ span: 12 }} md={{ span: 12 }} sm={24}>
                <ProForm.Item
                  label="数据分析（匹配学校）"
                  name="viewSchoolId"
                  style={{ margin: '0px' }}
                  // rules={[{ required: true, message: '请选择成绩分析可查看学校数据' }]}
                >
                  <Select allowClear mode="multiple" placeholder="请选择数据分析（匹配学校）">
                    {schoolList.map((item) => {
                      return (
                        <Option key={item.id} value={item.id}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                </ProForm.Item>
              </Col>
              <Col lg={24} md={24} sm={24}>
                <ProForm.Item
                  label="高考信息"
                  name="examInfoList"
                  trigger="onValuesChange"
                  rules={[{ required: true, message: '请添加高考信息' }]}
                >
                  <EditableProTable<DataSourceType>
                    rowKey="id"
                    toolBarRender={false}
                    columns={columns}
                    // scroll={{ x: 2000 }}
                    recordCreatorProps={{
                      newRecordType: 'dataSource',
                      position: 'bottom',
                      record: () => ({
                        id: Date.now(),
                      }),
                    }}
                    editable={{
                      type: 'multiple',
                      editableKeys,
                      onChange: setEditableRowKeys,
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
