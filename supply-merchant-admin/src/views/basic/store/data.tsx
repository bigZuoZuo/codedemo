import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

import { getSupplierListApi } from "/@/api/common"
import { Tag, Space } from "ant-design-vue"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '门店编号',
      dataIndex: 'cStoreNo',
    },
    {
      title: '门店名称',
      dataIndex: 'cStoreName',
    },

    {
      title: '供应商',
      dataIndex: 'cSupName',
      customRender: ({ record }) =>
        <Space>
          {
            record.storeSupDtos.map(item =>
              <Tag color="blue">{item.cSupName}</Tag>)
          }
        </Space>
    }
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [


      {
        field: 'supDetail',
        label: '供应商',
        component: 'ApiSelect',
        componentProps: {
          api: getSupplierListApi,
          labelField: 'cSupName',
          valueField: 'cSupNo',
          mode: 'multiple',
          maxTagCount: 1
        },
        colProps: {
          span: 6,
        },
      },

    ],

  };
}

