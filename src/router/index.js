import { createRouter, createWebHistory } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue'),
  },

  // =====================================
  // FOOTER PAGES - Halaman Informasi
  // =====================================
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue'),
  },
  {
    path: '/privacy',
    name: 'privacy',
    component: () => import('../views/PrivacyView.vue'),
  },
  {
    path: '/terms',
    name: 'terms',
    component: () => import('../views/TermsView.vue'),
  },

  // =====================================
  // CHECKOUT ROUTES
  // =====================================
  // ✅ FIX: Route SPESIFIK harus di atas route DYNAMIC /checkout/:productId
  // Kalau dynamic di atas, semua /checkout/pulsa, /checkout/top-up-game
  // akan ditangkap sebagai productId dan load CheckoutView bukan halaman yang benar
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
    path: '/checkout/game-voucher',
    name: 'game-voucher-checkout',
    component: () => import('../views/checkout/GameVoucherCheckout.vue')
  },

  // Route dynamic di BAWAH route spesifik
  {
    path: '/checkout/:productId',
    name: 'checkout',
    component: () => import('../views/CheckoutView.vue'),
  },

  // =====================================
  // PAYMENT & TRANSACTION ROUTES
  // =====================================
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
    path: '/payment/:orderId',
    name: 'payment',
    component: () => import('../views/PaymentView.vue'),
  },
  {
    path: '/transactions',
    name: 'transactions',
    component: () => import('../views/TransactionHistoryView.vue'),
  },

  // =====================================
  // USER ROUTES
  // =====================================
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/ProfileView.vue'),
  },

  // =====================================
  // ADMIN ROUTES
  // =====================================
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
    path: '/admin/orders',
    name: 'admin-orders',
    component: () => import('../views/AdminDashboard.vue'),
    meta: { requiresAuth: true }
  },

  // =====================================
  // 404 NOT FOUND
  // =====================================
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('../views/NotFound.vue'),
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Scroll ke atas setiap pindah halaman
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0, behavior: 'smooth' }
    }
  }
})

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  const { checkAuth, isAuthenticated } = useAuth()

  // Cek jika route butuh authentication (admin)
  if (to.meta.requiresAuth) {
    const authenticated = await checkAuth()
    if (!authenticated) {
      next({ name: 'admin-login' })
    } else {
      next()
    }
  } 
  // Cek jika route untuk guest only (login page)
  else if (to.meta.requiresGuest) {
    const authenticated = isAuthenticated.value || await checkAuth()
    if (authenticated) {
      next({ name: 'admin-dashboard' })
    } else {
      next()
    }
  } 
  // Route publik
  else {
    next()
  }
})

export default router