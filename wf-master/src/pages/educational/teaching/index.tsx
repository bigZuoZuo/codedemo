import { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Modal, Popconfirm, Table } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormDigit,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Link } from 'umi';

import { TableListData, GithubIssueItem } from './data';

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<GithubIssueItem>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [findAllSubjectList, setFindAllSubjectList] = useState<API.ProFormSelectType[]>([]);
  const [lisyEditableKeys, setLisyEditableKeys] = useState<any[]>([]);
  const [form] = Form.useForm();

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolTeach/' + id, {
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
  /** 新增/编辑提交操作 **/
  const onFinish = async (value: GithubIssueItem) => {
    // console.log(value, '------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const urls = types === 'add' ? '/web/schoolTeach/add' : '/web/schoolTeach/edit';
    let subjectName = undefined;
    if (value.subjectId) {
      findAllSubjectList.forEach((item) => {
        if (item.value == value.subjectId) {
          subjectName = item.label;
        }
      });
    }
    const res = await request<API.GeneralInterface>(urls, {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...value,
        subjectName,
        version: formData.version || undefined,
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
      title: '教材名称',
      dataIndex: 'name',
      search: false,
    },
    {
      title: '涵盖学科',
      search: false,
      dataIndex: 'subjectName',
      // render: (text, record) => {
      //   let list: string[] = [];
      //   if (record.teachRelList) {
      //     list = record.teachRelList.map((item: { subjectName: string }) => item.subjectName);
      //   }
      //   return list.join('、');
      // },
    },
    {
      title: '排序',
      search: false,
      dataIndex: 'sort',
    },
    {
      title: '教材名称',
      dataIndex: 'name',
      // copyable: true,
      ellipsis: true,
      hideInTable: true,
    },
    {
      title: '学科名称',
      width: 80,
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
          setFindAllSubjectList(list);
        }
        return list;
      },
    },
    {
      title: '创建时间',
      key: 'createTime',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => [
        <Link key="chapter" to={`/educational/teaching/chapter/${record.id}/${record.name}`}>
          章节
        </Link>,
        <a
          key="editable"
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
  ];

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<TableListData>('/web/schoolTeach/list', {
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

  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
  }, [createModalVisible]);

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
          <Button
            key="button"
            type="primary"
            onClick={() => {
              setTypes('add');
              handleModalVisible(true);
            }}
          >
            新增
          </Button>,
          <Button
            type="primary"
            onClick={() => {
              if (lisyEditableKeys.length === 0) {
                message.error('请选择要删除的教材');
                return;
              }
              Modal.confirm({
                title: '提醒',
                // icon: "",
                content: '确认是否删除这些教材？',
                okText: '确认',
                cancelText: '取消',
                centered: true,
                onOk: async () => {
                  // console.log(lisyEditableKeys, '确认删除');
                  // return true;
                  await deleteCl(lisyEditableKeys.toString());
                  setLisyEditableKeys([]);
                },
              });
            }}
          >
            批量删除
          </Button>,
        ]}
      />

      <ModalForm
        form={form}
        title={types === 'add' ? '教材新增' : '教材修改'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormText
          name="name"
          label="教材名称"
          rules={[
            {
              required: true,
              message: '教材名称为必填项',
            },
          ]}
          placeholder="请输入教材名称"
        />
        <ProFormSelect
          label="学科选择"
          name="subjectId"
          options={findAllSubjectList}
          placeholder="请选择学科"
        />
        <ProFormDigit name="sort" label="排序" />
        <ProFormTextArea label="备注" name="remark" placeholder="请输入备注" />
      </ModalForm>
    </div>
  );
};
