<template>
    <Upload
        name="file"
        list-type="picture-card"
        :show-upload-list="false"
        :action="uploadUrl"
        :headers="headers"
        :before-upload="beforeUpload"
        :data="{ module: props.module }"
        @change="uploadChange"
    >
        <img
            style="width:100%;height:100%;"
            v-if="props.imgUrl"
            :src="props.imgUrl"
        />
        <div v-else>
            <LoadingOutlined v-if="state.uploading" />
            <PlusOutlined v-else />
        </div>
    </Upload>
</template>

<script lang="ts">
import { computed, reactive } from "vue"
import { Upload } from "ant-design-vue"
import { useGlobSetting } from '/@/hooks/setting';
import { useUserStore } from '/@/store/modules/user';
import { useMessage } from '/@/hooks/web/useMessage';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue';
</script>
<script lang="ts" setup>
const { createMessage } = useMessage();
const { uploadUrl } = useGlobSetting();
const userStore = useUserStore();
const headers = computed(() => ({
    Authorization: userStore.getToken
}))
const state = reactive({
    uploading: false,
})
const props = defineProps({
    imgUrl: {
        type: String,
    },
    imgId: {
        type: [String, Number],
    },
    module: {
        type: String,
        default: 'img'
    }
})
const emit = defineEmits(['update:imgUrl', 'update:imgId', 'change'])
// 上传前
function beforeUpload(file) {
    const isImage = file.type.includes("image");
    if (!isImage) {
        createMessage.error('请上传图片类型的文件')
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        createMessage.error('请上传2MB一下大小的图片')
    }
    return isImage && isLt2M
};

function uploadChange({ file }) {
    if (file.status === 'uploading') {
        state.uploading = true;
        return;
    }
    if (file.status === 'done') {
        const { response: { code, data }
        } = file;
        if (code === 1) {
            emit('update:imgId', data?.id)
            emit('update:imgUrl', data?.fileUrl)
            emit('change', data?.id)
            createMessage.success('上传成功')
        } else {
            createMessage.error('上传失败')
        }
        state.uploading = false;
    }
    if (file.status === 'error') {
        state.uploading = false;
    }
};
</script>
