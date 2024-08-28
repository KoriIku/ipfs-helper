<template>
    <div class="container">
      <input
        v-model="gatewayDomain"
        type="text"
        placeholder="Crust Network IPFS Gateway Domain"
      />
      <input
        v-model="serviceNickname"
        type="text"
        placeholder="Service Nickname"
      />
      <textarea
        v-model="inputText"
        placeholder="Enter your input here..."
      ></textarea>
      <div class="output-container">
        <textarea
          v-model="outputBox1"
          placeholder="mkdir commands will be shown here..."
          readonly
          @click="selectAll('outputBox1')"
        ></textarea>
        <textarea
          v-model="outputBox2"
          placeholder="cp commands will be shown here..."
          readonly
          @click="selectAll('outputBox2')"
        ></textarea>
      </div>
      <div class="output-container">
        <textarea
          v-model="outputBox3"
          placeholder="ls command will be shown here..."
          readonly
          @click="selectAll('outputBox3')"
        ></textarea>
        <textarea
          v-model="outputBox4"
          placeholder="File CID list will be shown here..."
          readonly
          @click="selectAll('outputBox4')"
        ></textarea>
        <textarea
          v-model="outputBox5"
          placeholder="Folder CID list will be shown here..."
          readonly
          @click="selectAll('outputBox5')"
        ></textarea>
      </div>
      <textarea
        v-model="outputBox6"
        placeholder="Gateway URLs will be shown here..."
        readonly
        @click="selectAll('outputBox6')"
      ></textarea>
      <textarea
        v-model="outputBox7"
        placeholder="Folder Gateway URLs will be shown here..."
        readonly
        @click="selectAll('outputBox7')"
      ></textarea>
      <textarea
        v-model="outputBox8"
        placeholder="File CID Base32 conversion commands will be shown here..."
        readonly
        @click="selectAll('outputBox8')"
      ></textarea>
      <textarea
        v-model="outputBox9"
        placeholder="Folder CID Base32 conversion commands will be shown here..."
        readonly
        @click="selectAll('outputBox9')"
      ></textarea>
      <div class="output-container">
        <textarea
          v-model="outputBox10"
          placeholder="File CID pin commands will be shown here..."
          readonly
          @click="selectAll('outputBox10')"
        ></textarea>
        <textarea
          v-model="outputBox11"
          placeholder="Folder CID pin command will be shown here..."
          readonly
          @click="selectAll('outputBox11')"
        ></textarea>
      </div>
      <textarea
        v-model="outputBox12"
        placeholder="File CID pin status check commands will be shown here..."
        readonly
        @click="selectAll('outputBox12')"
      ></textarea>
      <textarea
        v-model="outputBox13"
        placeholder="Folder CID pin status check commands will be shown here..."
        readonly
        @click="selectAll('outputBox13')"
      ></textarea>
      <div class="buttons">
        <button @click="generateCommands">Generate</button>
        <button @click="clearOutput">Clear</button>
        <button @click="copyOutput">Copy All</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const gatewayDomain = ref('gateway.crustgateway.online');
  const serviceNickname = ref('crust');
  const inputText = ref('');
  
  const outputBox1 = ref('');
  const outputBox2 = ref('');
  const outputBox3 = ref('');
  const outputBox4 = ref('');
  const outputBox5 = ref('');
  const outputBox6 = ref('');
  const outputBox7 = ref('');
  const outputBox8 = ref('');
  const outputBox9 = ref('');
  const outputBox10 = ref('');
  const outputBox11 = ref('');
  const outputBox12 = ref('');
  const outputBox13 = ref('');
  
  function selectAll(id) {
    const element = document.getElementById(id);
    if (element) {
      element.select();
    }
  }
  
  function cleanInput(inputText) {
    return inputText.replace(/\u001b\[[0-9;]*[a-zA-Z]/g, '')
      .split('\n')
      .map(line => {
        const addedIndex = line.indexOf('added');
        return addedIndex !== -1 ? line.substring(addedIndex) : '';
      })
      .filter(line => line.trim() !== '')
      .join('\n');
  }
  
  function generateCommands() {
    const cleanedInput = cleanInput(inputText.value);
    const lines = cleanedInput.split('\n');
  
    let folderName = '';
    let mkdirCommands = [];
    let cpCommands = [];
    let lsCommand = '';
    let fileCIDs = [];
    let folderCIDs = [];
    let gatewayURLs = [];
    let folderGatewayURLs = [];
    let fileBase32Commands = [];
    let folderBase32Commands = [];
    let filePinCommands = [];
    let folderPinCommand = '';
    let filePinStatusCommands = [];
    let folderPinStatusCommands = [];
  
    lines.forEach(line => {
      const match = line.match(/^added\s+([^\s]+)\s+([^\/]+)\/(.+)$/);
      if (match) {
        const cid = match[1];
        folderName = match[2];
        const fileName = match[3];
  
        if (!mkdirCommands.includes(`ipfs files mkdir "/${folderName}"`)) {
          mkdirCommands.push(`ipfs files mkdir "/${folderName}"`);
          lsCommand = `ipfs files ls -l "/${folderName}"`;
        }
  
        cpCommands.push(`ipfs files cp "/ipfs/${cid}" "/${folderName}/${fileName}"`);
        fileCIDs.push(cid);
  
        const encodedFileName = encodeURIComponent(fileName);
        gatewayURLs.push(`https://${gatewayDomain.value}/ipfs/${cid}?filename=${encodedFileName}`);
        filePinCommands.push(`ipfs pin remote add --service=${serviceNickname.value} --background ${cid} --name "${fileName}"`);
        filePinStatusCommands.push(`ipfs pin remote ls --service=${serviceNickname.value} --cid=${cid} --status=pinned,pinning,failed,queued`);
  
        if (cid.startsWith('Qm')) {
          fileBase32Commands.push(`ipfs cid base32 ${cid}`);
        }
      } else {
        const folderMatch = line.match(/^added\s+([^\s]+)\s+([^\/]+)$/);
        if (folderMatch) {
          const folderCid = folderMatch[1];
          folderCIDs.push(folderCid);
          folderGatewayURLs.push(`https://${gatewayDomain.value}/ipfs/${folderCid}`);
          folderPinCommand = `ipfs pin remote add --service=${serviceNickname.value} --background ${folderCid} --name "${folderName}"`;
          folderPinStatusCommands.push(`ipfs pin remote ls --service=${serviceNickname.value} --cid=${folderCid} --status=pinned,pinning,failed,queued`);
  
          if (folderCid.startsWith('Qm')) {
            folderBase32Commands.push(`ipfs cid base32 ${folderCid}`);
          }
        }
      }
    });
  
    outputBox1.value = mkdirCommands.join('\n');
    outputBox2.value = cpCommands.join('\n');
    outputBox3.value = lsCommand;
    outputBox4.value = fileCIDs.join('\n');
    outputBox5.value = folderCIDs.join('\n');
    outputBox6.value = gatewayURLs.join('\n');
    outputBox7.value = folderGatewayURLs.join('\n');
    outputBox8.value = fileBase32Commands.length > 0 ? fileBase32Commands.join('\n') : '';
    outputBox9.value = folderBase32Commands.length > 0 ? folderBase32Commands.join('\n') : '';
    outputBox10.value = filePinCommands.join('\n');
    outputBox11.value = folderPinCommand;
    outputBox12.value = filePinStatusCommands.join('\n');
    outputBox13.value = folderPinStatusCommands.join('\n');
  }
  
  function clearOutput() {
    outputBox1.value = '';
    outputBox2.value = '';
    outputBox3.value = '';
    outputBox4.value = '';
    outputBox5.value = '';
    outputBox6.value = '';
    outputBox7.value = '';
    outputBox8.value = '';
    outputBox9.value = '';
    outputBox10.value = '';
    outputBox11.value = '';
    outputBox12.value = '';
    outputBox13.value = '';
  }
  
  function copyOutput() {
    const textToCopy = [
      outputBox1.value,
      outputBox2.value,
      outputBox3.value,
      outputBox4.value,
      outputBox5.value,
      outputBox6.value,
      outputBox7.value,
      outputBox8.value,
      outputBox9.value,
      outputBox10.value,
      outputBox11.value,
      outputBox12.value,
      outputBox13.value,
    ].join('\n\n');
  
    navigator.clipboard.writeText(textToCopy).then(() => {
      alert('Copied to clipboard!');
    });
  }
  </script>
  
  <style scoped>
  .container {
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 800px;
    margin: auto;
  }
  
  input[type="text"] {
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  textarea {
    width: 100%;
    height: 150px;
    margin: 10px 0;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    resize: vertical;
    cursor: pointer;
  }
  
  .output-container {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
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
  
  .readme {
    margin-top: 40px;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
  }
  
  .readme h2 {
    margin-top: 0;
  }
  </style>
  