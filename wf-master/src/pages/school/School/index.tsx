import { useRef } from 'react';
import { Button, message, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link, history } from 'umi';

import { GithubIssueItem, DictData } from './data';

export default () => {
  const actionRef = useRef<ActionType>();
  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolDetails/' + id, {
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
      title={`请确认是否删除？（如果确认删除则关联的教师和学生都将删除）`}
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
      width: 50,
    },
    {
      title: '学校名称',
      dataIndex: 'schoolName',
    },
    {
      title: '学校编号',
      search: false,
      dataIndex: 'schoolCode',
      ellipsis: true,
    },
    {
      title: '联系人',
      search: false,
      dataIndex: 'contacts',
    },
    {
      title: '固定电话',
      search: false,
      dataIndex: 'fixedPhone',
    },
    {
      title: '联系手机',
      search: false,
      dataIndex: 'telephone',
    },
    {
      title: '学校地区',
      search: false,
      dataIndex: 'provinces',
      // ellipsis: true,
      render: (text, record) => {
        const names = `${record.province || ''}${record.city || ''}${record.district || ''}`;
        return names || '-';
      },
    },
    {
      title: '学校地址',
      search: false,
      dataIndex: 'schoolSite',
      // copyable: true,
      ellipsis: true,
    },
    {
      title: '老师人数',
      search: false,
      dataIndex: 'totalTeacher',
      width: 80,
      render: (text, record) => {
        return (
          <Link to={`/school/classroom?schoolId=${record.id}`}>
            {record.totalTeacher != null ? record.totalTeacher : '-'}
          </Link>
        );
      },
    },
    {
      title: '学生人数',
      search: false,
      dataIndex: 'totalStudent',
      width: 80,
      render: (text, record) => {
        return (
          <Link to={`/school/student?schoolId=${record.id}`}>
            {record.totalStudent != null ? record.totalStudent : '-'}
          </Link>
        );
      },
    },
    {
      title: '创建人',
      search: false,
      dataIndex: 'createName',
      ellipsis: true,
    },
    {
      title: '创建时间',
      search: false,
      dataIndex: 'createTime',
      ellipsis: true,
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      width: 100,
      render: (text, record) => {
        const node = renderRemoveUser('删除', record.id || '');
        return [
          <a
            key="editable"
            onClick={() => {
              history.push('/school/School/edit/' + record.id);
            }}
          >
            修改
          </a>,
          node,
        ];
      },
    },
  ];

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<DictData>('/web/schoolDetails/list', {
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
      rowKey="id"
      search={{
        labelWidth: 'auto',
      }}
      pagination={{
        pageSize: 10,
      }}
      dateFormatter="string"
      toolBarRender={() => [
        <Link to="/school/School/add" key="links">
          <Button key="button" type="primary">
            新增
          </Button>
        </Link>,
      ]}
    />
  );
};
