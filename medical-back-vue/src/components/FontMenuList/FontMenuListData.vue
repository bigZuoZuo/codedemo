<template>
    <div class="box">
        <!-- 可以注释 -->
        <!-- <a-tree checkable :tree-data="treeData" /> -->
        <template v-if="data.length > 0">
            <div class="btn">
                <!-- <a-button type="primary" class="btn1" @click="addColumns" > 添加列 </a-button> -->
                <!-- 表单的方法新增 -->
                <!-- <font-add-columns
                    ref="collectionForm"
                    :visible="visible"
                    @cancel="handleCancel"
                    @create="handleCreate" 
                /> -->
                    <!--  icon="plus" -->
                <a-button class="btn1" @click="trigger('add')" type="primary">新增</a-button>
                <a-button type="primary" class="btn2" @click="handerDelete"> 删除列 </a-button>
                <a-button type="primary" @click="handlerDownloadexcel" class="btn3">
                    模板下载
                </a-button>
                <!-- <a-upload name="file" :multiple="true" action="http://127.0.0.1:4523/" :headers="headers"
                    @change="handleChange">

                </a-upload> -->
                <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader"
                    :action="importExcelUrl" @change="handleImportExcel">
                    <a-button type="primary" class="btn4">
                        <!-- <a-icon type="upload" /> -->
                        数据项导入
                    </a-button>
                </a-upload>
            </div>
            <div class="tab">
                <a-table :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
                    :columns="columns" :data-source="data" bordered Column="{align :left }" :pagination="false" :scroll="{ x: 1500, y:500 }" tableLayout="fixed">
                    <template slot="isSearchInList" slot-scope="value,record,index">
                        <a-checkbox @change="queryColumn($event,value,record,index)" :value="!!value" class="queryColumn" />
                    </template>
                    <template slot="isShowInList" slot-scope="value,record,index">
                        <a-checkbox @change="exhibit($event,value,record,index)" :value="!!value" class="queryColumn" />
                    </template>
                    <template slot="name" slot-scope="text, record">
                        <editable-cell :text="text" @change="onCellChange(record.key, 'name', $event)" />
                    </template>
                    <template slot="action" slot-scope="text, record">
                        <span v-if="record.editable" class="operation">
                            <a @click="() => save(record.key)" class="operation">保存</a>
                            <a-popconfirm cancel-text="不" title="真的要取消吗?" @confirm="() => cancel(record.key)" class="operation">
                                <a>取消</a>
                            </a-popconfirm>
                        </span>
                        <span v-else class="operation" >
                            <a :disabled="editingKey !== ''" @click="() => edit(record.key, true)">修改</a>
                        </span>
                        <a-popconfirm v-if="data.length" title="您真的要删除吗?" @confirm="() => onDelete(record.key)" class="operation">
                            <a href="javascript:;">删除</a>
                        </a-popconfirm>
                    </template>
                    <!-- 要修改什么就加那个字段 -->
                    <div
                        v-for="(col, i) in ['filedName', 'filedCharType', 'filedLength', 'filedConstraint', 'fieldValues', 'note']" 
                        :slot="col" slot-scope="text, record, index" :key="i">
                        <!-- <div :key="i" >                         -->
                            <a-input v-if="record.editable" style="margin: -5px 0" :value="text"
                                @change="e => handleChange(e.target.value, record.key, col, index)" />
                            <template v-else>
                                {{ text }}
                            </template>
                        <!-- </div> -->
                    </div>
                </a-table>
            </div>
        </template>
    </div>
</template>
<script>
import { getlistAll, getliste, updataTabelcol, addTabelcol, delTabelcol, deleteBatch, addImportExcel } from '@/api/api.js'
import { JeecgListMixin } from '@/mixins/JeecgListMixin'
import FontAddColumns from './FontAddColumns.vue'
const columns = [
    {
        title: '序号',
        dataIndex: 'filedOderNum',
        // align:'center',
        // fixed: 'left',
        ellipsis:true,
        customCell:column=>{
            return {
                style:{
                    'min-width':"100px",
                    // 'min-hight':"40px",
                    "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }
    },
    {
        title: '数据项名称',
        dataIndex: 'filedName',
        scopedSlots: { customRender: 'filedName' },
        customCell:column=>{
            return {
                style:{
                    'min-width':"50px",
                    // 'min-hight':"40px",
                    "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }

    },
    // {
    //     key: 'key',
    //     dataIndex: 'id',
    // },
    {
        title: '字符类型',
        dataIndex: 'filedCharType',
        scopedSlots: { customRender: 'filedCharType' },
        customCell:column=>{
            return {
                style:{
                    'min-width':"50px",
                    // 'min-hight':"40px",
                    "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }
    },
    {
        title: '长度',
        dataIndex: 'filedLength',
        scopedSlots: { customRender: 'filedLength' },
        customCell:column=>{
            return {
                style:{
                    'min-width':"70px",
                    // 'min-hight':"40px",
                    "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }

    },
    {
        title: '约束',
        dataIndex: 'filedConstraint',
        scopedSlots: { customRender: 'filedConstraint' },
        customCell:column=>{
            return {
                style:{
                    'min-width':"100px",
                    // 'min-hight':"40px",
                    // "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }
    },
    {
        title: '值域',
        dataIndex: 'fieldValues',
        scopedSlots: { customRender: 'fieldValues' },
        // customCell:column=>{
        //     return {
        //         style:{
        //             'min-width':"50px",
        //             // 'min-hight':"40px",
        //             "white-space":"nowrap",
        //             // overflow:"hidden",
        //             // display:"inline-block",
        //             // "text-overflow":"ellipsis",
        //             "font-size":"12px"
        //         }
        //     }
        // }

    },
    {
        title: '备注',
        dataIndex: 'note',
        scopedSlots: { customRender: 'note' },
        customCell:column=>{
            return {
                style:{
                    'min-width':"70px",
                    // 'min-hight':"40px",
                    // "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }
    },
    {
        title: '查询列',
        dataIndex: 'isSearchInList',
        scopedSlots: { customRender: 'isSearchInList' },
        customCell:column=>{
            return {
                style:{
                    'min-width':"100px",
                    // 'min-hight':"40px",
                    "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }
    },
    {
        title: '展示列',
        dataIndex: 'isShowInList',
        scopedSlots: { customRender: 'isShowInList' },
        customCell:column=>{
            return {
                style:{
                    'min-width':"100px",
                    // 'min-hight':"40px",
                    "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }
    },
    {
        title: '操作',
        key: 'action',
        scopedSlots: { customRender: 'action' },
        // fixed: 'right',
        customCell:column=>{
            return {
                style:{
                    'min-width':"100px",
                    // 'min-hight':"40px",
                    "white-space":"nowrap",
                    // overflow:"hidden",
                    // display:"inline-block",
                    // "text-overflow":"ellipsis",
                    "font-size":"12px"
                }
            }
        }
        
    },
];

// const data = [];
// for (let i = 0; i < 46; i++) {
//     data.push({
//         key: i,
//         index: ` ${i + 1}`,
//         filedName: 32,
//         // filedCharType: ` no. ${i}`,
//         filedCharType: `字符串型`,
//         filedLength: `100${i}`,
//         filedConstraint: `必选`,
//         fieldValues: `xx`,
//         note: `xx`,
//     });
// }

export default {
    components: { FontAddColumns },
    mixins: [JeecgListMixin],
    props: {
        list: {
            type: Array,
            default: [],
        },
    },
    data() {
        return {
            treeData: [],// 树结构
            data: [],
            columns,
            selectedRowKeys: [], //多选 选择的数据
            id: [],
            visible: false,   //模态框显示隐藏
            headers: '',
            editingKey: '',
            isupdata: false,
            // list: [],
            cacheData: [],
            importExcelUrl: `${window._CONFIG['domianURL']}/medicalShare/frontTableFiled/importExcel`,
        };
    },
    watch: {
        list: {
            handler(v) {
                if(!v) return []
                console.log(v, '22222');
                this.data = v;
                this.cacheData = this.data.map(item => ({ ...item }))
            }
        },
        immediate:true,
        deep:true,

    },
    computed: {

    },
    async mounted() {
        // await getlistAll().then(res => {

        //     console.log(res);
        //     this.treeData = res.result[0].id
        //     this.id = res.result[0].id
        //     console.log(this.id);
        // })

        // 216
        // const datas = await getliste({ id: 'id' })
        // console.log(datas, 'datas');
        // this.data = datas.result
        // setTimeout(() => {
        //     this.data = [
        //         {
        //             key: 1,
        //             index: ` 1`,
        //             filedName: '模拟请求的数据',
        //             // filedCharType: ` no. ${i}`,
        //             filedCharType: `字符串型`,
        //             filedLength: `受打击啊`,
        //             filedConstraint: `啊啊啊啊啊`,
        //             fieldValues: `啊实打实的`,
        //             note: `的权威权威`,
        //         }
        //     ]
        // }, 3000);
    },
    methods: {
        handleChange(value, key, column) {
            const newData = [...this.data];
            const target = newData.find(item => key === item.key);
            if (target) {
                target[column] = value;
                this.data = newData;
            }
        },
        edit(key, boole) {
            if (boole) {
                this.isupdata = true
            }
            const newData = [...this.data];
            const target = newData.find(item => key === item.key);
            this.editingKey = key;
            if (target) {
                target.editable = true;
                this.data = newData;
            }
        },
        async save(key) {
            const newData = [...this.data];
            const newCacheData = [...this.cacheData];
            const target = newData.find(item => key === item.key);
            const targetCache = newCacheData.find(item => key === item.key);
            if (target && targetCache) {
                delete target.editable;
                this.data = newData;
                Object.assign(targetCache, target);
                this.cacheData = newCacheData;
            }
            if (!this.isupdata) {
                const datas = await addTabelcol(target)
                this.editingKey = '';
                console.log(datas);
                this.$message.success('添加成功！')
            } else {
                const datas = await updataTabelcol(target)
                this.editingKey = '';
                console.log(datas);
                this.$message.success('修改成功！')
            }
        },
        cancel(key) {
            const newData = [...this.data];
            const target = newData.find(item => key === item.key);
            this.editingKey = '';
            if (target) {
                Object.assign(target, this.cacheData.find(item => key === item.key));
                delete target.editable;
                this.data = newData;
            }
        },
        handleImportExcel(e, i) {
            console.log(e, i);
        },
        handlerDownloadexcel() {
            window.location.href = "/static/表资源模板.xlsx"
        },
        onSelectChange(selectedRowKeys) {
            console.log('selectedRowKeys changed: ', selectedRowKeys);
            this.selectedRowKeys = selectedRowKeys;
            console.log(this.selectedRowKeys);
        },
        // onChanges(value,i){
        //     console.log(value,222);
        // }
        // 查询列 
        queryColumn(e, value,recode,index ) {
            console.log(e)
            console.log(value);
            console.log(recode);
            console.log(index);
            // this.data = this.data.find((l,i)=>l.id==recode.)
            const dataSource = [...this.data];
            const target = dataSource.find(item => item.id === recode.id);
            target.isSearchInList = !!value  ? '1':'0'
            if (target) {
                
                this.data[index] = Object.assign({},target)
            }
        },
        exhibit(e, value,recode,index) {
            console.log(e.target.checked);
            console.log(e);
            console.log(value);
            const dataSource = [...this.data];
            const target = dataSource.find(item => item.id === recode.id);
            target.isShowInList = !!value  ? '1':'0'
            if (target) {
                
                this.data[index] = Object.assign({},target)
            }
        },
        // 添加列
        addColumns() {
            this.visible = true;
        },
        handleCancel() {
            this.visible = false;
        },
        handleCreate() {
            const form = this.$refs.collectionForm.form;
            form.validateFields((err, values) => {
                if (err) {
                    return;
                }
                console.log('Received values of form: ', values);
                form.resetFields();
                this.visible = false;
            });
        },


        /** 触发事件 */
        trigger(name) {
            const { data } = this;
            // console.log(111);
            const newData = {
                // parentMenuId: '216',  // 死id
                // key: this.data.length + 1,
                // index: this.data.length + 1,
                // tableCode: '123',
                // tableName: '33333',
                // filedOderNum: this.data.length + 1,
                // filedName: '12322',
                // filedNameCode: '123123',
                // filedInfo: '123123',
                // filedCharType: 'asdasdasd',
                // filedLength: 231,
                // filedConstraint: 'cbhdkgf',
                // fieldValues: 'asdasd',
                // // isShowInList: 'asdasdssss',
                // createTime: '2022-11-25 12:12:22',
                // isSearchInList: "123123",
                parentMenuId: '216',  // 死id
                key: this.data.length + 1,
                index: this.data.length + 1,
                tableCode: '123',
                tableName: '33333',
                filedOderNum: this.data.length + 1,
                filedName: '',
                filedNameCode: '123123',
                filedInfo: '123123',
                filedCharType: '',
                filedLength: '',
                filedConstraint: '',
                fieldValues: '',
                createTime: '2022-11-25 12:12:22',
                isSearchInList: "123123",
            };

            this.data = [...data, newData];
            this.isupdata = false
            this.cacheData = this.data.map(item => ({ ...item }))
            this.edit(newData.key)
            // this.count = this.data.length + 1;
            // this.$emit(name)
        },
        onCellChange(key, dataIndex, value) {
            const dataSource = [...this.data];
            const target = dataSource.find(item => item.key === key);
            console.log(key)
            console.log(dataIndex)
            console.log(value)
            if (target) {
                target[dataIndex] = value;
                this.data = dataSource;
            }
        },

        // 删除一列数据
        async onDelete(key) {
            let res = await delTabelcol({
                id: this.data.find(e => e.key == key).id
            })
            console.log(res);
            const dataSource = [...this.data];
            this.data = dataSource.filter(item => item.key !== key);
            
        },
        // 删除多项数据
        async handerDelete(key) {
            const ids = this.data.map(e => {
                if (this.selectedRowKeys.includes(e.key)) { return e.id }
            }).filter(e => e).join(',')
            // this.selectedRowKeys
            this.data = this.data.filter(e => !this.selectedRowKeys.includes(e.key))
            console.log(this.data);

            let res = await deleteBatch({
                ids
            })

            console.log(res);
            // console.log(res);

        }
    },
};
</script>
<style lang="less" scoped>
* {
    margin: 0;
    padding: 0;
    text-decoration: none;
}

.box {
    width: 100%;
    height: 650px;
    // height: 500px;
    // border: 1px solid;

    .btn {
        // border: 1px solid;
        margin-top: 45.5px;
        margin-bottom: 56px;
        .btn1 {
            width: 82px;
            height: 32px;
            margin-left: 24px;
        }

        .btn2 {
            width: 72px;
            height: 32px;
            margin-left: 20px;
        }

        .btn3 {
            width: 112px;
            height: 32px;
            margin-left: 20px;
        }

        .btn4 {
            width: 127px;
            height: 32px;
            margin-left: 17px;

        }
    }

    .tab {
        // width: 832px;
        width: 100%;
        height: 700px;
        margin-top: 56px;
        overflow: auto;

        // text-align: center;
        // border: 1px solid;
        // overflow: auto;
        // background-color: antiquewhite;

        // margin-left: 10px;
        .queryColumn {
            // text-align: center;

        }


    }
}

::v-deep .ant-table-bordered .ant-table-thead>tr>th,
.ant-table-bordered .ant-table-tbody>tr>td {
    text-align: center
}

::v-deep .ant-table table {
    text-align: center;
}

::v-deep .ant-table-wrapper {
    overflow: auto !important;
}
 .ant-table-thead{
    font-size: 14px;
    background-color: antiquewhite !important;
}
// ::v-deep .ant-table-header-column {
//     // display: inline-block;
//     width: auto;
//     // height: 40px;
//     border: 1px solid;
//     // text-align: left !important
// }
// ant-table-header-column
.operation{
    padding-right: 6px;
    // border: 1px solid;
}
</style>