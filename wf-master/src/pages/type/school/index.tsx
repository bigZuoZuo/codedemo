import { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, message, Popconfirm, Form } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { ModalForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-form';


export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<API.DictDataListItem>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);

  const [form] = Form.useForm();

  // 删除
  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/system/dict/data/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success(res.msg || '删除成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg || '删除失败');
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

  const columns: ProColumns<API.DictDataListItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '学校类型',
      dataIndex: 'dictLabel',
    },
    {
      title: '备注信息',
      search: false,
      dataIndex: 'remark',
      // copyable: true,
      ellipsis: true,
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
  /** 请求列表数据 **/
  const getDataList = async (datas: API.DictDataList) => {
    const res = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        ...datas,
        dictType: 'school_type',
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

  /** 编辑专业提交操作 **/
  const onFinish = async (value: API.DictDataListItem) => {
    // console.log(value, formData, '------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request<API.GeneralInterface>('/system/dict/data', {
      method: types === 'add' ? 'POST' : 'POST',
      data: {
        ...formData,
        ...value,
        dictType: 'school_type',
        dictValue: value.dictLabel,
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

  return (
    <>
      <ProTable<API.DictDataListItem>
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
        title={types === 'add' ? '添加' : '编辑'}
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
              message: '学校类型为必填项',
            },
          ]}
          name="dictLabel"
          label="学校类型"
          placeholder="请输入学校类型"
        />
        <ProFormTextArea label="备注" name="remark" placeholder="请输入备注" />
      </ModalForm>
    </>
  );
};
