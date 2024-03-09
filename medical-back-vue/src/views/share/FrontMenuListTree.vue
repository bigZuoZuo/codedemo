<template>
    <div>
        <div class="top">
            <a-button type="primary" class="add" @click="showModal"> +目录</a-button>
            <!-- 弹窗 -->
            <collection-create-form ref="collectionForm" :visible="visible" @cancel="handleCancel"
                @create="handleCreate" :options="treeData" @senddata="getChooseData" />
            <a-input-search placeholder="请输入目录" @search="onChange" class="search" />
        </div>
        <a-tree v-if="treeData.length > 0" :tree-data="treeData" :defaultExpandAll="istrue"
            :replace-fields="replaceFields" autoExpandParent @select="onHandcilck" class="treeone">
            <template slot="title" slot-scope="scope">
                <div class="title-nav">
                    <div class="name" >{{ scope.name }}</div>
                    <div class="color">
                        <!-- <a-popover v-model="visible" title="Title" trigger="click">
                            <a slot="content" >Close</a>
                            <span>操作</span>
                        </a-popover> -->
                         <a-tooltip> 
                            <div slot="title" @click="edit" class="btnlist">
                                <a-button class="btn" size="small" ghost>编辑</a-button> 
                                <a-button class="btn" size="small" type="primary" ghost>添加下级</a-button> 
                                <!-- <a-popconfirm
                                    title="确定要删除这个目录吗?"
                                    ok-text="是的"
                                    cancel-text="取消"
                                    @confirm="del(scope)"
                                    placement="rightTop"
                                >   
                                     
                                </a-popconfirm> -->
                                <a-button class="btn" size="small" type="danger" ghost >删除</a-button>
                            </div>
                            
                            操作
                         </a-tooltip> 
                    </div>
                    <!-- <span class="name" :title="name">{{ name }}</span> -->
                    <!-- <span @click="hanlderchange(name)" class="color">操作</span> -->
                    <!-- <span  @click="hanlderchange(name)" class="color">
                        <a-tooltip>
                            <template slot="title" @click="edit">
                            编辑
                            </template>
                            <template slot="title">
                            添加下级
                            </template>
                            <template slot="title">
                            删除
                            </template>
                            操作
                        </a-tooltip>
                    </span> -->
                </div>
            </template>
        </a-tree>
        <span v-else>暂无数据</span>
    </div>
</template>

<script>

import { deleteFrontMenu, getlistAll, addApiuser, addFrontMenu, getBaseData, searchMenuSearch ,getliste} from '@/api/api.js'
import CollectionCreateForm from './ModalForm.vue'
// 数据
const treeData = [
    {
        title: '基础',
        key: '0',
        children: [
            {
                title: '法人',
                key: '0-0',
                // disabled: true,
                children: [
                    {
                        title: 'leaf', key: '0-0-0',
                        children: [
                            {
                                title: '法人',
                                key: '0-0-0-1',
                            }
                        ]
                    },
                    {
                        title: 'leaf', key: '0-0-1',
                        children: [
                            {
                                title: '法人',
                                key: '0-0-0-1',
                            }
                        ]
                    },
                ],
            },
            {
                title: '法人',
                key: '0-1',
                // disabled: true,
                children: [
                    {
                        title: 'leaf', key: '0-1-0',
                        children: [
                            {
                                title: '法人',
                                key: '0-1-0-0',
                            }
                        ]
                    },
                    {
                        title: 'leaf', key: '0-1-1',
                        children: [
                            {
                                title: '法人',
                                key: '0-1-0-2',
                            }
                        ]
                    },
                ],
            },
        ],
    },
    {
        title: '药品',
        key: '1',
        children: [
            {
                title: '法人',
                key: '1-0',
                // disabled: true,
                children: [
                    {
                        title: 'leaf', key: '1-0-0',
                        children: [
                            {
                                title: '法人',
                                key: '1-0-0-0',
                            }
                        ]
                    },
                    {
                        title: 'leaf', key: '1-0-1',
                        children: [
                            {
                                title: '法人',
                                key: '1-0-0-2',
                            }
                        ]
                    },
                ],
            },
            {
                title: '法人',
                key: '1-1',
                // disabled: true,
                children: [
                    {
                        title: 'leaf', key: '0-1-0',
                        children: [
                            {
                                title: '法人',
                                key: '0-1-0-0',
                            }
                        ]
                    },
                    {
                        title: 'leaf', key: '0-1-1',
                        children: [
                            {
                                title: '法人',
                                key: '0-1-0-2',
                            }
                        ]
                    },
                ],
            },
        ],
    },
    { title: '医药器械', key: '3', isLeaf: false },
    { title: '化妆品', key: '4', isLeaf: false },
];
export default {
    components: { CollectionCreateForm },
    data() {
        return {
            treeData,
            replaceFields: {
                title: 'name',
                key: "id"

            },
            visible: false,
            chooseData: null,
            istrue: false
        };
    },
    propd: ['option'],
    methods: {
        hanlderchange(val) {
            console.log(val);
        },
        // 模态框显示隐藏
        showModal() {
            // 点击时，显示弹框，修改状态
            this.visible = true;
        },
        // 关闭按钮
        handleCancel() {
            this.visible = false;
        },
        getChooseData(data) {
            this.chooseData = data;
        },

        //   子组件 通过$emit 将事件发出，此处父页面@ 接收，提交表单数据
        handleCreate() {
            // 获取子组件的数据，传递给form（父表单）
            const form = this.$refs.collectionForm.form;
            form.validateFields(async (err, values) => {
                if (err) {
                    console.log(err)
                    return;
                }
                console.log(values)
                
                // 如果没有 this.chooseData ,默认第一个 
                if(!this.chooseData){
                    this.chooseData = this.treeData[0]
                }
                console.log(this.chooseData)
                // 目录添加
                let res = await addFrontMenu({
                    // 添加目录对应参数
                    pid: this.chooseData.level == '1'? 0 : this.chooseData.id,  // level = 1 或者没有表示添加第一级 就不需要 pid 
                    name: values.title,
                    level: this.chooseData.level,
                    order: this.chooseData.order,
                    odLibTableName: this.chooseData.odLibTableName,
                    // hasChild: this.chooseData.hasChild,
                    hasChild:values.hasChild,
                    dataSource: this.chooseData.dataSource
                })

                console.log(res)
                if (res.code == 200) {
                    this.getTreeData()
                    this.istrue = false
                    this.chooseData = null;
                    this.$message.success('目录添加成功');
                } else {
                    this.$message.error('目录添加失败');
                }

                console.log('Received values of form: ', values);
                form.resetFields();
                this.visible = false;
            });
        },

        // 搜索
        onChange(value) {
            if (value === '') {
                this.istrue = false
            } else {
                this.istrue = true
            }
            console.log(value)  // 输入框输入的值
            searchMenuSearch({
                name: value,
                id: value
            }).then(res => {
                this.treeData = res.result//搜索出来的数据
                console.log(this.treeData);
            })

            // const exp
        },
        async getTreeDataOne() {
            await getlistAll().then(res => {
                this.treeData = res.result
            })
        },
        async getTreeData() {
            await getlistAll().then(res => {

                this.treeData = res.result
                console.log(res, 'ressssss');
                this.onHandcilck(res.result[0])
                console.log(this.treeData);


                // this.treeData = res.result[0].id
                // this.id = res.result[0].id
                // console.log(this.id);
            })
        },
        getTreeDataMore(list, id) {
            list.forEach((item, index) => {
                if (item.id == id) {
                    console.log(item)
                    this.$emit('getchoosedata', item)
                    return false;
                } else {
                    if (item.children) {
                        this.getTreeDataMore(item.children, id)
                    } else {
                        return false;
                    }
                }
            })
        },

        // 基础信息事件获取
        async onHandcilck(value, e) {
            console.log(value); // 点击的层级 id 
            let res = await getBaseData({
                id: value.length > 0 ? value[0] : value.id
               
            })
            console.log(res);

            // // ？ 有问题
            // let data = await addApiuser({
            //     // id: value.length > 0 ? value[0] : value.id
            //     id: '216'
            // })
            let data = await getliste({
                // id: value.length > 0 ? value[0] : value.id
                id: '216'
            })
            console.log(this.data);



            this.$emit('getchoosedata', res.result, data)
            // this.getTreeDataMore(this.treeData,value[0])
            // console.log(e)



        },
        // 操作->编辑
        edit(){
            console.log(1111);
        },
        // 添加下级
        addjunior(){
            console.log(2222);
        },
        // 删除
        async del(item){
            console.log(item)
            console.log(3333);
            let res = await deleteFrontMenu({
                id:item.id,
            })
            if(res.code==200){
                this.$message.success(res.message)
                this.getTreeData()
            }
        }
    },



    mounted() {
        this.getTreeData()
    }
}

</script>

<style lang="less" scoped>

.treeone{
    margin-top: 3px;
    padding:10px;
    // ::v-deep li{
    //     width:100%;
    // }
    // ::v-deep .ant-tree-treenode-switcher-close{
    //     display: flex;
    //      .ant-tree-node-content-wrapper{
    //         flex:1;
            
    //         .ant-tree-title{
    //             display: flex;
    //             justify-content: space-between;
    //             width:100%;
    //         }
    //     }
    // }
}
.title-nav {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-size: 14px;
    .name{
        overflow-x: hidden;
        overflow: hidden;
        text-overflow: ellipsis ;
        white-space:nowrap;
        width: 150px;
        display: inline-block;
        vertical-align: middle;
    }

    .color {
        color: #409EFF;
        text-align: right;
        padding-right: 0;
        margin-left: 5px;
        font-size:12px;
        
    }
}

.btnlist{
    display: flex;
    justify-content: space-around;
    padding: 10px;
    .btn{
        margin:0 5px;
        font-size: 10px;
    }
}

.top {
    width: 100%;
    display: flex;
    margin-top: 23px;
    padding:15px;
    display: flex;
    align-items: center;
    .add {
        width: 82px;
        height: 32px;
        border-radius: 2px;
    }

    .search {
        width: 170px;
        height: 32px;
        border-radius: 8px;
        margin-left: 36px;
    }
}
</style>