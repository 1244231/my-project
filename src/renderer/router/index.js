import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/home',
      name: 'home',
      component: require('@/views/home').default,
    },
    {
      path: '/login',
      name: 'login',
      component: require('@/views/login').default
    },
  ]
})




