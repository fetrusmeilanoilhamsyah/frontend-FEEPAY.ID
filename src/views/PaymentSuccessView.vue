<template>
  <div class="success-page-wrapper">
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
      <div class="max-w-md w-full">

        <!-- 
          ICON DINAMIS berdasarkan status order:
          - success  → centang hijau
          - failed   → silang merah
          - lainnya  → loading spinner (masih processing)
        -->
        <div class="text-center mb-6">
          <div class="status-icon mx-auto mb-4">

            <!-- Success Icon -->
            <div v-if="order?.status === 'success'" class="success-checkmark">
              <Check :size="48" class="text-white" />
            </div>

            <!-- Failed Icon -->
            <div v-else-if="order?.status === 'failed'" class="failed-icon">
              <X :size="48" class="text-white" />
            </div>

            <!-- Still Processing Icon (polling aktif) -->
            <div v-else class="processing-icon">
              <Loader :size="48" class="text-white animate-spin" />
            </div>

          </div>

          <!-- 
            JUDUL DINAMIS:
            - success    → "Pembayaran Berhasil!"
            - failed     → "Pembayaran Gagal"
            - processing → "Sedang Diproses..."
            - pending    → "Menunggu Verifikasi"
          -->
          <h1 class="text-2xl sm:text-3xl font-black text-dark-950 dark:text-white mb-2">
            {{ pageTitle }}
          </h1>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            {{ pageSubtitle }}
          </p>

          <!-- Info polling aktif (tampil saat masih processing) -->
          <div 
            v-if="isPolling" 
            class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 rounded-full"
          >
            <div class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span class="text-xs font-semibold text-blue-600 dark:text-blue-400">
              Auto-refresh setiap 5 detik...
            </span>
          </div>
        </div>

        <!-- Order Details Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl border border-border p-6 mb-4">
          
          <!-- Loading skeleton -->
          <div v-if="loading" class="space-y-4">
            <div class="h-4 bg-dark-100 dark:bg-dark-800 rounded animate-pulse"></div>
            <div class="h-4 bg-dark-100 dark:bg-dark-800 rounded animate-pulse w-3/4"></div>
            <div class="h-4 bg-dark-100 dark:bg-dark-800 rounded animate-pulse w-1/2"></div>
          </div>

          <!-- Order Info -->
          <div v-else-if="order" class="space-y-4">
            
            <!-- Order ID -->
            <div class="flex items-center justify-between pb-4 border-b border-border">
              <span class="text-sm text-dark-600 dark:text-dark-400">Order ID</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-dark-950 dark:text-white font-mono">
                  {{ order.order_id }}
                </span>
                <button 
                  @click="copyOrderId"
                  class="p-1.5 hover:bg-dark-100 dark:hover:bg-dark-800 rounded transition-colors"
                >
                  <Copy :size="14" class="text-dark-500" />
                </button>
              </div>
            </div>

            <!-- Produk -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-600 dark:text-dark-400">Produk</span>
              <span class="text-sm font-semibold text-dark-950 dark:text-white text-right">
                {{ order.product_name }}
              </span>
            </div>

            <!-- Nomor Tujuan -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-600 dark:text-dark-400">Nomor Tujuan</span>
              <span class="text-sm font-semibold text-dark-950 dark:text-white">
                {{ order.target_number }}
              </span>
            </div>

            <!-- 
              SERIAL NUMBER (hanya tampil kalau sudah ada SN dari Digiflazz)
              SN = kode voucher, token listrik, dll
              Muncul otomatis setelah Digiflazz callback + polling detect
            -->
            <div 
              v-if="order.sn" 
              class="p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-xl"
            >
              <div class="flex items-start gap-3">
                <Key :size="18" class="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs font-semibold text-primary-700 dark:text-primary-300 mb-1">
                    Serial Number / Kode Voucher
                  </p>
                  <p class="text-sm font-mono font-bold text-primary-950 dark:text-primary-100 break-all">
                    {{ order.sn }}
                  </p>
                </div>
                <button 
                  @click="copySN"
                  class="p-2 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded-lg transition-colors"
                >
                  <Copy :size="16" class="text-primary-600 dark:text-primary-400" />
                </button>
              </div>
            </div>

            <!-- Total Bayar -->
            <div class="flex items-center justify-between pt-4 border-t border-border">
              <span class="text-base font-semibold text-dark-700 dark:text-dark-300">Total Bayar</span>
              <span class="text-2xl font-black text-primary-600 dark:text-primary-400">
                Rp {{ formatPrice(order.total_price || 0) }}
              </span>
            </div>

            <!-- 
              STATUS BADGE DINAMIS
              Warna dan teks berubah sesuai status terbaru dari backend
            -->
            <div class="flex items-center justify-center pt-2">
              <div 
                class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border"
                :class="statusBadgeClass"
              >
                <div class="w-2 h-2 rounded-full" :class="statusDotClass"></div>
                <span class="text-xs font-bold" :class="statusTextClass">
                  {{ statusLabel }}
                </span>
              </div>
            </div>

          </div>

          <!-- Error State -->
          <div v-else class="text-center py-8">
            <AlertCircle class="mx-auto mb-3 text-red-500" :size="48" />
            <p class="text-sm text-red-600 dark:text-red-400">Gagal memuat detail order</p>
          </div>

        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="$router.push('/')"
            class="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-xl transition-all"
          >
            Kembali ke Beranda
          </button>
          
          <button
            @click="$router.push('/transactions')"
            class="w-full h-12 border-2 border-border hover:bg-dark-50 dark:hover:bg-dark-800 text-dark-950 dark:text-white font-semibold rounded-xl transition-all"
          >
            Lihat Riwayat Transaksi
          </button>
        </div>

        <!-- CS Button -->
        <div class="mt-6 text-center">
          <button 
            @click="openChat"
            class="inline-flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 font-semibold transition-colors"
          >
            <MessageCircle :size="16" />
            <span>Butuh bantuan? Hubungi Customer Service</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-white dark:bg-dark-900 border border-primary-600 rounded-xl shadow-lg p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-primary-600 flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-dark-800 dark:text-white">{{ toastMessage }}</span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Check, X, Copy, Key, AlertCircle, MessageCircle, Loader } from 'lucide-vue-next'
import api from '@/services/api'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const order = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const isPolling = ref(false)

const orderId = route.params.orderId

// Interval ID untuk polling, disimpan supaya bisa di-clear saat komponen unmount
let pollingInterval = null

// Maksimal polling: 20x × 5 detik = 100 detik (sekitar 1.5 menit)
// Kalau lewat batas ini, polling berhenti otomatis
const MAX_POLL_COUNT = 20
const POLL_INTERVAL_MS = 5000
let pollCount = 0

// ============================================
// COMPUTED: Teks & Style dinamis berdasarkan status
// ============================================

/**
 * Judul halaman berdasarkan status order
 */
const pageTitle = computed(() => {
  switch (order.value?.status) {
    case 'success':    return 'Pembayaran Berhasil!'
    case 'failed':     return 'Pembayaran Gagal'
    case 'processing': return 'Sedang Diproses...'
    default:           return 'Menunggu Verifikasi'
  }
})

/**
 * Subtitle halaman berdasarkan status order
 */
const pageSubtitle = computed(() => {
  switch (order.value?.status) {
    case 'success':    return 'Transaksi Anda telah berhasil diproses'
    case 'failed':     return 'Transaksi gagal. Hubungi CS untuk bantuan.'
    case 'processing': return 'Produk sedang dikirim ke nomor tujuan'
    default:           return 'Menunggu konfirmasi dari admin'
  }
})

/**
 * Label status badge
 */
const statusLabel = computed(() => {
  switch (order.value?.status) {
    case 'success':    return 'Sukses'
    case 'failed':     return 'Gagal'
    case 'processing': return 'Diproses'
    default:           return 'Menunggu'
  }
})

/**
 * CSS class untuk badge container berdasarkan status
 */
const statusBadgeClass = computed(() => {
  switch (order.value?.status) {
    case 'success': return 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800'
    case 'failed':  return 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
    default:        return 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800'
  }
})

/**
 * CSS class untuk dot di dalam badge
 */
const statusDotClass = computed(() => {
  switch (order.value?.status) {
    case 'success': return 'bg-green-600 animate-pulse'
    case 'failed':  return 'bg-red-600'
    default:        return 'bg-yellow-500 animate-pulse'
  }
})

/**
 * CSS class untuk teks badge
 */
const statusTextClass = computed(() => {
  switch (order.value?.status) {
    case 'success': return 'text-green-700 dark:text-green-400'
    case 'failed':  return 'text-red-700 dark:text-red-400'
    default:        return 'text-yellow-700 dark:text-yellow-400'
  }
})

// ============================================
// METHODS
// ============================================

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)

/**
 * Fetch data order dari backend
 * Dipanggil saat pertama load DAN saat polling
 */
const fetchOrderDetails = async () => {
  try {
    const response = await api.orders.get(orderId)
    order.value = response
    return response
  } catch (err) {
    console.error('Failed to fetch order:', err)
    return null
  } finally {
    loading.value = false
  }
}

/**
 * POLLING MECHANISM
 * 
 * Cara kerja:
 * 1. Cek status order setiap 5 detik
 * 2. Kalau status jadi 'success' atau 'failed' → stop polling
 * 3. Kalau sudah 20x polling belum selesai → stop otomatis
 * 
 * Kenapa polling?
 * - Kita gak bisa tau kapan Digiflazz callback masuk
 * - Polling memastikan UI update otomatis tanpa user refresh manual
 * - Max 100 detik polling, setelah itu user bisa cek manual
 */
const startPolling = () => {
  // Jangan start polling kalau sudah final
  if (['success', 'failed'].includes(order.value?.status)) return

  isPolling.value = true
  pollCount = 0

  pollingInterval = setInterval(async () => {
    pollCount++

    // Stop kalau sudah maksimal
    if (pollCount >= MAX_POLL_COUNT) {
      stopPolling()
      return
    }

    const updatedOrder = await fetchOrderDetails()

    // Stop polling kalau status sudah final
    if (updatedOrder && ['success', 'failed'].includes(updatedOrder.status)) {
      stopPolling()
    }
  }, POLL_INTERVAL_MS)
}

const stopPolling = () => {
  isPolling.value = false
  if (pollingInterval) {
    clearInterval(pollingInterval)
    pollingInterval = null
  }
}

const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(order.value.order_id)
    showToastMsg('Order ID disalin')
  } catch { }
}

const copySN = async () => {
  try {
    await navigator.clipboard.writeText(order.value.sn)
    showToastMsg('Serial Number disalin')
  } catch { }
}

const showToastMsg = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 2000)
}

const openChat = () => {
  window.dispatchEvent(new CustomEvent('open-chat'))
}

// ============================================
// LIFECYCLE
// ============================================
onMounted(async () => {
  // Fetch order pertama kali
  await fetchOrderDetails()

  // Start polling kalau status belum final
  startPolling()
})

onUnmounted(() => {
  // PENTING: Hentikan polling saat user pindah halaman
  // Kalau gak dihentikan → memory leak + request terus jalan di background
  stopPolling()
})
</script>

<style scoped>
.success-page-wrapper { /* single root wrapper */ }

/* Success Icon - hijau */
.success-checkmark {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Failed Icon - merah */
.failed-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgb(239, 68, 68) 0%, rgb(220, 38, 38) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Processing Icon - biru */
.processing-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(37, 99, 235) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(59, 130, 246, 0.3);
}

@keyframes scaleIn {
  0% { transform: scale(0); opacity: 0; }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}

.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>