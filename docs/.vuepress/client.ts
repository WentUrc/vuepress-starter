import { defineClientConfig } from 'vuepress/client'
import Swiper from './theme/lib/client/features/components/Swiper.vue'
import './styles/custom.css'
import VPImageToAscii from './components/VPImageToAscii.vue'
import VPGame1 from './components/VPGame1.vue'

export default defineClientConfig({
  enhance({ app }) {
    app.component('Swiper', Swiper)
    app.component('VPImageToAscii', VPImageToAscii)
    app.component('VPGame1', VPGame1)
  },
})