import { createRouter, createWebHistory } from 'vue-router'

import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import { useAuthStore } from './stores/auth.js'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.LOGIN, component: LoginPage, meta: { guestOnly: true } },
  { path: ROUTES.REGISTER, component: RegisterPage, meta: { guestOnly: true } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (!authStore.token && !authStore.user) {
    authStore.restoreAuth()
  }

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return ROUTES.LOGIN
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
