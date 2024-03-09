import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
// import dayjs, { Dayjs } from 'dayjs';
// import { getStoreListApi, getSupplierListApi } from "../../../api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '供应商编号',
      dataIndex: 'cSupNo',
    },
    {
      title: '供应商名称',
      dataIndex: 'cSupName',
    },
    {
      title: '行业',
      dataIndex: 'cTrade',
    },
    {
      title: '开户行',
      dataIndex: 'cBank',
    },
    {
      title: '账户',
      dataIndex: 'cAccount',
    },
    {
      title: '法人',
      dataIndex: 'clPerson',
    },
    {
      title: '法人电话',
      dataIndex: 'cPhone',
    },
    {
      title: '联系人',
      dataIndex: 'cSupPerson',
    },
    {
      title: '手机',
      dataIndex: 'cMobile',
    },
    {
      title: '地址',
      dataIndex: 'cAddress',
    },
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'supNo',
        label: '供应商编号',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      // {
      //   field: 'storeDetail',
      //   label: '门店',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     api: getStoreListApi,
      //     labelField: 'cStoreName',
      //     valueField: 'cStoreNo',
      //     mode: 'multiple',
      //     maxTagCount: 1
      //   },
      //   colProps: {
      //     span: 6,
      //   },
      // },
      // {
      //   field: 'supDetail',
      //   label: '供应商',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     api: getSupplierListApi,
      //     labelField: 'cSupName',
      //     valueField: 'cSupNo',
      //   },
      //   colProps: {
      //     span: 6,
      //   },
      // },
      // {
      //   field: 'fieldTime',
      //   component: 'RangePicker',
      //   label: '时间段',
      //   defaultValue: [dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'), dayjs()],
      //   componentProps: {
      //     showTime: {
      //       defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
      //     },
      //     // // disabledDate: (current: Dayjs) => current && current < dayjs().month(1),
      //     style: {
      //       width: '100%'
      //     }
      //   },
      //   colProps: {
      //     span: 6,
      //   },
      // },
    ],
    // fieldMapToTime: [['fieldTime', ['dtb', 'dte'], 'YYYY-MM-DD HH:mm:ss']],
  };
}

