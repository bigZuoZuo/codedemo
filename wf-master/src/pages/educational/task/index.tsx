import { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
// , Cascader, Select
import { Button, message, Popconfirm, Form } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { ModalForm, ProFormRadio, ProFormText, ProFormDigit } from '@ant-design/pro-form';
import { Link } from 'umi';
// const { Option } = Select;

import { GithubIssueItem, TableListData } from './data';

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [formData, setFormData] = useState<GithubIssueItem>({});
  const [form] = Form.useForm();

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolTemplateMajor/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success('删除成功');
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
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '任务练习名称',
      dataIndex: 'name',
      // search: false,
    },
    {
      title: '试题专业',
      search: false,
      dataIndex: 'majorName',
    },
    {
      title: '试题学科',
      // search: false,
      dataIndex: 'subjectName',
    },
    {
      title: '创建人',
      search: false,
      dataIndex: 'createName',
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      search: false,
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <Link key="chapter" to={'/educational/task/set/' + record.id}>
          设置题目
        </Link>,
        <a
          key="editable"
          onClick={() => {
            setTypes('edit');
            setFormData(record);
            handleModalVisible(true);
            form.setFieldsValue(record);
          }}
        >
          修改
        </a>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
  ];

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<TableListData>('/web/schoolTask/list', {
      method: 'GET',
      params: {
        ...datas,
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
        success: false,
      };
    }
  };

  /** 新增/编辑专业提交操作 **/
  const onFinish = async (value: GithubIssueItem) => {
    // console.log(value, '------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const urls = types === 'add' ? '/web/schoolTask/add' : '/web/schoolTask';
    const res = await request(urls, {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...value,
        version: formData.version,
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


  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModalVisible]);

  useEffect(() => {
    // getCategorSelectyMajor();
  }, []);

  return (
    <>
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
        editable={{
          type: 'multiple',
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setTypes('add');
              handleModalVisible(true);
            }}
          >
            新增
          </Button>,
        ]}
      />
      <ModalForm
        form={form}
        title={types === 'add' ? '新增' : '编辑'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '任务练习名称为必填项',
            },
          ]}
          name="name"
          label="任务练习名称"
          placeholder="请输入任务练习名称"
        />
        <ProFormRadio.Group
          name="answerMode"
          label="公布答案"
          options={[
            {
              label: '做完后，显示答案',
              value: 1,
            },
            {
              label: '不显示答案',
              value: 0,
            },
          ]}
          rules={[
            {
              required: true,
              message: '公布答案为必填项',
            },
          ]}
        />
        <ProFormRadio.Group
          name="multipleModel"
          label="多选模式"
          options={[
            {
              label: '全部答对，才算得分',
              value: 0,
            },
            {
              label: '漏选，按半对',
              value: 1,
            },
            // {
            //   label: '漏选',
            //   value: 2,
            // },
          ]}
          rules={[
            {
              required: true,
              message: '多选模式为必填项',
            },
          ]}
        />
        <Form.Item noStyle shouldUpdate>
          {(form) => {
            if (form.getFieldValue('multipleModel') != 2) return;
            return (
              <ProFormDigit
                name="multipleScore"
                label="漏选得分"
                rules={[
                  {
                    required: true,
                    message: '漏选得分为必填项',
                  },
                ]}
              />
            );
          }}
        </Form.Item>
      </ModalForm>
    </>
  );
};
