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
      title: '最近进价',
      dataIndex: 'fckPrice',
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
      title: '供应商编号',
      dataIndex: 'cSupNo',
    },
    {
      title: '供应商名称',
      dataIndex: 'cSupName',
    },
    {
      title: '商品类别编号',
      dataIndex: 'cGoodsTypeNo',
    },
    {
      title: '商品类别名称',
      dataIndex: 'cGoodsTypeName',
    },
    {
      title: '单位',
      dataIndex: 'cUnit',
    },
    {
      title: '规格',
      dataIndex: 'cSpec',
    }
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 60,
    schemas: [
      {
        field: 'barCode',
        label: '条码',
        component: 'Input',
        defaultValue: "",
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
      width: 80
    },
    {
      title: '门店编号',
      dataIndex: 'cStoreNo',
      width: 80
    },
    {
      title: '门店名称',
      dataIndex: 'cStoreName',
      width: 80
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
      title: '数量',
      dataIndex: 'fQuantity',
      width: 60
    },
    {
      title: '进价',
      dataIndex: 'fInPrice',
      width: 60
    },
    {
      title: '总金额',
      dataIndex: 'fInMoney',
      width: 80,
    },
    {
      title: '单位',
      dataIndex: 'cUnit',
      width: 50
    },
    {
      title: '规格',
      dataIndex: 'cSpec',
      width: 50
    },
    {
      title: '供应商编号',
      dataIndex: 'cSupplierNo',
      width: 100
    },
    {
      title: '单据类型',
      dataIndex: 'cType',
      width: 80
    },
  ]

}

