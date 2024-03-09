<template>
    <!-- title='Create a new collection' -->
    <a-modal :visible="visible"  okText='提交' @cancel="() => { $emit('cancel') }"
        @ok="() => { $emit('create') }">
        <a-form layout='vertical' :form="form" >
            <!--  pleace="请输入目录名称" -->
            <a-form-item label='目录名称' >
                <a-input v-decorator="[
                    'title',
                    {
                        rules: [{  message: '请输入任务名称' , required:true  }],
                    }
                ]"  placeholder="请输入任务名称"
               />
            </a-form-item>
            <a-form-item label='父级节点'   >
                <a-tree-select
                    @change="changeData"
                    v-decorator="['parentNode',{
                        rules:[
                            {  message: '请选择父级节点' , }
                        ]
                    }]" 
                    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
                    :tree-data="options"
                    placeholder="请选择父级节点"
                    :replaceFields="replaceFields"
                    
                />
            </a-form-item>
            <a-form-item class='collection-create-form_last-form-item'>
               <span style="margin-right:10px"> 数据类型:</span>
                <a-radio-group
                    v-decorator="[
                    'hasChild',
                    {
                        initialValue: 0,
                    }
                    ]"
                >
                    <a-radio :value='0' >目录</a-radio>
                    <a-radio :value='1' >数据库表</a-radio>
                    </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>

export default {
    data(){
        return {
            replaceFields:{
                title: 'name',
                key:'id',
                value:'id'
            },
            fieldNames:{
                label:"name",
                children:'children',
                value:'id'
            },
            chooseData:null 
        }
    },
    
    // 父传子
    props:['visible','options'],  
    methods:{
        // 改变事件
        changeData(value){
            console.log(value)
            this.getTreeData(this.options,value)
        },
        getTreeData(list,id ){
            list.forEach((item,index)=>{
                if(item.id == id){
                    this.chooseData = item;
                    console.log(this.chooseData)
                    this.$emit('senddata',this.chooseData)
                    return false;
                }else{
                    if(item.children){
                        this.getTreeData(item.children,id)
                    }else{
                        return false;
                    }
                }
            })
        },
    },
    beforeCreate() {
        this.form = this.$form.createForm(this, { name: 'form_in_modal' });
    },
}
</script>

<style lang="less" scoped>
.ant-input{
    width: 341.51px;
    height: 51.61%;
}
.optionselsect {
    width: 341.51px;
    height: 51.61%;
}

</style>