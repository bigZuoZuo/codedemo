import { useRef, useState } from 'react';
import type { FC } from 'react';
import type { FormInstance } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Button, Alert } from 'antd';
import { StepsForm, ProFormText, ProFormDigit, ProFormSelect } from '@ant-design/pro-form';

const Steps: FC = () => {
    const [current, setCurrent] = useState(0);
    const [initValue] = useState({
        name: 'zks',
        age: 18,
        province: 'hubei',
        hobby: ['sports', 'art'],
    });
    const formRef = useRef<FormInstance>();
    return (
        <PageContainer content="将一个复杂的表单任务分成多个步骤，指导用户完成。">
            <Card bordered={false}>
                <StepsForm current={current} onCurrentChange={setCurrent}
                    submitter={{
                        render: (props, dom) => {
                            // console.log(props, dom)
                            // console.log(props.form?.getFieldsValue())
                            if(props.step === 0) {
                                return <Button type="primary" onClick={() => props.onSubmit?.()}>去第二步</Button>
                            }
                            if(props.step === 1) {
                                return [
                                    <Button type="primary" key="0" onClick={() => props.onPre?.()}>返回第一步</Button>,
                                    <Button type="primary" key="1" onClick={() => props.onSubmit?.()}>下一步</Button>,
                                ]
                            }
                            return [
                                <Button type="primary"  key="0" onClick={() => props.onPre?.()}>返回第二步</Button>,
                                <Button type="primary" key="1" onClick={() => props.onSubmit?.()}>提交 √</Button>,
                            ]
                            // if (props.step === 2) {
                            //     return null;
                            // }
                            // return dom;
                        },
                    }}
                >
                    <StepsForm.StepForm
                        title="第一步"
                        formRef={formRef}
                        initialValues={initValue}
                        onFinish={async (values) => {
                            console.log(values);
                            return true;
                        }}
                    >
                        <ProFormText
                            label="姓名"
                            name="name"
                            width="md"
                            rules={[{ required: true, message: '请输入姓名' }]}
                            placeholder="请输入姓名"
                        />
                        <ProFormDigit
                            label="年龄"
                            name="age"
                            width="md"
                            rules={[
                                { required: true, message: '请输入年龄' },
                                {
                                    pattern: /^(\d*)$/,
                                    message: '请输入合法年龄',
                              },]}
                            placeholder="请输入年龄"
                            // fieldProps={{prefix: '岁'}}
                        />
                        <ProFormSelect
                            label="省份"
                            name="province"
                            width="md"
                            rules={[{ required: true, message: '请选择省份' }]}
                            placeholder="请选择省份"
                            valueEnum={{ 'hubei': '湖北', 'henan': '河南', 'shanxi': '陕西', 'shandong': '山东' }}
                        />
                        <ProFormSelect
                            label="爱好"
                            mode="multiple"
                            name="hobby"
                            width="md"
                            rules={[{ required: true, message: '请选择爱好' }]}
                            placeholder="请选择爱好"
                            options={[
                                { value: 'sports', label: '体育' },
                                { value: 'art', label: '艺术' },
                                { value: 'music', label: '音乐' },
                            ]}
                        />
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        title="第二步"
                        formRef={formRef}
                        onFinish={async (values) => {
                            console.log(values);
                            return true;
                        }}
                    >
                        <ProFormDigit
                            label="手机号"
                            name="phone"
                            width="md"
                            rules={[
                                { required: true, message: '请输入手机号' },
                                {
                                    pattern: /^(\d*)$/,
                                    message: '请输入合法手机号',
                              },]}
                            placeholder="请输入手机号"
                        />
                    </StepsForm.StepForm>
                    <StepsForm.StepForm
                        title="第三步"
                        // formRef={formRef}
                        // onFinish={async (values) => {
                        //     console.log(values);
                        //     setCurrent(0);
                        //     // return true;
                        // }}
                    >
                        <Alert
                            closable
                            showIcon
                            message="分步提交已完成，谢谢！"
                            style={{ marginBottom: 24 }}
                        />
                    </StepsForm.StepForm>
                </StepsForm>
            </Card>
        </PageContainer>
    );
};
export default Steps;