import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/checkout/:productId',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
  },
  {
    path: '/payment/:orderId',
    name: 'payment',
    component: () => import('../views/PaymentView.vue'),
  },
  {
    path: '/payment/:orderId/pending',
    name: 'payment-pending',
    component: () => import('../views/PaymentPendingView.vue'),
  },
  {
    path: '/payment/:orderId/success',
    name: 'payment-success',
    component: () => import('../views/PaymentSuccessView.vue'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/TransactionHistoryView.vue'),
  },
  {
    path: '/usdt-history',
    name: 'usdt-history',
    component: () => import('../views/UsdtHistoryView.vue'),
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
  },
  {
    path: '/admin/login',
    name: 'admin-login',
    component: () => import('../views/AdminLogin.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/checkout/pulsa',
    name: 'pulsa-checkout',
    component: () => import('../views/checkout/PulsaCheckout.vue')
  },
  {
    path: '/checkout/data',
    name: 'data-checkout',
    component: () => import('../views/checkout/DataCheckout.vue')
  },
  {
    path: '/checkout/game-voucher',
    name: 'game-voucher-checkout',
    component: () => import('../views/checkout/GameVoucherCheckout.vue')
  },
  {
    path: '/checkout/pln',
    name: 'pln-checkout',
    component: () => import('../views/checkout/PlnCheckout.vue')
  },
  {
    path: '/checkout/top-up-game',
    name: 'top-up-game-checkout',
    component: () => import('../views/checkout/TopUpGameCheckout.vue')
  },
  {
    path: '/checkout/e-wallet',
    name: 'e-wallet-checkout',
    component: () => import('../views/checkout/EWalletCheckout.vue')
  },
  {
    path: '/admin/dashboard',
    name: 'admin-dashboard',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  },
  // ✅ NEW: Jika kamu ingin memisahkan halaman manajemen order di masa depan
  {
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('../views/AdminDashboard.vue'), // Sementara pakai dashboard karena tabbed system
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