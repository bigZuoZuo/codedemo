import React, { useRef } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link } from 'umi';

type GithubIssueItem = {
  url: string;
  id: string;
  number: number;
  title: string;
  labels: {
    name: string;
    color: string;
  }[];
  state: string;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: string;
};

export default () => {
  const actionRef = useRef<ActionType>();

  const deleteCl = async (id: any) => {
    const res: any = await request('/web/schoolStudent/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success('删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error('删除');
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
    },
    {
      title: '姓名',
      dataIndex: 'name',
      // // copyable: true,
      // ellipsis: true,
      search: false,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '此项为必填项',
          },
        ],
      },
    },
    {
      title: '性别',
      search: false,
    },
    {
      title: '民族',
      search: false,
    },
    {
      title: '邮箱',
      search: false,
    },
    {
      title: '微信',
      search: false,
    },
    {
      title: '年级',
      search: false,
    },
    {
      title: '班级',
      search: false,
    },
    {
      title: '专业',
      search: false,
    },
    {
      title: '学业类型',
      search: false,
    },
    {
      title: '毕业类型',
      search: false,
    },
    {
      title: '身份证号',
      search: false,
    },
    {
      title: '出生年月',
      search: false,
    },
    {
      title: '文丰学号',
      search: false,
    },
    {
      title: '登录密码',
      search: false,
    },
    {
      title: '现住地址',
      search: false,
    },
    {
      title: '爱好特长',
      search: false,
    },
    {
      title: '入学日期',
      search: false,
    },
    {
      title: '毕业日期',
      search: false,
    },
    {
      title: '创建日期',
      search: false,
    },
    {
      title: '考试编号',
      search: false,
    },
    {
      title: '创建人',
      search: false,
    },
  ];

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res: any = await request<{
      data: GithubIssueItem[];
    }>('/web/schoolStudent/list', {
      method: 'GET',
      params: {
        ...datas,
      },
    });
    if (res && res.code === 200) {
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

  return (
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
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      toolBarRender={() => [
        
      ]}
    />
  );
};
