import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/login',
    name: 'Home',
    component: () => import('@/views/RegionSelector.vue')
  },
  {
    path: '/',
    name: 'MainLayout',
    component: () => import('@/layout/MainLayout.vue'),
    children: [
      {
        path: 'cctv-list',
        name: 'CctvList',
        component: () => import('@/views/CctvList.vue')
      },
      {
        path: '/cctv-log',
        name: 'CctvLog',
        component: () => import('@/views/CctvLog.vue')
      }
    ]
  },
  {
    path: '/as-is',
    component: () => import('@/layout/as-is/MainLayout.vue'),
    children: [
      {
        path: 'db-data-list',
        name: 'AS-IS DBDataList',
        component: () => import('@/views/as-is/DBDataList.vue')
      },
      {
        path: 'connection-fail-list',
        name: 'ConnectionFailList',
        component: () => import('@/views/as-is/ConnectionFailList.vue')
      },
      {
        path: 'realtime-view',
        name: 'RealTimeView',
        component: () => import('@/views/as-is/RealTimeView.vue')
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router 