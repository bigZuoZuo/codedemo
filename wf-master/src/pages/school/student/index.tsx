import React, { useEffect, useRef, useState } from 'react';
import { Button, message, Popconfirm, TreeSelect } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link, history } from 'umi';

import { TableListData, GithubIssueItem } from './data';

export default (props: { location: { query: { schoolId?: string } } }) => {
  const actionRef = useRef<ActionType>();
  // const [majorList, setMajorList] = useState<any[]>([]); // 专业数据

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolStudent/' + id, {
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
      width: 50,
    },
    {
      title: '学生姓名',
      dataIndex: 'name',
      search: false,
    },
    // {
    //   title: '手机号码',
    //   search: false,
    //   dataIndex: 'phone',
    // },
    {
      title: '班级名称',
      search: false,
      dataIndex: 'className',
      ellipsis: true,
    },
    {
      title: '年级名称',
      search: false,
      dataIndex: 'gradeName',
      ellipsis: true,
    },
    {
      title: '入学年份',
      search: false,
      dataIndex: 'enterTime',
      valueType: 'dateTime',
      ellipsis: true,
    },
    {
      title: '准考证号',
      search: false,
      dataIndex: 'admissionNumber',
      ellipsis: true,
    },
    {
      title: '学籍编号',
      search: false,
      dataIndex: 'studentNumber',
      ellipsis: true,
    },
    {
      title: '登录账号',
      search: false,
      dataIndex: 'wechat',
    },
    {
      title: '学生类型',
      search: false,
      dataIndex: 'typeValue',
    },
    {
      title: '毕业类型',
      search: false,
      dataIndex: 'graduationValue',
      ellipsis: true,
    },
    {
      title: '创建人',
      search: false,
      dataIndex: 'createName',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      search: false,
      ellipsis: true,
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      width: 100,
      fixed: 'right',
      render: (text, record) => [
        // <a>查看</a>,
        <a
          key="editable"
          onClick={() => {
            history.push('/school/student/edit/' + record.id);
          }}
        >
          修改
        </a>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
    {
      title: '学校名称',
      // width: 80,
      dataIndex: 'schoolId',
      initialValue: props.location.query.schoolId || undefined,
      hideInTable: true,
      request: async () => {
        const res = await request('/web/schoolDetails/schoolSelect', {
          method: 'GET',
        });
        let list = [];
        if (res && res.code === 200) {
          list = res.data.map((item: { name: string; id: string }) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
    {
      title: '年级',
      dataIndex: 'gradeId',
      hideInTable: true,
      // initialValue: 'all',
      request: async () => {
        const res = await request('/web/schoolGrade/gradeSelect', {
          method: 'GET',
        });
        let list = [];
        if (res && res.code === 200) {
          list = res.data.map((item: { name: string; id: string }) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
    {
      title: '专业',
      // width: 80,
      dataIndex: 'majorId',
      hideInTable: true,
      request: async () => {
        const res = await request('/web/schoolMajor/findAllMajor', {
          method: 'GET',
        });
        let list = [];
        if (res && res.code === 200) {
          list = res.data.map((item: { name: string; id: string }) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
    {
      title: '班级名称',
      // width: 80,
      dataIndex: 'classId',
      hideInTable: true,
      // initialValue: 'all',
      request: async () => {
        const res = await request('/web/schoolClass/list', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 5000,
          },
        });
        let list = [];
        if (res && res.code === 200) {
          list = res.data.list.map((item: { name: string; id: string }) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
    {
      title: '学生姓名',
      dataIndex: 'name',
      hideInTable: true,
    },
    {
      title: '手机号码',
      dataIndex: 'phone',
      hideInTable: true,
    },
    {
      title: '考号',
      dataIndex: 'admissionNumber',
      hideInTable: true,
    },
    {
      title: '文丰学号',
      dataIndex: 'studentNumber',
      hideInTable: true,
    },
    {
      title: '毕业类型',
      width: 80,
      hideInTable: true,
      dataIndex: 'graduationType',
      request: async () => {
        const res = await request('/system/dict/data/page', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 1000,
            dictType: 'graduation_type',
          },
        });
        let list: any[] = [];
        if (res && res.code === 200) {
          list = res.data.list.map((item: { dictLabel: string; id: string }) => {
            return {
              label: item.dictLabel,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
  ];

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<TableListData>('/web/schoolStudent/list', {
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

  /** 专业数据 **/
  // const getMajorList = async () => {
  //   const res = await request('/web/schoolMajor/findAllMajor', {
  //     method: 'GET',
  //   });

  //   if (res && res.code === 200) {
  //     setMajorList(res.data);
  //   }
  // };

  // useEffect(() => {
  //   getMajorList();
  // }, []);

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
        <Link to="/school/student/add" key="add">
          <Button key="button" type="primary">
            新增
          </Button>
        </Link>,
        // <Button key="button1" type="primary">
        //   删除
        // </Button>,
        <Button key="button2" type="primary">
          导出
        </Button>,
        <Button key="button3" type="primary">
          导入
        </Button>,
      ]}
    />
  );
};
