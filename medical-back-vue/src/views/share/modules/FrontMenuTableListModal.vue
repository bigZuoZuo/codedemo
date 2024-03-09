<template>

<!--  <a-steps class="steps" :current="currentTab">-->
<!--    <a-step title="填写转账信息" />-->
<!--    <a-step title="确认转账信息" />-->
<!--    <a-step title="完成" />-->
<!--  </a-steps>-->
  <j-modal
    :title="title"
    :width="width"
    :visible="visible"
    switchFullscreen
    @ok="handleOk"
    :okButtonProps="{ class:{'jee-hidden': disableSubmit} }"
    @cancel="handleCancel"
    cancelText="关闭">
    <front-menu-table-list-form ref="realForm" @ok="submitCallback" :disabled="disableSubmit"></front-menu-table-list-form>

  </j-modal>
</template>

<script>

  import FrontMenuTableListForm from './FrontMenuTableListForm'
  export default {
    name: 'FrontMenuTableListModal',
    components: {
      FrontMenuTableListForm
    },
    data () {
      return {
        title:'',
        width:800,
        visible: false,
        disableSubmit: false,

        description: '将一个冗长或用户不熟悉的表单任务分成多个步骤，指导用户完成。',
        currentTab: 0,

        // form
        form: null,
      }
    },
    methods: {
      add () {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.add();
        })
      },
      addByMenuId (record) {
        console.log(record)
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.addByMenuId(record);
        })
      },
      edit (record) {
        this.visible=true
        this.$nextTick(()=>{
          this.$refs.realForm.edit(record);
        })
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
<style lang="less" scoped>
  .steps {
    max-width: 750px;
    margin: 16px auto;
  }
</style>