<template>
  <div class="min-h-screen bg-stone-50 dark:bg-dark-950 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      
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

      <!-- Payment Form -->
      <div v-else-if="order" class="space-y-6">
        
        <!-- Header -->
        <div class="mb-6">
          <button 
            @click="$router.push('/')"
            class="inline-flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold mb-4 transition-colors"
          >
            <ChevronLeft :size="16" />
            Kembali
          </button>
          <h1 class="text-3xl font-bold text-dark-950 dark:text-white">
            Pembayaran
          </h1>
        </div>

        <!-- Order Summary Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-dark-950 dark:text-white">
              Ringkasan Pesanan
            </h3>
            <StatusBadge :status="order.status" />
          </div>

          <div class="space-y-3">
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

            <div class="pt-4 border-t border-border flex justify-between items-end">
              <span class="text-sm font-semibold text-dark-600 dark:text-dark-400">Total Pembayaran</span>
              <span class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Rp {{ formatPrice(order.total_price) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Payment Method Selection -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-4">
            Metode Pembayaran
          </h3>

          <div class="grid grid-cols-2 gap-4">
            <button 
              @click="paymentType = 'qris'" 
              type="button" 
              class="p-4 border-2 rounded-xl transition-all" 
              :class="paymentType === 'qris' 
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20' 
                : 'border-border hover:border-primary-300 dark:hover:border-primary-700'"
            >
              <QrCode class="mx-auto mb-2 text-primary-600 dark:text-primary-400" :size="32" />
              <div class="text-sm font-semibold text-dark-950 dark:text-white">QRIS</div>
            </button>

            <button 
              @click="paymentType = 'bank_transfer'" 
              type="button" 
              class="p-4 border-2 rounded-xl transition-all" 
              :class="paymentType === 'bank_transfer' 
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20' 
                : 'border-border hover:border-primary-300 dark:hover:border-primary-700'"
            >
              <Building2 class="mx-auto mb-2 text-primary-600 dark:text-primary-400" :size="32" />
              <div class="text-sm font-semibold text-dark-950 dark:text-white">Transfer Bank</div>
            </button>
          </div>
        </div>

        <!-- Payment Details Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          
          <!-- QRIS -->
          <div v-if="paymentType === 'qris'" class="text-center">
            <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-4">
              Scan QR Code
            </h3>
            <div class="mx-auto w-64 h-64 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-xl flex items-center justify-center border-2 border-primary-300 dark:border-primary-700 overflow-hidden mb-4">
              <img src="/qris.png" alt="QRIS Payment" class="w-full h-full object-contain" />
            </div>
            <p class="text-sm text-dark-600 dark:text-dark-400">
              Scan QR Code menggunakan aplikasi pembayaran Anda
            </p>
          </div>

          <!-- Bank Transfer -->
          <div v-else>
            <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-4">
              Transfer ke Rekening Berikut
            </h3>
            <div class="space-y-3">
              <div class="flex justify-between items-center text-sm">
                <span class="text-dark-600 dark:text-dark-400">Bank</span>
                <span class="font-semibold text-dark-950 dark:text-white">{{ bankInfo.name }}</span>
              </div>
              <div class="bg-dark-50 dark:bg-dark-950 p-4 rounded-lg border border-border">
                <div class="flex justify-between items-center gap-3">
                  <div class="flex-1">
                    <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">Nomor Rekening</div>
                    <div class="font-mono text-lg font-bold text-dark-950 dark:text-white">
                      {{ bankInfo.number }}
                    </div>
                  </div>
                  <button 
                    @click="copyBankNumber"
                    type="button" 
                    class="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <Copy :size="16" />
                    Salin
                  </button>
                </div>
              </div>
              <div class="flex justify-between items-center text-sm">
                <span class="text-dark-600 dark:text-dark-400">Atas Nama</span>
                <span class="font-semibold text-dark-950 dark:text-white">{{ bankInfo.accountName }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Upload Proof Form -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          <form @submit.prevent="handleSubmitPayment">
            <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-4">
              Upload Bukti Pembayaran
            </h3>

            <div 
              @click="triggerFileInput" 
              class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all mb-4"
              :class="uploadedFile 
                ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20' 
                : 'border-border hover:border-primary-600 bg-dark-50/50 dark:bg-dark-800/50'"
            >
              <Upload class="mx-auto mb-3 text-dark-400" :size="40" />
              <p class="text-sm font-semibold text-dark-950 dark:text-white mb-1">
                {{ uploadedFile ? uploadedFile.name : 'Klik untuk upload bukti transfer' }}
              </p>
              <p class="text-xs text-dark-500 dark:text-dark-400">
                Format: JPG, PNG, PDF (Max 5MB)
              </p>
            </div>
            <input 
              ref="fileInput" 
              type="file" 
              accept="image/*,application/pdf" 
              class="hidden" 
              @change="handleFileSelect" 
              required 
            />

            <button 
              type="submit" 
              :disabled="submitting || !uploadedFile"
              class="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader v-if="submitting" class="animate-spin" :size="18" />
              <span>{{ submitting ? 'Memproses...' : 'Konfirmasi Pembayaran' }}</span>
            </button>
          </form>
        </div>

        <!-- Info Card -->
        <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div class="flex gap-3">
            <Info class="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" :size="20" />
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-semibold mb-1">Petunjuk Pembayaran:</p>
              <ul class="space-y-1 text-blue-600 dark:text-blue-400">
                <li>• Transfer sesuai nominal yang tertera</li>
                <li>• Upload bukti transfer yang jelas</li>
                <li>• Pembayaran akan diverifikasi dalam 5-15 menit</li>
                <li>• Jangan tutup halaman ini sebelum upload bukti</li>
              </ul>
            </div>
          </div>
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
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Loader, AlertCircle, Info, QrCode, Building2, Upload, Copy, Check } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import StatusBadge from '@/components/StatusBadge.vue'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const order = ref(null)
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)
const paymentType = ref('qris')
const uploadedFile = ref(null)
const fileInput = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const bankInfo = {
  name: import.meta.env.VITE_BANK_NAME || 'BCA',
  number: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '3000944636',
  accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'FETRUS MEILANO ILHAMSYAH'
}

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

    // Jika sudah ada payment atau status bukan pending, redirect
    if (orderData.status === 'processing' || orderData.status === 'success') {
      router.replace(`/payment/${orderId}/pending`)
    }
  } catch (err) {
    error.value = err.message || 'Gagal memuat data pesanan'
  } finally {
    loading.value = false
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

const copyBankNumber = async () => {
  try {
    await navigator.clipboard.writeText(bankInfo.number)
    toastMessage.value = 'Nomor rekening berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal menyalin nomor rekening')
  }
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file) {
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal 5MB')
      return
    }
    uploadedFile.value = file
  }
}

const handleSubmitPayment = async () => {
  if (!uploadedFile.value || !order.value) {
    alert('Silakan upload bukti pembayaran terlebih dahulu')
    return
  }
  
  submitting.value = true
  
  try {
    const fd = new FormData()
    fd.append('order_id', order.value.order_id)
    fd.append('type', paymentType.value)
    fd.append('amount', order.value.total_price)
    fd.append('proof', uploadedFile.value)
    
    await orderStore.submitPayment(order.value.order_id, fd)
    
    // Redirect to pending page
    router.push(`/payment/${order.value.order_id}/pending`)
  } catch (err) {
    alert(err.message || 'Gagal mengirim bukti pembayaran. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
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
</style>