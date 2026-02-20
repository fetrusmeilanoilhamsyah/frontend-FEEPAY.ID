<template>
  <div class="min-h-screen bg-background flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      
      <!-- Pending Icon -->
      <div class="text-center mb-6">
        <div class="pending-icon mx-auto mb-4">
          <Clock :size="48" class="text-warning" />
        </div>
        
        <h1 class="text-2xl sm:text-3xl font-black text-foreground mb-2">
          Menunggu Pembayaran
        </h1>
        <p class="text-sm text-muted-foreground">
          Selesaikan pembayaran sebelum waktu habis
        </p>
      </div>

      <!-- Countdown Timer -->
      <div v-if="timeRemaining" class="mb-6 p-4 bg-warning-light border border-warning/20 rounded-xl">
        <div class="flex items-center justify-between">
          <span class="text-sm font-semibold text-warning-foreground">
            Batas Waktu
          </span>
          <div class="text-2xl font-black font-mono text-warning">
            {{ formatTime(timeRemaining) }}
          </div>
        </div>
      </div>

      <!-- Order Details -->
      <div class="bg-card rounded-2xl border border-border p-6 mb-4">
        
        <!-- Loading -->
        <div v-if="loading" class="space-y-4">
          <div class="h-4 bg-muted rounded animate-pulse"></div>
          <div class="h-4 bg-muted rounded animate-pulse w-3/4"></div>
        </div>

        <!-- Order Info -->
        <div v-else-if="order" class="space-y-4">
          
          <div class="flex items-center justify-between pb-4 border-b border-border">
            <span class="text-sm text-muted-foreground">Order ID</span>
            <span class="text-sm font-bold text-foreground font-mono">
              {{ order.order_id }}
            </span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-sm text-muted-foreground">Produk</span>
            <span class="text-sm font-semibold text-foreground text-right">
              {{ order.product_name }}
            </span>
          </div>

          <div class="flex items-center justify-between pt-4 border-t border-border">
            <span class="text-base font-semibold text-foreground">Total</span>
            <span class="text-xl font-black text-primary">
              Rp {{ Number(order.total_price).toLocaleString('id-ID') }}
            </span>
          </div>

        </div>
      </div>

      <!-- Payment Instructions -->
      <div class="bg-card rounded-2xl border border-border p-6 mb-6">
        <h3 class="text-sm font-bold text-foreground mb-4">
          Cara Pembayaran
        </h3>
        
        <ol class="space-y-3">
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              1
            </span>
            <span class="text-sm text-foreground">
              Pilih metode pembayaran di popup Midtrans
            </span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              2
            </span>
            <span class="text-sm text-foreground">
              Selesaikan pembayaran sesuai instruksi
            </span>
          </li>
          <li class="flex gap-3">
            <span class="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground text-xs font-bold rounded-full flex items-center justify-center">
              3
            </span>
            <span class="text-sm text-foreground">
              Tunggu notifikasi pembayaran berhasil
            </span>
          </li>
        </ol>
      </div>

      <!-- Action Buttons -->
      <div class="space-y-3">
        <button
          @click="checkPaymentStatus"
          :disabled="checking"
          class="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl transition-all disabled:opacity-50 active:scale-95"
        >
          <!-- ✅ FIX: Tutup quote yang hilang di :size -->
          <Loader v-if="checking" class="inline animate-spin mr-2" :size="18" />
          {{ checking ? 'Mengecek...' : 'Cek Status Pembayaran' }}
        </button>
        
        <button
          @click="$router.push('/')"
          class="w-full h-12 border-2 border-border hover:bg-muted text-foreground font-semibold rounded-xl transition-all active:scale-95"
        >
          Kembali ke Beranda
        </button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, Loader } from 'lucide-vue-next'
import api from '@/services/api'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(true)
const checking = ref(false)
const order = ref(null)
const timeRemaining = ref(null)

let intervalId = null

const orderId = route.params.orderId

const fetchOrderDetails = async () => {
  loading.value = true
  try {
    // ✅ FIX H-06: Pass email dari orderStore untuk verifikasi kepemilikan order
    const email = orderStore.currentOrder?.customer_email
    const response = await api.orders.get(orderId, email)
    order.value = response
    
    if (response.created_at) {
      const createdAt = new Date(response.created_at)
      const expiresAt = new Date(createdAt.getTime() + 24 * 60 * 60 * 1000)
      const now = new Date()
      timeRemaining.value = Math.max(0, expiresAt - now)
    }
  } catch (err) {
    console.error('Failed to fetch order:', err)
  } finally {
    loading.value = false
  }
}

const checkPaymentStatus = async () => {
  checking.value = true
  try {
    // ✅ FIX H-06: Pass email dari orderStore untuk verifikasi kepemilikan order
    const email = orderStore.currentOrder?.customer_email
    const response = await api.orders.get(orderId, email)
    
    if (response.status === 'success') {
      router.push({ name: 'payment-success', params: { orderId } })
    } else if (response.status === 'failed') {
      alert('Pembayaran gagal atau dibatalkan')
      router.push('/')
    } else {
      alert('Pembayaran masih pending. Silakan selesaikan pembayaran.')
    }
  } catch (err) {
    alert('Gagal mengecek status pembayaran')
  } finally {
    checking.value = false
  }
}

const formatTime = (ms) => {
  const hours = Math.floor(ms / (1000 * 60 * 60))
  const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((ms % (1000 * 60)) / 1000)
  
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

onMounted(() => {
  fetchOrderDetails()
  
  intervalId = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value -= 1000
    } else {
      clearInterval(intervalId)
    }
  }, 1000)
})

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId)
})
</script>

<style scoped>
.pending-icon {
  width: 100px;
  height: 100px;
  background: var(--warning-light);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  margin: 0 auto;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}
</style>