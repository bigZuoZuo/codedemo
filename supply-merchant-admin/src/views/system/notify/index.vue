<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <!-- <AButton
          type="primary"
          @click="handleCreate"
        >添加</AButton> -->


        <Dropdown>
          <template #overlay>
            <Menu>
              <MenuItem :key="1" @click="handleCreate(1)">公告</MenuItem>
              <MenuItem :key="2" @click="handleCreate(2)">通知</MenuItem>
            </Menu>
          </template>
          <AButton
            type="primary"
          >添加</AButton>
        </Dropdown>

      </template>

      <template #validDate="{ record }">
        {{ record.validBeginDate }} - {{ record.valideEndDate }}
      </template>

    </BasicTable>

    <FormDrawer
      @register="registerDrawer"
      @success="reload"
    />

  </div>
</template>
<script lang="ts">
import { BasicTable, useTable } from '/@/components/Table';
import { getTableColumns, getTableFormConfig } from './data';
import { getListApi } from '/@/api/system/notify';
import { useDrawer } from '/@/components/Drawer';
import FormDrawer from "./FormDrawer.vue"
import { Menu, Dropdown } from 'ant-design-vue';
const MenuItem = Menu.Item
export default {
  name: 'Notify'
}
</script>
<script lang="ts" setup>
const [registerTable, { reload }] = useTable({
  api: getListApi,
  columns: getTableColumns(),
  useSearchForm: true,
  formConfig: getTableFormConfig(),
  showTableSetting: true,
  tableSetting: { fullScreen: true },
  showIndexColumn: true,
  // pagination: false,
});
const [registerDrawer, { openDrawer }] = useDrawer();
function handleCreate(noticeType) {
  openDrawer(true, { noticeType });
}


</script>
