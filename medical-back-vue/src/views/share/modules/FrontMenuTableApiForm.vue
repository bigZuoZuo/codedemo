<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="关联数据库资源表ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="frontMenuTableListId">
              <a-input v-model="model.frontMenuTableListId" placeholder="请输入关联数据库资源表ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="关联数据库名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="frontMenuTableName">
              <a-input v-model="model.frontMenuTableName" placeholder="请输入关联数据库名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="接口名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="frontMenuTableApiName">
              <a-input v-model="model.frontMenuTableApiName" placeholder="请输入接口名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="服务提供方" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="serviceProvider">
              <a-input v-model="model.serviceProvider" placeholder="请输入服务提供方"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="接入类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="accessType">
              <a-input v-model="model.accessType" placeholder="请输入接入类型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="注册日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="registrationDate">
              <j-date placeholder="请选择注册日期" v-model="model.registrationDate"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="资源目录" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="resourceDirectory">
              <a-input v-model="model.resourceDirectory" placeholder="请输入资源目录"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="公开方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publicType">
              <a-input v-model="model.publicType" placeholder="请输入公开方式"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="调用频率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="callFrequency">
              <a-input v-model="model.callFrequency" placeholder="请输入调用频率"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="超时时间（秒）" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="timeout">
              <a-input-number v-model="model.timeout" placeholder="请输入超时时间（秒）" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="协议类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="protocolType">
              <a-input v-model="model.protocolType" placeholder="请输入协议类型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="服务有效期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="validityPeriod">
              <j-date placeholder="请选择服务有效期" v-model="model.validityPeriod"  style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="附件说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="descriptionFiles">
              <a-input v-model="model.descriptionFiles" placeholder="请输入附件说明"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="方法名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="apiName">
              <a-input v-model="model.apiName" placeholder="请输入方法名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="方法描述" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="apiDescription">
              <a-input v-model="model.apiDescription" placeholder="请输入方法描述"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="请求方式" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="requestMode">
              <a-input v-model="model.requestMode" placeholder="请输入请求方式"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="接口地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="apiUrl">
              <a-input v-model="model.apiUrl" placeholder="请输入接口地址"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="参数名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paramsName">
              <a-input v-model="model.paramsName" placeholder="请输入参数名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="参数位置" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paramHeadOrBody">
              <a-input v-model="model.paramHeadOrBody" placeholder="请输入参数位置"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="参数类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paramsType">
              <a-input v-model="model.paramsType" placeholder="请输入参数类型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="参数说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="paramsDescription">
              <a-input v-model="model.paramsDescription" placeholder="请输入参数说明"  ></a-input>
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
    name: 'FrontMenuTableApiForm',
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
          add: "/medicalShare/frontMenuTableApi/add",
          edit: "/medicalShare/frontMenuTableApi/edit",
          queryById: "/medicalShare/frontMenuTableApi/queryById"
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