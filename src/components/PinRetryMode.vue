<template>
    <div class="container">
      <textarea
        v-model="inputCids"
        placeholder="Enter CIDs here, one per line..."
        class="textarea"
      ></textarea>
      <textarea
        v-model="outputCommands"
        placeholder="Generated commands will appear here..."
        readonly
        class="textarea"
      ></textarea>
      <div class="buttons">
        <button @click="generateCommands">生成命令</button>
        <button @click="clearOutput">清空</button>
        <button @click="copyOutput">复制全部</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  // Reactive variables
  const inputCids = ref('');
  const outputCommands = ref('');
  
  // Method to generate pin retry commands from input CIDs
  function generateCommands() {
    const cids = inputCids.value.trim().split('\n');
    const commands = cids
      .map(cid => `ipfs pin retry ${cid}`)
      .join('\n');
    outputCommands.value = commands;
  }
  
  // Method to clear the output text area
  function clearOutput() {
    outputCommands.value = '';
  }
  
  // Method to copy output text to clipboard
  function copyOutput() {
    navigator.clipboard.writeText(outputCommands.value.trim())
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
  