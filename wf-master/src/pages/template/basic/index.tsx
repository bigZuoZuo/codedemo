import { Card, message, Button } from 'antd';
import ProForm, {
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { useRequest } from 'umi';
import type { FC} from 'react';
import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { LeftOutlined } from '@ant-design/icons';
import { fakeSubmitForm } from './service';
import styles from './style.less';

const BasicForm: FC<Record<string, any>> = () => {
  const [loadings, setLoadings] = useState<boolean>(false);

  const { run } = useRequest(fakeSubmitForm, {
    manual: true,
    onSuccess: () => {
      message.success('提交成功');
      setLoadings(false);
    },
  });

  const onFinish = async (values: Record<string, any>) => {
    run(values);
  };

  return (
    <PageContainer content="表单页用于向用户收集或验证信息，基础表单常见于数据项较少的表单场景。">
      <div className={styles.tops}>
        <Button icon={<LeftOutlined />} className={styles.LoginForm_buttom}>
          返回
        </Button>
        <p className={styles.LoginForm_p}>编辑表单页面</p>
      </div>
      <Card bordered={false}>
        <ProForm
          hideRequiredMark
          style={{ margin: 'auto', marginTop: 8, maxWidth: 600 }}
          name="basic"
          layout="horizontal"
          initialValues={{ public: '1' }}
          onFinish={onFinish}
          submitter={false}
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 18}}
        >
          <ProFormText
            // width="md"
            label="标题"
            name="title"
            rules={[
              {
                required: true,
                message: '请输入标题',
              },
            ]}
            placeholder="给目标起个名字"
          />
          <ProFormDateRangePicker
            label="起止日期"
            // width="md"
            name="date"
            rules={[
              {
                required: true,
                message: '请选择起止日期',
              },
            ]}
            placeholder={['开始日期', '结束日期']}
          />
          <ProFormTextArea
            label="目标描述"
            // width="xl"
            name="goal"
            rules={[
              {
                required: true,
                message: '请输入目标描述',
              },
            ]}
            placeholder="请输入你的阶段性工作目标"
          />

          <ProFormTextArea
            label="衡量标准"
            name="standard"
            // width="xl"
            rules={[
              {
                required: true,
                message: '请输入衡量标准',
              },
            ]}
            placeholder="请输入衡量标准"
          />

          <ProFormText
            // width="md"
            label={
              <span>
                客户
                <em className={styles.optional}>（选填）</em>
              </span>
            }
            tooltip="目标的服务对象"
            name="client"
            placeholder="请描述你服务的客户，内部客户直接 @姓名／工号"
          />

          <ProFormText
            // width="md"
            label={
              <span>
                邀评人
                <em className={styles.optional}>（选填）</em>
              </span>
            }
            name="invites"
            placeholder="请直接 @姓名／工号，最多可邀请 5 人"
          />

          <ProFormDigit
            label={
              <span>
                权重
                <em className={styles.optional}>（选填）</em>
              </span>
            }
            name="weight"
            placeholder="请输入"
            min={0}
            max={100}
            // width="xs"
            fieldProps={{
              formatter: (value) => `${value || 0}%`,
              parser: (value) => (value ? value.replace('%', '') : '0'),
            }}
          />

          <ProFormRadio.Group
            options={[
              {
                value: '1',
                label: '公开',
              },
              {
                value: '2',
                label: '部分公开',
              },
              {
                value: '3',
                label: '不公开',
              },
            ]}
            label="目标公开"
            help="客户、邀评人默认被分享"
            name="publicType"
          />
          <ProFormDependency name={['publicType']}>
            {({ publicType }) => {
              return (
                <ProFormSelect
                  // width="md"
                  name="publicUsers"
                  label=' '
                  colon={false}
                  fieldProps={{
                    style: {
                      margin: '8px 0',
                      display: publicType && publicType === '2' ? 'block' : 'none',
                    },
                  }}
                  options={[
                    {
                      value: '1',
                      label: '同事甲',
                    },
                    {
                      value: '2',
                      label: '同事乙',
                    },
                    {
                      value: '3',
                      label: '同事丙',
                    },
                  ]}
                />
              );
            }}
          </ProFormDependency>
          <div style={{ textAlign: 'center' }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={loadings}
              className={styles.LoginForm_buttom}
            >
              提交
            </Button>
          </div>
        </ProForm>
      </Card>
    </PageContainer>
  );
};

export default BasicForm;
