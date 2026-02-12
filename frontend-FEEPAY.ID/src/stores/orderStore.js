// stores/orderStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
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
  // ACTIONS
  // ============================================
  
  async function createOrder(orderData) {
    loading.value = true
    error.value = null
    
    try {
      const order = await api.orders.create(orderData)
      currentOrder.value = order
      
      const exists = orderHistory.value.find(o => o.order_id === order.order_id)
      if (!exists) {
        orderHistory.value.unshift(order)
      }
      
      localStorage.setItem('feepay_current_order', JSON.stringify(order))
      
      return order
    } catch (err) {
      error.value = err.message || 'Failed to create order'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function submitPayment(orderId, paymentData) {
    loading.value = true
    error.value = null
    
    try {
      const response = await api.payments.submit(paymentData)
      
      const orderIndex = orderHistory.value.findIndex(o => o.order_id === orderId)
      if (orderIndex !== -1) {
        orderHistory.value[orderIndex].status = 'pending'
      }
      
      if (currentOrder.value?.order_id === orderId) {
        currentOrder.value.status = 'pending'
        localStorage.setItem('feepay_current_order', JSON.stringify(currentOrder.value))
      }
      
      return response
    } catch (err) {
      error.value = err.message || 'Failed to submit payment'
      throw err
    } finally {
      loading.value = false
    }
  }

  async function getOrderById(orderId) {
    loading.value = true
    error.value = null
    
    try {
      const order = await api.orders.get(orderId)
      
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

  async function checkOrderStatus(orderId) {
    try {
      const order = await getOrderById(orderId)
      return order.status
    } catch (err) {
      console.error('Failed to check order status:', err)
      return null
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
        console.error('Failed to restore order:', err)
        localStorage.removeItem('feepay_current_order')
      }
    }
  }

  function addToHistory(order) {
    const exists = orderHistory.value.find(o => o.order_id === order.order_id)
    if (!exists) {
      orderHistory.value.unshift(order)
      
      const historyToSave = orderHistory.value.slice(0, 20)
      localStorage.setItem('feepay_order_history', JSON.stringify(historyToSave))
    }
  }

  function restoreHistory() {
    const saved = localStorage.getItem('feepay_order_history')
    if (saved) {
      try {
        orderHistory.value = JSON.parse(saved)
      } catch (err) {
        console.error('Failed to restore history:', err)
        localStorage.removeItem('feepay_order_history')
      }
    }
  }

  function clearHistory() {
    orderHistory.value = []
    localStorage.removeItem('feepay_order_history')
  }

  // Auto-restore
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
    clearCurrentOrder,
    restoreCurrentOrder,
    addToHistory,
    restoreHistory,
    clearHistory
  }
})