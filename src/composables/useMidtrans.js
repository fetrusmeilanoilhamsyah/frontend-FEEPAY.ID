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
      // ✅ Validasi orderId dulu
      if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
        throw new Error('Order ID tidak valid')
      }

      console.log('🔵 Requesting payment for:', orderId)

      // Step 1: Get snap token from backend
      const response = await api.payments.midtrans.create({ order_id: orderId })
      
      console.log('🟢 Payment response:', response)

      // ✅ FIX: Interceptor sudah return response.data.data
      if (!response || !response.snap_token) {
        throw new Error('Gagal mendapatkan payment token dari server')
      }

      const snapToken = response.snap_token  // ✅ Langsung ambil snap_token

      // Step 2: Check if Snap is loaded
      if (!window.snap) {
        throw new Error('Midtrans Snap belum dimuat. Silakan refresh halaman.')
      }

      // Step 3: Open Midtrans Snap popup
      window.snap.pay(snapToken, {
        onSuccess: (result) => {
          console.log('✅ Payment success:', result)
          isLoading.value = false
          if (onSuccess) onSuccess(result, orderId)
        },
        
        onPending: (result) => {
          console.log('⏳ Payment pending:', result)
          isLoading.value = false
          if (onPending) onPending(result, orderId)
        },
        
        onError: (result) => {
          console.error('❌ Payment error:', result)
          error.value = result
          isLoading.value = false
          if (onError) onError(result, orderId)
        },
        
        onClose: () => {
          console.log('🔴 Payment modal closed')
          isLoading.value = false
          if (onClose) onClose(orderId)
        }
      })

    } catch (err) {
      console.error('🚨 Payment exception:', err)
      
      // ✅ Better error message
      let errorMessage = 'Terjadi kesalahan saat membuka pembayaran'
      
      if (err.message.includes('Order ID')) {
        errorMessage = 'Order ID tidak valid'
      } else if (err.message.includes('Snap')) {
        errorMessage = 'Midtrans belum siap. Silakan refresh halaman.'
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message
      } else if (err.message) {
        errorMessage = err.message
      }

      error.value = errorMessage
      isLoading.value = false
      
      // ✅ Call onError callback
      if (onError) {
        onError({ error: errorMessage }, orderId)
      } else {
        // Fallback: show alert if no error handler
        alert(`Error: ${errorMessage}\n\nSilakan coba lagi atau hubungi customer service.`)
      }
    }
  }

  return {
    pay,
    isLoading,
    error
  }
}