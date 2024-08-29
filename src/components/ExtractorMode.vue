<template>
  <div id="extractorMode" class="container">
    <input
      type="text"
      v-model="gatewayDomain"
      placeholder="Crust Network IPFS Gateway Domain"
      value="gateway.crustgateway.com"
    />
    <input
      type="text"
      v-model="serviceNickname"
      placeholder="Service Nickname"
      value="crust"
    />
    <div>
      <label>
        <input type="checkbox" v-model="useHttps" />
        Use HTTPS for Gateway URLs
      </label>
    </div>
    <textarea
      v-model="inputText"
      placeholder="Enter your input here..."
    ></textarea>
    <div class="buttons">
      <button @click="generateCommands">Generate</button>
      <button @click="clearOutput">Clear</button>
      <button @click="copyOutput">Copy All</button>
    </div>
    <div class="output-container">
      <textarea
        v-model="mkdirCommands"
        placeholder="mkdir commands will be shown here..."
        readonly
        @click="selectText($event)"
      ></textarea>
      <textarea
        v-model="cpCommands"
        placeholder="cp commands will be shown here..."
        readonly
        @click="selectText($event)"
      ></textarea>
    </div>
    <div class="output-container">
      <textarea
        v-model="lsCommand"
        placeholder="ls command will be shown here..."
        readonly
        @click="selectText($event)"
      ></textarea>
      <textarea
        v-model="fileCIDs"
        placeholder="File CID list will be shown here..."
        readonly
        @click="selectText($event)"
      ></textarea>
      <textarea
        v-model="folderCIDs"
        placeholder="Folder CID list will be shown here..."
        readonly
        @click="selectText($event)"
      ></textarea>
    </div>
    <textarea
      v-model="gatewayURLs"
      placeholder="Gateway URLs will be shown here..."
      readonly
      @click="selectText($event)"
    ></textarea>
    <textarea
      v-model="folderGatewayURLs"
      placeholder="Folder Gateway URLs will be shown here..."
      readonly
      @click="selectText($event)"
    ></textarea>
    <textarea
      v-model="fileBase32Commands"
      placeholder="File CID Base32 conversion commands will be shown here..."
      readonly
      @click="selectText($event)"
    ></textarea>
    <textarea
      v-model="folderBase32Commands"
      placeholder="Folder CID Base32 conversion commands will be shown here..."
      readonly
      @click="selectText($event)"
    ></textarea>
    <div class="output-container">
      <textarea
        v-model="filePinCommands"
        placeholder="File CID pin commands will be shown here..."
        readonly
        @click="selectText($event)"
      ></textarea>
      <textarea
        v-model="folderPinCommand"
        placeholder="Folder CID pin command will be shown here..."
        readonly
        @click="selectText($event)"
      ></textarea>
    </div>
    <textarea
      v-model="filePinStatusCommands"
      placeholder="File CID pin status check commands will be shown here..."
      readonly
      @click="selectText($event)"
    ></textarea>
    <textarea
      v-model="folderPinStatusCommands"
      placeholder="Folder CID pin status check commands will be shown here..."
      readonly
      @click="selectText($event)"
    ></textarea>

    <Readme/>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Readme from './Readme.vue'

const gatewayDomain = ref("gateway.crustgateway.com");
const serviceNickname = ref("crust");
const useHttps = ref(true);
const inputText = ref("");

const mkdirCommands = ref("");
const cpCommands = ref("");
const lsCommand = ref("");
const fileCIDs = ref("");
const folderCIDs = ref("");
const gatewayURLs = ref("");
const folderGatewayURLs = ref("");
const fileBase32Commands = ref("");
const folderBase32Commands = ref("");
const filePinCommands = ref("");
const folderPinCommand = ref("");
const filePinStatusCommands = ref("");
const folderPinStatusCommands = ref("");

function cleanInput(inputText) {
  return inputText
    .replace(/\u001b\[[0-9;]*[a-zA-Z]/g, "")
    .split("\n")
    .map((line) => {
      const addedIndex = line.indexOf("added");
      return addedIndex !== -1 ? line.substring(addedIndex) : "";
    })
    .filter((line) => line.trim() !== "")
    .join("\n");
}

function generateCommands() {
  const cleanedInput = cleanInput(inputText.value);
  const lines = cleanedInput.split("\n");
  const httpsProtocol = useHttps.value ? "https" : "http";

  let folderName = "";
  let mkdirCmds = [];
  let cpCmds = [];
  let lsCmd = "";
  let fileCIDsArr = [];
  let folderCIDsArr = [];
  let gatewayURLsArr = [];
  let folderGatewayURLsArr = [];
  let fileBase32Cmds = [];
  let folderBase32Cmds = [];
  let filePinCmds = [];
  let folderPinCmd = "";
  let filePinStatusCmds = [];
  let folderPinStatusCmds = [];

  lines.forEach((line) => {
    const match = line.match(/^added\s+([^\s]+)\s+([^\/]+)\/(.+)$/);
    if (match) {
      const cid = match[1];
      folderName = match[2];
      const fileName = match[3];

      if (!mkdirCmds.includes(`ipfs files mkdir "/${folderName}"`)) {
        mkdirCmds.push(`ipfs files mkdir "/${folderName}"`);
        lsCmd = `ipfs files ls -l "/${folderName}"`;
      }

      cpCmds.push(`ipfs files cp "/ipfs/${cid}" "/${folderName}/${fileName}"`);
      fileCIDsArr.push(cid);

      const encodedFileName = encodeURIComponent(fileName);
      gatewayURLsArr.push(
        `${httpsProtocol}://${gatewayDomain.value}/ipfs/${cid}?filename=${encodedFileName}`
      );
      filePinCmds.push(
        `ipfs pin remote add --service=${serviceNickname.value} --background ${cid} --name "${fileName}"`
      );
      filePinStatusCmds.push(
        `ipfs pin remote ls --service=${serviceNickname.value} --cid=${cid} --status=pinned,pinning,failed,queued`
      );

      if (cid.startsWith("Qm")) {
        fileBase32Cmds.push(`ipfs cid base32 ${cid}`);
      }
    } else {
      const folderMatch = line.match(/^added\s+([^\s]+)\s+([^\/]+)$/);
      if (folderMatch) {
        const folderCid = folderMatch[1];
        folderCIDsArr.push(folderCid);
        folderGatewayURLsArr.push(
          `${httpsProtocol}://${gatewayDomain.value}/ipfs/${folderCid}`
        );
        folderPinCmd = `ipfs pin remote add --service=${serviceNickname.value} --background ${folderCid} --name "${folderName}"`;
        folderPinStatusCmds.push(
          `ipfs pin remote ls --service=${serviceNickname.value} --cid=${folderCid} --status=pinned,pinning,failed,queued`
        );

        if (folderCid.startsWith("Qm")) {
          folderBase32Cmds.push(`ipfs cid base32 ${folderCid}`);
        }
      }
    }
  });

  mkdirCommands.value = mkdirCmds.join("\n");
  cpCommands.value = cpCmds.join("\n");
  lsCommand.value = lsCmd;
  fileCIDs.value = fileCIDsArr.join("\n");
  folderCIDs.value = folderCIDsArr.join("\n");
  gatewayURLs.value = gatewayURLsArr.join("\n");
  folderGatewayURLs.value = folderGatewayURLsArr.join("\n");
  fileBase32Commands.value =
    fileBase32Cmds.length > 0 ? fileBase32Cmds.join("\n") : "";
  folderBase32Commands.value =
    folderBase32Cmds.length > 0 ? folderBase32Cmds.join("\n") : "";
  filePinCommands.value = filePinCmds.join("\n");
  folderPinCommand.value = folderPinCmd;
  filePinStatusCommands.value = filePinStatusCmds.join("\n");
  folderPinStatusCommands.value = folderPinStatusCmds.join("\n");
}

function clearOutput() {
  mkdirCommands.value = "";
  cpCommands.value = "";
  lsCommand.value = "";
  fileCIDs.value = "";
  folderCIDs.value = "";
  gatewayURLs.value = "";
  folderGatewayURLs.value = "";
  fileBase32Commands.value = "";
  folderBase32Commands.value = "";
  filePinCommands.value = "";
  folderPinCommand.value = "";
  filePinStatusCommands.value = "";
  folderPinStatusCommands.value = "";
}

function copyOutput() {
  const allOutput = [
    mkdirCommands.value,
    cpCommands.value,
    lsCommand.value,
    fileCIDs.value,
    folderCIDs.value,
    gatewayURLs.value,
    folderGatewayURLs.value,
    fileBase32Commands.value,
    folderBase32Commands.value,
    filePinCommands.value,
    folderPinCommand.value,
    filePinStatusCommands.value,
    folderPinStatusCommands.value,
  ].join("\n\n");

  navigator.clipboard.writeText(allOutput).then(() => {
    alert("All output copied to clipboard!");
  });
}

function selectText(event) {
  const textarea = event.target;
  textarea.select();
}
</script>
