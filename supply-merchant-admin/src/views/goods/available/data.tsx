import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getStoreListApi, getSupplierListApi } from "/@/api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '门店',
      dataIndex: 'cStoreNo',
    },
    {
      title: '门店名称',
      dataIndex: 'cStoreName',
    },
    {
      title: '店内码',
      dataIndex: 'cGoodsNo',
    },
    {
      title: '条形码',
      dataIndex: 'cBarcode',
    },
    {
      title: '商品名称',
      dataIndex: 'cGoodsName',
    },
    {
      title: '单位',
      dataIndex: 'cUnit',
    },
    {
      title: '规格',
      dataIndex: 'cSpec',
    },
    {
      title: '合同价',
      dataIndex: 'fContract',
    }
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [
      {
        field: 'csheetno',
        label: '单号',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: 'storeDetail',
        label: '门店',
        component: 'ApiSelect',
        componentProps: {
          api: getStoreListApi,
          labelField: 'cStoreName',
          valueField: 'cStoreNo',
          mode: 'multiple',
          maxTagCount: 1
        },
        colProps: {
          span: 6,
        },
      },
      {
        field: 'supNos',
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
      //     style: { width: '100%' }
      //   },
      //   colProps: {
      //     span: 6,
      //   },
      // },
    ],
    // fieldMapToTime: [['fieldTime', ['dtb', 'dte'], 'YYYY-MM-DD HH:mm:ss']],
  };
}

