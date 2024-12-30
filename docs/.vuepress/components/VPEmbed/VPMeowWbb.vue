<template>
    <div class="iframe-wrapper">
      <iframe
        :src="src"
        allowfullscreen
        class="embed-iframe"
      />
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType } from 'vue';
  
  export default defineComponent({
    name: 'VPEmbedHTML3', // 组件名随意
    props: {
      src: {
        type: String as PropType<string>,
        required: true,
      },
      width: {
        type: String,
        default: '100%',
      },
      /* 
        这里你也可以加一个 height，如果想固定高度
        height: {
          type: String,
          default: '500px'
        }
      */
    },
  });
  </script>
  
  <style scoped>
  .iframe-wrapper {
    width: 100%;
    max-width: 600px;            /* 示例：限制最大宽度 */
    border: 2px solid var(--vp-c-brand-3); 
    border-radius: 15px;
    overflow: hidden;
    margin-bottom: 20px;         /* 让组件之间留一点距离 */
  }
  
  .embed-iframe {
    width: 100%;
    height: 360px;               /* 这里写死一个高度(示例) */
    border: none;
  }
  </style>
  