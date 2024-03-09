import { useState, FC } from 'react';
import { Table, Modal, Button } from 'antd';
import PreviewFile from '../PreviewFile';
const useAttahcModal: FC = (): any => {
  const [show, setShow] = useState<boolean>(false);
  const [soucre, setSource] = useState<any[]>([]);
  const columns: any[] = [
    {
      title: '序号',
      key: 'key',
      dataIndex: 'key',
      render: (text, record, index) => `${index + 1}`,
    },
    {
      title: '附件名称',
      dataIndex: 'name',
      key: 'name',
      render: (text) => {
        return <span title={text}>{text}</span>;
      },
    },
    {
      title: '操作',
      key: 'download',
      render: (text, data, index) => (
        <div>
          <a href={`/api/file/download?filePath=${data.url}&fileName=${data.name}`} target="_blank">
            下载
          </a>
          <PreviewFile url={data.url} name={data.name} />
        </div>
      ),
    },
  ];
  const showModal: any = (data: any): void => {
    setSource(data);
    setShow(true);
  };
  return [
    <Modal
      wrapClassName="attach"
      title="查看附件"
      visible={show}
      centered={true}
      width={1000}
      onOk={() => setShow(false)}
      onCancel={() => setShow(false)}
      cancelText="取消"
      okText="确定"
      className="bottomModal"
    >
      <div className="zeus_line"></div>
      <div className="zeus__detail__table">
        <Table
          rowKey={(record, index) => index}
          columns={columns}
          dataSource={soucre}
          pagination={false}
        />
      </div>
    </Modal>,
    showModal,
  ];
};
export default useAttahcModal;
