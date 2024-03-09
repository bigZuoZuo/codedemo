<template>
    <div class="flex text-white">
        <template v-if="isSupplier">

            <div class="flex items-center px-15px">
                当前供应商：
                <span class="font-semibold"> {{ userStore.getUserInfo.supplyInfoName }}</span>
            </div>
            <div class="flex items-center px-15px">
                当前选择商户： <span
                    class="pr-5px font-semibold cursor-pointer"
                    @click="handleSwitchMercahnt"
                >{{ userStore.getMerchantName || '暂未选择' }}
                    <SwapOutlined />
                </span>
            </div>

        </template>
    </div>
</template>

<script lang="ts" setup>
import { SwapOutlined } from "@ant-design/icons-vue"
import { useUserStore } from "/@/store/modules/user";
const userStore = useUserStore();

const emit = defineEmits(['clickSwitch'])
defineProps({
    isSupplier: {
        type: Boolean,
        default: false
    }
})


function handleSwitchMercahnt() {
    emit('clickSwitch')
}
</script>
