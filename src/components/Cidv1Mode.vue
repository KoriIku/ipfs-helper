<template>
  <div class="container">
    <textarea
      v-model="inputText"
      placeholder="Enter your input here..."
      class="textarea"
    ></textarea>
    <textarea
      v-model="outputText"
      placeholder="Extracted CIDs will be shown here..."
      readonly
      class="textarea"
    ></textarea>
    <div class="buttons">
      <button @click="extractCids">开始提取</button>
      <button @click="clearOutput">清空</button>
      <button @click="copyOutput">复制全部</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// Reactive variables
const inputText = ref('');
const outputText = ref('');

// Method to extract CIDs from input
function extractCids() {
  const lines = inputText.value.trim().split('\n');
  const cidRegex = /bafy[a-z0-9]+|bafk[a-z0-9]+/;
  const extractedCids = lines
    .map(line => {
      const match = line.match(cidRegex);
      return match ? match[0] : '';
    })
    .filter(cid => cid !== '')
    .join('\n');
  outputText.value = extractedCids;
}

// Method to clear the output text area
function clearOutput() {
  outputText.value = '';
}

// Method to copy output text to clipboard
function copyOutput() {
  navigator.clipboard.writeText(outputText.value.trim())
    .then(() => {
      alert('内容已复制到剪贴板');
    })
    .catch(err => {
      console.error('复制失败:', err);
    });
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 800px;
  margin: 20px auto;
}

.textarea {
  width: 100%;
  height: 150px;
  margin: 10px 0;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.buttons {
  margin-top: 20px;
}

button {
  margin: 0 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
