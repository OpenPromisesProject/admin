import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Promises from '@/components/Promises'
import Politicians from '@/components/Politicians'
import Contributors from '@/components/Contributors'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/promises',
      name: 'Promises',
      component: Promises
    },
    {
      path: '/politicians',
      name: 'Politicians',
      component: Politicians
    },
    {
      path: '/contributors',
      name: 'Contributors',
      component: Contributors
    }
  ]
})
