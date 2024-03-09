import { FC } from 'react';
import { Card, Col, Button, Row, message } from 'antd';
import ProForm, {
  ProFormTextArea,
  ProFormSelect,
  ProFormText,
  ProFormTimePicker,
} from '@ant-design/pro-form';
import Upload from '@/components/Upload/index';
import styles from '../styles.less';

const Tab1: FC = () => {
  const onFinish = async (values: Record<string, any>) => {
    // setError([]);
    try {
      await fakeSubmitForm(values);
      message.success('提交成功');
    } catch {
      // console.log
    }
  };

  const fakeSubmitForm = async (value: any): Promise<void> => {
    console.log(value);
  };
  return (
    <ProForm layout="vertical" hideRequiredMark submitter={false} onFinish={onFinish}>
      {/* <Card> */}
      <div className={styles.titles}>审批</div>
      <Row gutter={24}>
        <Col lg={18} md={24} sm={24}>
          <ProFormTextArea label="审批意见" name="remark" />
        </Col>
        <Col lg={18} md={24} sm={24}>
          <Upload label="附件" name="file" title="添加" extra={false} />
        </Col>
        <Col lg={24} md={24} sm={24} style={{ textAlign: 'center' }}>
          <Button shape="round" className={styles.buttomSty}>
            返回
          </Button>
          <Button shape="round" className={styles.buttomSty}>
            保存
          </Button>
          <Button type="primary" htmlType="submit" shape="round" className={styles.buttomSty}>
            通过
          </Button>
        </Col>
      </Row>
      {/* </Card> */}
    </ProForm>
  );
};

export default Tab1;
