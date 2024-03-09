<template>
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    :style="detailFlag?'overflow:hidden;overflow-x:scroll;overflow-y:scroll;':''"
    cancelText="关闭">
<!--    <front-apply-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></front-apply-form>-->
    <front-apply-reviewed-form v-if="detailFlag" ref="realForm" @ok="submitCallback" @searchFount="setErrorQuery" :disabled="disableSubmit"></front-apply-reviewed-form>
<!--    <front-apply-form  v-if="!detailFlag" ref="unDetail" @ok="submitCallback" :disabled="disableSubmit"></front-apply-form>-->
    <template slot="footer">
      <a-button type="primary" @click="handleOk">提交</a-button>
      <!--		<a-button v-if="type==1" type="primary" @click="handleHuan">缓存</a-button> -->
      <a-button  @click="handleCancel">取消</a-button>
    </template>
  </j-modal>
</template>

<script>

  import FrontApplyForm from './FrontApplyForm'
  import FrontApplyReviewedForm from './FrontApplyReviewedForm'
  export default {
    name: 'FrontApplyModal',
    components: {
      FrontApplyForm,
      FrontApplyReviewedForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        detailFlag:true,
        disableSubmit: false
      }
    },
    methods: {
      add (data,type) {
        this.width=600
        this.visible=true
        this.detailFlag=true
        this.fullscreen=false
        this.$nextTick(()=>{
          this.$refs.realForm.error(data);
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
      },
      setErrorQuery () {
        this.close()
        this.$emit('setErrorQuery');
      },
      close () {
        this.$emit('close');
        this.visible = false;
      },
      handleOk () {
        this.$refs.realForm.submitForm();
      },
      submitCallback(){
        this.$emit('ok');
        this.visible = false;
      },
      handleCancel () {
        this.close()
      }
    }
  }
</script>