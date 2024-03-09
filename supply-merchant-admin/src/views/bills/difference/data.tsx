import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getStoreListApi, getSupplierListApi } from "../../../api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '门店',
      dataIndex: 'store',
    },
    {
      title: '门店名称',
      dataIndex: 'cStoreName',
    },
    // {
    //   title: '小组',
    //   dataIndex: 'groupType',
    // },
    {
      title: '供应商',
      dataIndex: 'supplier',
    },
    {
      title: '仓库',
      dataIndex: 'wareHouse',
    },
    // {
    //   title: '修改人',
    //   dataIndex: 'fillEmp',
    // },
    // {
    //   title: '制单人',
    //   dataIndex: 'operator',
    // },
    // {
    //   title: '审查人',
    //   dataIndex: 'examiner',
    // },
    {
      title: '编号',
      dataIndex: 'cSheetno',
    },
    {
      title: '日期',
      dataIndex: 'dDate',
      // sorter: true,
    },
    // {
    //   title: '具体时间',
    //   dataIndex: 'cTime',
    //   // sorter: true,
    // },
    {
      title: '原金额',
      dataIndex: 'fMoneyOld',
      // sorter: true,
    },
    {
      title: '差异金额',
      dataIndex: 'fMoneyDiff',
      // sorter: true,
    },
    {
      title: '新金额',
      dataIndex: 'fMoneyNow',
      // sorter: true,
    },
    {
      title: '总数量',
      dataIndex: 'fQty',
      // sorter: true,
    },

    {
      title: '备注',
      dataIndex: 'cBeiZhu1',
    },

    // {
    //   title: '审核状态',
    //   dataIndex: 'cBillState',
    // },
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
      title: '店内码',
      dataIndex: 'cGoodsNo',
    },
    {
      title: '商品名称',
      dataIndex: 'cGoodsName',
    },
    {
      title: '条形码',
      dataIndex: 'cBarCode',
    },
    {
      title: '单位',
      dataIndex: 'cUnit',
      width: 60
    },
    {
      title: '是否促销',
      dataIndex: 'iCxFlag',
      width: 100
    },
    {
      title: '门店编号',
      dataIndex: 'cStoreNo',
      width: 100
    },
    {
      title: '数量',
      dataIndex: 'fQuantity',
      width: 60
    },
    {
      title: '进价',
      dataIndex: 'fInPrice',
      width: 100
    },
    {
      title: '金额',
      dataIndex: 'fInMoney',
      width: 100
    },
    {
      title: '差异金额',
      dataIndex: 'fMoneyDiff',
      width: 100
    },
    {
      title: '备注',
      dataIndex: 'cDetail',
    },
    {
      title: '入库单号',
      dataIndex: 'cSheetNoIn',
    },
  ]
}