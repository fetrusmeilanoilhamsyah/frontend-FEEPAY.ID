import { ref } from 'vue'
import api from '@/services/api'

export function useMidtrans() {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Initialize Midtrans Snap
   * @param {string} orderId - Order ID from backend
   * @param {Object} callbacks - { onSuccess, onPending, onError, onClose }
   */
  const pay = async (orderId, { onSuccess, onPending, onError, onClose } = {}) => {
    isLoading.value = true
    error.value = null

    try {
      // Step 1: Get snap token from backend
      const response = await api.payments.midtrans.create({ order_id: orderId })
      
      // ✅ FIX: Interceptor sudah return response.data.data
      if (!response || !response.snap_token) {
        throw new Error('Failed to get payment token')
      }

      const snapToken = response.snap_token  // ✅ Langsung ambil snap_token

      // Step 2: Check if Snap is loaded
      if (!window.snap) {
        throw new Error('Midtrans Snap not loaded. Please refresh the page.')
      }

      // Step 3: Open Midtrans Snap popup
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          isLoading.value = false
          if (onSuccess) onSuccess(result, orderId)
        },
        
        onPending: (result) => {
          isLoading.value = false
          if (onPending) onPending(result, orderId)
        },
        
        onError: (result) => {
          error.value = result
          isLoading.value = false
          if (onError) onError(result, orderId)
        },
        
        onClose: () => {
          isLoading.value = false
          if (onClose) onClose(orderId)
        }
      })

    } catch (err) {
      error.value = err.message || 'Terjadi kesalahan'
      isLoading.value = false
      if (onError) onError(err, orderId)
    }
  }

  return {
    pay,
    isLoading,
    error
  }
}