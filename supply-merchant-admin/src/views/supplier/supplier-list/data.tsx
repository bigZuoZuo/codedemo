import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs from "dayjs"
import {
  getSupplyListWithRelationApi,
  getSupListWithRelationApi
} from "/@/api/common"
import { Tag } from "ant-design-vue"
export function getTableColumns(): BasicColumn[] {
  return [

    {
      title: '公司名称',
      dataIndex: 'companyName',
    },
    {
      title: '法人',
      dataIndex: 'legalPerson',
    },
    {
      title: '税号',
      dataIndex: 'taxNum',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: '手机号',
      dataIndex: 'tel',
    },
    {
      title: '传真',
      dataIndex: 'fax',
    },
    {
      title: '联系人',
      dataIndex: 'linkMan',
    },
    {
      title: '联系电话(登录账号)',
      dataIndex: 'linkManPhone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      // slots: { customRender: 'status' },
      customRender: ({ record }) => <Tag color={record.status === 1 ? 'green' : 'blue'}>{record.status === 1 ? '已启用' : '已禁用'}</Tag>
    },

    // {
    //   title: '有效期',
    //   dataIndex: 'validTime',
    //   slots: { customRender: 'validTime' },
    // },
    // {
    //   title: 'ERP供应商',
    //   dataIndex: 'erpSupList',
    //   slots: { customRender: 'erpSupList' },
    // },
  ];
}
export const getSchema = (): FormSchema[] => {
  return [
    {
      field: 'searchKey',
      label: '供应商名称',
      component: 'Input',
      colProps: {
        span: 6,
      },
    },

  ];
};
export function getTableFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [...getSchema()],
  };
}

export function getFormSchema(): FormSchema[] {
  return [
    // {
    //   field: 'companyName',
    //   component: 'Input',
    //   label: '公司名称',
    //   required: true,
    // },
    // {
    //   field: 'legalPerson',
    //   component: 'Input',
    //   label: '法人',
    //   required: true,
    // },
    // {
    //   field: 'taxNum',
    //   component: 'Input',
    //   label: '税号',
    //   required: true,
    // },
    // {
    //   field: 'email',
    //   component: 'Input',
    //   label: 'Email',
    //   required: true,
    // },
    // {
    //   field: 'tel',
    //   component: 'Input',
    //   label: '手机号',
    //   required: true,
    // },
    // {
    //   field: 'fax',
    //   component: 'Input',
    //   label: '传真',
    //   required: true,
    // },
    // {
    //   field: 'linkMan',
    //   component: 'Input',
    //   label: '联系人',
    //   required: true,
    // },
    // {
    //   field: 'linkManPhone',
    //   component: 'Input',
    //   label: '联系人电话(登录账号)',
    //   required: true,
    // },
    // {
    //   field: 'loginPwd',
    //   component: 'InputPassword',
    //   label: '登录密码',
    //   required: true,
    // },
    // {
    //   field: 'fieldTime',
    //   component: 'RangePicker',
    //   label: '商户有效期',
    //   componentProps: {
    //     showTime: {
    //       defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
    //     },
    //     style: { width: '100%' },
    //   },

    //   required: true,
    // },
    {
      field: 'fieldTime',
      component: 'RangePicker',
      label: '商户有效期',
      componentProps: {
        showTime: {
          defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
        },
        style: { width: '100%' },
      },

      required: true,
    },
    {
      field: 'supplyInfoId',
      component: 'ApiSelect',
      label: '供应商',
      componentProps: {
        api: getSupplyListWithRelationApi,
        labelField: 'companyName',
        valueField: 'id'
      },
      required: true,
    },
    {
      field: 'erpSupplyCode',
      component: 'ApiSelect',
      label: 'ERP供应商',
      componentProps: {
        api: getSupListWithRelationApi,
        labelField: 'cSupName',
        valueField: 'cSupNo',
      },
      required: true,
    },


  ];
}
