<template>
  <div id="app">
    <div class="centered-container">
      <h1>IPFS Command Generator</h1>
      <ModeSelector @mode-change="handleModeChange" />
    </div>
    <ExtractorMode v-if="currentMode.value === 'extractor'" />
    <Cidv1Mode v-if="currentMode.value === 'cidv1'" />
    <PinRetryMode v-if="currentMode.value === 'pinRetry'" />
    <IpfsAddGeneratorMode v-if="currentMode.value === 'ipfsAddGenerator'" />
    <Readme />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ModeSelector from './components/ModeSelector.vue'
import ExtractorMode from './components/ExtractorMode.vue'
import Cidv1Mode from './components/Cidv1Mode.vue'
import PinRetryMode from './components/PinRetryMode.vue'
import IpfsAddGeneratorMode from './components/IpfsAddGeneratorMode.vue'
import Readme from './components/Readme.vue'

const currentMode = ref('extractor')

function handleModeChange(mode) {
  currentMode.value = mode
}
</script>

<style scoped>


.centered-container {
  display: inline-block; /* Adjust container to fit content and center it */
  text-align: center; /* Center text and inline elements horizontally within container */
  margin: 0 auto; /* Center the container itself horizontally */
}
</style>
