import { viteBundler } from '@vuepress/bundler-vite'
import { defineUserConfig } from 'vuepress'
import customTheme from './theme'; // 引入自定义vuepress-theme-plume主题，以后就要从此处编辑主题了
import path from 'path';

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
    autoFrontmatter: false,

    blog: {
      // 配置 封面图 布局位置
      // postCover: 'left', // 'left' | 'right' | 'odd-left' | 'odd-right' | 'top'
      postCover: {
        layout: 'top',
        ratio: '16:9',
        compact: true
      }
    },

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

    sidebar: {
        '/beta/': [
          {
            text: 'beta',
            collapsed: false, // VuePress 2.x 中的 `collapsable` 替换为 `collapsed`
            items: [
              '/beta/',  // README.md 对应路径
              '/beta/1.md',
            ],
          },
        ],
        '/novel/':[
          {
            text: 'Novel',
            items: [
              {
                text: 'Re - 从零开始的异世界生活',
                collapsed: false,
                items: [
                  '/novel/Re - 从零开始的异世界生活/',
                  {
                    text: '第一卷',
                    collapsed: false,
                    items: [
                      '/novel/Re - 从零开始的异世界生活/第一卷/插图/01-插图.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/序章/02-序章 开始的余韵.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/第一章/03-第一章 开始的结束.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/第二章/04-第二章 太迟的抵抗.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/第三章/05-第三章 结束的开始.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/第四章/06-第四章 第四次的正直.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/第五章/07-第五章 从零开始的异世界生活.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/终章/08-终章 月亮都看在眼里.md',
                      '/novel/Re - 从零开始的异世界生活/第一卷/后记/09-后记.md',
                    ],
                  },
                ],
              }
            ]
          },
        ],
        '/GPTstory/': [
          {
            text: 'GPTstory',
            collapsed: false,
            items: [
              '1.md',
              '2.md',
              '3.md',
              '4.md',
              '5.md',
              '6.md',
            ],  // 这里也可以根据需要增加其他子页面
          },
        ],
        '/tech/': [
          {
            text: 'tech',
            collapsed: false,
            items: [
              '1.md',
              '2.md',
              '3.md',
              '4.md',
              '5.md',
              '6.md',
              '7.md',
              '8.md',
              '9.md',
              '10.md',
              '11.md',
              '12.md',
              '13.md',
              '14.md',
            ],  // 同样这里也可以增加其他子页面
          },
        ],
        '/learn/': [
          //Group1
          {
            text: 'Learn',
            items: [
              {
                text: '工程力学',
                collapsed: false,
                items: ['/learn/工程力学/复习资料1.md','/learn/工程力学/题目1的解答.md','/learn/工程力学/题目解答2.md'],  // 同样这里也可以增加其他子页面
              },
              {
                text: '建筑结构',
                collapsed: false,
                items: ['/learn/建筑结构/复习资料1.md',],
              },
              {
                text: '管理学',
                collapsed: false,
                items: ['/learn/管理学/绪论.md','/learn/管理学/第一章.md', '/learn/管理学/第二章.md', '/learn/管理学/复习资料.md'],  // 同样这里也可以增加其他子页面
              },
              {
                text: '经济学',
                collapsed: false,
                items: ['/learn/经济学/经济学期末考-复习1.md','/learn/经济学/经济学期末考-复习2.md'],  // 同样这里也可以增加其他子页面
              },
              {
                text: '英语',
                collapsed: false,
                items: 
                  ['/learn/英语/期末资料 .md',
                    {
                      text: '四级复习',
                      collapsed: true,
                      items: [
                        '/learn/英语/CET-4/README.md',
                        '/learn/英语/CET-4/0.md',
                        '/learn/英语/CET-4/1.md',
                        '/learn/英语/CET-4/2.md'
                      ]
                    },
                    {
                      text: '六级复习',
                      collapsed: true,
                      items: [
                        '/learn/英语/CET-6/README.md',
                        '/learn/英语/CET-6/1.md',
                      ]
                    },

                  ],  // 同样这里也可以增加其他子页面
              },
              {
                text: '近代史',
                collapsed: false,
                items: ['/learn/近代史/期末资料 .md',],  // 同样这里也可以增加其他子页面
              },
              {
                text: '毛泽东概论',
                collapsed: false,
                items: ['/learn/毛概/导论.md', '/learn/毛概/第一章.md', '/learn/毛概/第二章.md',]
              },
            ],
          },
        ],
    },
  }),

  bundler: viteBundler(),
})
