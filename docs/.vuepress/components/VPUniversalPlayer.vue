<template>
  <!-- video.js 的 DOM 容器 -->
  <video
    ref="videoPlayer"
    class="video-js vjs-default-skin"
    controls
    preload="auto"
    playsinline
  >
  </video>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import videojs from 'video.js'
// video.js 默认样式
import 'video.js/dist/video-js.css'

// ------------------------------
// 1) 如果你用的是 video.js 7+，它内置了 VHS，可直接支持 HLS (m3u8)、DASH (mpd) 等
//    不一定需要手动 import "videojs-http-streaming"
// ------------------------------

// 2) FLV 播放插件
import 'videojs-flvjs'
import flvjs from 'flv.js'

// 3) 若需要 DASH 播放
// import 'videojs-contrib-dash'
// import dashjs from 'dashjs'

// （可选）如果要单独使用 videojs-contrib-hls.js（旧方式），再另行 import
// import 'videojs-contrib-hls.js'

export default defineComponent({
  name: 'UniversalPlayer',
  props: {
    src: {
      type: String,
      required: true
    }
    // 你也可以加更多属性，比如 autoplay, poster, loop 等
  },
  setup(props) {
    const videoPlayer = ref<HTMLVideoElement | null>(null)
    let player: videojs.Player | null = null

    onMounted(() => {
      // 初始化播放器
      player = videojs(videoPlayer.value, {
        // 常见 Video.js 配置项，比如
        autoplay: false,
        fluid: true  // 自适应
      })

      // 赋值初始播放源
      player.src({ src: props.src })

      // 如果你想针对 flvjs 进行特殊处理：
      // Video.js 会自动根据插件去匹配 .flv 文件，但有时需要你手动设置 type:
      // if (props.src.endsWith('.flv')) {
      //   player.src({ src: props.src, type: 'video/flv' })
      // } else {
      //   player.src({ src: props.src })
      // }
    })

    // 当 src 改变时，更新播放源
    watch(
      () => props.src,
      (newVal) => {
        if (player) {
          player.src({ src: newVal })
          player.load()
          // player.play() // 如果想自动播放可自行调用
        }
      }
    )

    // 卸载组件时，销毁播放器实例
    onBeforeUnmount(() => {
      if (player) {
        player.dispose()
      }
    })

    return {
      videoPlayer
    }
  }
})
</script>

<style scoped>
.video-js {
  width: 100%;
  max-width: 600px; /*示例：让播放器最大600px宽*/
}
</style>
