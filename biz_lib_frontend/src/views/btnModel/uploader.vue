<template>
  <div class="flex items-center">
    <input
      ref="fileInput"
      type="file"
      :accept="accept"
      class="hidden"
      @change="handleFileChange"
    />
    <button
      v-if="progress > 0 && progress < 1"
      class="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
      @click="cancelUpload"
    >
      取消上传
    </button>
    <button
      v-else
      class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      @click="fileInput.click()"
    >
      选择文件
    </button>
    <span class="ml-2 text-gray-400 text-sm" v-if="fileRef">
      已选择: {{ fileRef.name }}
    </span>
    
  </div>
</template>

<script setup>
import { getUploadToken } from '@/api/public';
import { ref } from 'vue';
import OSS from 'ali-oss';

const props = defineProps({
  // 接受的文件类型
  accept: {
    type: String,
    default: '.safetensors,.pth,.bin,.pt,.ckpt,.gguf,.sft',
  },
  // 最大文件大小（单位：GB）
  maxSize: {
    type: Number,
    default: 20,
  },
  // 文件分片大小（单位：MB）
  chunkSize: {
    type: Number,
    default: 1,
  },
  // 并发上传的分片个数
  parallel: {
    type: Number,
    default: 4,
  },
});

const emit = defineEmits(['progress']);
const fileInput = ref(null);
const fileRef = ref(null);
const progress = ref(0);

const onProgress = p => {
  console.log(`${fileRef.value.name} upload progress: ${p}`);
  progress.value = p;
  emit('progress', Number((p * 100).toFixed(2)));
};

// 文件改变时的处理函数
const handleFileChange = event => {
  const file = event.target.files[0];
  if (!file) return;

  // 清空 input 值，确保能重复上传同一个文件
  event.target.value = '';
  fileRef.value = file;
};

// 上传到 OSS ，最多重试 3 次
async function doUpload(client, file, objectKey, retryLimit = 3) {
  try {
    // see https://help.aliyun.com/zh/oss/developer-reference/multipart-upload-3
    const result = await client.multipartUpload(objectKey, file, {
      progress: p => {
        onProgress(p);
      },
      parallel: props.parallel,
      partSize: props.chunkSize * 1024 * 1024, // 分片大小
    });
    return result;
  } catch (e) {
    console.error(e);
    if (e.name === 'cancel') {
      return e;
    }
    // if (e.code === 'ConnectionTimeoutError') {
    // }
    if (retryLimit <= 0) {
      throw e;
    } else {
      console.log('重试上传');
      return await doUpload(client, file, objectKey, retryLimit - 1);
    }
  }
}

let client = null;
// 开始上传
const startUpload = async () => {
  const file = fileRef.value;
  if (!file) {
    throw new Error('Please choose a file first');
  }
  // 文件大小验证
  const fileSize = file.size / 1024 / 1024 / 1024; // 转换为 GB
  if (fileSize > props.maxSize) {
    throw new Error(`File size cannot exceed ${props.maxSize}GB`);
  }
  onProgress(0);
  // 获取上传凭证
  const res = await getUploadToken(file.name);

  const {
    accessKeyId,
    accessKeySecret,
    securityToken,
    bucket,
    objectKey,
    region,
  } = res.data;

  // 初始化 OSS 客户端
  client = new OSS({
    region,
    accessKeyId,
    accessKeySecret,
    bucket,
    stsToken: securityToken,
    secure: true,
  });

  // 开始分片上传
  const result = await doUpload(client, file, objectKey);

  if (result.status === 0) {
    // 用户取消上传
    return Promise.reject('')
  } else if (result.res.status === 200) {
    return result.res;
  } else {
    throw new Error(`Upload to OSS failed: ${result.res.statusText}`);
  }
};

const cancelUpload = () => {
  onProgress(0);
  client?.cancel();
  client = null;
};

// 暴露方法给父组件
defineExpose({
  startUpload,
});
</script>
