// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'

// 引入axios
import axios from 'axios'

// 引入qs
import qs from 'qs'

// 引入element-ui
import 'element-ui/lib/theme-chalk/index.css'
import ElementUI from 'element-ui'

// 引入字体图标
import '@/assets/font/iconfont.css'

// 引入公共样式
import '@/assets/css/base.css'

// 引入公用方法
import common from '@/utils/common.js'

// 引入兼容IE插件
import 'babel-polyfill'

// 注册axios
// axios.defaults.baseURL = 'http://www.allsps.com'
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;'
// axios.defaults.timeout = 5000
Vue.prototype.$axios = axios

// 注册qs
Vue.prototype.$qs = qs

// 注册elementui
Vue.use(ElementUI)

// 注册全局方法
Vue.prototype.$common = common

// Vue.prototype.baseUrl = () => '/api'
Vue.prototype.baseUrl = () => 'http://szydak.eicp.net:82'
// Vue.prototype.baseUrl = () => 'http://192.168.1.199:8080'
// Vue.prototype.baseUrl = () => 'http://www.allsps.com'

Vue.config.productionTip = false

// 注册请求拦截器
axios.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('wxMapToken')
  const userId = sessionStorage.getItem('wxMapUserId')
  if (token) {
    config.headers.token = token
    config.headers.user_id = userId
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 注册全局导航守卫判断是否未登录
router.beforeEach((to, from, next) => {
  const token = sessionStorage.getItem('wxMapToken')
  if (token) {
    next()
  } else {
    if (to.path === '/login') {
      next()
    } else {
      next({path: '/login'})
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
