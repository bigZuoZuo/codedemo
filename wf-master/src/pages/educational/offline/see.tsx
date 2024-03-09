/* eslint-disable @typescript-eslint/no-use-before-define */
import { Card, Col, Row, message, Button, Form, Select, Descriptions } from 'antd';
import type { FC } from 'react';
import { useState, useEffect } from 'react';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import styles from './style.less';
import request from '@/utils/umi-request';
import { Link, history } from 'umi';

const AdvancedForm: FC<Record<string, any>> = () => {
  /** 学校下拉接口 **/
  const getSchoolSelect = async () => {
    const res: any = await request('/web/schoolDetails/schoolSelect', {
      method: 'GET',
    });
    if (res && res.code === 200) {
    }
  };

  useEffect(() => {}, []);

  return (
    <PageContainer>
      <Card bordered={false}>
        <Descriptions title="成绩查看" >
          <Descriptions.Item label="学生姓名">Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label="专业名称">1810000000</Descriptions.Item>
          <Descriptions.Item label="准考证号">No. 18</Descriptions.Item>
          <Descriptions.Item label="年级名称">Hangzhou, Zhejiang</Descriptions.Item>
          <Descriptions.Item label="学校名称">empty</Descriptions.Item>
          <Descriptions.Item label="班级名称">No. 18</Descriptions.Item>

          <Descriptions.Item label="总分">Zhou Maomao</Descriptions.Item>
          <Descriptions.Item label="文化综合">1810000000</Descriptions.Item>
          <Descriptions.Item label="语文">No. 18</Descriptions.Item>
          <Descriptions.Item label="数学">Hangzhou, Zhejiang</Descriptions.Item>
          <Descriptions.Item label="英语">empty</Descriptions.Item>
          <Descriptions.Item label="计算机专业">No. 18</Descriptions.Item>
        </Descriptions>
      </Card>
    </PageContainer>
  );
};

export default AdvancedForm;
