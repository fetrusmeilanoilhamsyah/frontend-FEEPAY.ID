<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-dark-950 dark:to-dark-900 flex items-center justify-center p-4">
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

      <!-- Success State -->
      <div v-else-if="order" class="space-y-6">
        
        <!-- Success Card with Animation -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-green-200 dark:border-green-800 text-center relative overflow-hidden">
          
          <!-- Confetti Background -->
          <div class="absolute inset-0 pointer-events-none">
            <div v-for="i in 20" :key="i" 
              class="absolute w-2 h-2 bg-green-500 rounded-full opacity-50"
              :style="{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }"
            ></div>
          </div>

          <!-- Success Icon with Animation -->
          <div class="relative inline-flex mb-6">
            <div class="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
            <div class="relative bg-green-50 dark:bg-green-950/20 p-6 rounded-full success-icon">
              <CheckCircle2 class="text-green-600 dark:text-green-400" :size="64" />
            </div>
          </div>

          <!-- Status Badge -->
          <div class="mb-4">
            <StatusBadge :status="order.status" />
          </div>

          <!-- Title -->
          <h1 class="text-3xl font-bold text-dark-950 dark:text-white mb-2">
            Transaksi Berhasil!
          </h1>
          <p class="text-sm text-dark-600 dark:text-dark-400 mb-6">
            Pesanan Anda telah diproses dan akan segera aktif
          </p>

          <!-- Email Notification Info -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm">
            <Mail class="text-blue-600 dark:text-blue-400" :size="16" />
            <span class="text-blue-700 dark:text-blue-300">
              Detail transaksi telah dikirim ke email
            </span>
          </div>
        </div>

        <!-- Order Details Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-4 flex items-center gap-2">
            <FileText :size="20" />
            Detail Transaksi
          </h3>

          <div class="space-y-4">
            <div class="flex justify-between items-start">
              <span class="text-sm text-dark-600 dark:text-dark-400">Order ID</span>
              <div class="text-right">
                <div class="font-mono text-sm font-semibold text-dark-950 dark:text-white">
                  {{ order.order_id }}
                </div>
                <button 
                  @click="copyText(order.order_id, 'Order ID')"
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
              <div class="text-right">
                <div class="font-mono font-semibold text-dark-950 dark:text-white">
                  {{ order.target_number }}
                </div>
                <button 
                  @click="copyText(order.target_number, 'Nomor tujuan')"
                  class="text-xs text-primary-600 hover:text-primary-700 font-semibold mt-1"
                >
                  Salin
                </button>
              </div>
            </div>

            <!-- Serial Number (SN) -->
            <div v-if="order.sn && order.sn !== '-'" class="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div class="flex items-start justify-between gap-3">
                <div class="flex-1">
                  <div class="text-xs font-semibold text-green-700 dark:text-green-400 mb-1">
                    Serial Number (SN)
                  </div>
                  <div class="font-mono text-sm font-bold text-green-900 dark:text-green-300 break-all">
                    {{ order.sn }}
                  </div>
                </div>
                <button 
                  @click="copyText(order.sn, 'Serial Number')"
                  class="flex-shrink-0 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
                >
                  <Copy :size="14" />
                  Salin
                </button>
              </div>
            </div>

            <div class="flex justify-between items-start">
              <span class="text-sm text-dark-600 dark:text-dark-400">Tanggal</span>
              <span class="text-sm text-dark-950 dark:text-white text-right">
                {{ formatDate(order.created_at) }}
              </span>
            </div>

            <div class="pt-4 border-t border-border flex justify-between items-end">
              <span class="text-sm font-semibold text-dark-600 dark:text-dark-400">Total Pembayaran</span>
              <span class="text-2xl font-bold text-green-600 dark:text-green-400">
                Rp {{ formatPrice(order.total_price) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Info Card -->
        <div class="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
          <div class="flex gap-3">
            <Info class="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" :size="20" />
            <div class="text-sm text-green-700 dark:text-green-300">
              <p class="font-semibold mb-1">Informasi Penting:</p>
              <ul class="space-y-1 text-green-600 dark:text-green-400">
                <li>• Produk akan aktif secara otomatis dalam 1-5 menit</li>
                <li v-if="order.sn && order.sn !== '-'">• Simpan Serial Number (SN) untuk keperluan Anda</li>
                <li>• Email konfirmasi telah dikirim ke {{ order.customer_email }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-col sm:flex-row gap-3">
          <button 
            @click="$router.push('/')"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-dark-900 border border-border hover:border-primary-600 text-dark-950 dark:text-white rounded-lg font-semibold transition-all"
          >
            <Home :size="18" />
            Beranda
          </button>
          <button 
            @click="$router.push('/transactions')"
            class="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
          >
            <History :size="18" />
            Lihat Riwayat
          </button>
        </div>

        <!-- Repeat Order -->
        <div class="text-center">
          <button 
            @click="repeatOrder"
            class="text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold transition-colors inline-flex items-center gap-1"
          >
            <RotateCcw :size="14" />
            Pesan Produk yang Sama
          </button>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-white dark:bg-dark-900 border border-green-600 rounded-xl shadow-lg p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-green-600 flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-dark-950 dark:text-white">{{ toastMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { CheckCircle2, AlertCircle, Info, Mail, FileText, Copy, Home, History, RotateCcw, Check, Loader } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import StatusBadge from '@/components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref(null)
const loading = ref(true)
const error = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
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

    // Jika status bukan success, redirect
    if (orderData.status !== 'success') {
      router.replace(`/payment/${orderId}/pending`)
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data pesanan'
  } finally {
    loading.value = false
  }
}

const copyText = async (text, label) => {
  try {
    await navigator.clipboard.writeText(text)
    toastMessage.value = `${label} berhasil disalin`
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert(`Gagal menyalin ${label}`)
  }
}

const repeatOrder = () => {
  router.push('/')
  // TODO: Auto-select product yang sama
}

onMounted(() => {
  loadOrder()
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

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

.success-icon {
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>