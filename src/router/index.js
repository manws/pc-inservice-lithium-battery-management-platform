import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { title: '登录', public: true }
  },
  {
    path: '/charging',
    name: 'charging',
    component: () => import('@/views/ChargingIdleView.vue'),
    meta: { title: '智慧充电柜' }
  },
  {
    path: '/bms/:cabinetId',
    name: 'bms',
    component: () => import('@/views/BmsDetailView.vue'),
    meta: { title: '电池信息详情' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    return { name: 'login' }
  }
  if (to.name === 'login' && auth.isLoggedIn) {
    return { name: 'charging' }
  }
})

router.afterEach((to) => {
  document.title = to.meta.title
    ? `${to.meta.title} · 在役锂电池精细化管理平台`
    : '在役锂电池精细化管理平台'
})

export default router
