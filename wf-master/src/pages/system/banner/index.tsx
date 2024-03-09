import { useRef, useState, useEffect } from 'react';
import { Button, message, Popconfirm, Switch, Form, Image } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormUploadButton,
  ProFormSelect,
} from '@ant-design/pro-form';

import request from '@/utils/umi-request';
import { GithubIssueItem, OperlogList, SchoolBanner } from './data';

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<GithubIssueItem>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [rotationList, setRotationList] = useState<{ label: string; value: string }[]>([]);

  const [form] = Form.useForm();

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolBanner/' + id, {
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
      title: '轮播名称',
      dataIndex: 'name',
    },
    {
      title: '轮播图片',
      search: false,
      dataIndex: 'imgUrl',
      render: (_text, record) => {
        if (record.imgUrl) {
          return <Image width={50} src={`/question-api${record.imgUrl}`} />;
        }
        return undefined;
      },
    },
    {
      title: '链接跳转',
      search: false,
      dataIndex: 'url',
      ellipsis: true,
      // copyable: true,
    },
    {
      title: '轮播位置',
      search: false,
      dataIndex: 'siteValue',
    },
    {
      title: '轮播位置',
      dataIndex: 'site',
      hideInTable: true,
      request: async () => {
        const res = await request('/system/dict/data/page', {
          method: 'GET',
          params: {
            pageNum: 1,
            pageSize: 1000,
            dictType: 'rotation_position',
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
        setRotationList(list);
        return list;
      },
    },
    {
      title: '轮播排序',
      search: false,
      dataIndex: 'order',
    },
    {
      title: '创建人',
      search: false,
      dataIndex: 'createName',
    },
    {
      title: '轮播状态',
      search: false,
      dataIndex: 'status',
      render: (text, record) => (
        <Switch
          onChange={(val) => statusCh(record, val)}
          defaultChecked
          checked={text == '0' ? false : true}
        />
      ),
    },
    {
      title: '上传时间',
      search: false,
      dataIndex: 'createTime',
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => {
        const node = renderRemoveUser('删除', record.id || '');
        return [
          <a
            key="editable"
            onClick={() => {
              setFormData(record);
              setTypes('edit');
              handleModalVisible(true);
              form.setFieldsValue({
                ...record,
                imgUrl: [
                  {
                    url: `/question-api${record.imgUrl}`,
                    status: 'done',
                  },
                ],
              });
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
    const res = await request<OperlogList>('/web/schoolBanner/list', {
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
  /** 状态修改出发事件 **/
  const statusCh = async (data: GithubIssueItem, val: boolean) => {
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request('/web/schoolBanner', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...data,
        status: val ? '1' : '0',
      },
    });
    if (res && res.code === 200) {
      message.success('状态修改成功');
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };

  /** 新增/编辑提交操作 **/
  const onFinish = async (value: SchoolBanner) => {
    // console.log(value, '------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    let imgUrl = value.imgUrl[0].url.replace('/question-api', '');
    const res = await request('/web/schoolBanner', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...formData,
        ...value,
        handleType: types,
        imgUrl,
      },
    });
    if (res && res.code === 200) {
      message.success(types === 'add' ? '新增成功' : '修改成功');
      handleModalVisible(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };

  const handleChange = (info: { file: any; fileList: any }) => {
    let fileList = [...info.fileList];
    // console.log(info, '----------------');
    if (info.file.status === 'done') {
      if (info.file.response.code === 200) {
        fileList = fileList.slice(-1);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        fileList = fileList.map((file) => {
          if (file.response) {
            file.url = file.response.fileName;
          }
          return file;
        });
      } else if (info.fileList && info.fileList.length) {
        message.error(info.file.response.msg);
        info.fileList = [];
      }
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
        ]}
      />
      <ModalForm
        form={form}
        title={types === 'add' ? '添加轮播图' : '编辑轮播图'}
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
              message: '轮播图名称为必填项',
            },
            {
              max: 200,
              message: '轮播图名称长度不能超过200个字符',
            },
          ]}
          name="name"
          label="轮播名称"
        />
        <ProFormUploadButton
          name="imgUrl"
          label="图片上传"
          rules={[
            {
              required: true,
              message: '图片上传为必填项',
            },
          ]}
          max={1}
          fieldProps={{
            name: 'file',
            listType: 'picture-card',
            headers: {
              // Authorization: `Bearer ${localStorage.getItem('headers_token')}`,
            },
          }}
          action="/question-api/common/upload"
          onChange={handleChange}
        />
        <ProFormDigit
          rules={[
            {
              required: true,
              message: '轮播排序为必填项',
            },
          ]}
          name="order"
          label="轮播排序"
        />
        <ProFormText name="url" label="跳转地址" />
        <ProFormSelect
          label="轮播位置"
          placeholder="请选择轮播位置"
          rules={[{ required: true, message: '轮播位置为必填项' }]}
          options={rotationList}
          name="site"
        />
      </ModalForm>
    </div>
  );
};
