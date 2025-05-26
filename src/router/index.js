import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/RegionSelector.vue')
  },
  {
    path: '/as-is',
    component: () => import('@/layout/As-IsLayout.vue'),
    children: [
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
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 