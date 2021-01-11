import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入api接口
// import api from "./api"

// 全局的过滤器
import filters from './filters'

// 自定义的toast
import Toast from './components/toast/index'

// 引入整个 Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 导入icon-font的js
import '@/assets/iconfont/iconfont.js'

Vue.config.productionTip = false

// 将api挂载到vue的原型上复制代码
// Vue.prototype.$api = api

Vue.use(Toast)
// Vue.prototype.$toast = Toast
Vue.use(ElementUI)

// 全局过滤器
Object.keys(filters).forEach((filterName) => {
  Vue.filter(filterName, filters[filterName])
})

// 选择高亮的css 通过babel配置
// prism-coy prism-dark prism-funky prism-okaidia prism-tomorrow prism-twilight
// import "prismjs/themes/prism-okaidia.css"

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
