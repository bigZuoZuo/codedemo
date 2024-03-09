<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="订阅人id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userId">
              <a-input v-model="model.userId" placeholder="请输入订阅人id"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="目录代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="catalogCode">
              <a-input v-model="model.catalogCode" placeholder="请输入目录代码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="目录名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="catalogName">
              <a-input v-model="model.catalogName" placeholder="请输入目录名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资源名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sourceName">
              <a-input v-model="model.sourceName" placeholder="请输入资源名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资源状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sourceStatus">
              <a-input-number v-model="model.sourceStatus" placeholder="请输入资源状态" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="订阅时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subscribeTime">
              <j-date placeholder="请选择订阅时间"  v-model="model.subscribeTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="订阅状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subscribeStatus">
              <a-input-number v-model="model.subscribeStatus" placeholder="请输入订阅状态" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资源类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">
              <a-input-number v-model="model.type" placeholder="请输入资源类型" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="订阅字段" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subscribeFileds">
              <a-input v-model="model.subscribeFileds" placeholder="请输入订阅字段"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="同步频率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="synchronousFrequency">
              <a-input v-model="model.synchronousFrequency" placeholder="请输入同步频率"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="审核人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkBy">
              <a-input v-model="model.checkBy" placeholder="请输入审核人"  ></a-input>
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

  import { httpAction, getAction } from '@/api/manage'
  import { validateDuplicateValue } from '@/utils/util'

  export default {
    name: 'FrontSubscribeForm',
    components: {
    },
    props: {
      //表单禁用
      disabled: {
        type: Boolean,
        default: false,
        required: false
      }
    },
    data () {
      return {
        model:{
         },
        labelCol: {
          xs: { span: 24 },
          sm: { span: 5 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
        confirmLoading: false,
        validatorRules: {
        },
        url: {
          add: "/medicalShare/frontSubscribe/add",
          edit: "/medicalShare/frontSubscribe/edit",
          queryById: "/medicalShare/frontSubscribe/queryById"
        }
      }
    },
    computed: {
      formDisabled(){
        return this.disabled
      },
    },
    created () {
       //备份model原始值
      this.modelDefault = JSON.parse(JSON.stringify(this.model));
    },
    methods: {
      add () {
        this.edit(this.modelDefault);
      },
      edit (record) {
        this.model = Object.assign({}, record);
        this.visible = true;
      },
      submitForm () {
        const that = this;
        // 触发表单验证
        this.$refs.form.validate(valid => {
          if (valid) {
            that.confirmLoading = true;
            let httpurl = '';
            let method = '';
            if(!this.model.id){
              httpurl+=this.url.add;
              method = 'post';
            }else{
              httpurl+=this.url.edit;
               method = 'put';
            }
            httpAction(httpurl,this.model,method).then((res)=>{
              if(res.success){
                that.$message.success(res.message);
                that.$emit('ok');
              }else{
                that.$message.warning(res.message);
              }
            }).finally(() => {
              that.confirmLoading = false;
            })
          }
         
        })
      },
    }
  }
</script>