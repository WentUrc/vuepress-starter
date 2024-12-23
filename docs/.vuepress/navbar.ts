import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
  // ...
    { text: 'Text', 
      link: '/beta/' 
    },

    { text: 'Tech-Document', 
      link: '/tech/',
    },

    { text: 'ChatGPT Said', 
      link: '/GPTstory/',
    },

    { text: 'WentUrc Learn', 
      items: 
      [
        {
          text: '前言',
          link: '/learn/',
        },

        {
          text: '工程力学',
          link: '/learn/工程力学/',
        },

        {
          text: '建筑结构',
          link: '/learn/建筑结构/',
        },

        {
          text: '管理学',
          link: '/learn/管理学/',
        },

        {
          text: '经济学',
          link: '/learn/经济学/',
        },

        {
          text: '英语',
          link: '/learn/英语/',
        },

        {
          text: '近代史',
          link: '/learn/近代史/',
        },

        {
          text: '毛泽东概论',
          link: '/learn/毛概/',
        },

      ]
    },

    { text: 'Novel', 
      items: 
      [
        {
          text:'小说',
          link: '/novel/',
        },
        {
          text: 'Re - 从零开始的异世界生活',
          link: '/novel/Re - 从零开始的异世界生活/'
        },
      ]
    }, 

])