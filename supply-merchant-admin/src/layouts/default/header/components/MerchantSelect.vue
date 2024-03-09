<template>

    <BasicModal
        @register="registerModal"
        title="选择商户"
        @ok="handleSubmit"
        @cancel="handleLogout"
        centered
        :width="1200"
        :maskClosable="false"
        :keyboard="false"
        :closable="false"
        :canFullscreen="false"
        cancelText="重新登录"
        okText="确认选择"
    >

        <div class="flex flex-wrap">

            <div
                class="w-1/3 p-5px bg-white"
                v-for="(item, index) in merchantList"
                :key="item.merchantId"
            >
                <div
                    class="item p-20px mb-10px "
                    :class="{ 'on': currentIndex === index }"
                    @click="currentIndex = index"
                    @dblclick="handleDbclick(index)"
                >
                    <div class="text-26px font-semibold">
                        {{ item.merchantName }}
                    </div>
                    <div class="pt-20px">商户有效期：</div>
                    <div>{{ item.validityStartTime }} - {{ item.validityEndTime }}</div>
                </div>
            </div>
        </div>

    </BasicModal>
</template>

<script lang="ts" setup>
import { ref, onMounted, unref } from "vue"
import { useModal, BasicModal } from '/@/components/Modal';
import { getUserMerchantListApi } from "/@/api/sys/user"
import { useUserStore } from "/@/store/modules/user";
import { useTabs } from '/@/hooks/web/useTabs';
import { RoleEnum } from '/@/enums/roleEnum';

interface Merchant {
    merchantId: number;
    merchantName: string;
    validityStartTime: string;
    validityEndTime: string;
}
const { refreshPage } = useTabs();
const userStore = useUserStore()
const merchantList = ref<Merchant[]>([])
const currentIndex = ref<number>(0)
const [registerModal, { openModal, closeModal, setModalProps }] = useModal();
function handleDbclick(index) {
    currentIndex.value = index;
    handleSubmit()
}
function handleSubmit() {
    const { merchantId, merchantName } = merchantList.value[currentIndex.value]
    userStore.setMerchantInfo({
        merchantId,
        merchantName
    })
    closeModal();
    refreshPage()
}
function handleLogout() {
    userStore.logout(true)
}
async function getUserMerchantList() {
    setModalProps({ loading: true })
    merchantList.value = await getUserMerchantListApi()
    const index = unref(merchantList).findIndex(item => item.merchantId === userStore.getMerchantId)
    if (index !== -1) currentIndex.value = index;
    setModalProps({ loading: false })
}
function showMerchantSelect() {
    openModal()
    getUserMerchantList()
}
onMounted(() => {
    const [role] = userStore.roleList;
    if (role !== RoleEnum.SUPPLIER) return;
    if (!userStore.getMerchantId) {
        showMerchantSelect()
    }
})
defineExpose({
    showMerchantSelect
})
</script>

<style lang="less" scoped>
.item {
    border: 4px solid #eee;
    cursor: pointer;

    &.on {
        border-color: #0960BD;
        color: #0960BD;
    }
}
</style>