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
  // AUTO-SAVE WATCHER
  // ============================================
  watch(
    () => orderHistory.value,
    (newHistory) => {
      const historyToSave = newHistory.slice(0, 50) // Save max 50 orders
      localStorage.setItem('feepay_order_history', JSON.stringify(historyToSave))
    },
    { deep: true }
  )

  // ============================================
  // ACTIONS
  // ============================================
  
  async function createOrder(orderData) {
    loading.value = true
    error.value = null
    
    try {
      const order = await api.orders.create(orderData)
      
      // Set current order
      currentOrder.value = order
      localStorage.setItem('feepay_current_order', JSON.stringify(order))
      
      // Add to history
      const exists = orderHistory.value.find(o => o.order_id === order.order_id)
      if (!exists) {
        orderHistory.value.unshift(order)
      }
      
      console.log('✅ Order created and saved to history:', order.order_id)
      
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
      
      // Update order status in history
      const orderIndex = orderHistory.value.findIndex(o => o.order_id === orderId)
      if (orderIndex !== -1) {
        orderHistory.value[orderIndex].status = 'processing'
      }
      
      // Update current order
      if (currentOrder.value?.order_id === orderId) {
        currentOrder.value.status = 'processing'
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
      
      // Update or add to history
      const index = orderHistory.value.findIndex(o => o.order_id === orderId)
      if (index !== -1) {
        orderHistory.value[index] = order
      } else {
        orderHistory.value.unshift(order)
      }
      
      // Update current order if match
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

  function updateOrderStatus(orderId, status) {
    console.log('📝 Updating order status:', orderId, status)
    
    // Update in history
    const index = orderHistory.value.findIndex(o => o.order_id === orderId)
    if (index !== -1) {
      orderHistory.value[index].status = status
      console.log('✅ Order status updated in history')
    }
    
    // Update current order
    if (currentOrder.value?.order_id === orderId) {
      currentOrder.value.status = status
      localStorage.setItem('feepay_current_order', JSON.stringify(currentOrder.value))
      console.log('✅ Current order status updated')
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
        console.log('✅ Current order restored:', currentOrder.value.order_id)
      } catch (err) {
        console.error('Failed to restore order:', err)
        localStorage.removeItem('feepay_current_order')
      }
    }
  }

  function addToHistory(order) {
    const index = orderHistory.value.findIndex(o => o.order_id === order.order_id)
    
    if (index !== -1) {
      // Update existing
      orderHistory.value[index] = { ...orderHistory.value[index], ...order }
      console.log('✅ Order updated in history:', order.order_id)
    } else {
      // Add new
      orderHistory.value.unshift(order)
      console.log('✅ Order added to history:', order.order_id)
    }
  }

  function restoreHistory() {
    const saved = localStorage.getItem('feepay_order_history')
    if (saved) {
      try {
        orderHistory.value = JSON.parse(saved)
        console.log('✅ Order history restored:', orderHistory.value.length, 'orders')
      } catch (err) {
        console.error('Failed to restore history:', err)
        localStorage.removeItem('feepay_order_history')
      }
    }
  }

  function clearHistory() {
    orderHistory.value = []
    localStorage.removeItem('feepay_order_history')
    console.log('🗑️ Order history cleared')
  }

  // ============================================
  // AUTO-RESTORE ON INIT
  // ============================================
  restoreCurrentOrder()
  restoreHistory()

  return {
    // State
    currentOrder,
    orderHistory,
    loading,
    error,
    
    // Getters
    hasCurrentOrder,
    pendingOrders,
    processingOrders,
    completedOrders,
    
    // Actions
    createOrder,
    submitPayment,
    getOrderById,
    checkOrderStatus,
    updateOrderStatus,
    clearCurrentOrder,
    restoreCurrentOrder,
    addToHistory,
    restoreHistory,
    clearHistory
  }
})