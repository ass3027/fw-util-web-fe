import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/region-selector',
    name: 'Home',
    component: () => import('@/views/RegionSelector.vue')
  },
  {
    path: '/',
    name: 'default-layout',
    component: () => import('@/layout/DefaultLayout.vue'),
    children: [
      {
        path: 'db-data-list',
        name: 'DBDataList',
        component: () => import('@/views/DBDataList.vue')
      },
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