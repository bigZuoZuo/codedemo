<template>
  <ScrollContainer>
    <div ref="wrapperRef" :class="prefixCls">
      <Tabs tab-position="left" :tabBarStyle="tabBarStyle">
        <template v-for="item in settingList" :key="item.key">
          <TabPane :tab="item.name">
            <component :is="item.component" />
          </TabPane>
        </template>
      </Tabs>
    </div>
  </ScrollContainer>
</template>

<script lang="ts">

import { Tabs } from 'ant-design-vue';

import { ScrollContainer } from '/@/components/Container/index';

import BaseSetting from './BaseSetting.vue';
import PwdSetting from './PwdSetting.vue';

export default {
  components: {
    ScrollContainer,
    Tabs,
    TabPane: Tabs.TabPane,
    BaseSetting,
    PwdSetting
  },

}
</script>
<script lang="ts" setup>
const settingList = [
  {
    key: '1',
    name: '基本设置',
    component: 'BaseSetting',
  },
  {
    key: '2',
    name: '密码设置',
    component: 'PwdSetting',
  },
];
const prefixCls = 'account-setting'
const tabBarStyle = {
  width: '220px',
}
</script>
<style lang="less">
.account-setting {
  margin: 12px;
  background-color: @component-background;

  .base-title {
    padding-left: 0;
  }

  .ant-tabs-tab-active {
    background-color: @item-active-bg;
  }
}
</style>
