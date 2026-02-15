<template>
  <button
    @click="handlePayment"
    :disabled="disabled || isProcessing"
    class="midtrans-btn"
    :class="{ 'is-processing': isProcessing }"
  >
    <Loader v-if="isProcessing" class="animate-spin" :size="20" />
    <span v-else>Bayar Sekarang</span>
  </button>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Loader } from 'lucide-vue-next'
import { useMidtrans } from '@/composables/useMidtrans'
import { useOrderStore } from '@/stores/orderStore'

const props = defineProps({
  product: {
    type: Object,
    required: true
  },
  targetNumber: {
    type: String,
    default: ''
  },
  customerEmail: {
    type: String,
    default: 'customer@feepay.id'
  },
  disabled: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success', 'pending'])

const router = useRouter()
const orderStore = useOrderStore()
const { pay } = useMidtrans()

const isProcessing = ref(false)

const handlePayment = async () => {
  isProcessing.value = true

  try {
    // Step 1: Create order via orderStore (auto-save to history!)
    const orderData = {
      sku: props.product.buyer_sku_code || props.product.sku,
      target_number: props.targetNumber,
      customer_email: props.customerEmail
    }

    console.log('📦 Creating order via orderStore:', orderData)
    
    // ✅ Use orderStore instead of api directly
    const orderResponse = await orderStore.createOrder(orderData)
    
    console.log('📊 Order response:', orderResponse)
    
    if (!orderResponse || !orderResponse.order_id) {
      throw new Error('Failed to create order')
    }

    const orderId = orderResponse.order_id
    console.log('✅ Order created and saved to history:', orderId)

    // Step 2: Open Midtrans payment
    pay(orderId, {
      onSuccess: (result, oid) => {
        console.log('🎉 Payment success! Updating order status...', oid)
        
        // Update order status in history
        orderStore.updateOrderStatus(oid, 'success')
        
        emit('success', oid)
        emit('close')
        
        setTimeout(() => {
          router.push(`/payment/${oid}/success`)
          isProcessing.value = false
        }, 300)
      },
      
      onPending: (result, oid) => {
        console.log('⏳ Payment pending! Updating order status...', oid)
        
        // Update order status in history
        orderStore.updateOrderStatus(oid, 'pending')
        
        emit('pending', oid)
        emit('close')
        
        setTimeout(() => {
          router.push(`/payment/${oid}/pending`)
          isProcessing.value = false
        }, 300)
      },
      
      onError: (result) => {
        console.error('❌ Payment error:', result)
        alert('Pembayaran gagal. Silakan coba lagi.')
        emit('close')
        isProcessing.value = false
      },
      
      onClose: () => {
        console.log('🚪 User closed payment popup')
        emit('close')
        isProcessing.value = false
      }
    })

  } catch (err) {
    console.error('❌ Payment error:', err)
    alert(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    emit('close')
    isProcessing.value = false
  }
}
</script>

<style scoped>
.midtrans-btn {
  width: 100%;
  height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  
  font-size: 1rem;
  font-weight: 700;
  
  border: none;
  border-radius: 14px;
  
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  box-shadow: 0 4px 14px rgba(79, 172, 254, 0.35);
}

.midtrans-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(79, 172, 254, 0.45);
}

.midtrans-btn:active:not(:disabled) {
  transform: translateY(0);
  box-shadow: 0 4px 14px rgba(79, 172, 254, 0.35);
}

.midtrans-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.midtrans-btn.is-processing {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  cursor: wait;
}
</style>