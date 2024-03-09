<template>
  <a-card :bordered="false">
    <!-- 查询区域 -->
    <div class="table-page-search-wrapper">
      <a-form layout="inline" @keyup.enter.native="searchQuery">
        <a-row :gutter="24">
<!--          <a-col :xl="6" :lg="7" :md="8" :sm="24">-->
<!--            <a-form-item label="申请状态">-->
<!--              <j-dict-select-tag placeholder="请选择申请状态" v-model="queryParam.status" dictCode="share_apply_status"/>-->
<!--            </a-form-item>-->
<!--          </a-col>-->
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <a-form-item label="申请资源类型">
              <j-dict-select-tag placeholder="请选择申请资源类型" v-model="queryParam.type" dictCode="share_apply_type"/>
            </a-form-item>
          </a-col>
          <a-col :xl="6" :lg="7" :md="8" :sm="24">
            <span style="float: left;overflow: hidden;" class="table-page-search-submitButtons">
              <a-button type="primary" @click="searchQuery" icon="search">查询</a-button>
              <a-button type="primary" @click="searchReset" icon="reload" style="margin-left: 8px">重置</a-button>
<!--              <a @click="handleToggleSearch" style="margin-left: 8px">-->
<!--                {{ toggleSearchStatus ? '收起' : '展开' }}-->
<!--                <a-icon :type="toggleSearchStatus ? 'up' : 'down'"/>-->
<!--              </a>-->
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <!-- 查询区域-END -->
    <!-- 操作按钮选择区域 -->
    <div class = "table-chose">
     <span v-for="(item, index) in checkList" :key="index" :span="10">
										<a-button
                      style="margin-left: 10px; width: 80px;"
                      @click="checkStatusSearch(index)"
                      :type="checkBackGround ==  index ? 'primary' : null">{{ item.id }}
										</a-button>
									</span>
    </div>


    <!-- 操作按钮选择区域 end-->

    <!-- 操作按钮区域 -->
    <div class="table-operator">
<!--      <a-button @click="handleAdd" type="primary" icon="plus">新增</a-button>-->
<!--      <a-button type="primary" icon="download" @click="handleExportXls('申请表')">导出</a-button>-->
<!--      <a-upload name="file" :showUploadList="false" :multiple="false" :headers="tokenHeader" :action="importExcelUrl" @change="handleImportExcel">-->
<!--        <a-button type="primary" icon="import">导入</a-button>-->
<!--      </a-upload>-->
      <!-- 高级查询区域 -->
<!--      <j-super-query :fieldList="superFieldList" ref="superQueryModal" @handleSuperQuery="handleSuperQuery"></j-super-query>-->
    </div>

    <!-- table区域-begin -->
    <div>
      <div class="ant-alert ant-alert-info" style="margin-bottom: 16px;">
        <i class="anticon anticon-info-circle ant-alert-icon"></i> 已选择 <a style="font-weight: 600">{{ selectedRowKeys.length }}</a>项
        <a style="margin-left: 24px" @click="onClearSelected">清空</a>
      </div>

      <a-table
        ref="table"
        size="middle"
        :scroll="{x:true}"
        bordered
        rowKey="id"
        :columns="columns"
        :dataSource="dataSource"
        :pagination="ipagination"
        :loading="loading"
        :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
        class="j-table-force-nowrap"
        @change="handleTableChange">

        <template slot="htmlSlot" slot-scope="text">
          <div v-html="text"></div>
        </template>
        <template slot="imgSlot" slot-scope="text,record">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无图片</span>
          <img v-else :src="getImgView(text)" :preview="record.id" height="25px" alt="" style="max-width:80px;font-size: 12px;font-style: italic;"/>
        </template>
        <template slot="fileSlot" slot-scope="text">
          <span v-if="!text" style="font-size: 12px;font-style: italic;">无文件</span>
          <a-button
            v-else
            :ghost="true"
            type="primary"
            icon="download"
            size="small"
            @click="downloadFile(text)">
            下载
          </a-button>
        </template>

        <span slot="action" slot-scope="text, record">
<!--          <a @click="handleDetail(record)">详情</a>-->
           <a style="margin-left: 5px" @click="checkSucces(record)">通过</a>
          <a style="margin-left: 5px" @click="checkError(record)">驳回</a>


<!--          <a-dropdown>-->
<!--            <a class="ant-dropdown-link">更多 <a-icon type="down" /></a>-->
<!--            <a-menu slot="overlay">-->
  <!--              <a-menu-item>-->
  <!--                <a @click="handleDetail(record)">通过</a>-->
  <!--              </a-menu-item>-->
  <!--              <a-menu-item>-->
  <!--                <a-popconfirm title="确定删除吗?" @confirm="() => handleDelete(record.id)">-->
  <!--                  <a>驳回</a>-->
  <!--                </a-popconfirm>-->
  <!--              </a-menu-item>-->
<!--            </a-menu>-->
<!--          </a-dropdown>-->
        </span>

      </a-table>
    </div>

    <front-apply-modal ref="modalForm" @ok="modalFormOk"></front-apply-modal>
  </a-card>
</template>

<script>

  import '@/assets/less/TableExpand.less'
  import { mixinDevice } from '@/utils/mixin'
  import { JeecgListMixin } from '@/mixins/JeecgListMixin'
  import FrontApplyModal from './modules/FrontApplyModal'
  import {filterMultiDictText} from '@/components/dict/JDictSelectUtil'
  import { check } from "@/api/apply.js";
  export default {
    name: 'FrontApplyList',
    mixins: [JeecgListMixin, mixinDevice],
    components: {
      FrontApplyModal,

    },
    data() {
      return {
        description: '申请表管理页面',
        // 表头
        columns: [
          {
            title: '#',
            dataIndex: '',
            key: 'rowIndex',
            width: 60,
            align: "center",
            customRender: function (t, r, index) {
              return parseInt(index) + 1;
            }
          },
          {
            title: '申请用户',
            align: "center",
            dataIndex: 'userId_dictText'

          },
          {
            title: '审批事项',
            align: "center",
            dataIndex: 'item'
          },
          // {
          //   title:'审批机构',
          //   align:"center",
          //   dataIndex: 'checkBy'
          // },
          {
            title: '申请时间',
            align: "center",
            dataIndex: 'applyTime'
          },
          // {
          //   title:'完成时间',
          //   align:"center",
          //   dataIndex: 'checkTime'
          // },
          {
            title: '申请是由',
            align: "center",
            dataIndex: 'matter'
          },
          {
            title: '申请状态',
            align: "center",
            dataIndex: 'status_dictText'
          },
          {
            title: '申请附件',
            align: "center",
            dataIndex: 'applyFile'
          },
          {
            title: '申请资源类型',
            align: "center",
            dataIndex: 'type_dictText'
          },
          // {
          //   title:'申请api地址',
          //   align:"center",
          //   dataIndex: 'api'
          // },
          // {
          //   title:'目标库地址',
          //   align:"center",
          //   dataIndex: 'dataBase'
          // },
          // {
          //   title:'目标库用户',
          //   align:"center",
          //   dataIndex: 'dataBaseAccount'
          // },
          // {
          //   title:'建库策略',
          //   align:"center",
          //   dataIndex: 'dataBaseMethod'
          // },
          // {
          //   title:'数据项',
          //   align:"center",
          //   dataIndex: 'dataLine'
          // },
          // {
          //   title:'数据交换频率,0-每时,1-每天,2-每周,3-每月,4-每年',
          //   align:"center",
          //   dataIndex: 'rate'
          // },
          {
            title: '资源目录',
            align: "center",
            dataIndex: 'menuId_dictText'
          },
          // {
          //   title:'资源id',
          //   align:"center",
          //   dataIndex: 'sourceId'
          // },
          // {
          //   title:'审批人',
          //   align:"center",
          //   dataIndex: 'checkPerson'
          // },
          // {
          //   title:'驳回原因',
          //   align:"center",
          //   dataIndex: 'backReason'
          // },
          {
            title: '操作',
            dataIndex: 'action',
            align: "center",
            fixed: "right",
            width: 147,
            scopedSlots: { customRender: 'action' }
          }
        ],
        url: {
          list: "/medicalShare/frontApply/list",
          delete: "/medicalShare/frontApply/delete",
          deleteBatch: "/medicalShare/frontApply/deleteBatch",
          exportXlsUrl: "/medicalShare/frontApply/exportXls",
          importExcelUrl: "/medicalShare/frontApply/importExcel",
        },
        dictOptions: {},
        superFieldList: [],
        checkBackGround:0,
        checkList: [{ id: "待审核" }, { id: "已审核" }, { id: "已驳回" }],
      }
    },
    created() {
      this.getSuperFieldList();
    },
    computed: {
      importExcelUrl: function () {
        return `${window._CONFIG['domianURL']}/${this.url.importExcelUrl}`;
      },
    },
    methods: {
      initDictConfig() {
      },
      getSuperFieldList() {
        let fieldList = [];
        fieldList.push({
          type: 'string',
          value: 'userId',
          text: '申请用户',
          dictCode: "front_platform_user,realname,id"
        })
        fieldList.push({ type: 'Text', value: 'item', text: '审批事项', dictCode: '' })
        fieldList.push({ type: 'string', value: 'checkBy', text: '审批机构', dictCode: "front_depart,depart_name,id" })
        fieldList.push({ type: 'datetime', value: 'applyTime', text: '申请时间' })
        fieldList.push({ type: 'datetime', value: 'checkTime', text: '完成时间' })
        fieldList.push({ type: 'string', value: 'matter', text: '申请是由', dictCode: '' })
        fieldList.push({
          type: 'int',
          value: 'status',
          text: '申请状态',
          dictCode: 'share_apply_status'
        })
        fieldList.push({ type: 'Text', value: 'applyFile', text: '申请附件', dictCode: '' })
        fieldList.push({
          type: 'string',
          value: 'type',
          text: '申请资源类型',
          dictCode: 'share_apply_type'
        })
        fieldList.push({ type: 'string', value: 'api', text: '申请api地址', dictCode: '' })
        fieldList.push({ type: 'string', value: 'dataBase', text: '目标库地址', dictCode: '' })
        fieldList.push({ type: 'string', value: 'dataBaseAccount', text: '目标库用户', dictCode: '' })
        fieldList.push({ type: 'string', value: 'dataBaseMethod', text: '建库策略', dictCode: '' })
        fieldList.push({ type: 'Text', value: 'dataLine', text: '数据项', dictCode: '' })
        fieldList.push({
          type: 'int',
          value: 'rate',
          text: '数据交换频率',
          dictCode: ''
        })
        fieldList.push({ type: 'string', value: 'menuId', text: '资源目录', dictCode: "front_menu,name,id" })
        fieldList.push({ type: 'Text', value: 'sourceId', text: '资源id', dictCode: '' })
        fieldList.push({ type: 'string', value: 'checkPerson', text: '审核人', dictCode: '' })
        fieldList.push({ type: 'string', value: 'checkPerson', text: '审批人', dictCode: '' })
        this.superFieldList = fieldList
      },

      checkStatusSearch(index) {
        this.checkBackGround = index
        if (index == 0) {
          this.queryParam.status = 0
        }
        if (index == 1) {
          this.queryParam.status = 1
        }
        if (index == 2) {
          this.queryParam.status = 2
        }
        this.searchQuery()
      },

      checkSucces(data) {
        const that = this;
        this.$confirm({
          title: '提示！',
          content: `是否确定${data.item}审核通过！`,
          okText: '确认',
          okType: 'danger',
          cancelText: '取消',
          onOk() {
            const newList = { id: data.id };
            that.loading = true;
            console.log(newList)
            check(newList)
              .then(res => {
                that.$message.success("操作成功");
                that.searchQuery();
              })
              .catch(err => {
                that.$message.error("操作失败，" + err);
                that.searchQuery();
              });
            that.loading = false;
          },
          onCancel() {
          },
        });
      },

      checkError(data) {
        this.$refs.modalForm.add(data);
      },


    }
  }
</script>
<style scoped>
  @import '~@assets/less/common.less';
</style>