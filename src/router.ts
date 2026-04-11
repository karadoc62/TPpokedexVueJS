import { createRouter, createWebHistory } from 'vue-router'

import DeckCreatePage from './pages/DeckCreatePage.vue'
import DeckDetailPage from './pages/DeckDetailPage.vue'
import DeckEditPage from './pages/DeckEditPage.vue'
import HomePage from './pages/HomePage.vue'
import LoginPage from './pages/LoginPage.vue'
import RegisterPage from './pages/RegisterPage.vue'
import { useAuthStore } from './stores/auth.js'

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DECK_CREATE: '/decks/create',
  DECK_DETAIL: '/decks/:id',
  DECK_EDIT: '/decks/:id/edit',
} as const

const routes = [
  { path: ROUTES.HOME, component: HomePage, meta: { requiresAuth: true } },
  { path: ROUTES.LOGIN, component: LoginPage, meta: { guestOnly: true } },
  { path: ROUTES.REGISTER, component: RegisterPage, meta: { guestOnly: true } },
  {
    path: ROUTES.DECK_CREATE,
    component: DeckCreatePage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_DETAIL,
    component: DeckDetailPage,
    meta: { requiresAuth: true },
  },
  {
    path: ROUTES.DECK_EDIT,
    component: DeckEditPage,
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  authStore.restoreAuth()

  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return ROUTES.LOGIN
  }

  if (to.meta.guestOnly && authStore.isAuthenticated) {
    return ROUTES.HOME
  }

  return true
})

export default router
