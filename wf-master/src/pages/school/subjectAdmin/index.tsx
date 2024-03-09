import { SetStateAction, useEffect, useRef, useState } from 'react';
import { Button, Form, message, Popconfirm, Select } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import {
  ModalForm,
  ProFormText,
  ProFormSelect,
  ProFormTextArea,
  ProFormCascader,
  ProFormRadio,
  ProFormCheckbox,
} from '@ant-design/pro-form';

import { GithubIssueItem, SpecialtyTree, TableListData } from './data';

const { Option } = Select;

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible1, handleModalVisible1] = useState<boolean>(false);
  const [createModalVisible2, handleModalVisible2] = useState<boolean>(false);
  const [types1, setTypes1] = useState<string>('add');
  const [formData, setFormData] = useState<GithubIssueItem>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [options, setOptions] = useState<SpecialtyTree[]>([]); // 所属专业数据
  const [dataPage, setDataPage] = useState<API.ProFormSelectType[]>([]); // 类型数据
  const [form1] = Form.useForm();
  const [form2] = Form.useForm();

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolSubject/' + id, {
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

  const [columns, setColumns] = useState<ProColumns<GithubIssueItem>[]>([
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: '学科名称',
      dataIndex: 'name',
    },
    {
      title: '所属专业',
      search: false,
      dataIndex: 'majorName',
      render: (text, record) => {
        if (record.majorName && record.majorName?.split(',').length > 3) {
          let list = record.majorName?.split(',');
          return (
            <a
              onClick={() => {
                handleModalVisible2(true);
                form2.setFieldsValue({
                  majorName: record.majorName,
                });
              }}
              style={{color:"black"}}
            >{`${list[0]},${list[1]},${list[2]}等${list.length}个专业`}</a>
          );
        } else {
          return record.majorName;
        }
      },
    },
    {
      title: '类别',
      dataIndex: 'typeValue',
      search: false,
    },
    {
      title: '专业',
      // width: 80,
      dataIndex: 'majorUuids',
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
      title: '类别',
      dataIndex: 'type',
      valueEnum: {},
      hideInTable: true,
    },
    {
      title: '所属类目',
      search: false,
      dataIndex: 'category',
      render: (text, record) => {
        if (record.category) {
          let list = [];
          if (record.category.indexOf("1") != -1) {
            list.push("学科")
          }
          if (record.category.indexOf("2") != -1) {
            list.push("科目")
          }
          return list.toString();
        }else{
          return text;
        }
      }
    },
    {
      title: '备注信息',
      search: false,
      dataIndex: 'remark',
      ellipsis: true,
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
      width: 180,
      render: (text, record) => [
        <a
          key="editable"
          onClick={() => {
            setTypes1('edit');
            setFormData(record);
            handleModalVisible1(true);
            let relMajorList: any[] = [];
            if (record.relMajorList) {
              record.relMajorList.forEach((item) => {
                relMajorList.push([item.categoryId, item.majorId]);
              });
            }
            let category: string[] = [];
            if (record.category) {
              category = record.category.split(",")
            }
            form1.setFieldsValue({
              ...record,
              relMajorList,
              category
            });
          }}
        >
          修改
        </a>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
  ]);

  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request<TableListData>('/web/schoolSubject/list', {
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

  /** 学科、新增/编辑提交操作 **/
  const onFinish1 = async (value: { relMajorList: any[]; category?: string[] }) => {
    // console.log(value, formData, '------------');
    const relMajorList: { categoryId: string; majorId: string }[] = [];
    if (value.relMajorList) {
      value.relMajorList.forEach((item) => {
        if (item.length === 1) {
          let list: SpecialtyTree = options.find((its) => its.id == item[0]) || {};
          if (list && list.majorLists) {
            list.majorLists.forEach((it) => {
              relMajorList.push({
                categoryId: list.id || '', //分类id
                majorId: it.id || '', //专业id
              });
            });
          }
        } else {
          relMajorList.push({
            categoryId: item[0] || '', //分类id
            majorId: item[1] || '', //专业id
          });
        }
      });
    }
    // console.log(relMajorList, '----------------------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request('/web/schoolSubject', {
      method: types1 === 'add' ? 'POST' : 'PUT',
      data: {
        ...value,
        relMajorList,
        version: formData.version || undefined,
        category: value.category ? value.category.toString() : undefined,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      handleModalVisible1(false);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };
  /** 类型数据 **/
  const getDataPage = async () => {
    const res = await request<API.DictData>('/system/dict/data/page', {
      method: 'GET',
      params: {
        pageNum: 1,
        pageSize: 1000,
        dictType: 'subject_type',
      },
    });
    if (res && res.code === 200) {
      const objs = {};
      const list = res.data.list.map((item: { dictLabel?: string; id?: string }) => {
        objs[item.id || ''] = {
          text: item.dictLabel,
        };
        return {
          label: item.dictLabel || '',
          value: item.id || '',
        };
      });
      const colu = [...columns];
      colu[5].valueEnum = objs;
      setColumns(colu);
      setDataPage(list);
    }
  };

  /** 获取专业数据 **/
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
      setOptions(data);
    }
  };

  const onFinish2 = async () => {
    handleModalVisible2(false);
  };

  useEffect(() => {
    getDataPage();
    getMajorCategory();
  }, []);

  useEffect(() => {
    if (!createModalVisible1) {
      setFormData({});
      setRepeatIs(false);
      form1.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModalVisible1]);

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
              setTypes1('add');
              handleModalVisible1(true);
            }}
          >
            新增学科
          </Button>,
        ]}
      />
      {/* 新增学科 */}
      <ModalForm
        form={form1}
        title={types1 === 'add' ? '添加学科' : '编辑学科'}
        width={500}
        visible={createModalVisible1}
        onVisibleChange={handleModalVisible1}
        onFinish={onFinish1}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormText
          rules={[
            {
              required: true,
              message: '学科名称为必填项',
            },
          ]}
          name="name"
          label="学科名称"
        />
        <ProFormSelect
          label="类别"
          name="type"
          rules={[
            {
              required: true,
              message: '类别为必填项',
            },
          ]}
          options={dataPage}
        />
        <ProFormCascader
          name="relMajorList"
          label="所属专业"
          placeholder="请选择所属专业"
          // rules={[
          //   {
          //     required: true,
          //     message: '所属专业为必填项',
          //   },
          // ]}
          fieldProps={{
            options: options,
            fieldNames: { label: 'name', value: 'id', children: 'majorLists' },
            multiple: true,
          }}
        />
        <ProFormText name="order" label="排序" />
        <ProFormCheckbox.Group
          name="category"
          label="所属类目"
          options={[
            {
              label: '学科',
              value: '1',
            },
            {
              label: '科目',
              value: '2',
            },
          ]}
        />
        <ProFormTextArea label="备注" name="remark" placeholder="请输入" />
      </ModalForm>

      <ModalForm
        form={form2}
        title="所属专业"
        width={500}
        visible={createModalVisible2}
        onVisibleChange={handleModalVisible2}
        onFinish={onFinish2}
      >
        <ProFormTextArea name="majorName" placeholder="" fieldProps={{ rows: 5 }} disabled />
      </ModalForm>
    </div>
  );
};
