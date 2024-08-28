<template>
    <div v-if="visible" class="container">
      <input
        v-model="serviceNickname"
        type="text"
        placeholder="Service Nickname"
      />
      <textarea
        v-model="inputAdded"
        placeholder="Enter your added input here..."
      ></textarea>
      <textarea
        v-model="inputCid"
        placeholder="Enter your CID list here (one per line)..."
      ></textarea>
      <div class="output-container">
        <textarea
          v-model="outputFilePin"
          placeholder="ipfs remote pin add commands for files will be shown here..."
          readonly
          @click="selectText($event)"
        ></textarea>
        <textarea
          v-model="outputFolderPin"
          placeholder="ipfs remote pin add commands for folders will be shown here..."
          readonly
          @click="selectText($event)"
        ></textarea>
      </div>
      <div class="output-container">
        <textarea
          v-model="outputFileStatusQuery"
          placeholder="File CID status query commands will be shown here..."
          readonly
          @click="selectText($event)"
        ></textarea>
        <textarea
          v-model="outputFolderStatusQuery"
          placeholder="Folder CID status query commands will be shown here..."
          readonly
          @click="selectText($event)"
        ></textarea>
      </div>
      <div class="buttons">
        <button @click="generatePinRetry">Generate</button>
        <button @click="clearOutput">Clear</button>
        <button @click="copyOutput">Copy All</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const visible = ref(true);
  const serviceNickname = ref('crust');
  const inputAdded = ref('');
  const inputCid = ref('');
  
  const outputFilePin = ref('');
  const outputFolderPin = ref('');
  const outputFileStatusQuery = ref('');
  const outputFolderStatusQuery = ref('');
  
  function generatePinRetry() {
    const addedLines = inputAdded.value.trim().split('\n');
    const cidLines = inputCid.value.trim().split('\n');
  
    const addedCids = new Set();
    const cidSet = new Set();
    const fileCidNameMap = {};
    const folderCidNameMap = {};
  
    addedLines.forEach((line) => {
      const match = line.match(/^added\s+([^\s]+)\s+(.+)$/);
      if (match) {
        const cid = match[1];
        const name = match[2];
        addedCids.add(cid);
        if (name.includes('/')) {
          const parts = name.split('/');
          const folderName = parts[0];
          const fileName = parts.slice(1).join('/');
          fileCidNameMap[cid] = fileName;
        } else {
          folderCidNameMap[cid] = name;
        }
      }
    });
  
    cidLines.forEach((line) => {
      const trimmedCid = line.trim();
      if (trimmedCid) {
        cidSet.add(trimmedCid);
      }
    });
  
    const filePinCommands = [];
    const folderPinCommands = [];
    const fileStatusQueries = [];
    const folderStatusQueries = [];
  
    addedCids.forEach((cid) => {
      if (cidSet.has(cid)) {
        if (fileCidNameMap[cid]) {
          filePinCommands.push(
            `ipfs pin remote add --service=${serviceNickname.value} --background ${cid} --name "${fileCidNameMap[cid]}"`
          );
          fileStatusQueries.push(
            `ipfs pin remote ls --service=${serviceNickname.value} --cid=${cid} --status=pinned,pinning,failed,queued`
          );
        } else if (folderCidNameMap[cid]) {
          folderPinCommands.push(
            `ipfs pin remote add --service=${serviceNickname.value} --background ${cid} --name "${folderCidNameMap[cid]}"`
          );
          folderStatusQueries.push(
            `ipfs pin remote ls --service=${serviceNickname.value} --cid=${cid} --status=pinned,pinning,failed,queued`
          );
        }
      }
    });
  
    outputFilePin.value = filePinCommands.join('\n');
    outputFolderPin.value = folderPinCommands.join('\n');
    outputFileStatusQuery.value = fileStatusQueries.join('\n');
    outputFolderStatusQuery.value = folderStatusQueries.join('\n');
  }
  
  function clearOutput() {
    outputFilePin.value = '';
    outputFolderPin.value = '';
    outputFileStatusQuery.value = '';
    outputFolderStatusQuery.value = '';
  }
  
  function copyOutput() {
    const allOutput = [
      outputFilePin.value,
      outputFolderPin.value,
      outputFileStatusQuery.value,
      outputFolderStatusQuery.value,
    ]
      .filter((value) => value)
      .join('\n');
    navigator.clipboard.writeText(allOutput.trim());
  }
  
  function selectText(event) {
    event.target.select();
  }
  </script>
  
  <style scoped>

  </style>
  