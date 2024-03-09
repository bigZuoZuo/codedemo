import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getSupplierListApi } from "../../../api/common"
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
      title: '商品名称',
      dataIndex: 'cGoodsName',
    },
    {
      title: '条形码',
      dataIndex: 'cBarcode',
    },
    {
      title: '产地',
      dataIndex: 'cProductUnit',
    },
    {
      title: '规格',
      dataIndex: 'cSpec',
    },
    {
      title: '单位',
      dataIndex: 'cUnit',
    },
    {
      title: '合同价格',
      dataIndex: 'fPriceContract',
    },
    {
      title: '销售价格',
      dataIndex: 'fNormalPrice',
    },
    {
      title: '保质期',
      dataIndex: 'fFreshDays',
      // sorter: true,
    },
    {
      title: '扣点',
      dataIndex: 'fPackRatio',
      // sorter: true,
    },
    {
      title: '审核类型',
      dataIndex: 'examinType',
      // sorter: true,
    },
    {
      title: '申报时间',
      dataIndex: 'dCreateDate',
      // sorter: true,
    },
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [
      {
        field: 'cGoodsNo',
        label: '条形码',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: 'bExamin',
        label: '审核状态',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: 'cSupNos',
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
          style: { width: '100%' }
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
      title: '条形码',
      dataIndex: 'cBarcode',
      slots: { customRender: 'cBarcode' },
    },
    {
      title: '商品名称',
      dataIndex: 'cGoodsName',
      slots: { customRender: 'cGoodsName' },
    },

    {
      title: '产地',
      dataIndex: 'cProductUnit',
      slots: { customRender: 'cProductUnit' },
    },
    {
      title: '规格',
      dataIndex: 'cSpec',
      slots: { customRender: 'cSpec' },
    },
    {
      title: '单位',
      dataIndex: 'cUnit',
      slots: { customRender: 'cUnit' },
    },
    {
      title: '合同价格',
      dataIndex: 'fPriceContract',
      slots: { customRender: 'fPriceContract' },
    },
    {
      title: '正常价格',
      dataIndex: 'fNormalPrice',
      slots: { customRender: 'fNormalPrice' },
    },
    {
      title: '保质天数',
      dataIndex: 'fFreshDays',
      slots: { customRender: 'fFreshDays' },
    },
    {
      title: '包装比率',
      dataIndex: 'fPackRatio',
      slots: { customRender: 'fPackRatio' },
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  ]
}