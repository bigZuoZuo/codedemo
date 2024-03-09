// name:提交时对应的字段,必传
// label:展示的名称,必传
// max:最大上传个数,默认为1个;选传,只能传数字

// import type { FC } from 'react';
// import { useState } from 'react';
import { ProFormUploadButton } from '@ant-design/pro-form';
import { PlusOutlined } from '@ant-design/icons';

export type UploadProps = {
  name: string;
  label: string;
  title?: string;
  max?: number;
  accept?: any;
  action?: string;
  extra?: any;
};
const FormUpload: React.FC<UploadProps> = (props) => {
  const token: string = `Bearer ${sessionStorage.getItem('token')}`;
  return (
    <>
      <ProFormUploadButton
        extra={props.extra != null ? props.extra : '支持扩展名：.jpg .png .pdf .doc'}
        name={props.name}
        label={props.label}
        title={props.title != null ? props.title : '上传文件'}
        action={props.action != null ? props.action : '/api/upload/txUpload'}
        accept={
          props.accept != null
            ? props.accept
            : 'image/jpeg,image/jpg,image/png,application/pdf,application/msword'
        }
        fieldProps={{
          name: 'file',
          headers: {
            Authorization: token,
          },
        }}
        icon={<PlusOutlined />}
        max={props.max || 1}
        transform={(value: any): any => {
          // console.log(value);
          // eslint-disable-next-line prefer-const
          let list: any[] = [];
          value.map((item: any) => {
            if (item.response) {
              if (item.status == 'done' && item.response.success) {
                list.push({
                  name: item.response.data.name,
                  url: item.response.data.url,
                });
              }
            }
          });
          return { [props.name]: list };
        }}
        // onChange={(e) => {
        //   console.log(e);
        // }}
      />
    </>
  );
};

export default FormUpload;
