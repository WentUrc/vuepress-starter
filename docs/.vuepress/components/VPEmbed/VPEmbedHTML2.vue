<template>
    <div class="abdsos">
        <iframe
            src="/HTML/Untitled-1.html"
            width="100%"
            height="600px"
            frameborder="0"
            style="border: none;"
            sandbox="allow-scripts allow-same-origin"
            class="abdsos"
        ></iframe>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import EmbedHtml from './VPMeow.vue';
  
  export default defineComponent({
    name: 'App',
    components: {
      EmbedHtml,
    },
    data() {
      return {
        embeddedHtml: `

        `,
      };
    },
  });
  </script>
  
  <style>
  /* 父组件的样式 */
  .abdsos {
    display: flex;
    flex-direction: column;
    margin-top: 30px;
    padding: 20px;
    width: 100%;
    min-width: 100%;
    min-height: 600px;
    height: auto;
    font-family: Arial, sans-serif;
    border: 2px solid var(--vp-c-brand-3);
    border-radius: 15px;
  }
  </style>
  