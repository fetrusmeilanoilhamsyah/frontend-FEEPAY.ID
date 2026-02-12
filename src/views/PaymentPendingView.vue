<template>
  <div class="min-h-screen bg-stone-50 dark:bg-dark-950 flex items-center justify-center p-4">
    <div class="max-w-md w-full">
      
      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-border text-center">
        <Loader class="animate-spin mx-auto mb-4 text-primary-600" :size="48" />
        <p class="text-sm text-dark-600 dark:text-dark-400">Memuat data pesanan...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-border text-center">
        <AlertCircle class="mx-auto mb-4 text-red-500" :size="48" />
        <h2 class="text-xl font-bold text-dark-950 dark:text-white mb-2">Order Tidak Ditemukan</h2>
        <p class="text-sm text-dark-600 dark:text-dark-400 mb-6">{{ error }}</p>
        <button 
          @click="$router.push('/')"
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>

      <!-- Pending State -->
      <div v-else-if="order" class="space-y-6">
        
        <!-- Status Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-border text-center">
          <!-- Animated Icon -->
          <div class="relative inline-flex mb-6">
            <div class="absolute inset-0 bg-yellow-500/20 rounded-full animate-ping"></div>
            <div class="relative bg-yellow-50 dark:bg-yellow-950/20 p-6 rounded-full">
              <Clock class="text-yellow-600 dark:text-yellow-400" :size="48" />
            </div>
          </div>

          <!-- Status -->
          <div class="mb-4">
            <StatusBadge :status="order.status" />
          </div>

          <h1 class="text-2xl font-bold text-dark-950 dark:text-white mb-2">
            Pembayaran Sedang Diverifikasi
          </h1>
          <p class="text-sm text-dark-600 dark:text-dark-400 mb-6">
            Pesanan Anda akan diproses setelah admin memverifikasi pembayaran
          </p>

          <!-- Estimated Time -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
            <Timer class="text-blue-600 dark:text-blue-400" :size="16" />
            <span class="font-semibold text-blue-700 dark:text-blue-300">
              Estimasi: 5-15 menit
            </span>
          </div>
        </div>

        <!-- Order Details Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-4">
            Detail Pesanan
          </h3>

          <div class="space-y-4">
            <div class="flex justify-between items-start">
              <span class="text-sm text-dark-600 dark:text-dark-400">Order ID</span>
              <div class="text-right">
                <div class="font-mono text-sm font-semibold text-dark-950 dark:text-white">
                  {{ order.order_id }}
                </div>
                <button 
                  @click="copyOrderId"
                  class="text-xs text-primary-600 hover:text-primary-700 font-semibold mt-1"
                >
                  Salin
                </button>
              </div>
            </div>

            <div class="flex justify-between items-start">
              <span class="text-sm text-dark-600 dark:text-dark-400">Produk</span>
              <span class="font-semibold text-dark-950 dark:text-white text-right max-w-[60%]">
                {{ order.product_name }}
              </span>
            </div>

            <div class="flex justify-between items-start">
              <span class="text-sm text-dark-600 dark:text-dark-400">Nomor Tujuan</span>
              <span class="font-mono font-semibold text-dark-950 dark:text-white">
                {{ order.target_number }}
              </span>
            </div>

            <div class="flex justify-between items-start">
              <span class="text-sm text-dark-600 dark:text-dark-400">Email</span>
              <span class="text-sm text-dark-950 dark:text-white">
                {{ order.customer_email }}
              </span>
            </div>

            <div class="pt-4 border-t border-border flex justify-between items-end">
              <span class="text-sm font-semibold text-dark-600 dark:text-dark-400">Total Pembayaran</span>
              <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Rp {{ formatPrice(order.total_price) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div class="flex gap-3">
            <Info class="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" :size="20" />
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-semibold mb-1">Catatan Penting:</p>
              <ul class="space-y-1 text-blue-600 dark:text-blue-400">
                <li>• Anda akan menerima notifikasi via email setelah verifikasi selesai</li>
                <li>• Proses verifikasi dilakukan secara manual oleh admin</li>
                <li>• Jangan melakukan pembayaran ulang</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            @click="checkStatus"
            :disabled="checking"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-dark-900 border border-border hover:border-primary-600 text-dark-950 dark:text-white rounded-lg font-semibold transition-all disabled:opacity-50"
          >
            <RefreshCw :class="{ 'animate-spin': checking }" :size="18" />
            {{ checking ? 'Memeriksa...' : 'Cek Status' }}
          </button>
          <button 
            @click="$router.push('/transactions')"
            class="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
          >
            Lihat Riwayat
          </button>
        </div>

        <!-- Back Home -->
        <div class="text-center">
          <button 
            @click="$router.push('/')"
            class="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors"
          >
            ← Kembali ke Beranda
          </button>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-white dark:bg-dark-900 border border-primary-600 rounded-xl shadow-lg p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-primary-600 flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-dark-950 dark:text-white">{{ toastMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Clock, AlertCircle, Info, Timer, RefreshCw, Check, Loader } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import StatusBadge from '@/components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref(null)
const loading = ref(true)
const error = ref(null)
const checking = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
let autoCheckInterval = null

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const loadOrder = async () => {
  const orderId = route.params.orderId
  
  if (!orderId) {
    error.value = 'Order ID tidak ditemukan'
    loading.value = false
    return
  }

  try {
    const orderData = await orderStore.getOrderById(orderId)
    order.value = orderData

    // Jika status bukan pending/processing, redirect
    if (orderData.status === 'success') {
      router.replace(`/payment/${orderId}/success`)
    } else if (orderData.status === 'failed') {
      router.replace('/transactions')
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data pesanan'
  } finally {
    loading.value = false
  }
}

const checkStatus = async () => {
  if (!order.value) return
  
  checking.value = true
  try {
    const status = await orderStore.checkOrderStatus(order.value.order_id)
    
    if (status === 'success') {
      toastMessage.value = 'Pembayaran berhasil diverifikasi!'
      showToast.value = true
      setTimeout(() => {
        router.push(`/payment/${order.value.order_id}/success`)
      }, 1500)
    } else if (status === 'failed') {
      toastMessage.value = 'Pembayaran ditolak'
      showToast.value = true
      setTimeout(() => {
        router.push('/transactions')
      }, 1500)
    } else {
      toastMessage.value = 'Status masih dalam verifikasi'
      showToast.value = true
      setTimeout(() => showToast.value = false, 2000)
    }
    
    // Update order data
    await loadOrder()
  } catch (err) {
    toastMessage.value = 'Gagal memeriksa status'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } finally {
    checking.value = false
  }
}

const copyOrderId = async () => {
  if (!order.value) return
  
  try {
    await navigator.clipboard.writeText(order.value.order_id)
    toastMessage.value = 'Order ID berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal menyalin Order ID')
  }
}

// Auto-check status every 30 seconds
const startAutoCheck = () => {
  autoCheckInterval = setInterval(() => {
    checkStatus()
  }, 30000) // 30 seconds
}

const stopAutoCheck = () => {
  if (autoCheckInterval) {
    clearInterval(autoCheckInterval)
    autoCheckInterval = null
  }
}

onMounted(() => {
  loadOrder()
  startAutoCheck()
})

onUnmounted(() => {
  stopAutoCheck()
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}

.animate-ping {
  animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>