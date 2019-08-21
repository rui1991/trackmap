import Vue from 'vue'
import Router from 'vue-router'
// 登录
const Login = () => import('@/components/login')
// 企业
const Firm = () => import('@/components/firm')
// 分公司
const Filiale = () => import('@/components/filiale')
// 项目
const Project = () => import('@/components/project')
// 轨迹展示
const Roadmap = () => import('@/components/roadmap')
// 热点设置
const Sethot = () => import('@/components/sethot')

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/firm',
      name: 'firm',
      component: Firm
    },
    {
      path: '/filiale',
      name: 'filiale',
      component: Filiale
    },
    {
      path: '/project',
      name: 'project',
      component: Project
    },
    {
      path: '/roadmap',
      name: 'roadmap',
      component: Roadmap
    },
    {
      path: '/sethot',
      name: 'sethot',
      component: Sethot
    }
  ]
})
