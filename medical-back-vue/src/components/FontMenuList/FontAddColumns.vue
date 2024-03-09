<template>
    <!-- title='Create a new collection' -->
    <a-modal :visible="visible" okText='提交' @cancel="() => { $emit('cancel') }" @ok="() => { $emit('create') }">
        <template>
            <a-form :form="form">
                <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="数据项名称">
                    <a-input v-decorator="[
                        'filedName',
                        { rules: [{ required: true, message: '请输入数据项名称' }] },
                    ]" placeholder="请输入数据项名称" />
                </a-form-item>
                <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                    label="字符类型">
                    <a-input v-decorator="[
                        'filedCharType',
                        { rules: [{ required: true, message: '请输入字符类型' }] },
                    ]" placeholder="请输入字符类型" />
                </a-form-item>
                <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                    label="长度">
                    <a-input v-decorator="[
                        'filedLength',
                        { rules: [{ required: true, message: '请输入长度' }] },
                    ]" placeholder="请输入长度" />
                </a-form-item>
                <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                    label="约束">
                    <a-input v-decorator="[
                        'filedConstraint',
                        { rules: [{ required: true, message: '请输入约束' }] },
                    ]" placeholder="请输入约束" />
                </a-form-item>
                <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                    label="值域">
                    <a-input v-decorator="[
                        'fieldValues',
                        { rules: [{ required: true, message: '请输入值域' }] },
                    ]" placeholder="请输入值域" />
                </a-form-item>
                <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol"
                    label="备注">
                    <a-input v-decorator="[
                        'note',
                        { rules: [{ required: checkNick, message: '请输入备注' }] },
                    ]" placeholder="请输入备注" />
                </a-form-item>

                

                <!-- <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
                    <a-checkbox :checked="checkNick" @change="handleChange">
                        Nickname is required
                    </a-checkbox>
                </a-form-item>
                <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
                    <a-button type="primary" @click="check">
                        Check
                    </a-button>
                </a-form-item> -->
            </a-form>
        </template>
    </a-modal>
</template>

<script>
const formItemLayout = {
    labelCol: { span: 5 },
    wrapperCol: { span: 8 },
};
const formTailLayout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 8, offset: 4 },
};
export default {
    props: ['visible'],
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'form_in_modal' });
    },
    data() {
        return {
            checkNick: false,
            formItemLayout,
            formTailLayout,
            form: this.$form.createForm(this, { name: 'dynamic_rule' }),
        };
    },
    methods: {
        check() {
            this.form.validateFields(err => {
                if (!err) {
                    console.info('success');
                }
            });
        },
        handleChange(e) {
            this.checkNick = e.target.checked;
            this.$nextTick(() => {
                this.form.validateFields(['note'], { force: true });
            });
        },
    },
}
</script>

<style lang="less" scoped>
.ant-input {
    width: 341.51px;
    height: 51.61%;
}

.optionselsect {
    width: 341.51px;
    height: 51.61%;
}
</style>