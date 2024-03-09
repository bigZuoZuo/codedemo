import { useRef } from 'react';
import { message, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';

import { GithubIssueItem, OperlogList } from './data';

export default () => {
  const actionRef = useRef<ActionType>();

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/monitor/loginLog/' + id, {
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
      key={`popconfirm${id}`}
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
      title: '登录账号',
      dataIndex: 'userName',
    },
    {
      title: '操作功能',
      dataIndex: 'msg',
      search: false,
    },
    {
      title: '地址',
      search: false,
      dataIndex: 'loginLocation',
    },
    {
      title: '位置',
      search: false,
      // dataIndex: 'loginLocation',
    },
    {
      title: '操作学校',
      search: false,
      // dataIndex: 'loginLocation',
    },
    {
      title: '操作时间',
      search: false,
      dataIndex: 'loginTime',
    },
    {
      title: '操作时间',
      dataIndex: 'loginTime',
      valueType: 'dateTimeRange',
      hideInTable: true,
    },
    {
      title: '操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [renderRemoveUser('删除', record.id || '')],
    },
    {
      title: '学校名称',
      // width: 80,
      dataIndex: 'schoolId',
      hideInTable: true,
      request: async () => {
        const res = await request<API.NameIdType>('/web/schoolDetails/schoolSelect', {
          method: 'GET',
        });
        let list: API.ProFormSelectType[] = [];
        if (res && res.code === 200 && res.data) {
          list = res.data.map((item) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
  ];

  const getDataList = async (datas: {
    pageNum: number;
    pageSize: number;
    loginTime?: string[] | undefined;
  }) => {
    console.log(datas.loginTime);
    let objs: {
      beginTime?: string;
      endTime?: string;
    } = {};
    if (datas.loginTime) {
      objs.beginTime = datas.loginTime[0];
      objs.endTime = datas.loginTime[1];
    }
    const res = await request<OperlogList>('/monitor/loginLog/page', {
      method: 'GET',
      params: {
        ...datas,
        ...objs,
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
    />
  );
};
