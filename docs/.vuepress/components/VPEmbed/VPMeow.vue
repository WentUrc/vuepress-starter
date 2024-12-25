<!-- src/components/EmbedIframe.vue -->
<template>
    <iframe
      :srcdoc="htmlContent"
      :width="width"
      :height="iframeHeight"
      frameborder="0"
      sandbox="allow-scripts allow-same-origin"
      class="embed-iframe"
      @load="onLoad"
    ></iframe>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  
  export default defineComponent({
    name: 'EmbedIframe',
    props: {
      htmlContent: {
        type: String as PropType<string>,
        required: true,
      },
      width: {
        type: String,
        default: '100%',
      },
      height: {
        type: String,
        default: '500px',
      },
    },
    setup(props) {
      const iframeHeight = ref(props.height);
  
      const onLoad = () => {
        const iframe = document.querySelector('.embed-iframe') as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          try {
            const doc = iframe.contentWindow.document;
            const height = doc.body.scrollHeight;
            iframeHeight.value = `${height}px`;
          } catch (error) {
            console.error('无法访问 iframe 内容:', error);
          }
        }
      };
  
      return {
        iframeHeight,
        onLoad,
      };
    },
  });
  </script>
  
  <style scoped>
    .embed-iframe {
    width: 100%;
    max-width: 100%;
    border: none;
    transition: height 0.3s ease;
    }
  </style>
  