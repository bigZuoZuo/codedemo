import { Card, Col, Row, message, Button, Form } from 'antd';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import ProForm, { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';

import request from '@/utils/umi-request';
import { Link, history } from 'umi';

const AdvancedForm: FC<Record<string, any>> = (props) => {
  const [loadings, setLoadings] = useState<boolean>(false);

  const [roleList, setRoleList] = useState<API.ProFormSelectType[]>([]); // 角色列表
  const [schoolDetailsList, setSchoolDetailsList] = useState<API.ProFormSelectType[]>([]); // 学校列表
  const [detailsData, setDetailsData] = useState<API.GithubIssueItem>({ id: '' });

  const [form] = Form.useForm();

  const onFinish = async (values: Record<string, any>) => {
    if (loadings) return;
    setLoadings(true);
    // console.log(values, '------------------------');
    // return;
    const res = await request<API.GeneralInterface>('/system/user', {
      method: 'PUT',
      data: {
        ...detailsData,
        ...values,
        deptId: values.deptId ? values.deptId.toString() : undefined,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      history.push('/system/user');
    } else {
      message.error(res.msg);
    }
    setLoadings(false);
  };
  /** 角色列表 **/
  const getRoleList = async () => {
    const res = await request<API.RoleList>('/system/role/list', {
      method: 'GET',
      params: {
        // ...datas,
        pageNum: 1,
        pageSize: 1000,
      },
    });
    if (res && res.code === 200) {
      const list: API.ProFormSelectType[] = res.data.list.map(
        (item: { roleName?: string; id: string }) => {
          return {
            label: item.roleName || '',
            value: item.id,
          };
        },
      );
      setRoleList(list);
    }
  };

  /** 学校列表 **/
  const getSchoolDetailsList = async () => {
    const res: any = await request<API.SchoolDetailsList>('/web/schoolDetails/list', {
      method: 'GET',
      params: {
        // ...datas,
        pageNum: 1,
        pageSize: 200,
      },
    });
    if (res && res.code === 200) {
      const list: API.ProFormSelectType[] = res.data.list.map(
        (item: { schoolName?: string; id: string }) => {
          return {
            label: item.schoolName || '',
            value: item.id,
          };
        },
      );
      setSchoolDetailsList(list);
    }
  };

  const getDetailsData = async (id: string) => {
    const res: any = await request('/system/user/' + id, {
      method: 'GET',
    });
    if (res && res.code === 200) {
      //   console.log(res, '---------------');
      form.setFieldsValue({
        ...res.data,
        roleIds: res.roleIds,
        deptId: res.data.deptId ? res.data.deptId.split(',') : undefined,
      });
      setDetailsData(res.data);
    }
  };

  useEffect(() => {
    // console.log(props.match.params.id, '--------------');
    getRoleList();
    getSchoolDetailsList();
    getDetailsData(props.match.params.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Card title="" className={styles.card} bordered={false}>
        <ProForm
          layout="horizontal"
          hideRequiredMark
          submitter={false}
          onFinish={onFinish}
          form={form}
          style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
        >
          <ProFormText
            label="用户姓名"
            name="name"
            rules={[{ required: true, message: '请输入用户姓名' }]}
            placeholder="请输入用户姓名"
          />
          <ProFormSelect
            label="用户性别"
            name="sex"
            options={[
              {
                label: '男',
                value: '0',
              },
              {
                label: '女',
                value: '1',
              },
              {
                label: '未知',
                value: '2',
              },
            ]}
            placeholder="请选择用户性别"
          />
          <ProFormText
            label="登录账号"
            name="userName"
            rules={[{ required: true, message: '请输入登录账号' }]}
            placeholder="请输入登录账号"
          />

          <ProFormSelect
            label="角色选择"
            name="roleIds"
            mode="tags"
            options={roleList}
            placeholder="请选择角色选择"
          />
          <ProFormSelect
            label="负责学校"
            name="deptId"
            mode="tags"
            options={schoolDetailsList}
            placeholder="请选择负责学校"
          />

          <ProFormText
            label="手机号码"
            rules={[
              { pattern: new RegExp(/^[1][3-9][\d]{9}$/, 'g'), message: '请输入正确的手机号' },
            ]}
            name="phonenumber"
            placeholder="请输入手机号码"
          />
          <ProFormText
            label="用户邮箱"
            name="email"
            placeholder="请输入用户邮箱"
            rules={[{ type: 'email', message: '请输入正确用户邮箱' }]}
          />
          <ProFormTextArea label="备注信息" name="remark" placeholder="请输入备注信息" />
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
              <Link to="/system/user">
                <Button>返回</Button>
              </Link>
            </Col>
          </Row>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default AdvancedForm;
