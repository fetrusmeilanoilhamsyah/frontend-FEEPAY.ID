import axios from 'axios'
import router from '../router'
import { ref } from 'vue'

// Global Loading State
export const isApiProcessing = ref(false)

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.feepay.web.id/api',
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// ✅ FIX C-04: Admin path diambil dari env, tidak hardcode di source code
const ADMIN_PATH = import.meta.env.VITE_ADMIN_PATH

// 1. REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    isApiProcessing.value = true

    const token = localStorage.getItem('feepay_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    const adminPin = sessionStorage.getItem('feepay_admin_pin')
    if (adminPin) config.headers['X-Admin-Pin'] = adminPin

    if (['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
      config.headers['X-Idempotency-Key'] = `FP-${Date.now()}-${Math.random().toString(36).substring(7)}`
    }

    return config
  },
  (error) => {
    isApiProcessing.value = false
    return Promise.reject(error)
  }
)

// 2. RESPONSE INTERCEPTOR
api.interceptors.response.use(
  (response) => {
    isApiProcessing.value = false
    if (response.config.responseType === 'blob') return response.data
    return response.data.data || response.data
  },
  (error) => {
    isApiProcessing.value = false
    
    if (!error.response) {
      return Promise.reject({ message: 'Server FeePay tidak merespon. Cek Koneksi Boss!' })
    }

    const { status, data } = error.response

    switch (status) {
      case 401:
        if (data.message?.toLowerCase().includes('pin')) {
          sessionStorage.removeItem('feepay_admin_pin')
          return Promise.reject({ type: 'pin_error', message: 'PIN Admin Salah Boss!' })
        }

        localStorage.clear()
        sessionStorage.clear()
        if (!router.currentRoute.value.path.includes('login')) {
          router.push('/admin/login')
        }
        break

      case 422:
        return Promise.reject({ type: 'validation', errors: data.errors, message: data.message })

      case 429:
        return Promise.reject({ message: 'Sabar Boss, kliknya kecepetan (Rate Limit)!' })

      case 500:
        if (data.message?.toLowerCase().includes('saldo')) {
          return Promise.reject({ message: 'SALDO DIGIFLAZZ HABIS BOSS! Top up dulu.' })
        }
        return Promise.reject({ message: data.message || 'Server Error (500). Cek Laravel Log!' })
      
      default:
        return Promise.reject(data)
    }

    return Promise.reject(error.response.data)
  }
)

// 3. API SERVICES
export default {
  auth: {
    login: (cred) => api.post('/admin/login', cred),
    logout: () => api.post('/admin/logout'),
    me: () => api.get('/admin/me'),
    refresh: () => api.post('/admin/refresh'),
  },

  products: {
    getAll: (p) => api.get('/products', { params: p }),
    sync: () => api.post(`/admin/${ADMIN_PATH}/products/sync`),
    update: (id, d) => api.put(`/admin/${ADMIN_PATH}/products/${id}`, d),
    bulkMargin: (margin) => api.post(`/admin/${ADMIN_PATH}/products/bulk-margin`, { margin }),
  },

  orders: {
    create: (d) => api.post('/orders/create', d),
    // ✅ FIX H-06: POST + email untuk verifikasi kepemilikan order
    get: (id, email) => api.post(`/orders/${id}`, { email }),
    list: () => api.get('/orders'),
    getAll: (p) => api.get(`/admin/${ADMIN_PATH}/orders`, { params: p }),
    confirm: (id) => api.post(`/admin/${ADMIN_PATH}/orders/${id}/confirm`),
    sync: (id) => api.post(`/admin/${ADMIN_PATH}/orders/${id}/sync`),
  },

  payments: {
    midtrans: {
      create: (data) => api.post('/payments/midtrans/create', data)
    },
    submit: (fd) => api.post('/payments/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getAll: (p) => api.get(`/admin/${ADMIN_PATH}/payments`, { params: p }),
    verify: (id, d) => api.post(`/admin/${ADMIN_PATH}/payments/${id}/verify`, d),
  },

  usdt: {
    getRate: () => api.get('/usdt/rate'),
    submit: (fd) => api.post('/usdt/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    get: (id) => api.get(`/usdt/${id}`),
    getAll: (p) => api.get(`/admin/${ADMIN_PATH}/usdt`, { params: p }),
    approve: (id, d) => api.post(`/admin/${ADMIN_PATH}/usdt/${id}/approve`, d),
    updateRate: (d) => api.post(`/admin/${ADMIN_PATH}/usdt/rate`, d),
    getProof: (id) => api.get(`/admin/${ADMIN_PATH}/usdt/${id}/proof`, { responseType: 'blob' }),
  },

  dashboard: {
    getStats: (p) => api.get(`/admin/${ADMIN_PATH}/dashboard/stats`, { params: p }),
    getBalance: () => api.get(`/admin/${ADMIN_PATH}/dashboard/balance`),
  },

  support: {
    send: (data) => api.post('/support/send', data),
    getContacts: () => api.get('/support/contacts')
  }
}