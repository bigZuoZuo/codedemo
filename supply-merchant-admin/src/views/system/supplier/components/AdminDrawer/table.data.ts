import { FormProps, FormSchema } from '/@/components/Table';
import { BasicColumn } from '/@/components/Table/src/types/table';
import dayjs from 'dayjs';
export function getBasicColumns(): BasicColumn[] {
  return [
    {
      title: '登录名',
      dataIndex: 'phone',
    },
    {
      title: '姓名',
      dataIndex: 'realName',
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '角色',
      dataIndex: 'roleName',
    },
    {
      title: '状态',
      dataIndex: 'status',
      slots: { customRender: 'status' },
    },
    {
      title: '有效时间',
      dataIndex: 'validTime',
      slots: { customRender: 'validTime' },
    },
  ];
}
export const getSchema = (): FormSchema[] => {
  return [
    {
      field: 'searchKey',
      label: '管理员名称',
      component: 'Input',
      colProps: {
        span: 6,
      },
    },
  ];
};
export function getFormConfig(): Partial<FormProps> {
  return {
    labelWidth: 80,
    schemas: [...getSchema()],
  };
}
export function getFormSchema(): FormSchema[] {
  return [
    {
      field: 'phone',
      component: 'Input',
      label: '登录名',
      required: true,
    },
    {
      field: 'password',
      component: 'InputPassword',
      label: '密码',
      required: true,
    },
    {
      field: 'repeatPassword',
      component: 'InputPassword',
      label: '确认密码',
      required: true,

      dynamicRules: ({ values }) => {
        return [
          {
            required: true,
            validator: (_, value) => {
              if (value !== values.password) {
                return Promise.reject('两次输入的密码不一致!');
              }
              return Promise.resolve();
            },
          },
        ];
      },
    },

    {
      field: 'realName',
      component: 'Input',
      label: '姓名',
      required: true,
    },
    {
      field: 'phone',
      component: 'Input',
      label: '手机号',
    },
    // {
    //   field: 'roleId',
    //   component: 'Select',
    //   label: '角色',
    //   required: true,
    // },
    // {
    //   field: 'isAdmin',
    //   component: 'RadioButtonGroup',
    //   label: '是否是管理员',
    //   defaultValue: false,
    //   componentProps: {
    //     options: [
    //       {
    //         label: '是',
    //         value: true,
    //       },
    //       {
    //         label: '否',
    //         value: false,
    //       },
    //     ],
    //   },
    //   required: true,
    // },
    {
      field: 'fieldTime',
      component: 'RangePicker',
      label: '有效期',
      componentProps: {
        showTime: {
          defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')],
        },
        style: { width: '100%' },
      },

      required: true,
    },
  ];
}
