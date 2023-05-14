import {createRouter, createWebHashHistory, RouteRecordRaw} from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'landing',
    component: () => import('@renderer/views/landing/index.vue')
  },
  {
    path: '/chat',
    name: 'chat',
    component: () => import('@renderer/views/chat/index.vue')
  }
]

export default createRouter({
  history: createWebHashHistory(),
  routes
})
