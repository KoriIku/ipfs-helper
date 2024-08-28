<template>
  <div id="app">
    <div class="centered-container">
      <h1>IPFS Command Generator</h1>
      <ModeSelector @mode-change="handleModeChange" />
    </div>
    <ExtractorMode v-if="currentMode === 'extractor'" />
    <Cidv1Mode v-if="currentMode === 'cidv1'" />
    <PinRetryMode v-if="currentMode === 'pinRetry'" />
    <IpfsAddGeneratorMode v-if="currentMode === 'ipfsAddGenerator'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModeSelector from './components/ModeSelector.vue'
import ExtractorMode from './components/ExtractorMode.vue'
import Cidv1Mode from './components/Cidv1Mode.vue'
import PinRetryMode from './components/PinRetryMode.vue'
import IpfsAddGeneratorMode from './components/IpfsAddGeneratorMode.vue'


const currentMode = ref('extractor')

function handleModeChange(mode) {
  currentMode.value = mode
}
</script>

<style scoped>
#app {
  display: flex;
  flex-direction: column;
  align-items: center; /* 水平居中对齐子项 */
  justify-content: center; /* 垂直居中对齐子项 */
  margin: 0; /* 清除默认边距 */
  font-family: Arial, sans-serif; /* 设置字体 */
}

.centered-container {
  text-align: center; /* 中心对齐文本 */
  margin-bottom: 20px; /* 给内容下方添加间距 */
}
</style>
