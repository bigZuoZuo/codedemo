<template>
  <a-spin :spinning="confirmLoading">
    <j-form-container :disabled="formDisabled">
      <a-form-model ref="form" :model="model" style="margin-top: 30px" :rules="validatorRules" slot="detail">
        <a-row>
          <a-col :span="24">
            <a-form-model-item label="驳回原因11" :labelCol="labelCol" :wrapperCol="wrapperCol" prop="reason">
              <a-textarea v-model="model.reason" rows="4" placeholder="请输入驳回原因" />
            </a-form-model-item>
          </a-col>
        </a-row>
      </a-form-model>
    </j-form-container>
  </a-spin>
</template>

<script>

import { httpAction, getAction } from '@/api/manage'

import { reBack } from '@/api/apply.js'
export default {
  name: 'FrontApplyReviewedForm',
  components: {
  },
  props: {
    //表单禁用s
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
        check: "/medicalShare/frontApply/reBack"
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
    error (data) {
      this.model = Object.assign({}, data);
      this.visible = true;
    },
    submitForm () {
      const that = this;
      console.log(111)
      // 触发表单验证
      this.$refs.form.validate(valid => {
        if (valid) {
          that.confirmLoading = true;
            let newList = {}
          newList.id = this.model.id
          newList.reason  = this.model.reason
          reBack(newList).then((res)=>{
            if(res.code == 200){
              that.$message.success(res.message);
              this.$emit('searchFount')
                this.visible= false
            }else{
              that.$message.warning(res.message);
            }
          }).catch(err=>{
            this.$message.error(err)
          }).finally(() => {
            that.confirmLoading = false;
          })
        }

      })
    },
  }
}
</script>