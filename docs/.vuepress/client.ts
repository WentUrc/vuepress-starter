import { defineClientConfig } from 'vuepress/client'
import { h } from 'vue'
import './styles/custom.css'
import Layout from './components/Layout.vue'
import AsideNav from './components/AsideNav.vue'

export default defineClientConfig({
  layouts: {
    Layout: h(Layout, null, {
      'aside-outline-after': () => h(AsideNav),
    }),
  },
  enhance({ app }) {
    // 在 VuePress 应用中注册全局组件

  },
})
