<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" :rules="validatorRules" slot="detail">
        <a-row>
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="申请用户" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="userId">-->
<!--              <a-input v-model="model.userId" placeholder="请输入申请用户"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="审批事项" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="item">-->
<!--              <a-input v-model="model.item" placeholder="请输入审批事项"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="审批机构" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkBy">-->
<!--              <a-input v-model="model.checkBy" placeholder="请输入审批机构"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="申请时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyTime">-->
<!--              <j-date placeholder="请选择申请时间"  v-model="model.applyTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="完成时间" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkTime">-->
<!--              <j-date placeholder="请选择完成时间"  v-model="model.checkTime" :show-time="true" date-format="YYYY-MM-DD HH:mm:ss" style="width: 100%" />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="申请是由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="matter">-->
<!--              <a-input v-model="model.matter" placeholder="请输入申请是由"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="申请状态" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="status">-->
<!--              <j-dict-select-tag type="list" v-model="model.status" dictCode="share_apply_status" placeholder="请选择申请状态" />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="申请附件" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="applyFile">-->
<!--              <a-input v-model="model.applyFile" placeholder="请输入申请附件"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="申请资源类型" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="type">-->
<!--              <j-dict-select-tag type="list" v-model="model.type" dictCode="share_apply_type" placeholder="请选择申请资源类型" />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="申请api地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="api">-->
<!--              <a-input v-model="model.api" placeholder="请输入申请api地址"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="目标库地址" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataBase">-->
<!--              <a-input v-model="model.dataBase" placeholder="请输入目标库地址"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="目标库用户" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataBaseAccount">-->
<!--              <a-input v-model="model.dataBaseAccount" placeholder="请输入目标库用户"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="建库策略" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataBaseMethod">-->
<!--              <a-input v-model="model.dataBaseMethod" placeholder="请输入建库策略"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="数据项" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="dataLine">-->
<!--              <a-input v-model="model.dataLine" placeholder="请输入数据项"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="数据交换频率" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="rate">-->
<!--              <a-input-number v-model="model.rate" placeholder="请输入数据交换频率" style="width: 100%" />-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="资源目录id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="menuId">-->
<!--              <a-input v-model="model.menuId" placeholder="请输入资源目录id"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="资源id" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="sourceId">-->
<!--              <a-input v-model="model.sourceId" placeholder="请输入资源id"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="审核人" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="checkPerson">-->
<!--              <a-input v-model="model.checkPerson" placeholder="请输入审核人"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
<!--          <a-col :span="24">-->
<!--            <a-form-model-item label="驳回理由" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="backReason">-->
<!--              <a-input v-model="model.backReason" placeholder="请输入驳回理由"  ></a-input>-->
<!--            </a-form-model-item>-->
<!--          </a-col>-->
          <a-col :span="24">
            <a-form-model-item label="驳回原因" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="matter">
              <a-input v-model="model.backReason" placeholder="请输入驳回原因"  ></a-input>
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
    name: 'FrontApplyForm',
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
          add: "/medicalShare/frontApply/add",
          edit: "/medicalShare/frontApply/edit",
          queryById: "/medicalShare/frontApply/queryById",
          reBack: "/medicalShare/frontApply/reBack",
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

              httpurl+=this.url.reBack;
              method = 'post';

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