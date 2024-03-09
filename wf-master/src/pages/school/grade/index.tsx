import { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { FormDataTy, TableListItem, DictData } from './data';

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<FormDataTy>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [form] = Form.useForm();
  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolGrade/' + id, {
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
  const onFinish = async (value: FormDataTy) => {
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request('/web/schoolGrade', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...value,
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

  const columns: ProColumns<TableListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '年级名称',
      dataIndex: 'name',
    },
    {
      title: '排序',
      dataIndex: 'order',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '用户操作',
      width: 180,
      key: 'option',
      valueType: 'option',
      render: (text, record) => {
        const node = renderRemoveUser('删除', record.id || '');
        return [
          <a
            key="edit"
            onClick={() => {
              handleModalVisible(true);
              setTypes('edit');
              setFormData(record);
              form.setFieldsValue(record);
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
    const res = await request<DictData>('/web/schoolGrade/list', {
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

  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <div>
      <ProTable<TableListItem>
        columns={columns}
        actionRef={actionRef}
        request={(params = {}) => {
          const datas: { pageNum: number; pageSize: number } = {
            ...params,
            pageNum: params.current || 1,
            pageSize: params.pageSize || 10,
          };
          return getDataList(datas);
        }}
        rowKey="key"
        pagination={{
          showQuickJumper: true,
          pageSize: 10,
        }}
        search={false}
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
        ]}
      />
      {/* 年级新增 */}
      <ModalForm
        form={form}
        title={types === 'add' ? '年级新增' : '年级新增'}
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
              message: '年级名称为必填项',
            },
          ]}
          name="name"
          label="年级名称"
        />
        <ProFormText
          name="order"
          label="排序"
          rules={[
            {
              required: true,
              message: '排序为必填项',
            },
          ]}
        />
      </ModalForm>
    </div>
  );
};
