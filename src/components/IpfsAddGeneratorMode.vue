<template>
    <div id="ipfsAddGeneratorMode" class="container" v-show="isVisible">
      <textarea
        v-model="folderInput"
        placeholder="输入ipfs files ls -l '/'获得的值..."
      ></textarea>
      <textarea
        v-model="filesInput"
        placeholder="输入ipfs files ls -l '/<folder name>'的返回..."
      ></textarea>
      <textarea
        v-model="outputAddCommands"
        placeholder="Generated IPFS Add Commands will be shown here..."
        readonly
        @click="selectAll"
      ></textarea>
      <div class="buttons">
        <button @click="generateAddCommands">Generate</button>
        <button @click="clearOutputAddCommands">Clear</button>
        <button @click="copyOutputAddCommands">Copy All</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const isVisible = ref(true); // 控制页面显示的状态
  
  const folderInput = ref('');
  const filesInput = ref('');
  const outputAddCommands = ref('');
  
  const generateAddCommands = () => {
    const folderLines = folderInput.value
      .split('\n')
      .filter(line => line.trim() !== '');
    const fileLines = filesInput.value
      .split('\n')
      .filter(line => line.trim() !== '');
  
    if (folderLines.length === 0 || fileLines.length === 0) {
      alert('Please provide both folder and file inputs.');
      return;
    }
  
    const folderParts = folderLines[0].split(/\s+/);
    let folderName = folderParts.slice(0, -2).join(' ').trim();
    const folderCid = folderParts[folderParts.length - 2].trim();
  
    // Remove trailing slash from folder name if it exists
    if (folderName.endsWith('/')) {
      folderName = folderName.slice(0, -1);
    }
  
    let output = '';
  
    fileLines.forEach(line => {
      const fileParts = line.split(/\s+/);
      const fileName = fileParts.slice(0, -2).join(' ').trim();
      const fileCid = fileParts[fileParts.length - 2].trim();
      output += `added ${fileCid} ${folderName}/${fileName}\n`;
    });
  
    output += `added ${folderCid} ${folderName}`;
  
    outputAddCommands.value = output;
  };
  
  const clearOutputAddCommands = () => {
    folderInput.value = '';
    filesInput.value = '';
    outputAddCommands.value = '';
  };
  
  const copyOutputAddCommands = () => {
    const textarea = document.createElement('textarea');
    textarea.value = outputAddCommands.value;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  };
  
  const selectAll = (event) => {
    event.target.select();
  };
  </script>