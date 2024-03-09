import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getSupplierListApi, getStoreListApi } from "/@/api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '时间',
      dataIndex: 'dDate',
    },
    {
      title: '表单编号',
      dataIndex: 'cSheetNo',
    },
    {
      title: '审核状态',
      dataIndex: 'bExamin',
    },
    // {
    //   title: '审核人编号',
    //   dataIndex: 'cExaminerNo',
    // },
    // {
    //   title: '审核人名称',
    //   dataIndex: 'cExaminerName',
    // },
    {
      title: '调价门店',
      dataIndex: 'cExeStoreNo',
    },
    {
      title: '审核日期',
      dataIndex: 'dExaminDate',
    },
    {
      title: '执行日期',
      dataIndex: 'dDateExe',
    },
    {
      title: '备注说明',
      dataIndex: 'cBeiZhu1',
    },
  ];
}

export function getTableFormConfig(
  // { supNoOptionsChange }
): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [
      {
        field: 'sheetNo',
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
      // {
      //   field: 'supNoDetail',
      //   label: '供应商',
      //   component: 'ApiSelect',
      //   componentProps: {
      //     api: getSupplierListApi,
      //     labelField: 'cSupName',
      //     valueField: 'cSupNo',
      //     // onOptionsChange: (options) => supNoOptionsChange(options),
      //     // allowClear: false,
      //     mode: 'multiple',
      //     maxTagCount: 1
      //   },
      //   colProps: {
      //     span: 6,
      //   },
      // },
      {
        field: 'fieldTime',
        component: 'RangePicker',
        label: '时间段',
        defaultValue: [dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'), dayjs()],
        componentProps: {
          showTime: {
            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
          },
          style: { width: '100%' },
          // disabledDate: (current: Dayjs) => current && current < dayjs().month(1)
        },
        colProps: {
          span: 6,
        },
      },
    ],
    fieldMapToTime: [['fieldTime', ['dtb', 'dte'], 'YYYY-MM-DD HH:mm:ss']],
  };
}

export function getDetailTableColumns(): BasicColumn[] {
  return [

    {
      title: '表单编号',
      dataIndex: 'cSheetNo',
      slots: { customRender: 'cSheetNo' },
    },
    {
      title: '店内码',
      dataIndex: 'cGoodsNo',
      slots: { customRender: 'cGoodsNo' },
    },
    {
      title: '商品名称',
      dataIndex: 'cGoodsName',
      slots: { customRender: 'cGoodsName' },
    },
    {
      title: '条形码',
      dataIndex: 'cBarcode',
      slots: { customRender: 'cBarcode' },
    },
    {
      title: '推荐进价',
      dataIndex: 'fckPrice',
      slots: { customRender: 'fckPrice' },
    }
  ]
}