<template>
    <div class="message">
        <div>
            <a-form-model ref="ruleForm" :model="ruleForm" :rules="rules" v-bind="layout" :colon="false" labelAlign="right" @on=hand()>
                <div class="formbox">
                    <h2>目录信息</h2>
                    <div class="from">
                        <a-form-model-item has-feedback label="目录名称" prop="name" class="text" >
                            <a-input v-model="ruleForm.name" type="text" autocomplete="off" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="父级目录" prop="pid" class="text">
                            <a-input v-model="ruleForm.pid" type="text" autocomplete="off" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="目录排序" prop="oder">
                            <a-input v-model="ruleForm.oder" type="text" autocomplete="off" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="更改时间" prop="updateTime">
                            <a-input v-model="ruleForm.updateTime" type='text' autocomplete="off" />
                            <!-- <a-input disabled  :value="ruleForm.updateTime | moment" type='text' autocomplete="off" /> -->

                        </a-form-model-item>
                        <a-form-model-item has-feedback label="目录层级" prop="level">
                            <a-input v-model="ruleForm.level" type="text" autocomplete="off" />
                        </a-form-model-item>
                    </div>

                    <h2>API信息</h2>
                    <div class="from">
                        <a-form-model-item has-feedback label="数据来源" prop="dataSource" class="text">
                            <a-input v-model="ruleForm.dataSource" type="text" autocomplete="off" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="原始表名称" prop="oldLibTableName">
                            <a-input v-model="ruleForm.oldLibTableName" type="text" autocomplete="off" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="原始表组建" prop="uniquePrimaryKeyFiled">
                            <a-input v-model="ruleForm.uniquePrimaryKeyFiled" type="text" autocomplete="off" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="API-URL" prop="url">
                            <a-input v-model="ruleForm.url" type="text" autocomplete="off" />
                        </a-form-model-item>
                        <a-form-model-item has-feedback label="API-TOKEN" prop="token" >
                            <a-input v-model="ruleForm.token" type="text" autocomplete="off" />
                        </a-form-model-item>
                    </div>
                    <a-form-model-item class="mt20" :wrapper-col="{ span: 17, offset:3 }">
                        <a-button type="primary"  @click="submitForm('ruleForm')">
                            修改
                        </a-button>
                        <a-button style="margin-left: 10px" @click="resetForm('ruleForm')">
                            重置
                        </a-button>

                        <!-- <a-button  type="primary" style="width:50px;margin-left: 10px" @click="submitForm('ruleForm')">
                            删除
                        </a-button>
                        <a-button style="width:50px ;margin-left: 10px" @click="resetForm('ruleForm')">
                            修改
                        </a-button>
                        <a-button style="width:80px ;margin-left: 10px" @click="resetForm('ruleForm')">
                            添加子节点
                        </a-button> -->
                    </a-form-model-item>

                </div>
            </a-form-model>
        </div>
    </div>
</template>
<script>

import { addApiuser, updataEdit } from '@api/api.js'

export default {
    props: ['item','changeTreeData'],
    data() {

        return {
            ruleForm: {
                name: '',
                pid: '',
                oder: '',
                timestamp: '',
                level: '',
                dataSource: '',
                oldLibTableName: '',
                uniquePrimaryKeyFiled: '',
                url: '',
                token: '',
            },

            layout: {
                labelCol: { span: 5 },
                wrapperCol: { span: 16 },
            },
        };
    },
    watch: {
        item(v) {
            console.log(v)
            this.ruleForm = { ...v,updateTime :v.updateTime  }
        }
    },
    methods: {
        initTime(){

        },
        submitForm(ruleForm) {
            this.$refs[ruleForm].validate(async valid => {
                if (valid) {
                    // this.ruleForm.id = Math.round()

                   const data = await updataEdit(this.ruleForm)
                    // const data = await addApiuser(this.ruleForm)
                    this.changeTreeData() 
                    this.$message.success(data.result)
                    // alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        resetForm(ruleForm) {
            // this.$refs[ruleForm].resetFields();
            // this.$emit('resetdata')
            this.changeTreeData()
            this.$message.success('重置成功')
        },
    },
};
</script>
<style lang="less" scoped>



.mt20{
    margin-top:20px;
}
.message {
    margin-left: 63px;
    width: 100%;
    .formbox{
        width:100%;
        padding:0 15px;
        ::v-deep .ant-input{
            padding:0 8px;
        }
    }

    h2 {
        font-size: 24px;
        color: #3D3D3D;
    }
    .from {
        max-width: 360px;
        margin-left: 50px;
        .text {
            font-size: 12px;
            font-weight: 400px;
        }

        ::v-deep .ant-form-item {
            margin-bottom: 5px;
        }
    }
}
::v-deep .ant-col-5{
    margin-right: 16px;
    font-size: 12px;
}


// 媒体查询
@media (min-width: 750px) and (max-width: 840px) {
    .message{
        margin-left: 23px;
        .from{
            margin-left: 20px;
            max-width: 300px;
        }
    }
}


// 媒体查询
@media (min-width: 550px) and (max-width: 750px) {
    .message{
        margin-left: 10px;
        .from{
            margin-left: 10px;
            max-width: 260px;
        }
    }
}

@media  (max-width: 550px) {
    .message{
        margin-left: 10px;
        .from{
            margin-left: 10px;
            max-width: 200px;
        }
    }
}
</style>