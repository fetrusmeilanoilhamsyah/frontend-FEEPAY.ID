<template>
  <button
    @click="handlePayment"
    :disabled="disabled || isProcessing"
    class="midtrans-btn"
    :class="{ 'is-processing': isProcessing }"
  >
    <Loader v-if="isProcessing" class="animate-spin" :size="18" />
    <span>{{ isProcessing ? 'Memproses...' : 'Bayar Sekarang' }}</span>
  </button>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Loader } from 'lucide-vue-next'
import { useMidtrans } from '@/composables/useMidtrans'
import { useOrderStore } from '@/stores/orderStore'

const props = defineProps({
  product:       { type: Object,  required: true },
  targetNumber:  { type: String,  default: '' },
  // ✅ FIX F2: zoneId diterima dari PaymentModal
  zoneId:        { type: String,  default: undefined },
  // ✅ FIX F4: customerEmail dari input user, bukan hardcode
  customerEmail: { type: String,  default: '' },
  disabled:      { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'success', 'pending'])

const router     = useRouter()
const orderStore = useOrderStore()
const { pay }    = useMidtrans()

const isProcessing = ref(false)

const handlePayment = async () => {
  if (isProcessing.value) return
  isProcessing.value = true

  try {
    // ✅ FIX F2: Bangun payload dengan zone_id sebagai field TERPISAH
    // Backend StoreOrderRequest sudah siap terima zone_id nullable
    const orderData = {
      sku:            props.product.buyer_sku_code || props.product.sku,
      target_number:  props.targetNumber,
      // ✅ FIX F4: email dari input user, bukan hardcode 'customer@feepay.id'
      customer_email: props.customerEmail,
    }

    // Sertakan zone_id hanya kalau ada nilainya
    // Backend: wajib untuk MOBILE LEGENDS, GENSHIN IMPACT, HOK
    if (props.zoneId && props.zoneId.trim() !== '') {
      orderData.zone_id = props.zoneId.trim()
    }

    const orderResponse = await orderStore.createOrder(orderData)

    if (!orderResponse || !orderResponse.order_id) {
      throw new Error('Gagal membuat pesanan')
    }

    const orderId = orderResponse.order_id

    // Simpan email untuk dipakai di PaymentSuccessView / PaymentPendingView
    localStorage.setItem(`order_email_${orderId}`, props.customerEmail)

    pay(orderId, {
      onSuccess: (result, oid) => {
        orderStore.updateOrderStatus(oid, 'success')
        emit('success', oid)
        emit('close')
        setTimeout(() => {
          router.push(`/payment/${oid}/success`)
          isProcessing.value = false
        }, 300)
      },
      onPending: (result, oid) => {
        orderStore.updateOrderStatus(oid, 'pending')
        emit('pending', oid)
        emit('close')
        setTimeout(() => {
          router.push(`/payment/${oid}/pending`)
          isProcessing.value = false
        }, 300)
      },
      onError: (result) => {
        alert('Pembayaran gagal. Silakan coba lagi.')
        emit('close')
        isProcessing.value = false
      },
      onClose: () => {
        emit('close')
        isProcessing.value = false
      }
    })

  } catch (err) {
    alert(err.message || 'Terjadi kesalahan. Silakan coba lagi.')
    emit('close')
    isProcessing.value = false
  }
}
</script>

<style scoped>
.midtrans-btn {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--primary);
  color: var(--primary-foreground);
  font-size: 0.9375rem;
  font-weight: 700;
  border: none;
  border-radius: 14px;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  letter-spacing: -0.01em;
}
.midtrans-btn:hover:not(:disabled) { opacity: 0.92; }
.midtrans-btn:active:not(:disabled) { transform: scale(0.98); }
.midtrans-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.midtrans-btn.is-processing { opacity: 0.7; cursor: wait; }
</style>