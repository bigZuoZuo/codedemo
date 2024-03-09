import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getStoreListApi, getSupplierListApi } from "../../../api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '店内码',
      dataIndex: 'cGoodsNo',
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
      title: '单位',
      dataIndex: 'cUnit',
    },
    {
      title: '规格',
      dataIndex: 'cSpec',
    },
    {
      title: '售价',
      dataIndex: 'fNormalPrice',
    },
    {
      title: '最新进价',
      dataIndex: 'fckPrice',
    },
    {
      title: '商品类别编号',
      dataIndex: 'cGoodsTypeNo',
    },
    {
      title: '商品类别名称',
      dataIndex: 'cGoodsTypeName',
    },
    // {
    //   title: '生产商',
    //   dataIndex: 'bProducted',
    // },
    // {
    //   title: '生产编号',
    //   dataIndex: 'cProductNo',
    // },
    {
      title: '开始日期',
      dataIndex: 'beginDate',
    },
    {
      title: '结束日期',
      dataIndex: 'endDate',
    },
    {
      title: '供应商编号',
      dataIndex: 'cSupplierNo',
    },
    {
      title: '供应商名称',
      dataIndex: 'cSupName',
    },
    {
      title: '销售数量',
      dataIndex: 'xsQty',
    },
    {
      title: '销售金额',
      dataIndex: 'xsMoney',
    },
    {
      title: '期初数量',
      dataIndex: 'beginQty',
    },
    {
      title: '期初金额',
      dataIndex: 'fMoneyBgn',
    },
    {
      title: '入库数量',
      dataIndex: 'rkQty',
    },
    {
      title: '入库金额',
      dataIndex: 'rkMoney',
    },
    {
      title: '返厂数量',
      dataIndex: 'fcQty',
    },
    {
      title: '返厂金额',
      dataIndex: 'fcMoney',
    },
    {
      title: '出库数量',
      dataIndex: 'ckQty',
    },
    {
      title: '期间数量',
      dataIndex: 'fQtyQj',
    },
    {
      title: '期间金额',
      dataIndex: 'fMoneyQj',
    },
    {
      title: '期末数量',
      dataIndex: 'endQty',
    },
    {
      title: '期末金额',
      dataIndex: 'ckMoney',
    },
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [
      {
        field: 'storeNo',
        label: '门店',
        component: 'ApiSelect',
        componentProps: {
          api: getStoreListApi,
          labelField: 'cStoreName',
          valueField: 'cStoreNo',
          // mode: 'multiple',
          // maxTagCount: 1
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

