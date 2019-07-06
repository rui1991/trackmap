import Vue from 'vue'
import Router from 'vue-router'
import Roadmap from '@/components/roadmap'
import Sethot from '@/components/sethot'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/roadmap'
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
