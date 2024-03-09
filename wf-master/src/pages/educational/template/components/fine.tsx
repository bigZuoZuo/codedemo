import { Key, ReactChild, ReactFragment, ReactPortal, useEffect } from 'react';
import ProForm, {
  ProFormDigit,
  ProFormGroup,
  ProFormList,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { message, Form, Select } from 'antd';
import { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table';
const { Option } = Select;

type DataSourceType = {
  id?: any;
  type?: any;
  difficulty?: any;
  medium?: any;
  easy?: any;
  score?: any;
};

const Fine = ({ data, fineChange, topicTypeList, facilityValue }: any) => {
  const [form] = Form.useForm();

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '题号',
      dataIndex: 'questionNumber',
      valueType: 'digit',
    },
    {
      title: '难度',
      dataIndex: 'difficulty',
      valueType: 'select',
      valueEnum: () => {
        const list = {};
        facilityValue?.forEach((item: { id: string | number; dictLabel: any }) => {
          list[item.id] = {
            text: item.dictLabel,
          };
        });
        return list;
      },
    },
    {
      title: '知识点',
      dataIndex: 'knowledgeList',
      // valueType: 'digit',
      renderFormItem: (text) => {
        return (
          <Select
            allowClear
            placeholder="请选择知识点"
            mode="multiple"
            maxTagCount="responsive"
            // onChange={async (val) => {}}
          >
            {data.knowledgePoints.map((item: { id: string; name: string }) => {
              return (
                <Option key={item.id} value={item.id}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        );
      },
    },
    {
      title: '分数',
      dataIndex: 'score',
      valueType: 'digit',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 100,
      fixed: 'right',
      render: (text, record, _, action) => {
        return [
          <a
            key="editable"
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            编辑
          </a>,
        ];
      },
    },
  ];

  const onValuesChange = (changedValues: any, allValues: any) => {
    // console.log(data, '------------');
    // console.log(changedValues, 'changedValues-----');
    // console.log(allValues, '-----------------------------');
    let typeVOList = [...allValues.typeVOList];
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    typeVOList = typeVOList.map((item: any, index: any) => {
      item.counts = item.fineVOList ? item.fineVOList.length : 0;
      if (item.fineVOList) {
        item.score = 0;
        const isn =
          data.typeVOList[index] &&
          data.typeVOList[index].fineVOList &&
          item.fineVOList.length !== data.typeVOList[index].fineVOList.length;

        item.fineVOList = item.fineVOList.map((it: any) => {
          if (isn) {
            const its: any =
              data.typeVOList[index].fineVOList.find((itn: { id: any }) => itn.id === it.id) ||
              null;
            // eslint-disable-next-line no-param-reassign
            it = its ? its : it;
          }
          item.score = (item.score || 0) + (it.score || 0);
          return it;
        });
      }
      return item;
    });
    // console.log(typeVOList, '--------------');
    form.setFieldsValue({
      typeVOList: typeVOList,
    });
    fineChange(typeVOList);
  };

  useEffect(() => {
    // console.log(data.typeVOList, '--------------------');
    form.setFieldsValue({
      typeVOList: data.typeVOList,
    });
  }, [data.key]);

  return (
    <ProForm submitter={false} form={form} onValuesChange={onValuesChange}>
      <ProFormList
        key={data.key}
        name="typeVOList"
        label=""
        actionGuard={{
          beforeAddRow: async (defaultValue, insertIndex) => {
            return new Promise((resolve) => {
              console.log(defaultValue, insertIndex);
              setTimeout(() => resolve(true), 1000);
            });
          },
          beforeRemoveRow: async (index) => {
            return new Promise((resolve) => {
              if (index === 0) {
                message.error('这行不能删');
                resolve(false);
                return;
              }
              setTimeout(() => resolve(true), 1000);
            });
          },
        }}
        itemRender={({ listDom, action }) => {
          return (
            <ProCard
              bordered
              extra={action}
              style={{
                marginBottom: 8,
              }}
            >
              {listDom}
            </ProCard>
          );
        }}
      >
        <ProFormGroup key="group">
          <ProFormSelect
            name="type"
            label="大题类型"
            valueEnum={() => {
              const list = {};
              topicTypeList?.forEach((item: { id: string | number; dictLabel: any }) => {
                list[item.id] = {
                  text: item.dictLabel,
                };
              });
              return list;
            }}
            style={{ minWidth: '200px' }}
          />
          <ProFormText name="summary" label="题目标题" />
          <ProFormDigit name="counts" label="题目数量" disabled />
          <ProFormDigit name="score" label="分数（分）" disabled />
          <ProForm.Item label="知识点设置" name="fineVOList" trigger="onValuesChange">
            <EditableProTable<DataSourceType>
              key={data.key}
              columns={columns}
              className="editableProTables"
              rowKey="id"
              scroll={{
                x: 850,
              }}
              recordCreatorProps={{
                newRecordType: `dataSource`,
                record: () => ({
                  id: Date.now(),
                }),
              }}
              editable={{
                type: 'multiple',
                actionRender: (row, config, defaultDoms) => {
                  return [defaultDoms.delete];
                },
              }}
            />
          </ProForm.Item>
        </ProFormGroup>
      </ProFormList>
    </ProForm>
  );
};

export default Fine;
