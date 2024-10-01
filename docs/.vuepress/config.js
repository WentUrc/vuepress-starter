import { viteBundler } from '@vuepress/bundler-vite'
import { defaultTheme } from '@vuepress/theme-default'
import { defineUserConfig } from 'vuepress'
import { searchPlugin } from '@vuepress/plugin-search'

export default defineUserConfig({
  base: '/vuepress-starter/', // 仓库名
  title: 'WentUrc', // 网站标题
  description: '持续学习大学课程', // 网站描述
  head: [ // 注入到当前HTMl页面 <head> 中的标签
    ['link', { rel: 'icon', href: '/vuepress-starter/logo.jpg' }], // 增加一个自定义的 favicon(网页标签的图标)
  ],
  markdown: {
    lineNumbers: true, // 代码块显示行号
  },
  theme: defaultTheme({
    repo: 'Unerge/vuepress-starter',
    docsDir: 'docs',
    docsBranch: 'docs', // 如果文档在其他分支，请设置此项，默认为 `main` 或 `master`
    editLinks: true,
    editLinkText: '在 GitHub 上编辑此页',

    navbar: [ //导航栏
      { text: 'beta', link: '/beta/' },
      { text: 'GPTstort', link: '/GPTstory/' },
      { text: 'tech', link: '/tech/' },
      { text: 'WentUrc Learn', link: '/learn/' , children: ['/learn/' , '/learn/工程力学/' , '/learn/管理学/' , '/learn/经济学/' , '/learn/英语/' , '/learn/近代史/' , '/learn/毛概/' , '/learn/房屋建筑学/']}
    ],

    sidebar: {
      '/beta/': [
        {
          text: 'beta',
          collapsible: true, // VuePress 2.x 中的 `collapsable` 替换为 `collapsible`
          children: [
            '/beta/',  // README.md 对应路径
          ],
        },
      ],
      '/GPTstory/': [
        {
          text: 'GPTstory',
          collapsible: true,
          children: [
            '1.md',
            '2.md',
            '3.md',
            '4.md',
          ],  // 这里也可以根据需要增加其他子页面
        },
      ],
      '/tech/': [
        {
          text: 'tech',
          collapsible: true,
          children: ['1.md','2.md','3.md','4.md','5.md','6.md','7.md','8.md','9.md'],  // 同样这里也可以增加其他子页面
        },
      ],
      '/learn/': [
        //Group1
        {
          title: 'Learn',
          children: [
                {
                    text: '工程力学',
                    collapsible: true,
                    children: ['/learn/工程力学/复习资料1.md','/learn/工程力学/题目1的解答.md','/learn/工程力学/题目解答2.md'],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '管理学',
                    collapsible: true,
                    children: ['/learn/管理学/绪论.md','/learn/管理学/第一章.md', '/learn/管理学/第二章.md' , '/learn/管理学/#' , '/learn/管理学/#' , '/learn/管理学/#'],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '经济学',
                    collapsible: true,
                    children: ['/learn/经济学/经济学期末考-复习1.md','/learn/经济学/经济学期末考-复习2.md'],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '英语',
                    collapsible: true,
                    children: ['/learn/英语/期末资料 .md',],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '近代史',
                    collapsible: true,
                    children: ['/learn/近代史/期末资料 .md',],  // 同样这里也可以增加其他子页面
                },
                {
                    text: '毛泽东概论',
                    collapsible: true,
                    children: ['/learn/毛概/导论.md', '/learn/毛概/第一章.md', '/learn/毛概/第二章.md',]
                },
                {
                    text: '房屋建筑学',
                    collapsible: true,
                    children: ['/learn/房屋建筑学/复习资料 01.md', ]
                },
            ],
        },
    ],
},
    // 其他主题配置
    logo: '/img/logo1251.jpg',
    search: true,
    searchMaxSuggestions: 10,
    colorMode: 'light', // 'light' | 'dark' | 'auto'
    colorModeSwitch: true,
  }),

  bundler: viteBundler(),

  plugins: [
    '@vuepress/plugin-back-to-top', // 返回顶部的插件
    '@vuepress/plugin-medium-zoom', // 图片放大的插件
    [
      'vuepress-plugin-one-click-copy', // 注意插件名称已更新
      {
        copyMessage: '复制成功',
      },
    ],
    [
      'vuepress-plugin-mathjax',  // 插件名称
      {
        target: 'svg', // 使用 SVG 来渲染数学公式
        macros: {
          '*': '\\times',
        },
      },
    ],
    [
      searchPlugin({
        // 配置项
        isSearchable: (page) => page.path !== '/',
        locales: {
          '/': {
            placeholder: 'Search',
          },
          '/zh/': {
            placeholder: '搜索',
          },
        },  
      }),
    ],
  ],
})
