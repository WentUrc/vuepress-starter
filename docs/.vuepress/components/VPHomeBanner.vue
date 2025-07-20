<script setup lang="ts">
import type { ThemeHomeBanner } from 'vuepress-theme-plume/lib/shared' // 引入类型定义，用于约束组件的 props 类型
import VPButton from '@theme/VPButton.vue' // 引入主题按钮组件
import { computed, ref, watch, } from 'vue' // 引入 Vue 的核心函数
import { withBase } from 'vuepress/client' // 用于解析本地相对路径为完整路径
import { isLinkHttp } from 'vuepress/shared' // 判断链接是否是 HTTP 链接
import { useData } from 'vuepress-theme-plume/composables' // 获取页面数据
import { usePageData } from '@vuepress/client'

// 定义组件接收的 props 类型
const props = defineProps<ThemeHomeBanner>()

// 默认的 banner 地址
const DEFAULT_BANNER = 'https://api.pengzhanbo.cn/wallpaper/bing'

// 从页面数据中获取 isDark 和 frontmatter（自定义字段）
const { isDark, frontmatter: matter } = useData<'home'>()

// 获取当前路由信息
const pageData = usePageData()

// 用于控制背景图片是否加载完成的状态
const loaded = ref(false)

// 计算当前的 banner 链接，优先使用 props，其次使用 frontmatter，最后使用默认链接
const bannerLink = computed(() => {
  const banner = props.banner ?? matter.value.banner
  return banner ? (isLinkHttp(banner) ? banner : withBase(banner)) : DEFAULT_BANNER
})

// 计算遮罩层的不透明度，根据页面模式（暗/亮）和配置进行调整
const maskOpacity = computed(() => {
  const mask = props.bannerMask ?? matter.value.bannerMask
  if (typeof mask !== 'object') return mask || 0
  return isDark.value ? mask.dark || 0 : mask.light || 0
})

// 计算背景样式，包括背景图片、透明度以及过渡效果
const bannerStyle = computed(() => ({
  'background-image': `url(${bannerLink.value})`,
  opacity: loaded.value ? 1 : 0,
  transition: loaded.value ? 'opacity 0.7s ease-in-out' : 'none', // 显示时平滑过渡
}));

// 预加载图片的函数，用于加载图片并返回是否加载成功
const preloadImage = async (src: string) => {
  if (typeof window !== 'undefined') {
    return new Promise<boolean>((resolve) => {
      const img = new Image();
      img.onload = () => {
        loaded.value = true;
        resolve(true);
      };
      img.onerror = () => resolve(false);
      img.src = src;

      // 使用 requestIdleCallback 来预加载
      if ('requestIdleCallback' in window) {
        requestIdleCallback(() => img.src = src);
      } else {
        img.src = src;  // 默认方式
      }
    });
  }
  return false;
};

// 设置缓存大小限制
const CACHE_SIZE = 3 // 最多缓存 3 张图片

// 使用 Map 存储图片缓存，键为图片 URL，值为 true 表示已加载
const loadedImages = new Map<string, boolean>()

// 添加图片到缓存并维护大小限制
const addToCache = (url: string) => {
  if (loadedImages.has(url)) {
    // 如果图片已存在于缓存中，先删除再重新插入（更新为最近使用）
    loadedImages.delete(url)
  } else if (loadedImages.size >= CACHE_SIZE) {
    // 如果缓存已满，移除最早插入的图片（FIFO）
    const oldestKey = loadedImages.keys().next().value
    loadedImages.delete(oldestKey);
  }
  // 插入新图片
  loadedImages.set(url, true)
};

// 检查图片是否在缓存中
const isCached = (url: string) => loadedImages.has(url)

// 动态获取重定向后的 URL
const fetchFinalRedirectUrl = async (url: string) => {
  try {
    const response = await fetch(url, {
      method: 'HEAD', // 使用 HEAD 方法，仅获取响应头
      redirect: 'follow',
    });

    // 优先从响应头中提取图片路径
    const imageUrl = response.headers.get('X-Image-Url') || response.url;
    return imageUrl;
  } catch (error) {
    console.error('Failed to fetch banner URL:', error);
    return false; // 如果请求失败，返回默认图片
  }
};

const customBannerLink = ref(bannerLink.value)

// 监听 banner 变化并预加载图片
watch(bannerLink, (newLink) => {
  preloadImage(newLink)
}, { immediate: true })

// 修改路由监听逻辑
watch(() => pageData.value.path, async () => { 
  // 强制重新加载当前图片 
  loaded.value = false; // 暂时隐藏图片 
  const finalBannerLink = await fetchFinalRedirectUrl(bannerLink.value); 
  if (!finalBannerLink) {
    console.error('Failed to fetch final banner link.');
    return; // 退出，避免传递 `false` 类型到 preloadImage
  }
  const success = await preloadImage(finalBannerLink); // 重新加载图片 
  if (success) { 
    addToCache(finalBannerLink); 
    customBannerLink.value = finalBannerLink; 
    loaded.value = true; // 图片加载完成后显示 
  }
});

let debounceTimeout: NodeJS.Timeout | null = null;

watch(() => pageData.value.path, () => {
  if (debounceTimeout) clearTimeout(debounceTimeout);

  debounceTimeout = setTimeout(async () => {
    const finalBannerLink = await fetchFinalRedirectUrl(bannerLink.value);
    
    if (typeof finalBannerLink === 'string') {  // 确保 finalBannerLink 是 string 类型
      if (!isCached(finalBannerLink)) {
        loaded.value = false;
        const success = await preloadImage(finalBannerLink);
        if (success) {
          addToCache(finalBannerLink);
          customBannerLink.value = finalBannerLink;
          loaded.value = true;
        }
      } else {
        customBannerLink.value = finalBannerLink;
      }
    } else {
      console.error('Invalid banner link received:', finalBannerLink);
    }
  }, 300);  // 根据需要调整间隔时间
});

// 定义 hero 区域的文本数据，优先使用 props，其次使用 frontmatter，最后使用默认值
const name = computed(() => props.hero?.name ?? matter.value.hero?.name ?? 'Plume')
const tagline = computed(() => props.hero?.tagline ?? matter.value.hero?.tagline ?? 'A VuePress Theme')
const text = computed(() => props.hero?.text ?? matter.value.hero?.text)
const actions = computed(() => props.hero?.actions ?? matter.value.hero?.actions ?? [])
</script>

<template>
  <div class="vp-home-banner">
    <!-- 背景图片容器 -->
    <div
      class="banner-background"
      :style="bannerStyle"
    />
    <!-- Mask 层 -->
    <div
      class="banner-mask"
      :style="{ opacity: maskOpacity }"
    />
    <!-- Hero 内容 -->
    <div class="container">
      <div class="content">
        <h2 v-if="name" class="hero-name">
          {{ name }}
        </h2>
        <p v-if="tagline" class="hero-tagline">
          <span class="line" /> <span>{{ tagline }}</span>
        </p>
        <p v-if="text" class="hero-text">
          {{ text }}
        </p>

        <div v-if="actions.length" class="actions">
          <div v-for="action in actions" :key="action.link" class="action">
            <VPButton
              tag="a"
              size="medium"
              :theme="action.theme"
              :text="action.text"
              :href="action.link"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.vp-home-banner {
  position: relative;
  width: 100%;
  min-height: calc(100vh - var(--vp-nav-height));
  overflow: hidden;
}

/* 背景图片容器 */
.banner-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
  opacity: 0; /* 初始透明度 */
  transition: opacity 0.5s ease; /* 过渡动画 */
  z-index: 0;
}

/* Mask 层 */
.banner-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgb(0, 0, 0);
  transition: opacity var(--vp-t-color); /* 动态不透明度 */
  z-index: 1;
}

/* Hero 内容容器 */
.vp-home-banner .container {
  position: relative;
  z-index: 2; /* 确保 Hero 内容在 mask 和背景之上 */
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 100%;
  padding-top: 4rem;
  margin: 0 auto;
}

.vp-home-banner .content {
  width: 100%;
  padding: 0 2rem;
}

.vp-home-banner .content .hero-name {
  font-size: 72px;
  font-weight: 600;
  line-height: 1;
  color: var(--vp-c-text-hero-name);
}

.vp-home-banner .content .hero-tagline {
  display: flex;
  align-items: center;
  margin-top: 1rem;
  font-size: 24px;
  font-weight: 500;
  line-height: 1.25;
  color: var(--vp-c-text-hero-tagline);
}

.vp-home-banner .content .hero-tagline .line {
  display: inline-block;
  width: 80px;
  height: 0;
  margin-right: 1rem;
  border-top: solid 1px var(--vp-c-text-hero-tagline);
}

.vp-home-banner .content .hero-text {
  width: 100%;
  max-width: 700px;
  margin-top: 1.5rem;
  font-size: 16px;
  font-weight: 500;
  color: var(--vp-c-text-hero-text);
  border-radius: 5px;
}

@media (min-width: 960px) {
  .vp-home-banner .container {
    max-width: 768px;
    padding-top: 8rem;
  }

  .vp-home-banner .content .hero-name {
    font-size: 100px;
  }
}

@media (min-width: 1440px) {
  .vp-home-banner .container {
    max-width: 1104px;
    padding-top: 8rem;
  }

  .vp-home-banner .content .hero-tagline {
    font-size: 32px;
  }
}

.actions {
  display: flex;
  flex-wrap: wrap;
  padding-top: 24px;
  margin: -6px;
}

.action {
  flex-shrink: 0;
  padding: 6px;
}
</style>