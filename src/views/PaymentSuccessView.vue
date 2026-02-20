<template>
  <div class="success-page-wrapper">
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
      <div class="max-w-md w-full">

        <!-- Icon Dinamis -->
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

            <!-- Still Processing Icon -->
            <div v-else class="processing-icon">
              <Loader :size="48" class="text-white animate-spin" />
            </div>

          </div>

          <!-- Judul Dinamis -->
          <h1 class="text-2xl sm:text-3xl font-black text-foreground mb-2">
            {{ pageTitle }}
          </h1>
          <p class="text-sm text-muted-foreground">
            {{ pageSubtitle }}
          </p>

          <!-- Info polling -->
          <div 
            v-if="isPolling" 
            class="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-info-light border border-info/20 rounded-full"
          >
            <div class="w-2 h-2 bg-info rounded-full animate-pulse"></div>
            <span class="text-xs font-semibold text-info">
              Auto-refresh setiap 5 detik...
            </span>
          </div>
        </div>

        <!-- Order Details Card -->
        <div class="bg-card rounded-2xl border border-border p-6 mb-4">
          
          <!-- Loading skeleton -->
          <div v-if="loading" class="space-y-4">
            <div class="h-4 bg-muted rounded animate-pulse"></div>
            <div class="h-4 bg-muted rounded animate-pulse w-3/4"></div>
            <div class="h-4 bg-muted rounded animate-pulse w-1/2"></div>
          </div>

          <!-- Order Info -->
          <div v-else-if="order" class="space-y-4">
            
            <!-- Order ID -->
            <div class="flex items-center justify-between pb-4 border-b border-border">
              <span class="text-sm text-muted-foreground">Order ID</span>
              <div class="flex items-center gap-2">
                <span class="text-sm font-bold text-foreground font-mono">
                  {{ order.order_id }}
                </span>
                <button 
                  @click="copyOrderId"
                  class="p-1.5 hover:bg-muted rounded transition-colors"
                >
                  <Copy :size="14" class="text-muted-foreground" />
                </button>
              </div>
            </div>

            <!-- Produk -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Produk</span>
              <span class="text-sm font-semibold text-foreground text-right">
                {{ order.product_name }}
              </span>
            </div>

            <!-- Nomor Tujuan -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-muted-foreground">Nomor Tujuan</span>
              <span class="text-sm font-semibold text-foreground font-mono">
                {{ order.target_number }}
              </span>
            </div>

            <!-- Serial Number -->
            <div 
              v-if="order.sn" 
              class="p-4 bg-success-light border border-success/20 rounded-xl"
            >
              <div class="flex items-start gap-3">
                <Key :size="18" class="text-success flex-shrink-0 mt-0.5" />
                <div class="flex-1">
                  <p class="text-xs font-semibold text-success mb-1">
                    Serial Number / Kode Voucher
                  </p>
                  <p class="text-sm font-mono font-bold text-success break-all">
                    {{ order.sn }}
                  </p>
                </div>
                <button 
                  @click="copySN"
                  class="p-2 hover:bg-success/10 rounded-lg transition-colors"
                >
                  <Copy :size="16" class="text-success" />
                </button>
              </div>
            </div>

            <!-- Total Bayar -->
            <div class="flex items-center justify-between pt-4 border-t border-border">
              <span class="text-base font-semibold text-foreground">Total Bayar</span>
              <span class="text-2xl font-black text-primary">
                Rp {{ formatPrice(order.total_price || 0) }}
              </span>
            </div>

            <!-- Status Badge Dinamis -->
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
            <AlertCircle class="mx-auto mb-3 text-error" :size="48" />
            <p class="text-sm text-error">Gagal memuat detail order</p>
          </div>

        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
          <button
            @click="$router.push('/')"
            class="w-full h-12 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl transition-all active:scale-95"
          >
            Kembali ke Beranda
          </button>
          
          <button
            @click="$router.push('/transactions')"
            class="w-full h-12 border-2 border-border hover:bg-muted text-foreground font-semibold rounded-xl transition-all active:scale-95"
          >
            Lihat Riwayat Transaksi
          </button>
        </div>

        <!-- CS Button -->
        <div class="mt-6 text-center">
          <button 
            @click="openChat"
            class="inline-flex items-center gap-2 text-sm text-primary hover:text-primary-hover font-semibold transition-colors"
          >
            <MessageCircle :size="16" />
            <span>Butuh bantuan? Hubungi Customer Service</span>
          </button>
        </div>

      </div>
    </div>

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-card border border-primary rounded-xl shadow-lg p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-primary flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-foreground">{{ toastMessage }}</span>
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
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading = ref(true)
const order = ref(null)
const showToast = ref(false)
const toastMessage = ref('')
const isPolling = ref(false)

const orderId = route.params.orderId

let pollingInterval = null
const MAX_POLL_COUNT = 20
const POLL_INTERVAL_MS = 5000
let pollCount = 0

// Computed
const pageTitle = computed(() => {
  switch (order.value?.status) {
    case 'success':    return 'Pembayaran Berhasil!'
    case 'failed':     return 'Pembayaran Gagal'
    case 'processing': return 'Sedang Diproses...'
    default:           return 'Menunggu Verifikasi'
  }
})

const pageSubtitle = computed(() => {
  switch (order.value?.status) {
    case 'success':    return 'Transaksi Anda telah berhasil diproses'
    case 'failed':     return 'Transaksi gagal. Hubungi CS untuk bantuan.'
    case 'processing': return 'Produk sedang dikirim ke nomor tujuan'
    default:           return 'Menunggu konfirmasi dari admin'
  }
})

const statusLabel = computed(() => {
  switch (order.value?.status) {
    case 'success':    return 'Sukses'
    case 'failed':     return 'Gagal'
    case 'processing': return 'Diproses'
    default:           return 'Menunggu'
  }
})

const statusBadgeClass = computed(() => {
  switch (order.value?.status) {
    case 'success': return 'bg-success-light border-success/20'
    case 'failed':  return 'bg-error-light border-error/20'
    default:        return 'bg-warning-light border-warning/20'
  }
})

const statusDotClass = computed(() => {
  switch (order.value?.status) {
    case 'success': return 'bg-success animate-pulse'
    case 'failed':  return 'bg-error'
    default:        return 'bg-warning animate-pulse'
  }
})

const statusTextClass = computed(() => {
  switch (order.value?.status) {
    case 'success': return 'text-success'
    case 'failed':  return 'text-error'
    default:        return 'text-warning'
  }
})

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)

const fetchOrderDetails = async () => {
  try {
    // FIX: Ambil email dari orderStore, fallback ke localStorage
    const email = orderStore.currentOrder?.customer_email 
      || localStorage.getItem(`order_email_${orderId}`) 
      || null
    const response = await api.orders.get(orderId, email)
    order.value = response
    return response
  } catch (err) {
    console.error('Failed to fetch order:', err)
    return null
  } finally {
    loading.value = false
  }
}

const startPolling = () => {
  if (['success', 'failed'].includes(order.value?.status)) return

  isPolling.value = true
  pollCount = 0

  pollingInterval = setInterval(async () => {
    pollCount++

    if (pollCount >= MAX_POLL_COUNT) {
      stopPolling()
      return
    }

    const updatedOrder = await fetchOrderDetails()

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

onMounted(async () => {
  await fetchOrderDetails()
  startPolling()
})

onUnmounted(() => {
  stopPolling()
})
</script>

<style scoped>
.success-page-wrapper { /* single root wrapper */ }

/* FIX: Semua icon di-center dengan margin auto */
.success-checkmark,
.failed-icon,
.processing-icon {
  margin: 0 auto;
}

.success-checkmark {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.3);
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.failed-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(239, 68, 68, 0.3);
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.processing-icon {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
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