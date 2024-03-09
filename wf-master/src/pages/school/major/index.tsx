/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Popconfirm, Tree } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import {
  ModalForm,
  ProFormText,
  ProFormDigit,
  ProFormTextArea,
  ProFormSelect,
} from '@ant-design/pro-form';
import { DeleteTwoTone, EditTwoTone } from '@ant-design/icons';

import './style.less';

import { FormData, GithubIssueItem, DictData } from './data';

export default () => {
  const actionRef = useRef<ActionType>();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  /** 编辑专业分类的弹窗 */
  const [createModalVisible1, handleModalVisible1] = useState<boolean>(false);

  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<FormData>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [parentId, setParentId] = useState<string>('0'); // 选中章节id

  const [dictList, setDictList] = useState<API.ProFormSelectType[]>([]); // 专业分类数据
  const [arrangement, setArrangement] = useState<number>(0); // 选中树结构层次
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);

  const [form] = Form.useForm();
  const [form1] = Form.useForm();

  const deleteCl = async (id: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolMajor/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      getDictList();
      if (actionRef.current) {
        actionRef.current.reload();
      }
      return true;
    } else {
      message.error(res.msg);
      return false;
    }
  };

  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 100,
    },
    {
      title: parentId == '0' ? '专业分类' : '专业名称',
      dataIndex: 'name',
      search: false,
      render: (text, record) => <span>{record.name || record.dictLabel || ''}</span>,
    },
    {
      title: '专业编码',
      dataIndex: 'code',
      search: false,
      hideInTable: parentId == '0' ? true : false,
    },
    {
      title: '备注信息',
      search: false,
      dataIndex: 'remark',
      // copyable: true,
      ellipsis: true,
    },
    // {
    //   title: '排序',
    //   search: false,
    //   dataIndex: 'order',
    // },
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
        <a onClick={() => editTwoToneCl(record.id, arrangement == 0 ? 1 : 2)}>修改</a>,
        renderRemoveUser('删除', record.id || ''),
      ],
    },
  ];

  /** 列表数据 **/
  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const urls = parentId == '0' ? '/system/dict/data/page' : '/web/schoolMajor/list';
    let params = {};
    if (parentId == '0') {
      params = {
        pageNum: 1,
        pageSize: 1000,
        dictType: 'major_category',
      };
    } else {
      params = {
        ...datas,
        parentId: arrangement != 2 ? parentId : undefined,
        id: arrangement != 2 ? undefined : parentId,
      };
    }
    const res = await request<DictData>(urls, {
      method: 'GET',
      params,
    });
    if (parentId == '0') {
      const list = res.data.list.map((item) => {
        return {
          label: item.dictLabel || '',
          value: item.id || '',
        };
      });
      list.unshift({
        label: '一级类目',
        value: 'classIcategory',
      });
      setDictList(list);
    }
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

  /** 专业详情数据 **/
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const getSchoolMajorDel = async (id?: string) => {
    const res = await request('/web/schoolMajor/' + id, {
      method: 'GET',
    });
    if (res && res.code === 200) {
      return res.data;
    }
    return {};
  };

  const [treeData, setTreeData] = useState<any[]>();

  /** 专业分类树数据 **/
  const getDictList = async () => {
    const res = await request<{
      code: number;
      data?: { id: string; name: string; majorLists?: { id: string }[] }[];
    }>('/web/schoolMajor/categorSelectyMajor', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      const expandedKeys: string[] = [];
      const list = res.data.map((item) => {
        if (item.majorLists) {
          item.majorLists = item.majorLists.map((it) => {
            expandedKeys.push(it.id);
            return {
              ...it,
              key: it.id,
            };
          });
        }
        expandedKeys.push(item.id);
        return {
          ...item,
          key: item.id,
        };
      });
      setExpandedKeys(['0', ...expandedKeys]);
      // console.log(list, '------------------');
      setTreeData([{ name: '全部', key: '0', id: '0', majorLists: list }]);
    }
  };

  /** 树结构点击触发事件 **/
  const onSelect = (
    selectedKeys: any,
    e: { selected: boolean; selectedNodes: any; node: any; event: any },
  ) => {
    // console.log(selectedKeys, '------------------------');
    // console.log(e, '----------------------------');
    // return;
    const list = e.node.pos.split('-');
    // console.log(list.length - 2, '-------------------------');
    setArrangement(list.length - 2);
    setParentId(selectedKeys[0]);
    if (actionRef.current) {
      actionRef.current.reload();
    }
  };

  /** 树结构数据删除成功后更新树结构 **/
  const treeDataHandle = (
    data: { id: string; children: { id: string; children: any }[] }[],
    id: string,
  ) => {
    const list = [...data];
    data.forEach((item, index) => {
      if (item.id == id) {
        list.splice(index, 1);
        return;
      }
      if (item.children) {
        item.children = treeDataHandle(item.children, id);
      }
    });
    return list;
  };

  /** 专业分类删除 **/
  const dictDelete = async (id: string) => {
    const res = await request<API.GeneralInterface>('/system/dict/data/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success(res.msg || '专业分类删除成功');
      getDictList();
      if (parentId === id || parentId === '0') {
        setParentId('0');
        if (actionRef.current) {
          actionRef.current.reload();
        }
      }
    } else {
      message.error(res.msg);
    }
  };

  /** 点击列表删除按钮触发事件 **/
  const renderRemoveUser = (text: string, id: string) => (
    <Popconfirm
      key="popconfirm"
      title={`确认${text}吗?`}
      okText="是"
      cancelText="否"
      onConfirm={() => {
        if (parentId === '0') {
          dictDelete(id);
        } else {
          deleteCl(id);
        }
      }}
    >
      <a>{text}</a>
    </Popconfirm>
  );

  /** 树结构删除触发事件 **/
  const treeDelete = async (id: string | undefined, arrangement: number) => {
    if (arrangement === 2) {
      await deleteCl(id || '');
      getDictList();
    } else if (arrangement === 1) {
      dictDelete(id || '');
    }
  };

  /** 编辑 **/
  const editTwoToneCl = async (id: string | undefined, arrangement: number) => {
    // console.log(id, arrangement, '-----------------');
    if (arrangement === 2) {
      const list = await getSchoolMajorDel(id);
      handleModalVisible(true);
      setFormData(list);
      setTypes('edit');
      form.setFieldsValue(list);
    } else {
      const res = await request('/system/dict/data/' + id, {
        method: 'GET',
      });
      setTypes('edit');
      handleModalVisible1(true);
      if (res && res.code === 200) {
        form1.setFieldsValue({
          ...res.data,
          dictName: res.data.dictLabel,
        });
        setFormData(res.data);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-shadow
  const renderTree = (
    data: {
      majorLists: any;
      checkable: any;
      name: {} | null | undefined;
      key: React.Key | null | undefined;
      id?: string;
    }[],
    arrangement: number,
  ) => {
    if (!data) return;
    return data.map((item) => {
      if (item.majorLists) {
        return (
          <Tree.TreeNode
            title={
              <div className="tree_treeNodes">
                {' '}
                {item.checkable && <input type="checkbox" name="" id="" />} {item.name}
                {item.key != '0' && (
                  <div className="icons" onClick={(event) => event.stopPropagation()}>
                    <EditTwoTone onClick={() => editTwoToneCl(item.id, arrangement)} />
                    <Popconfirm
                      key="popconfirm"
                      title={`确认删除吗?`}
                      okText="是"
                      cancelText="否"
                      onConfirm={async () => {
                        treeDelete(item.id, arrangement);
                      }}
                    >
                      <DeleteTwoTone className="delete" twoToneColor="red" />
                    </Popconfirm>
                  </div>
                )}
              </div>
            }
            key={item.key}
            checkable
          >
            {renderTree(item.majorLists, arrangement + 1)}
          </Tree.TreeNode>
        );
      }
      return (
        <Tree.TreeNode
          title={
            <div className="tree_treeNodes">
              {' '}
              {item.checkable && <input type="checkbox" name="" id="" />} {item.name}
              {item.key != '0' && (
                <div className="icons" onClick={(event) => event.stopPropagation()}>
                  <EditTwoTone onClick={() => editTwoToneCl(item.id, arrangement)} />
                  <Popconfirm
                    key="popconfirm"
                    title={`确认删除吗?`}
                    okText="是"
                    cancelText="否"
                    onConfirm={async () => {
                      treeDelete(item.id, arrangement);
                      // console.log(123456);
                      // deleteCl(id);
                    }}
                  >
                    <DeleteTwoTone className="delete" twoToneColor="red" />
                  </Popconfirm>
                </div>
              )}
            </div>
          }
          key={item.key}
          checkable
        />
      );
    });
    // console.log(arr);
  };

  /** 新增/编辑专业提交操作 **/
  const onFinish = async (value: GithubIssueItem) => {
    // console.log(value, '------------');
    // return;
    if (value.parentId === 'classIcategory') {
      onFinish1({
        dictLabel: value.dictName,
        remark: value.remark,
        id: value.id,
      });
      return;
    }
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request<API.GeneralInterface>('/web/schoolMajor', {
      method: types === 'add' ? 'POST' : 'PUT',
      data: {
        ...value,
        version: formData.version,
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      handleModalVisible(false);
      getDictList();
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };

  /** 编辑专业提交操作 **/
  const onFinish1 = async (value: { dictLabel?: string; id?: string; remark?: string }) => {
    // console.log(value, formData, '------------');
    // return;
    if (repeatIs) return;
    setRepeatIs(true);
    const res = await request<API.GeneralInterface>('/system/dict/data', {
      method: types === 'add' ? 'POST' : 'POST',
      data: {
        ...formData,
        ...value,
        dictValue: value.dictLabel,
        dictType: 'major_category',
      },
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      handleModalVisible1(false);
      handleModalVisible(false);
      getDictList();
      if (parentId === '0' && actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
    setRepeatIs(false);
  };

  const onExpand = (expandedKeysValue: React.Key[]) => {
    // console.log('onExpand', expandedKeysValue);
    // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.
    setExpandedKeys(expandedKeysValue);
  };

  useEffect(() => {
    getDictList();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      setRepeatIs(false);
      form.resetFields();
    }
    if (!createModalVisible1) {
      setFormData({});
      setRepeatIs(false);
      form1.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createModalVisible, createModalVisible1]);

  return (
    <div className="major_list">
      <div className="major_list_left">
        <Tree onSelect={onSelect} onExpand={onExpand} expandedKeys={expandedKeys}>
          {renderTree(treeData || [], 0)}
        </Tree>
      </div>
      <div className="major_list_right">
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
          search={false}
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
              新增专业
            </Button>,
          ]}
        />
      </div>
      <ModalForm
        form={form}
        title={types === 'add' ? '添加专业' : '编辑专业'}
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormSelect
          label="选择分类"
          name="parentId"
          rules={[
            {
              required: true,
              message: '分类为必填项',
            },
          ]}
          options={dictList}
        />
        <Form.Item noStyle shouldUpdate>
          {(form) => {
            // console.log(form.getFieldsValue().parentId === 'classIcategory', '--------');
            if (form.getFieldsValue().parentId === 'classIcategory') {
              return (
                <ProFormText
                  rules={[
                    {
                      required: true,
                      message: '分类名称为必填项',
                    },
                  ]}
                  name="dictName"
                  label="分类名称"
                  placeholder="请输入分类名称"
                />
              );
            } else {
              return (
                <>
                  <ProFormText
                    rules={[
                      {
                        required: true,
                        message: '专业名称为必填项',
                      },
                    ]}
                    name="name"
                    label="专业名称"
                    placeholder="请输入专业名称"
                  />
                  <ProFormText name="code" label="专业编码" placeholder="请输入专业编码" />
                  <ProFormDigit name="order" label="排序" placeholder="请输入排序" />
                </>
              );
            }
          }}
        </Form.Item>
        <ProFormTextArea
          key="ProFormTextArea"
          label="备注"
          name="remark"
          placeholder="请输入备注"
        />
      </ModalForm>

      <ModalForm
        form={form1}
        title={types === 'add' ? '添加专业分类' : '编辑专业分类'}
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
              message: '专业分类名称为必填项',
            },
          ]}
          name="dictLabel"
          label="专业分类名称"
          placeholder="请输入专业分类名称"
        />
        <ProFormTextArea
          key="ProFormTextArea1"
          label="备注"
          name="remark"
          placeholder="请输入备注"
        />
      </ModalForm>
    </div>
  );
};
