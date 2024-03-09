import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { getStoreListApi, getSupplierListApi } from "/@/api/common"
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '门店编码',
      dataIndex: 'store',
    },
    {
      title: '门店名称',
      dataIndex: 'cStoreName',
    },
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
    //   title: '审核人',
    //   dataIndex: 'examiner',
    // },
    {
      title: '编号',
      dataIndex: 'cSheetNo',
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
      title: '订单金额',
      dataIndex: 'fMoney',
      // sorter: true,
    },
    {
      title: '订单周期',
      dataIndex: 'iDays',
    },
    {
      title: '到期时间',
      dataIndex: 'dDeadLine',
    },
    // {
    //   title: '废弃时间',
    //   dataIndex: 'dDeadLine',
    // },
    {
      title: '备注',
      dataIndex: 'cBeiZhu1',
    },
    {
      title: '总采购量',
      dataIndex: 'fQty'
    },
    {
      title: '验货状态',
      dataIndex: 'bReceive'
    },
    {
      title: '送货状态',
      dataIndex: 'bSendTypeId',
      slots: {
        customRender: 'bSendTypeId'
      }
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
      width: 50
    },

    {
      title: '规格',
      dataIndex: 'cSpec',
      width: 50
    },
    {
      title: '包装率',
      dataIndex: 'fPacks',
      width: 70
    },
    {
      title: '采购数量',
      dataIndex: 'fQuantity',
      width: 80,
    },
    {
      title: '采购订单价',
      dataIndex: 'fInPrice',
      width: 100,
    },
    {
      title: '采购金额',
      dataIndex: 'fInMoney',
      width: 80,
    },
    {
      title: '时间',
      dataIndex: 'fTimes',
    },
    {
      title: '备注',
      dataIndex: 'cDetail',
    },
    {
      title: '促销进价',
      dataIndex: 'fPriceSO',
      width: 80
    },
    {
      title: '是否促销',
      dataIndex: 'iCxFlag',
      width: 80,
      customRender: ({ record }) => record.iCxFlag ? '是' : '否'
    },
  ]
}