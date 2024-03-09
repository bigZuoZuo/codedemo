import { Card, Col, Row, message, Button, Form } from 'antd';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import ProForm, { ProFormDigit, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';

import request from '@/utils/umi-request';
import { Link, history } from 'umi';
import { GithubIssueItem } from './data';

const AdvancedForm: FC<Record<string, any>> = (props) => {
  const [form] = Form.useForm();

  const [loadings, setLoadings] = useState<boolean>(false);
  const [testPaperType, setTestPaperType] = useState<API.ProFormSelectType[]>([]);

  const onFinish = async (values: GithubIssueItem) => {
    if (loadings) return;
    setLoadings(true);
    // console.log(values, '------------------------');
    // return;
    const res = await request<API.GeneralInterface>('/web/schoolTemplate/add', {
      method: 'POST',
      data: {
        status: '0',
        userType: '1',
        ...values,
      },
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
  /** 请求详情数据 **/
  const schoolTemplateMajor = async () => {
    const res = await request<{
      code: number;
      data?: GithubIssueItem;
    }>('/web/schoolTemplateMajor/' + props.match.params.id, {
      method: 'GET',
    });
    if (res && res.data) {
      form.setFieldsValue(res.data);
    }
  };

  useEffect(() => {
    getTestPaperType();
    schoolTemplateMajor();
  }, []);

  return (
    <ProForm layout="vertical" form={form} hideRequiredMark submitter={false} onFinish={onFinish}>
      <PageContainer>
        <Card title="" bordered={false}>
          {/* <ContentBigNumTitle num={"01"} title={"用户信息"} style={{}}/> */}
          <div className="padding40">
            <Row gutter={16}>
              <Col xl={{ span: 8, offset: 0 }} lg={{ span: 8 }} md={{ span: 12 }} sm={24}>
                <ProFormSelect
                  label="模板类型"
                  name="tempType"
                  options={[
                    {
                      label: '通用组卷模板',
                      value: 0,
                    },
                    {
                      label: '精细组卷模板',
                      value: 1,
                    },
                  ]}
                  placeholder="请选择模板类型"
                  rules={[{ required: true, message: '请选择模板类型' }]}
                  disabled
                />
              </Col>
              <Col lg={8} md={12} sm={24}>
                <ProFormText
                  label="模板名称"
                  name="tempName"
                  rules={[{ required: true, message: '请输入模板名称' }]}
                  placeholder="请输入模板名称"
                />
              </Col>
              <Col xl={{ span: 8, offset: 0 }} lg={{ span: 10 }} md={{ span: 24 }} sm={24}>
                <ProFormDigit
                  label="考试时间"
                  name="testTotalTime"
                  rules={[{ required: true, message: '请输入考试时间' }]}
                  placeholder="请输入考试时间"
                  addonAfter="分钟"
                />
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={8} md={12} sm={24}>
                <ProFormSelect
                  label="试卷类型"
                  name="paperType"
                  options={testPaperType}
                  placeholder="请选择试卷类型"
                  rules={[{ required: true, message: '请选择试卷类型' }]}
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
              <Link to="/educational/template">
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
