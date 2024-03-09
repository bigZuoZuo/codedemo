<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="原始库表名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tableCode">
              <a-input v-model="model.tableCode" placeholder="请输入原始库表名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据资源名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="tableName">
              <a-input v-model="model.tableName" placeholder="请输入数据资源名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据项序号" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filedOderNum">
              <a-input-number v-model="model.filedOderNum" placeholder="请输入数据项序号" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据项名称" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filedName">
              <a-input v-model="model.filedName" placeholder="请输入数据项名称"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="字段名" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filedNameCode">
              <a-input v-model="model.filedNameCode" placeholder="请输入字段名"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="数据项说明" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filedInfo">
              <a-input v-model="model.filedInfo" placeholder="请输入数据项说明"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="字符类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filedCharType">
              <a-input v-model="model.filedCharType" placeholder="请输入字符类型"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="长度" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filedLength">
              <a-input-number v-model="model.filedLength" placeholder="请输入长度" style="width: 100%" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="约束" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="filedConstraint">
              <a-input v-model="model.filedConstraint" placeholder="请输入约束"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="值域" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="fieldValues">
              <a-input v-model="model.fieldValues" placeholder="请输入值域"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="note">
              <a-input v-model="model.note" placeholder="请输入备注"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="业务系统反馈备注" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="businessSystemFeedback">
              <a-input v-model="model.businessSystemFeedback" placeholder="请输入业务系统反馈备注"  ></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="否列在表展示" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="isShowInList">
              <j-dict-select-tag type="radio" v-model="model.isShowInList" dictCode="yn" placeholder="请选择否列在表展示" />
            </a-form-model-item>
          </a-col>
          <a-col :span="24">
            <a-form-model-item label="列表展示排序" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="showInListOrder">
              <a-input-number v-model="model.showInListOrder" placeholder="请输入列表展示排序" style="width: 100%" />
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
    name: 'FrontTableFiledForm',
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
           tableCode: [
              { required: true, message: '请输入原始库表名!'},
           ],
           tableName: [
              { required: true, message: '请输入数据资源名称!'},
           ],
           filedOderNum: [
              { required: true, message: '请输入数据项序号!'},
           ],
           filedName: [
              { required: true, message: '请输入数据项名称!'},
           ],
           filedNameCode: [
              { required: true, message: '请输入字段名!'},
           ],
        },
        url: {
          add: "/medicalShare/frontTableFiled/add",
          edit: "/medicalShare/frontTableFiled/edit",
          queryById: "/medicalShare/frontTableFiled/queryById"
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