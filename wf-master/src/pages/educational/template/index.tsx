import { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link } from 'umi';
import { GithubIssueItem, TableListData } from './data';
import {
  ModalForm,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<object>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [testPaperType, setTestPaperType] = useState<API.ProFormSelectType[]>([]);
  const [findAllSubject, setFindAllSubject] = useState<API.ProFormSelectType[]>([]);

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
      title: '模板名称',
      dataIndex: 'tempName',
      // search: false,
    },
    {
      title: '考试时长',
      search: false,
      dataIndex: 'testTotalTime',
    },
    {
      title: '试卷难度',
      search: false,
      // dataIndex: 'tempName',
    },
    {
      title: '试卷类型',
      dataIndex: 'paperType',
      // initialValue: 'all',
      request: async () => {
        const res = await request<API.DictData>('/system/dict/data/page', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 200,
            dictType: 'test_paper_type',
          },
        });
        let list: any[] = [];
        if (res && res.code === 200) {
          list = res.data.list.map((item: { dictLabel?: string; id?: string }) => {
            return {
              label: item.dictLabel,
              value: item.id,
            };
          });
        }
        return list;
      },
    },
    {
      title: '试卷总分',
      search: false,
      dataIndex: 'totalScore',
    },
    {
      title: '单选题',
      search: false,
      // dataIndex: 'tempName',
    },
    {
      title: '多选题',
      search: false,
      // dataIndex: 'tempName',
    },
    {
      title: '判断题',
      search: false,
      // dataIndex: 'tempName',
    },
    {
      title: '简答题',
      search: false,
      // dataIndex: 'tempName',
    },
    {
      title: '状态',
      search: false,
      // dataIndex: 'tempName',
    },
    {
      title: '创建时间',
      search: false,
      dataIndex: 'createTime',
    },
    {
      title: '用户操作',
      width: 180,
      valueType: 'option',
      key: 'option',
      fixed: 'right',
      render: (text, record) => [
        <Link
          to={`/educational/template/set/${record.id}/${record.tempType || 0}`}
          key={'set' + record.id}
        >
          设置知识点
        </Link>,
        // <Link to={'/educational/template/edit/' + record.id} key={'edit' + record.id}>
        //   修改
        // </Link>,
        <a
          onClick={() => {
            setTypes('edit');
            handleModalVisible(true);
            setFormData(record);
            form.setFieldsValue(record);
          }}
        >
          修改
        </a>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
    {
      title: '模板类型',
      hideInTable: true,
      dataIndex: 'tempType',
      valueEnum: {
        0: { text: '通用组卷模板' },
        1: { text: '精细组卷模板' },
      },
    },
    {
      title: '学科',
      hideInTable: true,
      dataIndex: 'subjectId',
      request: async () => {
        const res = await request('/web/schoolSubject/findAllSubject', {
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
  ];

  /** 新增/编辑提交操作 **/
  const onFinish = async (value: API.GithubIssueItems) => {
    // console.log(value, '------------');
    if (repeatIs) return;
    setRepeatIs(true);
    let urls = types === 'add' ? '/web/schoolTemplate/add' : '/web/schoolTemplate';
    const res = await request<API.GeneralInterface>(urls, {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...formData,
        ...value,
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

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<TableListData>('/web/schoolTemplateMajor/list', {
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
  /** 试卷类型列表 **/
  const getTestPaperType = async () => {
    const res = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 200,
        dictType: 'test_paper_type',
      },
    });
    if (res && res.code === 200) {
      const list = res.data.list.map((item: { dictLabel?: string; id?: string }) => {
        return {
          label: item.dictLabel || '',
          value: item.id || '',
        };
      });
      setTestPaperType(list);
    }
  };
  /** 请求科目数据 **/
  const getFindAllSubject = async () => {
    const res = await request('/web/schoolSubject/findAllSubject', {
      method: 'GET',
      params: {
        category: 2,
      },
    });
    let list = [];
    if (res && res.code === 200) {
      list = res.data.map((item: { name: string; id: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setFindAllSubject(list);
    }
  };
  useEffect(() => {
    getFindAllSubject();
    getTestPaperType();
  }, []);
  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
  }, [createModalVisible]);

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
            key="buttona"
            type="primary"
            onClick={() => {
              setTypes('add');
              handleModalVisible(true);
            }}
          >
            新增
          </Button>,
          <Button key="button" type="primary">
            删除
          </Button>,
        ]}
      />
      <ModalForm
        form={form}
        title={types === 'add' ? '新增模板' : '修改模板'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
        className="rolesModalForm"
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormRadio.Group
          label="模板类型"
          name="tempType"
          placeholder="请选择模板类型"
          rules={[{ required: true, message: '请选择模板类型' }]}
          radioType="button"
          options={[
            {
              label: '通用组卷模板',
              value: 0,
            },
            {
              label: '精细组卷模板',
              value: 1,
            },
          ]}
        />
        <ProFormText
          label="模板名称"
          name="tempName"
          rules={[{ required: true, message: '请输入模板名称' }]}
          placeholder="请输入模板名称"
        />
        <ProFormDigit
          label="考试时间"
          name="testTotalTime"
          rules={[{ required: true, message: '请输入考试时间' }]}
          placeholder="请输入考试时间"
          addonAfter="分钟"
        />
        <ProFormSelect
          label="试卷类型"
          name="paperType"
          options={testPaperType}
          placeholder="请选择试卷类型"
          // rules={[{ required: true, message: '请选择试卷类型' }]}
        />
        <ProFormSelect
          label="科目"
          name="subjectId"
          options={findAllSubject}
          placeholder="请选择科目"
          rules={[{ required: true, message: '请选择科目' }]}
        />
      </ModalForm>
    </>
  );
};
