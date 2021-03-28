import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from '../pages/Login'
import Chat from '../pages/Chat'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'chat',
    component: Chat
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
