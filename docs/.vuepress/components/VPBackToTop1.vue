<template>
    <div
      class="back-to-top"
      :class="{
        load: isShow,
        'ani-leave': isLeaving,
        leaved: isLeaved,
        ending: isEnding
      }"
      @click="handleClick"
      aria-label="返回顶部"
      title="返回顶部"
    ></div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, onBeforeUnmount } from 'vue';
  
  const isShow = ref(false);
  const isLeaving = ref(false);
  const isLeaved = ref(false);
  const isEnding = ref(false);
  const lock = ref(false);
  
  // 滚动事件处理函数
  const handleScroll = () => {
    if (lock.value) return;
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (scrollTop >= 200) {
      if (!isShow.value && !isLeaving.value) {
        isShow.value = true;
        isLeaved.value = false; // 确保 leaved 被重置
      }
    } else {
      if (isShow.value) {
        isShow.value = false;
      }
    }
  };
  
  // 点击事件处理函数
  const handleClick = () => {
    if (lock.value) return;
    lock.value = true;
    isLeaving.value = true; // 添加 'ani-leave' 类
    window.scrollTo({ top: 0, behavior: 'smooth' });
  
    // 120ms 后添加 'ending' 类
    setTimeout(() => {
      isEnding.value = true;
    }, 120);
  
    // 390ms 后移除 'ani-leave' 类并添加 'leaved' 类
    setTimeout(() => {
      isLeaving.value = false;
      isLeaved.value = true;
    }, 390);
  
    // 1500ms 后移除 'load' 类
    setTimeout(() => {
      isShow.value = false;
    }, 1500);
  
    // 2000ms 后重置所有状态
    setTimeout(() => {
      isLeaving.value = false;
      isEnding.value = false;
      isShow.value = false;
      isLeaved.value = false;
      lock.value = false;
    }, 2000);
  };
  
  // 添加和移除滚动事件监听器
  onMounted(() => {
    window.addEventListener('scroll', handleScroll);
    // 初始化按钮的显示状态
    handleScroll();
  });
  
  onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll);
  });
  </script>
  
  <style scoped>
  .back-to-top {
    position: fixed;
    z-index: 99999;
    right: -108px; /* 初始位置 */
    bottom: 0;
    width: 108px;
    height: 150px;
    background: url("https://count.getloli.com/img/back-to-top.png?v=1") no-repeat 0 0;
    background-size: 108px 450px;
    opacity: 0.6;
    transition: opacity 0.3s, right 0.8s;
    cursor: pointer;
  }
  
  .back-to-top:hover {
    background-position: 0 -150px;
    opacity: 1;
  }
  
  .back-to-top::after {
    content: "";
    position: fixed;
    z-index: 2;
    right: 0;
    bottom: 0;
    width: 108px;
    height: 150px;
    background: url("https://count.getloli.com/img/back-to-top.png?v=1") no-repeat 0 0;
    background-size: 108px 450px;
    background-position: 0 -300px;
    transition: opacity 0.3s;
    opacity: 0;
    pointer-events: none;
  }
  
  .back-to-top.load {
    right: 0;
  }
  
  .back-to-top.ani-leave {
    background-position: 0 -150px;
    animation: ani-leave 800ms ease-in-out forwards;
  }
  
  @keyframes ani-leave {
    0% {
      right: 0;
    }
    100% {
      right: -108px;
    }
  }
  
  .back-to-top.leaved,
  .back-to-top.ending {
    pointer-events: none;
  }
  
  .back-to-top.leaved {
    background: none;
    transition: none;
  }
  
  .back-to-top.ending::after {
    opacity: 1;
    transition-delay: 0.35s;
  }
  </style>
  