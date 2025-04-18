import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import customTheme from './theme'; // 引入自定义vuepress-theme-plume主题，以后就要从此处编辑主题了

export default defineUserConfig({
  base: '/',
  lang: 'zh-CN',
  title: 'WentUrc Docs', // 网站标题
  description: '路很长，梦仍在', // 网站描述
  head: [ // 注入到当前HTMl页面 <head> 中的标签
    ['link', { rel: 'icon', href: '/logo.png' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],

  theme: customTheme({
    // 其他主题配置
    logo: '/img/logo1251.jpg',
    hostname: 'https://docs.wenturc.com',

    notes: false,
    blog: false,
    autoFrontmatter: false,

    plugins: {
      comment: {
        provider: 'Giscus',
        comment: true,
        repo: 'wenturc/vuepress-starter',
        repoId: 'R_kgDOM13P7A',
        category: 'Ideas',
        categoryId: 'DIC_kwDOM13P7M4Cj96G',
        darkTheme: 'dark_protanopia',
        lightTheme: 'light_protanopia',
      }
    },
  }),

  bundler: viteBundler(),
})
