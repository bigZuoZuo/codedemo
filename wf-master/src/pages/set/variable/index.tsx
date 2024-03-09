import { useState, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormDigit } from '@ant-design/pro-form';
import { Button, Col, Form, message, Row } from 'antd';
import request from '@/utils/umi-request';
import './style.less';

import { DictData, DictDataList, DictDataListItem } from './data';

const Demo = () => {
  const [form] = Form.useForm();
  const [dataList, setDataList] = useState<DictDataList[]>([]);
  const [repeatIs, setRepeatIs] = useState<boolean>(false);

  const getDataList = async () => {
    const res = await request<DictData>('/web/schoolVariableConfig/list', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 10,
      },
    });
    if (res && res.code === 200) {
      setDataList(res.data.list);
      form.setFieldsValue(res.data.list.length ? res.data.list[0] : {});
    }
  };

  const onFinish = async (value: DictDataListItem) => {
    // console.log(value, '----------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const urls = dataList.length ? '/web/schoolVariableConfig' : '/web/schoolVariableConfig';
    const res = await request<API.GeneralInterface>(urls, {
      method: dataList.length ? 'PUT' : 'POST',
      data: {
        ...value,
        version: dataList.length ? dataList[0].version : undefined,
        id: dataList.length ? dataList[0].id : undefined,
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

  useEffect(() => {
    getDataList();
  }, []);

  return (
    <PageContainer>
      <ProForm
        form={form}
        name="validate_other"
        onFinish={onFinish}
        className="validate-other"
        submitter={false}
      >
        {/* <div className="variable-item">
          <span>对象生：文化综合+专业成绩总成绩高于预估分数线</span>
          <ProFormDigit name="object" />
          <span>分，为对象生。</span>
        </div> */}
        <div className="variable-item">
          <span>临界生：总考试分数低于预估分数线，对象生的</span>
          <ProFormDigit name="critical" />
          <span>%，为临界生。</span>
        </div>
        <div className="variable-item">
          <span>偏科生：</span>
          <ProFormDigit name="dine" />
          <span>科考试成绩比另外科目成绩低于两个等级，为偏科生。</span>
        </div>
        <div className="variable-item">
          <span>成绩上升：距离上次考试大幅进步</span>
          <ProFormDigit name="stable" />
          <span>名，为进步生。</span>
        </div>
        <div className="variable-item">
          <span>成绩下降：距离上次考试大退步</span>
          <ProFormDigit name="fluctuations" />
          <span>名，为退步生。</span>
        </div>
        <div className="variable-item">
          <span>高频错题：计算每道题答错人数，答错人数（倒序）前</span>
          <ProFormDigit name="highWrong" />
          <span>%，为高频错题。</span>
        </div>
        <div className="variable-item">
          <span>顽固错题：错次数超过/包含</span>
          <ProFormDigit name="stubbornWrong" />
          <span>次，为顽固错题。</span>
        </div>

        <div style={{ display: 'flex' }}>
          <span>等级划分：</span>
          <div>
            <div className="variable-item">
              <span>分数小于满分的</span>
              <ProFormDigit name="lawGradeStart" />-
              <ProFormDigit name="lawGrade" />
              <span>%，为低分；</span>
            </div>
            <div className="variable-item">
              <span>分数小于满分的</span>
              <ProFormDigit name="noPassStart" />-
              <ProFormDigit name="noPassEnd" />
              <span>%，为不及格；</span>
            </div>
            <div className="variable-item">
              <span>分数大于满分的</span>
              <ProFormDigit name="passStart" />-
              <ProFormDigit name="passEnd" />
              <span>%，及格；</span>
            </div>
            <div className="variable-item">
              <span>分数大于满分的</span>
              <ProFormDigit name="goodStart" />-
              <ProFormDigit name="goodEnd" />
              <span>%，为优秀；</span>
            </div>
            {/* <div className="variable-item">
              <span>分数大于满分的</span>
              <ProFormDigit name="excellent" />
              <span>%，为优秀；</span>
            </div> */}
          </div>
        </div>
        <Row gutter={16}>
          <Col lg={24} md={24} sm={24} style={{ textAlign: 'center' }}>
            <Button type="primary" htmlType="submit" style={{ marginRight: '20px' }}>
              提交
            </Button>
            <Button onClick={()=>{
              form.setFieldsValue(dataList.length ? dataList[0] : {});
            }}>重置</Button>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};

export default Demo;
