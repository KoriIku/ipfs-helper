<template>
  <div class="readme">
    <h2>README</h2>
    <p><mark>Version: 2024-08-12</mark></p>
    <p>The terminal command should be:</p>
    <pre><code>ipfs add -r -n --cid-version=1 &lt;folder path&gt;</code></pre>
    <p>
      If you have enough disk space, for better experience, you can actually add
      the folder to the IPFS network:
    </p>
    <pre><code>ipfs add -r --cid-version=1 &lt;folder path&gt;</code></pre>
    <p>This tool accepts input in the following format:</p>
    <pre><code>added &lt;cid1&gt; &lt;folder name&gt;/&lt;file name1&gt;
  added &lt;cid2&gt; &lt;folder name&gt;/&lt;file name2&gt;
  ...
  added &lt;folder cid&gt; &lt;folder name&gt;</code></pre>
  </div>
</template>


<style>
.readme {
  margin-top: 40px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  width: 100%;
  max-width: 800px;
  background-color: #f9f9f9;
  box-sizing: border-box;
}
.readme h2 {
  margin-top: 0;
}
</style>
