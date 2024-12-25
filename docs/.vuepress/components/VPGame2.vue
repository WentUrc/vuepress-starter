<template>
  <div class="music-game">
    <div class="header">
      <h1>🎵 喵喵播放音频 🎵</h1>
    </div>
    <div class="button-container">
      <button
        v-for="(sound, index) in sounds"
        :key="index"
        :class="['music-button', `btn-${index}`]"
        @click="playSound(index)"
        :aria-label="'播放第' + (index + 1) + '段音频'"
      >
        喵喵{{ index + 1 }}
      </button>
    </div>
    <div class="snow">
      <div
        class="snowflake"
        v-for="n in 20"
        :key="'snowflake-' + n"
        :style="getSnowflakeStyle()"
      ></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import sound1 from '/sounds/sound1.wav';
import sound2 from '/sounds/sound2.wav';
import sound3 from '/sounds/sound3.wav';
import sound4 from '/sounds/sound4.wav';

export default defineComponent({
  data() {
    return {
      sounds: [sound1, sound2, sound3, sound4],
      showCatAnimation: false,
    };
  },
  methods: {
    playSound(index: number) {
      if (index < 0 || index >= this.sounds.length) {
        console.error('无效的音频索引喵！');
        return;
      }
      if (this.showCatAnimation) return;
      const audio = new Audio(this.sounds[index]);
      audio.play();
      this.triggerCatAnimation();
    },
    getSnowflakeStyle() {
      const left = Math.random() * 100; // 随机左侧位置百分比
      const delay = Math.random() * 5; // 随机动画延迟（秒）
      const size = Math.random() * 3; // 随机雪花大小（像素）
      const duration = 3 + Math.random() * 5; // 随机动画持续时间（秒）
      return {
        left: `${left}%`,
        top: `-${10 + Math.random() * 10}px`, // 雪花初始位置稍微在容器上方
        animationDelay: `${delay}s`,
        width: `${5 + size}px`,
        height: `${5 + size}px`,
        animationDuration: `${duration}s`,
      };
    },
  },
});
</script>

<style scoped>
.music-game {
  text-align: center;
  padding: 20px;
  font-family: 'Comic Sans MS', cursive;
  color: rgb(255, 42, 42);
  border: 2px solid #ff178b;
  border-radius: 15px;
  overflow: hidden;
  max-height: 500px;
  position: relative; /* 确保 .snow 的绝对定位相对于 .music-game */
}

.header h1 {
  font-size: 2.5rem;
  color: var(--vp-c-text-1);
  margin-bottom: 20px;
}

.button-container {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.music-button {
  padding: 15px 30px;
  font-size: 1.5rem;
  border: 2px solid #ff178b;
  border-radius: 20px;
  margin: 0 5px;
  cursor: pointer;
  box-shadow: 0 5px 7px rgba(41, 41, 41, 0.071);
  transition: transform 0.2s, background-color 0.3s;
}

.music-button:hover {
  transform: scale(1.1);
  background-color: #ffcae1;
}

.music-button:active {
  transform: scale(0.95);
  background-color: #ffdff1;
  box-shadow: 0 10px 12px rgba(0, 0, 0, 0.921);
}

/* 雪花效果 */
.snow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: hidden;
  z-index: 1;
}

.snowflake {
  position: absolute;
  /* top: -10px;  handled by inline style */
  width: 5px;
  height: 5px;
  background: #fff;
  border-radius: 50%;
  opacity: 0.8;
  animation: snowfall linear infinite;
}

@keyframes snowfall {
  0% {
    top: 0;
    opacity: 1;
  }
  100% {
    top: 100%; /* 下落到容器底部 */
    opacity: 0;
  }
}

@media (max-width: 480px) {
  .header h1 {
    font-size: 1.7rem;
    color: rgba(0, 0, 0, 0.797);
    margin-bottom: 20px;
  }
  .music-button {
    font-size: 1.2rem;
    padding: 10px 20px;
  }
  .snowflake {
    width: 3px;
    height: 3px;
  }
}
</style>
