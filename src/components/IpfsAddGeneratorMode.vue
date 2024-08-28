<template>
    <div class="container">
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
  
  const folderInput = ref('');
  const filesInput = ref('');
  const outputAddCommands = ref('');
  
  const generateAddCommands = () => {
    const folderLines = folderInput.value.trim().split('\n');
    const filesLines = filesInput.value.trim().split('\n');
    
    let addCommands = [];
  
    filesLines.forEach(line => {
      const match = line.match(/(\S+)\s+(\S+)\s+(.*)$/);
      if (match) {
        const path = match[1];
        const name = match[3];
        addCommands.push(`ipfs add ${path} -r --cid-version=1 --name="${name}"`);
      }
    });
  
    outputAddCommands.value = addCommands.join('\n');
  };
  
  const clearOutputAddCommands = () => {
    outputAddCommands.value = '';
  };
  
  const copyOutputAddCommands = () => {
    navigator.clipboard.writeText(outputAddCommands.value)
      .then(() => {
        alert('Copied to clipboard');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  };
  
  const selectAll = (event) => {
    const textarea = event.target;
    textarea.select();
  };
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
  }
  
  textarea {
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
  