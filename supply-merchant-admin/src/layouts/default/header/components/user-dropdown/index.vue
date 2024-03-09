<template>
  <Dropdown
    placement="bottomLeft"
    :overlayClassName="`${prefixCls}-dropdown-overlay`"
  >
    <span
      :class="[prefixCls, `${prefixCls}--${theme}`]"
      class="flex"
    >
      <img
        :class="`${prefixCls}__header`"
        :src="getUserInfo.avatar"
      />
      <span :class="`${prefixCls}__info hidden md:block`">
        <span
          :class="`${prefixCls}__name  `"
          class="truncate"
        >
          {{ getUserInfo.realName }}
        </span>
      </span>
    </span>

    <template #overlay>
      <Menu @click="handleMenuClick">
        <MenuItem
          key="doc"
          :text="t('layout.header.dropdownItemDoc')"
          icon="ion:document-text-outline"
          v-if="getShowDoc"
        />
        <MenuItem
          key="editpwd"
          text="修改密码"
          icon="ant-design:lock-filled"
        />
        <MenuItem
          v-if="getShowSwitch"
          key="switch"
          text="切换商户"
          icon="heroicons-outline:switch-horizontal"
        />
        <MenuDivider v-if="getShowDoc" />
        <MenuItem
          v-if="getUseLockPage"
          key="lock"
          :text="t('layout.header.tooltipLock')"
          icon="ion:lock-closed-outline"
        />

        <MenuItem
          key="logout"
          :text="t('layout.header.dropdownItemLoginOut')"
          icon="ion:power-outline"
        />
      </Menu>
    </template>
  </Dropdown>
  <LockAction @register="register" />
</template>
<script lang="ts">
// components
import { Dropdown, Menu } from 'ant-design-vue';

import { defineComponent, computed } from 'vue';

import { DOC_URL } from '/@/settings/siteSetting';

import { useUserStore } from '/@/store/modules/user';
import { useHeaderSetting } from '/@/hooks/setting/useHeaderSetting';
import { useI18n } from '/@/hooks/web/useI18n';
import { useDesign } from '/@/hooks/web/useDesign';
import { useModal } from '/@/components/Modal';

import headerImg from '/@/assets/images/header.jpg';
import { propTypes } from '/@/utils/propTypes';
import { openWindow } from '/@/utils';

import { createAsyncComponent } from '/@/utils/factory/createAsyncComponent';
import { RoleEnum } from '/@/enums/roleEnum';
import { useRouter } from 'vue-router';
// type MenuEvent = 'logout' | 'doc' | 'lock';

export default defineComponent({
  name: 'UserDropdown',
  components: {
    Dropdown,
    Menu,
    MenuItem: createAsyncComponent(() => import('./DropMenuItem.vue')),
    MenuDivider: Menu.Divider,
    LockAction: createAsyncComponent(() => import('../lock/LockModal.vue')),
  },
  props: {
    theme: propTypes.oneOf(['dark', 'light']),
  },
  emits: ['switch'],
  setup(_, { emit }) {
    const { prefixCls } = useDesign('header-user-dropdown');
    const { t } = useI18n();
    const { getShowDoc, getUseLockPage } = useHeaderSetting();
    const userStore = useUserStore();
    const router = useRouter()
    const getUserInfo = computed(() => {
      const { realName = '',
        // avatar, desc 

      } = userStore.getUserInfo || {};
      return {
        realName, avatar: headerImg,
        //  desc 
      };
    });

    const getShowSwitch = computed(() => userStore.getRoleList.includes(RoleEnum.SUPPLIER))

    const [register, { openModal }] = useModal();

    function handleLock() {
      openModal(true);
    }

    //  login out
    function handleLoginOut() {
      userStore.confirmLoginOut();
    }

    // open doc
    function openDoc() {
      openWindow(DOC_URL);
    }
    function handleSwitch() {
      emit('switch')
    }
    function handleEditPwd() {
      router.push("/basic/setting")
    }

    function handleMenuClick(e: { key }) {
      switch (e.key) {
        case 'logout':
          handleLoginOut();
          break;
        case 'doc':
          openDoc();
          break;
        case 'lock':
          handleLock();
          break;
        case 'switch':
          handleSwitch();
        case 'editpwd':
          handleEditPwd();
          break;
      }
    }

    return {
      prefixCls,
      t,
      getUserInfo,
      handleMenuClick,
      getShowDoc,
      register,
      getUseLockPage,
      getShowSwitch
    };
  },
});
</script>
<style lang="less">
@prefix-cls: ~'@{namespace}-header-user-dropdown';

.@{prefix-cls} {
  height: @header-height;
  padding: 0 0 0 10px;
  padding-right: 10px;
  overflow: hidden;
  font-size: 12px;
  cursor: pointer;
  align-items: center;

  img {
    width: 24px;
    height: 24px;
    margin-right: 12px;
  }

  &__header {
    border-radius: 50%;
  }

  &__name {
    font-size: 14px;
  }

  &--dark {
    &:hover {
      background-color: @header-dark-bg-hover-color;
    }
  }

  &--light {
    &:hover {
      background-color: @header-light-bg-hover-color;
    }

    .@{prefix-cls}__name {
      color: @text-color-base;
    }

    .@{prefix-cls}__desc {
      color: @header-light-desc-color;
    }
  }

  &-dropdown-overlay {
    .ant-dropdown-menu-item {
      min-width: 160px;
    }
  }
}
</style>
