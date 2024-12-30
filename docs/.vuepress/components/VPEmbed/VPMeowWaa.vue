<template>
    <!-- 外层容器，用于边框、圆角、裁切iframe -->
    <div class="iframe-wrapper" :style="{ height: iframeHeight }">
      <iframe
        :srcdoc="htmlContent"
        :width="width"
        frameborder="0"
        sandbox="allow-scripts allow-same-origin"
        class="embed-iframe"
        @load="onLoad"
      ></iframe>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, PropType, ref } from 'vue';
  
  export default defineComponent({
    name: 'VPMeowWaa', // 组件名随意，只要跟你项目一致即可
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
        if (iframe?.contentWindow) {
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
  /* 外层容器负责边框 & 圆角 & 裁切 */
  .iframe-wrapper {
    border: 2px solid var(--vp-c-brand-3);  /* 这里设置边框，按需可替换颜色 */
    border-radius: 15px;                   /* 这里设置圆角 */
    overflow: hidden;                      /* 让子元素溢出部分隐藏，实现裁切圆角效果 */
    width: 100%;                           /* 容器宽度保持 100% */
    transition: height 0.3s ease;         /* 在撑高时有个平滑过渡 */
  }
  
  /* 真正的 iframe */
  .embed-iframe {
    border: none;            /* 去掉 iframe 自带的边框 */
    width: 100%;
    height: 100%;            /* iframe 自身跟随外层容器的高度即可 */
    display: block;
  }
  </style>
  