import { Card, Col, Row, message, Button,Avatar,Tooltip} from 'antd';
import { FC, useRef } from 'react';
import { useState, useEffect } from 'react';
import ProForm, { ProFormSelect, ProFormText, ProFormTextArea } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './style.less';


import request from '@/utils/umi-request';
import { Link, history } from 'umi';


// import { UserOutlined ,AntDesignOutlined} from '@ant-design/icons';



const AdvancedForm: FC<Record<string, any>> = ({
  myinfo
}) => {
  // const {userInfo,changeUserInfo} = myinfo
  const imgFile:any  = useRef()
  const [loadings, setLoadings] = useState<boolean>(false);

  const [roleList, setRoleList] = useState<API.ProFormSelectType[]>([]); // 角色列表
  const [schoolDetailsList, setSchoolDetailsList] = useState<API.ProFormSelectType[]>([]); // 学校列表


  const onFinish = async (values: Record<string, any>) => {
    if (loadings) return;
    setLoadings(true);
    // console.log(values, '------------------------');
    // return;
    const res = await request<API.GeneralInterface>('/system/user', {
      method: 'POST',
      data: {
        status: '0',
        userType: '1',
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
    const res: API.RoleList = await request<API.RoleList>('/system/role/list', {
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
    const res = await request<API.SchoolDetailsList>('/web/schoolDetails/list', {
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

  // 上传头像
  
  const todoUploadFile = async ()=>{
    const file:any   = imgFile.current.files[0]
    const data:any  = new FormData()
    data.append("file",file)
    console.log("123123")
    const res: API.RoleList = await request<API.RoleList>('/common/upload', {
      method: 'POST',
      data:data,
      headers:{
        'Content-Type':'multipart/form-data'
      }
    });
    console.log(res)

  }
  useEffect(() => {
    getRoleList();
    getSchoolDetailsList();
  }, []);

  const uploadFile = ()=>{
    console.log(imgFile)
    imgFile.current.click()
  }

  return (
    <PageContainer >
      <Card title="" className={styles.card } bordered={false}  >
        <div className='ant-card-body-from'>
        <ProForm
          layout="horizontal"
          style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
          hideRequiredMark
          submitter={false}
          onFinish={onFinish}
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
            rules={[{ pattern: new RegExp(/^[1][3-9][\d]{9}$/), message: '请输入正确的手机号' }]}
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
    
        </div>
        <div className='ant-card-avatar-box'>
        <p>头像</p>

 
        {/* <Avatar size={120} icon={<UserOutlined />} /> */}
      {/* <Avatar size="large" icon={<UserOutlined />} /> */}
      <Tooltip title="更新头像">
        <Button onClick={uploadFile}>点击上传</Button>
      {/* <Avatar
    
    size={{ xs: 24, sm: 32, md: 40, lg: 64, xl: 80, xxl: 100 }}
    icon={<AntDesignOutlined />}
  /> */}
     </Tooltip>
      <input type="file" ref={imgFile}  style={{display:"none"}}  onChange={todoUploadFile}   />
      </div>
        {/* <ProForm
          layout="horizontal"
          style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
          hideRequiredMark
          submitter={false}
          onFinish={onFinish}
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
            rules={[{ pattern: new RegExp(/^[1][3-9][\d]{9}$/), message: '请输入正确的手机号' }]}
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
        </ProForm> */}
  
      </Card>
    


            

    </PageContainer>
  );
};

export default AdvancedForm;
