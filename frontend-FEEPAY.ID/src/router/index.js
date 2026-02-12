import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/AdminLogin.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const { checkAuth, isAuthenticated } = useAuth()

  if (to.meta.requiresAuth) {
    const authenticated = await checkAuth()
    
    if (!authenticated) {
      next({ name: 'admin-login' })
    } else {
      next()
    }
  } else if (to.meta.requiresGuest) {
    const authenticated = isAuthenticated.value || await checkAuth()
    
    if (authenticated) {
      next({ name: 'admin-dashboard' })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router 