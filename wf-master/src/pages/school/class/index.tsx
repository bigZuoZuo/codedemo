import { SetStateAction, useEffect, useRef, useState } from 'react';
import { Button, Form, message, Modal, Popconfirm, Table } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormSelect,
  ProFormCascader,
} from '@ant-design/pro-form';
// const { Option } = Select;

import { DictData, GithubIssueItem } from './data';

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<GithubIssueItem>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [schoolSelectList, setSchoolSelectList] = useState<API.ProFormSelectType[]>([]); // 学校下拉数据
  const [schoolGradeList, setSchoolGradeList] = useState<API.ProFormSelectType[]>([]); // 年级下拉数据
  const [majorCategory, setMajorCategory] = useState<any[]>([]); // 专业类别下拉数据
  const [lisyEditableKeys, setLisyEditableKeys] = useState<any[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const [form] = Form.useForm();
  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolClass/' + id, {
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
    const res = await request('/web/schoolClass', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        version: formData.version || undefined,
        ...value,
        majorId: value.majorId ? value.majorId[1] : undefined,
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
      title={`请确认是否删除？（如果确认删除则关联的学生都将删除）`}
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

  const [columns, setColumns] = useState<ProColumns<GithubIssueItem>[]>([
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '班级名称',
      dataIndex: 'name',
      // // copyable: true,
      // ellipsis: true,
      search: false,
    },
    {
      title: '班级编号',
      search: false,
      dataIndex: 'number',
    },
    {
      title: '专业名称',
      search: false,
      dataIndex: 'majorName',
    },
    {
      title: '年级名称',
      search: false,
      dataIndex: 'gradeName',
    },
    {
      title: '老师统计',
      search: false,
      dataIndex: 'totalTeacher',
    },
    {
      title: '学生统计',
      search: false,
      dataIndex: 'totalStudent',
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
      title: '学校',
      hideInTable: true,
      dataIndex: 'schoolId',
      valueEnum: {},
    },
    {
      title: '年级',
      hideInTable: true,
      dataIndex: 'gradeId',
      valueEnum: {},
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
      title: '班级名称',
      dataIndex: 'name',
      hideInTable: true,
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'createTime',
      search: false,
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record) => {
        const node = renderRemoveUser('删除', record.id || '');
        return [
          <a
            onClick={() => {
              // majorId
              setTypes('edit');
              handleModalVisible(true);
              setFormData(record);
            }}
          >
            修改
          </a>,
          node,
        ];
      },
    },
  ]);

  const getDataList = async (datas: GithubIssueItem) => {
    const res = await request<DictData>('/web/schoolClass/list', {
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

  /** 年级下拉数据 **/
  const getSchoolGradeList = async () => {
    const res = await request<{
      code: number;
      data: { name: string; id: string }[];
    }>('/web/schoolGrade/gradeSelect', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      const objs = {};
      const list = res.data.map((item: { name: any; id: any }) => {
        objs[item.id] = {
          text: item.name,
        };
        return {
          label: item.name,
          value: item.id,
        };
      });
      const col = [...columns];
      col[10].valueEnum = objs;
      setColumns(col);
      setSchoolGradeList(list);
    }
  };

  /** 专业下拉数据 **/
  const getMajorCategory = async () => {
    const res = await request('/web/schoolMajor/categorSelectyMajor', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      const data: SetStateAction<any[]> = [];
      res.data.forEach((item: { majorLists: { name?: string; id: string }[] }) => {
        if (item.majorLists) {
          data.push(item);
        }
      });
      setMajorCategory(data);
    }
  };

  /** 学校下拉数据 **/
  const getSchoolSelectList = async () => {
    const res = await request<{
      code: number;
      data: { name: string; id: string }[];
    }>('/web/schoolDetails/schoolSelect', {
      method: 'GET',
    });
    if (res && res.code === 200) {
      const objs = {};
      const list = res.data.map((item: { name: any; id: any }) => {
        objs[item.id] = {
          text: item.name,
        };
        return {
          label: item.name,
          value: item.id,
        };
      });
      const col = [...columns];
      col[9].valueEnum = objs;
      setColumns(col);
      setSchoolSelectList(list);
    }
  };
  //
  const upgrade = async () => {
    const res = await request<API.GeneralInterface>(
      '/web/schoolClass/upgrade/' + lisyEditableKeys.toString(),
      {
        method: 'POST',
      },
    );
    if (res && res.code === 200) {
      message.success(res.msg);
      // setLisyEditableKeys([]);
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } else {
      message.error(res.msg);
      return false;
    }
  };

  useEffect(() => {
    getSchoolSelectList();
    getSchoolGradeList();
    getMajorCategory();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      form.resetFields();
    }
  }, [createModalVisible]);

  useEffect(() => {
    if (formData.id) {
      let majorId: string[] = [];
      majorCategory.forEach((item) => {
        item.majorLists.forEach((it: { id: string | undefined }) => {
          if (it.id == formData.majorId) {
            majorId = [item.id, it.id];
          }
        });
      });
      form.setFieldsValue({
        ...formData,
        majorId,
      });
    }
  }, [formData]);

  return (
    <div>
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        rowSelection={{
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          selectedRowKeys: lisyEditableKeys,
          onChange: (selectedRowKeys, selectedRows) => setLisyEditableKeys(selectedRowKeys),
        }}
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
          <Button key="button" type="primary">
            导入
          </Button>,
          <Button key="button" type="primary">
            导出
          </Button>,
          <Button
            key="button"
            type="primary"
            onClick={() => {
              if (lisyEditableKeys.length === 0) {
                message.error('请选择班级数据');
                return;
              }
              Modal.confirm({
                title: '班级升级',
                // icon: "",
                content: '班级将自动升级到下一年级，确认是否升级吗？',
                okText: '确认',
                cancelText: '取消',
                centered: true,
                onOk: async () => {
                  // console.log('确认升级');
                  return upgrade();
                },
              });
            }}
          >
            升级
          </Button>,
        ]}
      />
      {/* 班级新增 */}
      <ModalForm
        form={form}
        title={types === 'add' ? '班级新增' : '班级新增'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormSelect
          label="学校名称"
          name="schoolId"
          rules={[
            {
              required: true,
              message: '学校名称为必填项',
            },
          ]}
          options={schoolSelectList}
        />
        <ProFormCascader
          name="majorId"
          label="专业"
          placeholder="请选择专业"
          rules={[
            {
              required: true,
              message: '专业为必填项',
            },
          ]}
          fieldProps={{
            options: majorCategory,
            fieldNames: { label: 'name', value: 'id', children: 'majorLists' },
          }}
        />
        <ProFormSelect
          label="年级名称"
          name="gradeId"
          rules={[
            {
              required: true,
              message: '年级名称为必填项',
            },
          ]}
          options={schoolGradeList}
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '班级名称为必填项',
            },
          ]}
          name="name"
          label="班级名称"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '班级编号为必填项',
            },
          ]}
          name="number"
          label="班级编号"
        />



        <ProFormDigit name="order" label="排序" />
      </ModalForm>
    </div>
  );
};
