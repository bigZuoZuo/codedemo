<template>
  <div :class="prefixCls">
    <Popover
      trigger="click"
      :overlayClassName="`${prefixCls}__overlay`"
      width="500"
    >
      <Badge
        :count="12"
        dot
      >
        <BellOutlined />
      </Badge>
      <template #content>
        <Tabs>
          <!-- <template v-for="item in listData" :key="item.key"> -->
          <TabPane>
            <template #tab>
              消息
              <span>({{ total }})</span>
            </template>
            <!-- 绑定title-click事件的通知列表中标题是“可点击”的-->
            <NoticeList
              class="w-300px"
              :list="listData"
              :total="total"
              v-model:currentPage="page.pageIndex"
              v-model:pageSize="page.pageSize"
              @title-click="onNoticeClick"
            />
            <!-- <NoticeList :list="item.list" v-else /> -->
          </TabPane>
          <!-- </template> -->
        </Tabs>
      </template>
    </Popover>
  </div>
</template>
<script lang="ts" setup>
import { ref, unref, watch } from 'vue';
import { Popover, Tabs, Badge } from 'ant-design-vue';
import { BellOutlined } from '@ant-design/icons-vue';
import { ListItem } from './data';
import NoticeList from './NoticeList.vue';
import { useDesign } from '/@/hooks/web/useDesign';
import { useMessage } from '/@/hooks/web/useMessage';
import { getNotifyPage, readNotice } from "/@/api/sys/user"

const TabPane = Tabs.TabPane
const { prefixCls } = useDesign('header-notify');
const { createMessage } = useMessage();
const listData = ref([]);
const total = ref(0)
const page = ref({
  pageIndex: 1,
  pageSize: 5,
})
async function getNotifyPageList() {
  const data = await getNotifyPage(unref(page));
  listData.value = data.itemList;
  total.value = data.totalCount
}
watch(() => unref(page).pageIndex, () => getNotifyPageList(), { immediate: true })


async function onNoticeClick(record: ListItem) {
  if(record.readStatus === 1)  return
  await readNotice({ id: record.id })
  createMessage.success('阅读成功');
  // 可以直接将其标记为已读（为标题添加删除线）,此处演示的代码会切换删除线状态
  record.titleDelete = !record.titleDelete;
}



</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-header-notify';

.@{prefix-cls} {
  padding-top: 2px;

  &__overlay {
    max-width: 360px;
  }

  .ant-tabs-content {
    width: 300px;
  }

  .ant-badge {
    font-size: 18px;

    .ant-badge-multiple-words {
      padding: 0 4px;
    }

    svg {
      width: 0.9em;
    }
  }
}
</style>
