import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs from 'dayjs';

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '单号',
      dataIndex: 'id',
    },
    {
      title: '发票号码',
      dataIndex: 'invoiceNo',
    },
    {
      title: '发票代码',
      dataIndex: 'invoiceCode',
    },
    {
      title: '抵押分类',
      dataIndex: 'mortgageType',
      customRender: ({ record }) => (record.mortgageType === 1 ? '货物抵扣' : '费用抵扣'),
    },
    {
      title: '发票状态',
      dataIndex: 'invoiceStatusName',
      // customRender: ({ record }) => {
      //   return {
      //     0: '录入', 1: '审核', 2: '驳回'
      //   }[record.invoiceStatus]
      // }
    },
    {
      title: '提交时间',
      dataIndex: 'examineTime',
    },
    {
      title: '未开金额',
      dataIndex: 'outMoney',
    },
    {
      title: '未税金额',
      dataIndex: 'outTaxMoney',
    },
    {
      title: '销售税额',
      dataIndex: 'taxMoney',
    },
    {
      title: '销售金额',
      dataIndex: 'saleMoney',
    },
    {
      title: '备注说明',
      dataIndex: 'remarks',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      // sorter: true,
    },
    {
      title: '最后修改时间',
      dataIndex: 'modifyTime',
      // sorter: true,
    },
    // {
    //   title: '结算单号',
    //   dataIndex: 'settleAccountNo',
    //   // sorter: true,
    // }
  ];
}

export function getTableFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'goodsName',
        label: '商品名称',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },
      {
        field: 'invoiceCode',
        label: '发票编号',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },

      {
        defaultValue: -1,
        field: 'invoiceStatus',
        label: '发票状态',
        component: 'Select',
        componentProps: {
          options: [
            {
              value: -1,
              label: '全部',
            },
            {
              value: 0,
              label: '录入',
            },
            {
              value: 1,
              label: '已提交',
            },
            {
              value: 2,
              label: '已审核',
            },
            {
              value: 3,
              label: '已驳回',
            },
          ],
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
          style: { width: '100%' },
        },
        colProps: {
          span: 6,
        },
      },
    ],
    fieldMapToTime: [['fieldTime', ['beginTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
  };
}

export function getDetailTableColumns(): BasicColumn[] {
  return [
    {
      title: '商品名称',
      dataIndex: 'goodsName',
      slots: { customRender: 'goodsName' },
    },
    {
      title: '单位',
      dataIndex: 'unit',
      slots: { customRender: 'unit' },
    },
    {
      title: '规格',
      dataIndex: 'specs',
      slots: { customRender: 'specs' },
    },
    {
      title: '销售数量',
      dataIndex: 'saleNum',
      slots: { customRender: 'saleNum' },
    },
    {
      title: '含税总金额',
      dataIndex: 'sumMoney',
      slots: { customRender: 'sumMoney' },
    },
    {
      title: '税率',
      dataIndex: 'tax',
      slots: { customRender: 'tax' },
    },
    // {
    //   title: '抵押分类',
    //   dataIndex: 'mortgageType',
    //   // slots: { customRender: 'mortgageType' },
    // },
    // {
    //   title: '未税金额',
    //   dataIndex: 'outTaxMoney',
    //   // slots: { customRender: 'mortgageType' },
    // },
    {
      title: '备注说明',
      dataIndex: 'remarks',
      slots: { customRender: 'remarks' },
    },
    {
      title: '操作',
      dataIndex: 'action',
      slots: { customRender: 'action' },
    },
  ];
}
