import { useEffect, useRef, useState } from 'react';
import { Button, message, Popconfirm, Table } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link } from 'umi';
import { GithubIssueItem, DictData } from './data';
import { PageContainer } from '@ant-design/pro-layout';

export default (props: { location: { query: { schoolId: string } } }) => {
  const actionRef = useRef<ActionType>();
  // const [majorList, setMajorList] = useState<any[]>([]); // 专业数据
  const [lisyEditableKeys, setLisyEditableKeys] = useState<any[]>([]);

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolTeacher/' + id, {
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
      width: 100,
    },
    {
      title: '教师姓名',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '负责班级',
      search: false,
      dataIndex: 'jobListVo',
      render: (text, record) => {
        const list: string[] = [];
        if (record.jobListVo) {
          record.jobListVo.forEach((item) => {
            if (item.teacherClassList) {
              item.teacherClassList.forEach((it: { className: string }) => {
                if (it.className) {
                  list.push(it.className);
                }
              });
            }
          });
        }
        return list.toString();
      },
    },
    {
      title: '职务名称',
      search: false,
      dataIndex: 'jobListVo1',
      render: (text, record) => {
        const list: string[] = [];
        const listId: string[] = [];
        if (record.jobListVo) {
          record.jobListVo.forEach((it) => {
            if (!listId[it.jobId]) {
              listId.push(it.jobId);
              list.push(it.jobName);
            }
          });
        }
        return list.toString();
      },
    },
    {
      title: '学校名称',
      search: false,
      dataIndex: 'schoolName',
    },
    {
      title: '登录账号',
      search: false,
      dataIndex: 'account',
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'order',
    },
    {
      title: '创建人',
      search: false,
      dataIndex: 'createName',
    },
    {
      title: '创建时间',
      search: false,
      dataIndex: 'createTime',
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        // <a key="view">查看</a>,
        <Link to={'/school/classroom/edit/' + record.id} key="add">
          修改
        </Link>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
    {
      title: '学校名称',
      // width: 80,
      dataIndex: 'schoolId',
      hideInTable: true,
      initialValue: props.location.query.schoolId || undefined,
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
    {
      title: '年级',
      dataIndex: 'gradeId',
      hideInTable: true,
      // initialValue: 'all',
      request: async () => {
        const res = await request<API.NameIdType>('/web/schoolGrade/gradeSelect', {
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
    {
      title: '专业',
      // width: 80,
      dataIndex: 'majorId',
      hideInTable: true,
      // initialValue: 'all',
      request: async () => {
        const res = await request<API.NameIdType>('/web/schoolMajor/findAllMajor', {
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
    {
      title: '班级',
      // width: 80,
      dataIndex: 'classId',
      hideInTable: true,
      // initialValue: 'all',
      request: async () => {
        const res = await request<{
          code: number;
          data?: {
            list?: { name: string; id: string }[];
          };
        }>('/web/schoolClass/list', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 5000,
          },
        });
        let list: API.ProFormSelectType[] = [];
        if (res && res.code === 200 && res.data && res.data.list) {
          list = res.data.list.map((item) => {
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
      title: '登录账号',
      hideInTable: true,
      dataIndex: 'account',
    },
    {
      title: '教师姓名',
      hideInTable: true,
      dataIndex: 'name',
    },
    {
      title: '职务名称',
      hideInTable: true,
      dataIndex: 'jobName',
    },
  ];

  const getDataList = async (datas: GithubIssueItem) => {
    const res = await request<DictData>('/web/schoolTeacher/list', {
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

  /** 专业数据 **/
  // const getMajorList = async () => {
  //   const res = await request('/web/schoolMajor/categorSelectyMajor', {
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
    <PageContainer>
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
          selectedRowKeys: lisyEditableKeys,
          onChange: (selectedRowKeys, selectedRows) => setLisyEditableKeys(selectedRowKeys),
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
          <Link to="/school/classroom/add" key="add">
            <Button key="button" type="primary">
              新增
            </Button>
          </Link>,
          <Button key="button" type="primary">
            导出
          </Button>,
          <Button key="button" type="primary">
            导入
          </Button>,
          <Button key="button" type="primary">
            下载导入模板
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
