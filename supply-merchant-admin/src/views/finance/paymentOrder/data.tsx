import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getStoreListApi, getSupplierListApi } from "/@/api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '付款单号',
      dataIndex: 'jieSuanPayOffNo',
    },
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
      title: '支付项目',
      dataIndex: 'sPayOffStyle',
    },
    {
      title: '备注说明',
      dataIndex: 'cRemark',
    },
    {
      title: '未付金额',
      dataIndex: 'fMoneyArrearage',
    },
    {
      title: '总金额',
      dataIndex: 'fMoneyPayMent',
    },
    {
      title: '已付金额',
      dataIndex: 'fMoneyBlance',
    },
    {
      title: '出纳员编号',
      dataIndex: 'cashierNo',
    },
    {
      title: '出纳员名称',
      dataIndex: 'cashierName',
    },
    // {
    //   title: '打印数量',
    //   dataIndex: 'iPrintNum',
    // },
    // {
    //   title: '抹零',
    //   dataIndex: 'fMoLing',
    // }
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

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
          // // disabledDate: (current: Dayjs) => current && current < dayjs().month(1),
          style: {
            width: '100%'
          }
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
    // {
    //   title: '列明',
    //   dataIndex: 'iCheck',
    // },
    {
      title: '结算日期',
      dataIndex: 'jieSuanRiQi',
    },
    {
      title: '结算单号',
      dataIndex: 'jieSuanNo',
    },
    {
      title: '供应商',
      dataIndex: 'cSup',
      width: 200
    },
    {
      title: '结算金额',
      dataIndex: 'jieSuanJinE',
      width: 80
    },
    {
      title: '总金额',
      dataIndex: 'fMoneyPayment',
      width: 70
    },
    {
      title: '支付金额',
      dataIndex: 'fPayment',
      width: 80
    },
    {
      title: '收取金额',
      dataIndex: 'inMoney',
      width: 80
    },
    {
      title: '返厂金额',
      dataIndex: 'rbdMoney',
      width: 80
    },
    {
      title: '差异金额',
      dataIndex: 'fMoneyDiff',
      width: 80
    },
    {
      title: '销售金额',
      dataIndex: 'xiaoShouJinE',
      width: 80
    },
    {
      title: '成本金额',
      dataIndex: 'fMoneyCost',
      width: 80
    },
    {
      title: '费用金额',
      dataIndex: 'feiYongJinE',
      width: 80
    },
    {
      title: '支付方式',
      dataIndex: 'cBlanceType',
    },
    // {
    //   title: '抹零',
    //   dataIndex: 'fMoLing',
    //   width: 60
    // },
    {
      title: '金额',
      dataIndex: 'fMoney',
      width: 60
    },
  ]
}