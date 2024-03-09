import React, { useRef, useState } from 'react';
import { Button, Form, message, Popconfirm, Table } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link } from 'umi';
import { ModalForm, ProFormText, ProFormSelect, ProFormUploadButton } from '@ant-design/pro-form';

type GithubIssueItem = {
  id: string;
};

export default (props: { match: { params: { id: string } } }) => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<object>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [form] = Form.useForm();
  const deleteCl = async (id?: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolOfflineTestScore/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
  };

  const renderRemoveUser = (text: string, id: string) => (
    <Popconfirm
      key="popconfirm"
      title={`确认${text}吗?`}
      okText="是"
      cancelText="否"
      onConfirm={() => {
        // console.log(123456);
        deleteCl(id);
      }}
    >
      <a>{text}</a>
    </Popconfirm>
  );

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
    },
    {
      title: 'ID',
      search: false,
      dataIndex: 'testId',
    },
    {
      title: '学生姓名',
      dataIndex: 'studentName',
    },
    {
      title: '考号',
      search: false,
      dataIndex: 'admissionNumber',
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
    },
    {
      title: '专业名称',
      dataIndex: 'majorName',
    },
    {
      title: '年级名称',
      dataIndex: 'gradeName',
    },
    {
      title: '班级名称',
      dataIndex: 'className',
    },
    {
      title: '总分',
      search: false,
      // dataIndex: 'testId',
    },
    {
      title: '上传时间',
      search: false,
      // dataIndex: 'testId',
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <Link to={`/educational/offline/see/${record.id}`}>
          <a>查看</a>
        </Link>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
  ];

  /** 新增/编辑提交操作 **/
  const onFinish = async (value: any) => {
    // console.log(value, '------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request('/web/schoolBanner', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...formData,
        ...value,
        handleType: types,
        imgUrl: value.imgUrl[0].url,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      handleModalVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
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

  /** 请求列表数据 **/
  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request('/web/schoolOfflineTestScore/list', {
      method: 'GET',
      params: {
        ...datas,
        id: props.match.params.id,
      },
    });
    if (res && res.code === 200 && res.data) {
      return {
        total: res.data.total,
        data: res.data.list,
        success: true,
      };
    } else {
      return {
        total: 0,
        data: [],
      };
    }
  };

  return (
    <div>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          const datas: { pageNum: number; pageSize: number } = {
            ...params,
            pageNum: params.current || 1,
            pageSize: params.pageSize || 10,
          };
          return getDataList(datas);
        }}
        rowSelection={{
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          defaultSelectedRowKeys: [],
        }}
        rowKey="id"
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button key="button" type="primary">
            返回
          </Button>,
          <Button key="button" type="primary">
            下载
          </Button>,
        ]}
      />
      <ModalForm
        form={form}
        title={types === 'add' ? '成绩上传' : '成绩上传'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormSelect
          label="学校名称"
          name="sex"
          options={[
            {
              label: '',
              value: '0',
            },
            {
              label: '',
              value: '1',
            },
            {
              label: '',
              value: '2',
            },
          ]}
          rules={[
            {
              required: true,
              message: '学校名称为必填项',
            },
          ]}
        />
        <ProFormSelect
          label="专业名称"
          name="sex"
          options={[
            {
              label: '',
              value: '0',
            },
            {
              label: '',
              value: '1',
            },
            {
              label: '',
              value: '2',
            },
          ]}
          rules={[
            {
              required: true,
              message: '专业名称为必填项',
            },
          ]}
        />
        <ProFormSelect
          label="年级名称"
          name="sex"
          options={[
            {
              label: '',
              value: '0',
            },
            {
              label: '',
              value: '1',
            },
            {
              label: '',
              value: '2',
            },
          ]}
          rules={[
            {
              required: true,
              message: '年级名称为必填项',
            },
          ]}
        />
        <ProFormUploadButton
          name="imgUrl"
          label="选择文件"
          rules={[
            {
              required: true,
              message: '选择文件为必填项',
            },
          ]}
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            headers: {
              Authorization: `Bearer ${localStorage.getItem('headers_token')}`,
            },
          }}
          action="/question-api/common/upload"
          onChange={handleChange}
        />
      </ModalForm>
    </div>
  );
};
