import axios from 'axios'
import router from '../router'
import { ref } from 'vue'

// Global Loading State
export const isApiProcessing = ref(false)

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api', // ← UBAH localhost → 127.0.0.1
  timeout: 30000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  }
})

// 1. REQUEST INTERCEPTOR
api.interceptors.request.use(
  (config) => {
    isApiProcessing.value = true // Set loading TRUE
    
    const token = localStorage.getItem('feepay_token')
    if (token) config.headers.Authorization = `Bearer ${token}`

    const adminPin = sessionStorage.getItem('feepay_admin_pin')
    if (adminPin) config.headers['X-Admin-Pin'] = adminPin

    // Smart Idempotency
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
    isApiProcessing.value = false // Set loading FALSE
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
        // Jika backend mengirim pesan error spesifik dari Try-Catch Laravel, tampilkan itu.
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
  },

  products: {
    getAll: (p) => api.get('/products', { params: p }),
    sync: () => api.post('/admin/x7k2m/products/sync'),
    update: (id, d) => api.put(`/admin/x7k2m/products/${id}`, d),
  },

  orders: {
    create: (d) => api.post('/orders/create', d),
    get: (id) => api.get(`/orders/${id}`),
    list: () => api.get('/orders'),
    getAll: (p) => api.get('/admin/x7k2m/orders', { params: p }), 
    confirm: (id) => api.post(`/admin/x7k2m/orders/${id}/confirm`),
    sync: (id) => api.post(`/admin/x7k2m/orders/${id}/sync`), 
  },

  payments: {
    midtrans: {
      create: (data) => api.post('/payments/midtrans/create', data)
    },
    submit: (fd) => api.post('/payments/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    getAll: (p) => api.get('/admin/x7k2m/payments', { params: p }),
    verify: (id, d) => api.post(`/admin/x7k2m/payments/${id}/verify`, d),
  },

  usdt: {
    getRate: () => api.get('/usdt/rate'),
    submit: (fd) => api.post('/usdt/submit', fd, { headers: { 'Content-Type': 'multipart/form-data' } }),
    get: (id) => api.get(`/usdt/${id}`),
    getAll: (p) => api.get('/admin/x7k2m/usdt', { params: p }),
    approve: (id, d) => api.post(`/admin/x7k2m/usdt/${id}/approve`, d),
    updateRate: (d) => api.post('/admin/x7k2m/usdt/rate', d),
  },

  dashboard: {
    getStats: (p) => api.get('/admin/x7k2m/dashboard/stats', { params: p }),
  },

  // Support / Customer Service
  support: {
    send: (data) => api.post('/support/send', data),
    getContacts: () => api.get('/support/contacts')
  }
}