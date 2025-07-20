import { defineClientConfig } from 'vuepress/client'
import './styles/custom.css'
import Layout from './components/Layout.vue'

export default defineClientConfig({
  layouts: {
    Layout,
  },
  enhance({ app }) {
    // 在 VuePress 应用中注册全局组件

  },
})
