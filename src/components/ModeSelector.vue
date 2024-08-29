<template>
  <el-radio-group v-model="selectedMode" size="large" fill="#409EFF" text-color="#ffffff">
    <el-radio-button value="extractor">IPFS Command added提取器</el-radio-button>
    <el-radio-button value="cidv1">IPFS Command CID-v1 提取器</el-radio-button>
    <el-radio-button value="pinRetry">IPFS Remote Pin 重试器</el-radio-button>
    <el-radio-button value="ipfsAddGenerator">IPFS Add 生成器</el-radio-button>
  </el-radio-group>
</template>

<script setup>
import { ref, watch, defineEmits } from 'vue';

const selectedMode = ref('extractor');
const emit = defineEmits(['mode-change']);

// 监听选中的值变化并发出事件
watch(selectedMode, (newValue) => {
  emit('mode-change', newValue);
});
</script>
