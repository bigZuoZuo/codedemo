import { FormProps, TableImg } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';

export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '转账单号',
      dataIndex: 'id',
    },
    {
      title: '转账金额(元)',
      dataIndex: 'transferAmount',
    },
    {
      title: '转账人名称',
      dataIndex: 'transferUserName',
    },
    {
      title: '转账银行账户',
      dataIndex: 'transferBankAccount',
    },
    {
      title: '接受银行账户',
      dataIndex: 'receiveBankAccount',
    },
    {
      title: '转账日期',
      dataIndex: 'transferTime',
    },
    {
      title: '图片',
      dataIndex: 'imgUrl',
      customRender: ({ value }) => <TableImg imgList={[value]} />,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
    // {
    //   title: '创建时间',
    //   dataIndex: 'createTime',
    // },
    {
      title: '状态',
      dataIndex: 'transferStatus',
      customRender: ({ record }) => {
        return {
          0: '录入',
          1: '提交',
          2: '审核',
        }[record.transferStatus];
      },
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      // sorter: true,
    },
  ];
}

export function getTableFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 100,
    schemas: [
      // {
      //   field: 'searchKey',
      //   label: '转账单号',
      //   component: 'Input',
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
          style: { width: '100%' },
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
    fieldMapToTime: [['fieldTime', ['beginTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
  };
}

export function getDetailTableColumns(): BasicColumn[] {
  return [
    {
      title: '费用编号',
      dataIndex: 'feiYongNo',
    },
    {
      title: '费用名称',
      dataIndex: 'feiYong',
    },
    {
      title: '费用金额',
      dataIndex: 'feiYongJinE',
    },
    {
      title: '制单日期',
      dataIndex: 'zdRiQi',
    },
    {
      title: '门店编号',
      dataIndex: 'cStoreNo',
    },
    {
      title: '门店名称',
      dataIndex: 'cStoreName',
    },
  ];
}
