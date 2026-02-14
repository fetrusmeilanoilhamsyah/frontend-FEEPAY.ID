<template>
  <div class="min-h-screen bg-stone-50 dark:bg-dark-950 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-dark-950 dark:text-white mb-2">
          Konversi USDT
        </h1>
        <p class="text-sm text-dark-600 dark:text-dark-400">
          Tukar USDT ke Rupiah dengan mudah
        </p>
      </div>

      <!-- USDT Calculator Card -->
      <div class="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 mb-8">

        <!-- Current Rate -->
        <div class="flex items-center justify-between mb-6">
          <div class="flex items-center gap-3">
            <div class="p-3 bg-emerald-600 rounded-xl">
              <TrendingUp class="text-white" :size="24" />
            </div>
            <div>
              <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Rate Saat Ini</div>
              <div class="text-2xl font-bold text-emerald-900 dark:text-emerald-300">
                1 USDT = Rp {{ formatPrice(currentRate) }}
              </div>
            </div>
          </div>
          <button
            @click="refreshRate"
            :disabled="loadingRate"
            class="p-2 rounded-lg hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-colors"
          >
            <RefreshCw :class="{ 'animate-spin': loadingRate }" class="text-emerald-600" :size="20" />
          </button>
        </div>

        <!-- Calculator -->
        <div class="bg-white dark:bg-dark-950 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
          <div class="space-y-4">

            <!-- USDT Input -->
            <div>
              <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Jumlah USDT
              </label>
              <div class="relative">
                <input
                  v-model.number="usdtAmount"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  class="w-full h-14 px-4 bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-xl text-dark-950 dark:text-white font-bold text-xl outline-none focus:border-emerald-600 transition-colors"
                />
                <div class="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-dark-500">
                  USDT
                </div>
              </div>
            </div>

            <!-- Arrow -->
            <div class="flex justify-center">
              <div class="p-2 bg-emerald-100 dark:bg-emerald-950/30 rounded-full">
                <ArrowDownUp class="text-emerald-600" :size="20" />
              </div>
            </div>

            <!-- IDR Output -->
            <div>
              <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Estimasi Rupiah
              </label>
              <div class="h-14 px-4 bg-emerald-50 dark:bg-emerald-950/20 border-2 border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
                <div class="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                  Rp {{ formatPrice(estimatedIDR) }}
                </div>
                <Coins class="text-emerald-600" :size="24" />
              </div>
              <p class="mt-2 text-xs text-dark-500 dark:text-dark-400">
                * Estimasi dapat berubah saat verifikasi
              </p>
            </div>

            <!-- Submit Button -->
            <button
              @click="showConversionForm = true"
              :disabled="!usdtAmount || usdtAmount <= 0"
              class="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send :size="18" />
              Ajukan Konversi
            </button>

          </div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div class="mb-6 overflow-x-auto">
        <div class="inline-flex bg-white dark:bg-dark-900 p-1 rounded-xl border border-border shadow-sm">
          <button
            v-for="filter in filters"
            :key="filter.value"
            @click="activeFilter = filter.value"
            class="px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap"
            :class="activeFilter === filter.value
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-dark-600 dark:text-dark-400 hover:bg-dark-50 dark:hover:bg-dark-800'"
          >
            {{ filter.label }}
            <span
              v-if="filter.count > 0"
              class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full"
              :class="activeFilter === filter.value
                ? 'bg-white/20'
                : 'bg-dark-100 dark:bg-dark-800'"
            >
              {{ filter.count }}
            </span>
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="usdtHistory.length === 0" class="text-center py-16">
        <Coins class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
        <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
          Belum ada konversi USDT
        </h3>
        <p class="text-sm text-dark-600 dark:text-dark-400 mb-6">
          Mulai konversi USDT Anda ke Rupiah sekarang
        </p>
      </div>

      <!-- Conversions List -->
      <div v-else class="space-y-4">
        <div
          v-for="conversion in filteredConversions"
          :key="conversion.id"
          class="bg-white dark:bg-dark-900 rounded-xl p-6 border border-border hover:border-emerald-600 dark:hover:border-emerald-600 transition-all cursor-pointer group"
          @click="viewConversionDetail(conversion)"
        >
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-semibold text-dark-500 dark:text-dark-400">
                  {{ formatDate(conversion.created_at) }}
                </span>
                <span
                  class="px-2 py-1 rounded-full text-xs font-semibold"
                  :class="{
                    'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400': conversion.status === 'pending',
                    'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400': conversion.status === 'approved',
                    'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400': conversion.status === 'rejected'
                  }"
                >
                  {{ statusLabel(conversion.status) }}
                </span>
              </div>
              <h3 class="font-bold text-xl text-dark-950 dark:text-white group-hover:text-emerald-600 transition-colors">
                {{ conversion.amount }} USDT
              </h3>
            </div>
            <ChevronRight class="text-dark-400 dark:text-dark-600 group-hover:text-emerald-600 transition-colors flex-shrink-0" :size="20" />
          </div>

          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">TRX ID</div>
              <div class="font-mono text-xs font-semibold text-dark-950 dark:text-white truncate">
                {{ conversion.trx_id || 'N/A' }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">IDR Diterima</div>
              <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Rp {{ formatPrice(conversion.idr_received || 0) }}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Conversion Form Modal -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showConversionForm" class="fixed inset-0 z-50 overflow-y-auto" @click="showConversionForm = false">
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="flex min-h-full items-center justify-center p-4">
            <div
              class="relative bg-white dark:bg-dark-950 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-border"
              @click.stop
            >
              <button
                @click="showConversionForm = false"
                class="absolute top-6 right-6 p-2 rounded-lg text-dark-400 hover:text-emerald-600 transition-all"
              >
                <X :size="20" />
              </button>

              <h2 class="text-2xl font-bold text-dark-950 dark:text-white mb-6">
                Form Konversi USDT
              </h2>

              <form @submit.prevent="handleSubmitConversion" class="space-y-4">

                <!-- Summary -->
                <div class="bg-emerald-50 dark:bg-emerald-950/20 rounded-xl p-4 border border-emerald-200 dark:border-emerald-800">
                  <div class="flex justify-between items-center mb-2">
                    <span class="text-sm text-dark-600 dark:text-dark-400">USDT</span>
                    <span class="font-bold text-dark-950 dark:text-white">{{ usdtAmount }} USDT</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-sm text-dark-600 dark:text-dark-400">Estimasi IDR</span>
                    <span class="text-xl font-bold text-emerald-600">Rp {{ formatPrice(estimatedIDR) }}</span>
                  </div>
                </div>

                <!-- Bank Selection -->
                <div>
                  <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                    Rekening Tujuan
                  </label>
                  <select
                    v-model="conversionForm.bank"
                    class="w-full h-12 px-4 bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-xl text-dark-950 dark:text-white font-medium outline-none focus:border-emerald-600 transition-colors"
                    required
                  >
                    <option value="">Pilih Bank</option>
                    <option value="BCA">BCA</option>
                    <option value="BRI">BRI</option>
                    <option value="BNI">BNI</option>
                    <option value="Mandiri">Mandiri</option>
                    <option value="BSI">BSI</option>
                  </select>
                </div>

                <!-- Account Number -->
                <div>
                  <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                    Nomor Rekening
                  </label>
                  <input
                    v-model="conversionForm.accountNumber"
                    type="text"
                    placeholder="1234567890"
                    class="w-full h-12 px-4 bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-xl text-dark-950 dark:text-white font-mono outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                </div>

                <!-- Account Name -->
                <div>
                  <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                    Atas Nama
                  </label>
                  <input
                    v-model="conversionForm.accountName"
                    type="text"
                    placeholder="Nama sesuai rekening"
                    class="w-full h-12 px-4 bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-xl text-dark-950 dark:text-white font-medium outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                </div>

                <!-- Wallet Address — FIX: dari .env bukan hardcode -->
                <div>
                  <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                    Wallet Address (TRC20)
                  </label>
                  <div class="bg-emerald-50 dark:bg-emerald-950/20 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                    <div class="text-xs text-emerald-700 dark:text-emerald-400 mb-1">Kirim USDT ke:</div>
                    <div class="flex items-center gap-2">
                      <div class="font-mono text-xs text-dark-950 dark:text-white flex-1 break-all">
                        {{ walletAddress }}
                      </div>
                      <button
                        type="button"
                        @click="copyWallet"
                        class="px-2 py-1 bg-emerald-600 text-white rounded text-xs font-semibold"
                      >
                        COPY
                      </button>
                    </div>
                  </div>
                </div>

                <!-- TRX ID -->
                <div>
                  <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                    Transaction ID (TRX)
                  </label>
                  <input
                    v-model="conversionForm.trxId"
                    type="text"
                    placeholder="Paste TRX ID dari blockchain"
                    class="w-full h-12 px-4 bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-xl text-dark-950 dark:text-white font-mono text-sm outline-none focus:border-emerald-600 transition-colors"
                    required
                  />
                </div>

                <!-- Upload Proof -->
                <div>
                  <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                    Bukti Transfer
                  </label>
                  <div
                    @click="$refs.fileInput.click()"
                    class="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-emerald-600 transition-colors"
                  >
                    <Upload class="mx-auto mb-2 text-dark-400" :size="32" />
                    <p class="text-sm font-medium text-dark-950 dark:text-white">
                      {{ uploadedFile ? uploadedFile.name : 'Upload screenshot TX' }}
                    </p>
                    <p class="text-xs text-dark-500 mt-1">JPG, PNG (Max 5MB)</p>
                  </div>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileUpload"
                    required
                  />
                </div>

                <!-- Submit -->
                <button
                  type="submit"
                  :disabled="submitting"
                  class="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors disabled:opacity-50"
                >
                  <Loader v-if="submitting" class="animate-spin inline mr-2" :size="18" />
                  {{ submitting ? 'Memproses...' : 'Kirim Pengajuan' }}
                </button>

              </form>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-white dark:bg-dark-900 border border-emerald-600 rounded-xl shadow-lg p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-emerald-600 flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-dark-950 dark:text-white">{{ toastMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Coins, TrendingUp, RefreshCw, ArrowDownUp, Send, ChevronRight, X, Upload, Loader, Check } from 'lucide-vue-next'

// FIX: wallet address dari .env bukan hardcode
const walletAddress = import.meta.env.VITE_WALLET_TRC20 || 'TSetWalletAddressInENV'

const currentRate = ref(16000)
const loadingRate = ref(false)
const usdtAmount = ref(0)
const activeFilter = ref('all')
const usdtHistory = ref([])
const showConversionForm = ref(false)
const uploadedFile = ref(null)
const submitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const conversionForm = ref({
  bank: '',
  accountNumber: '',
  accountName: '',
  trxId: ''
})

const estimatedIDR = computed(() => {
  return Math.floor(usdtAmount.value * currentRate.value)
})

const filters = computed(() => [
  { value: 'all', label: 'Semua', count: usdtHistory.value.length },
  { value: 'pending', label: 'Pending', count: usdtHistory.value.filter(c => c.status === 'pending').length },
  { value: 'approved', label: 'Disetujui', count: usdtHistory.value.filter(c => c.status === 'approved').length },
  { value: 'rejected', label: 'Ditolak', count: usdtHistory.value.filter(c => c.status === 'rejected').length }
])

const filteredConversions = computed(() => {
  if (activeFilter.value === 'all') return usdtHistory.value
  return usdtHistory.value.filter(c => c.status === activeFilter.value)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}

const statusLabel = (status) => {
  const labels = {
    pending: 'Menunggu',
    approved: 'Disetujui',
    rejected: 'Ditolak'
  }
  return labels[status] || status
}

const refreshRate = () => {
  loadingRate.value = true
  setTimeout(() => {
    loadingRate.value = false
    toastMessage.value = 'Rate berhasil diperbarui'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  }, 1000)
}

const copyWallet = async () => {
  try {
    await navigator.clipboard.writeText(walletAddress)
    toastMessage.value = 'Wallet address berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal menyalin')
  }
}

const handleFileUpload = (e) => {
  uploadedFile.value = e.target.files[0]
}

const handleSubmitConversion = () => {
  submitting.value = true
  setTimeout(() => {
    submitting.value = false
    showConversionForm.value = false
    toastMessage.value = 'Pengajuan berhasil dikirim!'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  }, 2000)
}

const viewConversionDetail = (conversion) => {
  // TODO: Show detail modal
}
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
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