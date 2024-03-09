import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getStoreListApi, getSupplierListApi } from "../../../api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '门店',
      dataIndex: 'cStore',
    },
    {
      title: '供应商',
      dataIndex: 'cSup',
    },
    {
      title: '时间',
      dataIndex: 'dDate',
    },
    {
      title: '是否生鲜订单',
      dataIndex: 'bFresh',
      customRender: ({ record }) => record.bFresh ? '是' : '否'

    },
    {
      title: '单号',
      dataIndex: 'cStockNo',
    },
    {
      title: '验货单号',
      dataIndex: 'cVerifyNo',
    },
    {
      title: '订单单品',
      dataIndex: 'iItemD',
    },
    {
      title: '订单数量',
      dataIndex: 'fQtyD',
    },
    {
      title: '到货单品',
      dataIndex: 'iItemY',
    },
    {
      title: '到货数量',
      dataIndex: 'fQtyY',
    },
    {
      title: '数量',
      dataIndex: 'fQty',
    },
    {
      title: '达标率',
      dataIndex: 'fRate',
    },
    {
      title: '订单金额',
      dataIndex: 'fMoney',
    },
    {
      title: '是否达标',
      dataIndex: 'iFlag',
      customRender: ({ record }) => record.iFlag ? '是' : '否'
    },
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [
      // {
      //   field: 'sheetNo',
      //   label: '单号',
      //   component: 'Input',
      //   colProps: {
      //     span: 6,
      //   },
      // },
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
        field: 'supNoDetail',
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
      {
        field: 'fieldTime',
        component: 'RangePicker',
        label: '时间段',
        defaultValue: [dayjs().subtract(1, 'month').format('YYYY-MM-DD 00:00:00'), dayjs()],
        componentProps: {
          showTime: {
            defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
          },
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

