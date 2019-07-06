// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'

// 引入axios
import axios from 'axios'

// 引入qs
import qs from 'qs'

// 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

// 引入字体图标
import '@/assets/font/iconfont.css'

// 注册axios
// axios.defaults.baseURL = 'http://www.allsps.com:82'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;'
// axios.defaults.timeout = 5000
Vue.prototype.$axios = axios

// 注册qs
Vue.prototype.$qs = qs

// 注册elementui
Vue.use(ElementUI)

// Vue.prototype.baseUrl = () => '/api'
Vue.prototype.baseUrl = () => 'http://szydak.eicp.net:82'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
