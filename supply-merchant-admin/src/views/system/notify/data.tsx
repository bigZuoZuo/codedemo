import { FormProps } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs, { Dayjs } from 'dayjs';
import { Tag } from 'ant-design-vue';
export function getTableColumns(): BasicColumn[] {
  return [
    {
      title: '消息标题',
      dataIndex: 'noticeTitle',
    },
    {
      title: '消息内容',
      dataIndex: 'noticeContent',
    },
    {
      title: '消息类型',
      dataIndex: 'noticeTypeName',
    },
    {
      title: '商户名称',
      dataIndex: 'merchantName',
    },
    {
      title: '消息有效期',
      dataIndex: 'validDate',
      slots: { customRender: 'validDate' },
    },

    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '创建人',
      dataIndex: 'createName',
    },
    {
      title: '供应商',
      dataIndex: 'noticeSupplierDetailDtos',
      customRender: ({ record }) => record.noticeSupplierDetailDtos.map(item => <Tag type="primary">{item.supplyInfoName}</Tag>)
    },
  ];
}

export function getTableFormConfig(): Partial<FormProps> {

  return {
    labelWidth: 100,
    schemas: [
      {
        field: 'noticeTitle',
        label: '消息标题',
        component: 'Input',
        colProps: {
          span: 6,
        },
      },

      {
        field: 'noticeType',
        label: '消息类型',
        component: 'Select',
        componentProps: {
          options: [
            {
              value: 1,
              label: '通告'
            },
            {
              value: 2,
              label: '通知'
            },
          ]
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
    fieldMapToTime: [['fieldTime', ['beginTime', 'endTime'], 'YYYY-MM-DD HH:mm:ss']],
  };
}
