import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';

export function getBasicColumns(): BasicColumn[] {
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
      title: '联系电话',
      dataIndex: 'linkManPhone',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slots: { customRender: 'status' },
    },

    {
      title: '有效期',
      dataIndex: 'validTime',
      slots: { customRender: 'validTime' },
    },
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
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [...getSchema()],
  };
}
