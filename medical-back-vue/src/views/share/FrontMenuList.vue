<template>
  <div class="directory">
    <div class="treebox">
      <FrontMenuListTree  ref="tree" @getchoosedata='getchoosedata'></FrontMenuListTree>
    </div>
    <div class="tab">
      <a-tabs default-active-key="1" @change="callback">
        <a-tab-pane key="1" tab="基础信息" class="">
          <font-menu-list :item="item"  :changeTreeData="changeTreeData"></font-menu-list>
        </a-tab-pane>
        <a-tab-pane key="2" tab="数据项" force-render>
          <font-menu-list-data :list="list"></font-menu-list-data>
        </a-tab-pane>
      </a-tabs>
    </div>

  </div>
</template>
<script>
// import FontMenuList from '../../components/FontMenuList/FontMenuList.vue';
import FrontMenuListTree from './FrontMenuListTree.vue'
export default {
  // components: { FontMenuList },
  data() {
    return {
      item: null,
      list: null
    };
  },
  methods: {
    changeTreeData(){
      this.$refs.tree.getTreeDataOne()
    },
    getchoosedata(item, data) {
      this.item = item;
      data.result.forEach((e, i) => {
        e.key = i
        e.index = i+1
      })
      this.list = data.result
      // console.log(data, item, 'data');
    },
    callback(key) {
      console.log(key);
    },
  },
  components: { FrontMenuListTree }
};
</script>
<style lang="less" scoped>


@media screen and (max-width: 90px) {
  
}
.directory {
  width: 100%;
  // width: 832px;
  // height: 807px;
  // border: 1px solid red;
  font-family: Source Han Sans CN;
  font-size: 12px;
  display: flex;
 
  .treebox {
    // width: 30%px;
    width: 300px;
    height: 807px;
    border-radius: 2px;
    // border: 1px solid;
    background-color: #FFFFFF;
    // flex: 1;
    overflow: auto;
    overflow-x: hidden;
    flex-shrink: 0;
  }


  .tab {
    flex:1;
    border-radius: 2px;
    background-color: #FFFFFF;
    margin-left: 18px;
    padding-top: 24px;
    min-width: 400px;
    overflow: auto;
  }

  .ant-form-item label{
    font-size: 12px;
  }

}
</style>