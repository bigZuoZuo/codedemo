import { Button, Card, Col, Form, message, Row, Space } from 'antd';
import ProForm, { ProFormText, ProFormTextArea, ProFormUploadButton } from '@ant-design/pro-form';
import { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

import request from '@/utils/umi-request';
import './style.less'

import { DictData, DictDataList, DictDataListItem } from './data';

const BasicForm: FC<Record<string, any>> = () => {
  const [form] = Form.useForm();
  const [dataList, setDataList] = useState<DictDataList[]>([]);
  const [repeatIs, setRepeatIs] = useState<boolean>(false);

  const getDataList = async () => {
    const res = await request<DictData>('/web/schoolWebsiteConfig/list', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    });
    if (res && res.code === 200) {
      setDataList(res.data.list);
      resetForm(res.data.list);
    }
  };
  // 重置数据
  const resetForm = (objs: string | any[]) => {
    let list: { userImage?: { url: string; status: string }[] } = {};
    if (objs.length) {
      list = {
        ...objs[0],
        userImage: undefined,
      };
      if (objs[0].userImage != null) {
        list.userImage = objs[0].userImage.split(',').map((item: any) => {
          return {
            url: `/question-api${item}`,
            status: 'done',
          };
        });
      }
    }
    form.setFieldsValue(list);
  };

  const onFinish = async (value: DictDataListItem) => {
    // console.log(value, '----------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const userImage = value.userImage
      ? value.userImage.map((item: { url: string }) => {
          return item.url.replace('/question-api', '');
        })
      : undefined;
    const urls = dataList.length ? '/web/schoolWebsiteConfig' : '/web/schoolWebsiteConfig';
    const res = await request<API.GeneralInterface>(urls, {
      method: dataList.length ? 'PUT' : 'POST',
      data: {
        ...value,
        version: dataList.length ? dataList[0].version : undefined,
        id: dataList.length ? dataList[0].id : undefined,
        userImage: userImage ? userImage.toString() : userImage,
      },
    });
    setRepeatIs(false);
    if (res && res.code === 200) {
      getDataList();
      message.success(res.msg || '提交成功');
    } else {
      message.error(res.msg || '提交失败');
    }
  };

  const handleChange = (info: { file: any; fileList: any }) => {
    let fileList = [...info.fileList];
    // console.log(info, '----------------');
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        fileList = fileList.slice(-1);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fileList = fileList.map((file) => {
          if (file.response) {
            file.url = file.response.fileName;
          }
          return file;
        });
      } else if (info.fileList && info.fileList.length) {
        message.error(info.file.response.msg);
        info.fileList = [];
      }
    }
  };

  useEffect(() => {
    getDataList();
  }, []);

  return (
    <PageContainer>
      <Card bordered={false}>
        <ProForm
          form={form}
          hideRequiredMark
          style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
          name="basic"
          layout="horizontal"
          onFinish={onFinish}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          submitter={false}
        >
          <ProFormText
            width="md"
            label="公司名称："
            name="name"
            placeholder="请输入公司名称"
            required
            rules={[{ required: true, message: '请输入公司名称' }]}
          />

          <ProFormText
            width="md"
            label="地址："
            name="site"
            required
            rules={[
              {
                required: true,
                message: '请输入地址',
              },
            ]}
          />
          <ProFormText
            width="md"
            label="电话："
            name="phone"
            rules={[
              {
                required: true,
                message: '请输入电话',
              },
              { pattern: new RegExp(/^[1][3-9][\d]{9}$/), message: '请输入正确的电话' },
            ]}
          />
          <ProFormText
            width="md"
            label="企业邮箱："
            name="mail"
            rules={[
              {
                required: true,
                message: '请输入企业邮箱',
              },
              {
                pattern: new RegExp(/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/),
                message: '请输入正确企业邮箱',
              },
            ]}
          />
          <ProFormText
            width="md"
            label="许可证："
            name="license"
            rules={[
              {
                required: true,
                message: '请输入许可证',
              },
            ]}
          />
          <ProFormUploadButton
            name="userImage"
            label="用户图像"
            // rules={[
            //   {
            //     required: true,
            //     message: '用户图像为必填项',
            //   },
            // ]}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              headers: {
                Authorization: '',
              },
            }}
            action="/question-api/common/upload"
            onChange={handleChange}
          />
          <ProFormTextArea
            label="用户协议："
            width="xl"
            name="userAgreement"
            // rules={[
            //   {
            //     required: true,
            //     message: '请输入用户协议：',
            //   },
            // ]}
            placeholder="请输入用户协议"
          />
          <Form.Item label=" " className='websiteFormItem'>
            <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
              提交
            </Button>
            <Button
              onClick={() => {
                resetForm(dataList);
              }}
            >
              重置
            </Button>
          </Form.Item>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
