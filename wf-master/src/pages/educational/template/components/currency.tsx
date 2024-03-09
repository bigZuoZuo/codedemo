/* eslint-disable react-hooks/rules-of-hooks */
import { ModalForm } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import { Button, Form, Select, Tag } from 'antd';
import { ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';

const { Option } = Select;

type Currencys = {
  data?: any;
  currencyChange?: any;
  topicTypeList?: { dictLabel?: string; id?: string }[];
};

type DataSourceType = {
  id?: any;
  type?: string;
  difficulty?: number;
  medium?: number;
  easy?: number;
  score?: number;
};

const Currency = ({ data, currencyChange, topicTypeList }: Currencys) => {
  const [form] = Form.useForm();
  const [createModalVisible, handleModalVisible] = useState(false);

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    data.commonList.map((item: { id: any }) => item.id),
  );

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '题型',
      key: 'type',
      dataIndex: 'type',
      valueType: 'select',
      valueEnum: () => {
        const list = {};
        topicTypeList?.forEach((item) => {
          list[item.id || ''] = {
            text: item.dictLabel,
          };
        });
        return list;
      },
    },
    {
      title: '困难（道）',
      dataIndex: 'difficulty',
      valueType: 'digit',
    },
    {
      title: '中等（道）',
      dataIndex: 'medium',
      valueType: 'digit',
    },
    {
      title: '简单（道）',
      dataIndex: 'easy',
      valueType: 'digit',
    },
    {
      title: '单题分值（分）',
      dataIndex: 'score',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: () => {
        return null;
      },
    },
  ];
  /** 选中知识点删除 **/
  const preventDefault = (idx: number) => {
    console.log(idx);
    data.knowledgeList.splice(idx, 1);
    currencyChange('knowledgeList', data.knowledgeList);
    // console.log(data,"----------------------");
  };

  const onFinishModal = async (value: { knowledgePoints: string[] }) => {
    console.log(value);
    const knowledgeList: { knowledgeId: string; knowledgeName: string }[] = [];
    data.knowledgePoints.forEach((item: { name: string; id: string }) => {
      if (value.knowledgePoints.includes(item.id)) {
        knowledgeList.push({
          knowledgeId: item.id,
          knowledgeName: item.name,
        });
      }
    });
    currencyChange('knowledgeList', knowledgeList);
    handleModalVisible(false);
  };

  useEffect(() => {
    if (!createModalVisible) {
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <div className="currencys">
      <div className="knowledgeList">
        <div style={{ paddingBottom: '20px' }}>
          {data.knowledgeList.map((item: { knowledgeName: string }, index: number) => (
            <Tag
              key={index}
              className="currencys_tag"
              closable
              onClose={(e) => {
                preventDefault(index);
                e.preventDefault();
              }}
            >
              {item.knowledgeName}
            </Tag>
          ))}
        </div>
        <Button
          onClick={() => {
            const knowledgeList = data.knowledgeList
              ? data.knowledgeList.map((item: { knowledgeId: string }) => item.knowledgeId)
              : [];
            form.setFieldsValue({
              knowledgePoints: knowledgeList,
            });
            handleModalVisible(true);
          }}
        >
          添加
        </Button>
      </div>
      <div>
        <EditableProTable<DataSourceType>
          key={data.key}
          columns={columns}
          className="editableProTables"
          rowKey="id"
          scroll={{
            x: 850,
          }}
          value={data.commonList}
          recordCreatorProps={{
            newRecordType: `dataSource`,
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              // console.log(recordList, "-----------------------")
              // setDataSource(recordList);
              currencyChange('commonList', recordList);
            },
            onChange: setEditableRowKeys,
          }}
        />
      </div>
      <ModalForm
        form={form}
        title="选择知识点"
        width={500}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinishModal}
      >
        <Form.Item
          name="knowledgePoints"
          label="知识点"
          rules={[{ required: false, message: '选择知识点' }]}
        >
          <Select allowClear placeholder="选择知识点" mode="multiple" maxTagCount="responsive">
            {data.knowledgePoints.map((item: { id: string; name: string }) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
      </ModalForm>
    </div>
  );
};

export default Currency;
