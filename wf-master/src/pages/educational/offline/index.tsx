import { useEffect, useRef, useState } from 'react';
import { Button, Form, message, Popconfirm } from 'antd';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import request from '@/utils/umi-request';
import { Link } from 'umi';
import { ModalForm, ProFormText, ProFormSelect, ProFormUploadButton } from '@ant-design/pro-form';
import { GithubIssueItem, GithubIssueItem1 } from './data';
import './style.less';

export default () => {
  const actionRef = useRef<ActionType>();
  const [form] = Form.useForm();
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [types, setTypes] = useState<string>('add');
  const [formData, setFormData] = useState<GithubIssueItem>({});
  const [repeatIs, setRepeatIs] = useState<boolean>(false);
  const [schoolList, setSchoolList] = useState<API.ProFormSelectType[]>([]); // 学校数据
  const [schoolGradeList, setSchoolGradeList] = useState<API.ProFormSelectType[]>([]); // 年级数据
  const [categorSelectyMajor, setCategorSelectyMajor] = useState<API.ProFormSelectType[]>([]); // 专业数据
  const [selectedRowKeys, setSelectedRowKeys] = useState<any[]>([]); // 选中数据
  const [actions, setActions] = useState<number>(0);
  const columns: ProColumns<GithubIssueItem>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
    },
    {
      title: '考试名称',
      dataIndex: 'name',
    },
    {
      title: '考试日期',
      // search: false,
      dataIndex: 'testDate',
      valueType: 'date',
    },
    {
      title: '参与学校',
      search: false,
    },
    {
      title: '参与班级',
      // width: 80,
      search: false,
      // dataIndex: 'status',
    },
    {
      title: '参与人数',
      search: false,
    },
    {
      title: '考试专业',
      search: false,
    },
    {
      title: '考试学科',
      search: false,
    },
    {
      title: '考试年级',
      search: false,
    },
    {
      title: '创建人',
      search: false,
    },
    {
      title: '创建时间',
      search: false,
    },
    {
      title: '用户操作',
      valueType: 'option',
      key: 'option',
      render: (text, record, _, action) => [
        <a
          onClick={() => {
            setFormData(record);
            operation(4, false);
          }}
        >
          上传
        </a>,
        <Link to={`/educational/offline/edit/${record.id}`}>
          <a>修改</a>
        </Link>,
        renderRemoveUser('删除', record.id || ''),
        <Link to={`/educational/offline/achievement/${record.id}`}>
          <a>成绩</a>
        </Link>,
      ],
    },
    {
      title: '年级',
      hideInTable: true,
      valueType: 'select',
      request: async () => {
        const res = await request<API.NameIdType>('/web/schoolGrade/gradeSelect', {
          method: 'GET',
        });
        let list: API.ProFormSelectType[] = [];
        if (res && res.code === 200 && res.data) {
          list = res.data.map((item: { name: string; id: string }) => {
            return {
              label: item.name,
              value: item.id,
            };
          });
          setSchoolGradeList(list);
        }
        return list;
      },
    },
  ];
  const deleteCl = async (id?: string) => {
    const res = await request<API.GeneralInterface>('/web/schoolOfflineTest/' + id, {
      method: 'DELETE',
    });
    if (res && res.code === 200) {
      message.success(res.msg);
      if (actionRef.current) {
        actionRef.current.reload();
      }
    } else {
      message.error(res.msg);
    }
  };

  const renderRemoveUser = (text: string, id: string) => (
    <Popconfirm
      key="popconfirm"
      title={`确认${text}吗?`}
      okText="是"
      cancelText="否"
      onConfirm={() => {
        // console.log(123456);
        deleteCl(id);
      }}
    >
      <a>{text}</a>
    </Popconfirm>
  );
  /** 上传提交操作 **/
  const onFinish = async (value: GithubIssueItem1) => {
    if (repeatIs) return;
    setRepeatIs(true);
    let testId = actions === 4 ? formData.id : selectedRowKeys[0];
    let ifs = false;
    // 总成绩数据提交
    if (actions === 1 || actions === 4) {
      await totalScore(
        {
          ...value,
          testId,
          multipartFile: value.multipartFile[0],
          multipartFile1: undefined,
          multipartFiles: undefined,
        },
        '/web/schoolOfflineTestScore/importScore',
      ).then((res: any) => {
        if (res?.code === 200) {
          message.success('总成绩导入成功');
        } else {
          message.error(res.msg);
          ifs = true;
        }
      });
    }
    // 小题分数数据提交
    if (actions === 2 || actions === 4) {
      await totalScore(
        {
          ...value,
          testId,
          multipartFile: value.multipartFile1[0],
          multipartFile1: undefined,
          multipartFiles: undefined,
        },
        '/web/schoolOfflineTestScore/importTrivia',
      ).then((res: any) => {
        if (res?.code === 200) {
          message.success('小题分数导入成功');
        } else {
          message.error(res.msg);
          ifs = true;
        }
      });
    }
    // 答题卡数据提交
    if (actions === 3 || actions === 4) {
      await totalScore(
        {
          ...value,
          testId,
          multipartFile1: undefined,
          multipartFile: undefined,
        },
        '/web/schoolOfflineTestScore/importCard',
      ).then((res: any) => {
        if (res?.code === 200) {
          message.success('答题卡导入成功');
        } else {
          message.error(res.msg);
          ifs = true;
        }
      });
    }
    // console.log(testId, '线下考试id');
    // return;
    if (actions != 4 && ifs) {
      setRepeatIs(false);
      return;
    }
    handleModalVisible(false);
    if (actionRef.current) {
      actionRef.current.reload();
    }
    setRepeatIs(false);
  };
  /** 数据提交 **/
  const totalScore = (data: any, url: string) => {
    return new Promise(async (resolve, reject) => {
      const res = await request<API.GeneralInterface>(url, {
        method: 'POST',
        data: {
          ...data,
        },
      });
      resolve(res);
    });
  };

  /** 学校下拉接口 **/
  const getSchoolSelect = async () => {
    const res = await request<API.NameIdType>('/web/schoolDetails/schoolSelect', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item: { name: string; id: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setSchoolList(list);
    }
  };

  /** 请求专业数据 **/
  const getCategorSelectyMajor = async () => {
    const res = await request<API.NameIdType>('/web/schoolMajor/findAllMajor', {
      method: 'GET',
    });
    if (res && res.code === 200 && res.data) {
      const list = res.data.map((item: { name: string; id: string }) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setCategorSelectyMajor(list);
    }
  };

  /** 请求列表数据 **/
  const getDataList = async (datas: { pageNum: number; pageSize: number }) => {
    const res = await request('/web/schoolOfflineTest/list', {
      method: 'GET',
      params: {
        ...datas,
      },
    });
    setSelectedRowKeys([]);
    if (res && res.code === 200 && res.data) {
      return {
        total: res.data.total,
        data: res.data.list,
        success: true,
      };
    } else {
      return {
        total: 0,
        data: [],
        success: false,
      };
    }
  };
  /** 通用上传操作 **/
  const operation = (number: number, boolean: boolean) => {
    if (boolean && selectedRowKeys.length === 0) {
      message.error('请选择数据');
      return;
    }
    setActions(number);
    handleModalVisible(true);
  };

  useEffect(() => {
    getSchoolSelect();
    getCategorSelectyMajor();
  }, []);

  useEffect(() => {
    if (!createModalVisible) {
      setFormData({});
      form.resetFields();
    }
  }, [createModalVisible]);

  return (
    <div className="offlines">
      <ProTable<GithubIssueItem>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        request={async (params = {}) => {
          const datas: { pageNum: number; pageSize: number } = {
            ...params,
            pageNum: params.current || 1,
            pageSize: params.pageSize || 10,
          };
          return getDataList(datas);
        }}
        rowSelection={{
          // onChange: (ls) => {

          // },
          selectedRowKeys: selectedRowKeys,
          onChange: (selectedRowKeys, selectedRows) => {
            if (selectedRowKeys.length > 1) {
              selectedRowKeys.shift();
              selectedRows.shift();
            }
            setSelectedRowKeys(selectedRowKeys);
          },
        }}
        rowKey="id"
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        dateFormatter="string"
        toolBarRender={() => [
          <Link to="/educational/offline/add">
            <Button key="button" type="primary">
              新增
            </Button>
            ,
          </Link>,
          <Button key="button" type="primary">
            下载成绩导入模板
          </Button>,
          <Button key="button" type="primary" onClick={() => operation(1, true)}>
            导入总成绩
          </Button>,
          <Button key="button" type="primary" onClick={() => operation(2, true)}>
            导入小题分
          </Button>,
          <Button key="button" type="primary" onClick={() => operation(3, true)}>
            导入答题卡
          </Button>,
        ]}
      />
      <ModalForm
        form={form}
        title="成绩上传"
        width={600}
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={onFinish}
        layout="horizontal"
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 18 }}
      >
        <div style={{ display: 'none' }}>
          <ProFormText name="id" label="id" />
        </div>
        <ProFormSelect
          label="学校名称"
          name="schoolId"
          options={schoolList}
          rules={[
            {
              required: true,
              message: '学校名称为必填项',
            },
          ]}
        />
        <ProFormSelect
          label="专业名称"
          name="majorId"
          options={categorSelectyMajor}
          rules={[
            {
              required: true,
              message: '专业名称为必填项',
            },
          ]}
        />
        <ProFormSelect
          label="年级名称"
          name="gradeId"
          options={schoolGradeList}
          rules={[
            {
              required: true,
              message: '年级名称为必填项',
            },
          ]}
        />
        {(actions === 1 || actions === 4) && (
          <ProFormUploadButton
            name="multipartFile"
            label="总成绩"
            // title="总成绩"
            max={1}
            rules={[
              {
                required: true,
                message: '总成绩为必填项',
              },
            ]}
            fieldProps={{
              name: 'file',
              listType: 'text',
              accept: '.xls, .xlsx',
            }}
          />
        )}
        {(actions === 2 || actions === 4) && (
          <ProFormUploadButton
            name="multipartFile1"
            label="小题分数"
            // title="小题分数"
            max={1}
            rules={[
              {
                required: true,
                message: '小题分为必填项',
              },
            ]}
            fieldProps={{
              name: 'file',
              listType: 'text',
              accept: '.xls, .xlsx',
            }}
          />
        )}
        {(actions === 3 || actions === 4) && (
          <ProFormUploadButton
            name="multipartFiles"
            label="答题卡"
            // title="答题卡"
            rules={[
              {
                required: true,
                message: '答题卡为必填项',
              },
            ]}
            fieldProps={{
              name: 'file',
              listType: 'picture-card',
              accept: '.png, .jpg, .gif, .svg',
            }}
          />
        )}
      </ModalForm>
    </div>
  );
};
