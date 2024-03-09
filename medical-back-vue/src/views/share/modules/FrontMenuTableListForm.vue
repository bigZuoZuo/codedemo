<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="目录ID" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="frontMenuId">
              <a-input v-model="model.frontMenuId" placeholder="请输入目录ID"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="目录名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="frontMenuName">
              <a-input v-model="model.frontMenuName" placeholder="请输入目录名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="原始库表名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tableCode">
              <a-input v-model="model.tableCode" placeholder="请输入原始库表名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资源名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="name">
              <a-input v-model="model.name" placeholder="请输入资源名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="资源说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="info">
              <a-input v-model="model.info" placeholder="请输入资源说明"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据资源分类" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataResourceClassification">
              <a-input v-model="model.dataResourceClassification" placeholder="请输入数据资源分类"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据资源代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataResourceCode">
              <a-input v-model="model.dataResourceCode" placeholder="请输入数据资源代码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据资源提供方" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataResourceProvide">
              <a-input v-model="model.dataResourceProvide" placeholder="请输入数据资源提供方"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据资源提供方式代码" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataResourceProvideType">
              <a-input v-model="model.dataResourceProvideType" placeholder="请输入数据资源提供方式代码"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="发布日期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="publishDate">
              <a-input v-model="model.publishDate" placeholder="请输入发布日期"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新周期" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="refreshCycle">
              <a-input v-model="model.refreshCycle" placeholder="请输入更新周期"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否向社会开放" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isOpenSociety">
              <a-input v-model="model.isOpenSociety" placeholder="请输入是否向社会开放"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="开放条件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="openCondition">
              <a-input v-model="model.openCondition" placeholder="请输入开放条件"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="共享条件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="shareCondition">
              <a-input v-model="model.shareCondition" placeholder="请输入共享条件"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="更新时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="updateDate">
              <a-input v-model="model.updateDate" placeholder="请输入更新时间"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="是否公开" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isOpen">
              <a-input v-model="model.isOpen" placeholder="请输入是否公开"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联络人邮箱" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactEmail">
              <a-input v-model="model.contactEmail" placeholder="请输入联络人邮箱"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联络人电话" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactTel">
              <a-input v-model="model.contactTel" placeholder="请输入联络人电话"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="联络人姓名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="contactName">
              <a-input v-model="model.contactName" placeholder="请输入联络人姓名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="订阅量" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="subscribeNum">
              <a-input-number v-model="model.subscribeNum" placeholder="请输入订阅量" style="width: 100%" />
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
    name: 'FrontMenuTableListForm',
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
          add: "/medicalShare/frontMenuTableList/add",
          edit: "/medicalShare/frontMenuTableList/edit",
          queryById: "/medicalShare/frontMenuTableList/queryById"
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
      addByMenuId (record) {
        console.log(record)
          this.model.frontMenuId=record.id;
          this.model.frontMenuName=record.name;
          this.edit(this.model)
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