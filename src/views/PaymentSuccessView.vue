<template>
  <div class="success-page-wrapper">
    <div class="min-h-screen bg-background flex items-center justify-center p-4">
      <div class="max-w-md w-full">
        
        <!-- Success Animation -->
        <div class="text-center mb-6">
          <div class="success-icon mx-auto mb-4">
            <div class="success-checkmark">
              <Check :size="48" class="text-white" />
            </div>
          </div>
          
          <h1 class="text-2xl sm:text-3xl font-black text-dark-950 dark:text-white mb-2">
            Pembayaran Berhasil!
          </h1>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Transaksi Anda telah berhasil diproses
          </p>
        </div>

        <!-- Order Details Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl border border-border p-6 mb-4">
          
          <!-- Loading State -->
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
                  title="Copy Order ID"
                >
                  <Copy :size="14" class="text-dark-500 dark:text-dark-400" />
                </button>
              </div>
            </div>

            <!-- Product -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-600 dark:text-dark-400">Produk</span>
              <span class="text-sm font-semibold text-dark-950 dark:text-white text-right">
                {{ order.product_name }}
              </span>
            </div>

            <!-- Target Number -->
            <div class="flex items-center justify-between">
              <span class="text-sm text-dark-600 dark:text-dark-400">Nomor Tujuan</span>
              <span class="text-sm font-semibold text-dark-950 dark:text-white">
                {{ order.target_number }}
              </span>
            </div>

            <!-- Serial Number (if available) -->
            <div v-if="order.sn" class="p-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-xl">
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

            <!-- Amount -->
            <div class="flex items-center justify-between pt-4 border-t border-border">
              <span class="text-base font-semibold text-dark-700 dark:text-dark-300">Total Bayar</span>
              <span class="text-xl font-black text-primary-600 dark:text-primary-400">
                Rp {{ order.amount?.toLocaleString('id-ID') }}
              </span>
            </div>

            <!-- Status Badge -->
            <div class="flex items-center justify-center pt-2">
              <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-full">
                <div class="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                <span class="text-xs font-bold text-green-700 dark:text-green-400">
                  {{ order.status === 'success' ? 'Sukses' : 'Diproses' }}
                </span>
              </div>
            </div>

          </div>

          <!-- Error State -->
          <div v-else class="text-center py-8">
            <AlertCircle class="mx-auto mb-3 text-red-500" :size="48" />
            <p class="text-sm text-red-600 dark:text-red-400">
              Gagal memuat detail order
            </p>
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

        <!-- Help Text -->
        <div class="mt-6 text-center">
          <p class="text-xs text-dark-500 dark:text-dark-400">
            Butuh bantuan? 
            <a href="#" class="text-primary-600 dark:text-primary-400 font-semibold hover:underline">
              Hubungi Customer Service
            </a>
          </p>
        </div>

      </div>
    </div>

    <!-- Toast Notification (inside wrapper) -->
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
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { Check, Copy, Key, AlertCircle } from 'lucide-vue-next'
import api from '@/services/api'

const route = useRoute()

const loading = ref(true)
const order = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const orderId = route.params.orderId

const fetchOrderDetails = async () => {
  loading.value = true
  try {
    console.log('📥 Fetching order:', orderId)
    const response = await api.orders.get(orderId)
    console.log('✅ Order details:', response)
    order.value = response
  } catch (err) {
    console.error('❌ Failed to fetch order:', err)
  } finally {
    loading.value = false
  }
}

const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(order.value.order_id)
    toastMessage.value = 'Order ID disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

const copySN = async () => {
  try {
    await navigator.clipboard.writeText(order.value.sn)
    toastMessage.value = 'Serial Number disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    console.error('Failed to copy:', err)
  }
}

onMounted(() => {
  console.log('🎉 PaymentSuccessView mounted, orderId:', orderId)
  fetchOrderDetails()
})
</script>

<style scoped>
.success-page-wrapper {
  /* Single root wrapper */
}

.success-icon {
  width: 100px;
  height: 100px;
  position: relative;
  animation: scaleIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.success-checkmark {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, rgb(34, 197, 94) 0%, rgb(22, 163, 74) 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 24px rgba(34, 197, 94, 0.3);
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>