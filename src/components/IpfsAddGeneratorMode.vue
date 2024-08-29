<template>
  <div id="ipfsAddGeneratorMode" class="container">
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
import { ref } from "vue";
import { generateAddCommandsLogic } from "../utils/generateAddCommands";



const folderInput = ref("");
const filesInput = ref("");
const outputAddCommands = ref("");

const generateAddCommands = () => {
  const result = generateAddCommandsLogic(folderInput.value, filesInput.value);

  if (!result.success) {
    alert(result.message);
    return;
  }

  outputAddCommands.value = result.output;
};

const clearOutputAddCommands = () => {
  folderInput.value = "";
  filesInput.value = "";
  outputAddCommands.value = "";
};

const copyOutputAddCommands = async () => {
  try {
    await navigator.clipboard.writeText(outputAddCommands.value);
    ElMessage({
      message: "复制成功",
      type: "success",
    });
    console.log("Text copied to clipboard");
  } catch (err) {
    ElMessage.error('复制失败')
    console.error("Failed to copy text: ", err);
  }
};

const selectAll = (event) => {
  event.target.select();
};
</script>
