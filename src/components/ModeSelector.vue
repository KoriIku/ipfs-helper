<template>
  <select @change="onModeChange">
    <option value="extractor">IPFS Command 提取器</option>
    <option value="cidv1">IPFS Command CID-v1 提取器</option>
    <option value="pinRetry">IPFS Remote Pin 重试器</option>
    <option value="ipfsAddGenerator">IPFS Add 生成器</option>
  </select>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  emits: ["mode-change"],
  setup(props, { emit }) {
    function onModeChange(event) {
      emit("mode-change", event.target.value);
    }

    return { onModeChange };
  },
});
</script>
