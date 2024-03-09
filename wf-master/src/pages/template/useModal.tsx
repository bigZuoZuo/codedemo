import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Card } from 'antd';
import { ModalForm } from '@ant-design/pro-form';

interface modalDatas {
  title?: string;
  name?: string;
  className?: string;
}

const UseModalss: FC = (params: any) => {
  /** 新建窗口的弹窗 */
  const [show, setShow] = useState<boolean>(false);
  const [modalData, setModalData] = useState<modalDatas>({});

  useEffect(() => {
    console.log(params);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PageContainer>
      <Card>
        <div style={{ margin: '20px 0' }}>
          <Button
            type="primary"
            onClick={() => {
              setShow(true);
              setModalData({
                title: '弹框类型一',
                name: '有底部图片，底部按钮样式修改',
                className: 'customizedModal',
              });
            }}
          >
            弹框类型一
          </Button>
        </div>
        <div style={{ margin: '20px 0' }}>
          <Button
            type="primary"
            onClick={() => {
              setShow(true);
              setModalData({
                title: '弹框类型二',
                name: '没有底部图片，底部按钮样式修改',
                className: 'bottomModal',
              });
            }}
          >
            弹框类型二
          </Button>
        </div>
        <div style={{ margin: '20px 0' }}>
          <Button
            type="primary"
            onClick={() => {
              setShow(true);
              setModalData({
                // title: '成功状态弹框',
                name: '处理成功',
                className: 'successModal',
              });
            }}
          >
            成功状态弹框
          </Button>
        </div>
        <div style={{ margin: '20px 0' }}>
          <Button
            type="primary"
            danger
            onClick={() => {
              setShow(true);
              setModalData({
                // title: '失败状态弹框',
                name: '处理失败',
                className: 'failModal',
              });
            }}
          >
            失败状态弹框
          </Button>
        </div>

        <ModalForm
          className={modalData.className}
          title={modalData.title}
          width="800px"
          visible={show}
          onVisibleChange={setShow}
          onFinish={async (value) => {
            console.log(value);
            setShow(false);
          }}
        >
          <h1>{modalData.name}</h1>
          {/* <ProFormText
            rules={[
              {
                required: true,
                message: '规则名称为必填项',
              },
            ]}
            width="md"
            name="name"
          />
          <ProFormTextArea width="md" name="desc" /> */}
        </ModalForm>
      </Card>
    </PageContainer>
  );
};

export default UseModalss;
