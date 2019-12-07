import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import ChatDashboard from '../views/ChatDashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: Login,
  },
  {
    path: '/chat',
    name: 'chat',
    component: ChatDashboard,
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
