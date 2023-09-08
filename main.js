import App from './App'
// 工具函数
import utils from '@/utils/uni'

// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
  ...App
})
app.use(utils)
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import * as Pinia from 'pinia'
export function createApp() {
  const app = createSSRApp(App)
  app.use(Pinia.createPinia())
  app.use(utils)
  return {
    app,
    Pinia
  }
}
// #endif
