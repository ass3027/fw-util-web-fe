import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/db-data-list',
    name: 'DBDataList',
    component: () => import('@/views/DBDataList.vue')
  },
  {
    path: '/connection-fail-list',
    name: 'ConnectionFailList',
    component: () => import('@/views/ConnectionFailList.vue')
  },
  {
    path: '/realtime-view',
    name: 'RealTimeView',
    component: () => import('@/views/RealTimeView.vue')
  },
  {
    path:'/test',
    name:'Test',
    component:() => import('@/views/TestPage.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 