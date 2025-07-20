import { defineNavbarConfig } from 'vuepress-theme-plume'

export default defineNavbarConfig([
    { text: '学习', 
      icon: 'material-symbols:article-outline',
      link: '/learn/' 
    },
    { 
      text: '关于', 
      icon: 'map:wind-surfing',
      link: 'https://wenturc.com' 
    },
])