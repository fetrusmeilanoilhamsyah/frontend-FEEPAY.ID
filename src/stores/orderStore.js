// stores/orderStore.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import api from '../services/api'

export const useOrderStore = defineStore('order', () => {
  
  // ============================================
  // STATE
  // ============================================
  const currentOrder = ref(null)
  const orderHistory = ref([])
  const loading = ref(false)
  const error = ref(null)

  // ============================================
  // GETTERS
  // ============================================
  const hasCurrentOrder = computed(() => currentOrder.value !== null)
  
  const pendingOrders = computed(() => 
    orderHistory.value.filter(o => o.status === 'pending')
  )
  
  const processingOrders = computed(() => 
    orderHistory.value.filter(o => o.status === 'processing')
  )
  
  const completedOrders = computed(() => 
    orderHistory.value.filter(o => 
      o.status === 'success' || o.status === 'failed'
    )
  )

  // ============================================
  // AUTO-SAVE KE LOCALSTORAGE
  // Simpan max 50 order terakhir
  // ============================================
  watch(
    orderHistory, // FIX: tanpa .value agar deep watch bekerja benar
    (newHistory) => {
      const historyToSave = newHistory.slice(0, 50)
      localStorage.setItem('feepay_order_history', JSON.stringify(historyToSave))
    },
    { deep: true }
  )

  // ============================================
  // ACTIONS
  // ============================================

  /**
   * Buat order baru ke backend
   */
  async function createOrder(orderData) {
    loading.value = true
    error.value = null
    
    try {
      const order = await api.orders.create(orderData)
      
      currentOrder.value = order
      localStorage.setItem('feepay_current_order', JSON.stringify(order))
      
      const exists = orderHistory.value.find(o => o.order_id === order.order_id)
      if (!exists) {
        orderHistory.value.unshift(order)
      }
      
      return order
    } catch (err) {
      error.value = err.message || 'Failed to create order'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Submit bukti pembayaran (manual transfer)
   */
  async function submitPayment(orderId, paymentData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.payments.submit(paymentData)
      
      const email = currentOrder.value?.customer_email
      await getOrderById(orderId, email)
      
      return response
    } catch (err) {
      error.value = err.message || 'Failed to submit payment'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Ambil data order dari backend berdasarkan orderId
   * FIX H-06: Wajib kirim email untuk verifikasi kepemilikan order
   */
  async function getOrderById(orderId, email = null) {
    loading.value = true
    error.value = null
    
    const verifyEmail = email || currentOrder.value?.customer_email

    try {
      const order = await api.orders.get(orderId, verifyEmail)
      
      const index = orderHistory.value.findIndex(o => o.order_id === orderId)
      if (index !== -1) {
        orderHistory.value[index] = order
      } else {
        orderHistory.value.unshift(order)
      }
      
      if (currentOrder.value?.order_id === orderId) {
        currentOrder.value = order
        localStorage.setItem('feepay_current_order', JSON.stringify(order))
      }
      
      return order
    } catch (err) {
      error.value = err.message || 'Failed to fetch order'
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Cek status order terbaru dari backend
   */
  async function checkOrderStatus(orderId) {
    try {
      const email = currentOrder.value?.customer_email
      const order = await getOrderById(orderId, email)
      return order.status
    } catch (err) {
      console.error('Failed to check order status:', err)
      return null
    }
  }

  /**
   * Update status order secara manual (hanya dari response backend)
   */
  function updateOrderStatus(orderId, status) {
    const index = orderHistory.value.findIndex(o => o.order_id === orderId)
    if (index !== -1) {
      orderHistory.value[index].status = status
    }
    
    if (currentOrder.value?.order_id === orderId) {
      currentOrder.value.status = status
      localStorage.setItem('feepay_current_order', JSON.stringify(currentOrder.value))
    }
  }

  function clearCurrentOrder() {
    currentOrder.value = null
    localStorage.removeItem('feepay_current_order')
  }

  function restoreCurrentOrder() {
    const saved = localStorage.getItem('feepay_current_order')
    if (saved) {
      try {
        currentOrder.value = JSON.parse(saved)
      } catch (err) {
        localStorage.removeItem('feepay_current_order')
      }
    }
  }

  function addToHistory(order) {
    const index = orderHistory.value.findIndex(o => o.order_id === order.order_id)
    if (index !== -1) {
      orderHistory.value[index] = { ...orderHistory.value[index], ...order }
    } else {
      orderHistory.value.unshift(order)
    }
  }

  // FIX: Hapus order dari localStorage kalau 404 di backend
  function removeFromHistory(orderId) {
    orderHistory.value = orderHistory.value.filter(o => o.order_id !== orderId)
  }

  function restoreHistory() {
    const saved = localStorage.getItem('feepay_order_history')
    if (saved) {
      try {
        orderHistory.value = JSON.parse(saved)
      } catch (err) {
        localStorage.removeItem('feepay_order_history')
      }
    }
  }

  function clearHistory() {
    orderHistory.value = []
    localStorage.removeItem('feepay_order_history')
  }

  // Auto-restore saat store diinisialisasi
  restoreCurrentOrder()
  restoreHistory()

  return {
    currentOrder,
    orderHistory,
    loading,
    error,
    hasCurrentOrder,
    pendingOrders,
    processingOrders,
    completedOrders,
    createOrder,
    submitPayment,
    getOrderById,
    checkOrderStatus,
    updateOrderStatus,
    clearCurrentOrder,
    restoreCurrentOrder,
    addToHistory,
    removeFromHistory, // FIX: export fungsi baru
    restoreHistory,
    clearHistory
  }
})