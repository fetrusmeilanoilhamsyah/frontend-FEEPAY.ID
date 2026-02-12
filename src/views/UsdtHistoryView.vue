<template>
  <div class="min-h-screen bg-stone-50 dark:bg-dark-950 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-dark-950 dark:text-white mb-2">
          Riwayat Konversi USDT
        </h1>
        <p class="text-sm text-dark-600 dark:text-dark-400">
          Pantau status konversi USDT ke Rupiah Anda
        </p>
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

      <!-- Current Rate Info -->
      <div class="mb-6 bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="p-2 bg-emerald-600 rounded-lg">
              <TrendingUp class="text-white" :size="20" />
            </div>
            <div>
              <div class="text-xs font-semibold text-emerald-700 dark:text-emerald-400">Rate Saat Ini</div>
              <div class="text-lg font-bold text-emerald-900 dark:text-emerald-300">
                1 USDT = Rp {{ formatPrice(currentRate) }}
              </div>
            </div>
          </div>
          <button 
            @click="$router.push('/')"
            class="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-semibold transition-colors"
          >
            Konversi USDT
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
        <button 
          @click="$router.push('/')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
        >
          <Coins :size="18" />
          Konversi Sekarang
        </button>
      </div>

      <!-- Conversions List -->
      <div v-else class="space-y-4">
        <div 
          v-for="conversion in filteredConversions" 
          :key="conversion.trx_id"
          class="bg-white dark:bg-dark-900 rounded-xl p-6 border border-border hover:border-emerald-600 dark:hover:border-emerald-600 transition-all cursor-pointer group"
          @click="viewConversionDetail(conversion)"
        >
          <!-- Header -->
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
              <h3 class="font-bold text-lg text-dark-950 dark:text-white group-hover:text-emerald-600 transition-colors">
                {{ conversion.amount }} USDT
              </h3>
              <div class="text-xs text-dark-500 dark:text-dark-400 mt-1">
                Network: {{ conversion.network }}
              </div>
            </div>
            <ChevronRight class="text-dark-400 dark:text-dark-600 group-hover:text-emerald-600 transition-colors flex-shrink-0" :size="20" />
          </div>

          <!-- Details Grid -->
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">TRX ID</div>
              <div class="font-mono text-xs font-semibold text-dark-950 dark:text-white truncate">
                {{ conversion.trx_id }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">IDR Diterima</div>
              <div class="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                Rp {{ formatPrice(conversion.idr_received) }}
              </div>
            </div>
          </div>

          <!-- Bank Info -->
          <div v-if="conversion.bank_details" class="mt-4 pt-4 border-t border-border">
            <div class="text-xs text-dark-500 dark:text-dark-400 mb-2">Rekening Tujuan:</div>
            <div class="flex items-center gap-2 text-sm">
              <span class="font-semibold text-dark-950 dark:text-white">
                {{ conversion.bank_details.bank_name }}
              </span>
              <span class="text-dark-500">•</span>
              <span class="font-mono text-dark-700 dark:text-dark-300">
                {{ conversion.bank_details.account_number }}
              </span>
            </div>
          </div>

          <!-- Admin Note (if rejected) -->
          <div v-if="conversion.admin_note && conversion.status === 'rejected'" class="mt-4 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div class="text-xs font-semibold text-red-700 dark:text-red-400 mb-1">Catatan Admin:</div>
            <div class="text-sm text-red-600 dark:text-red-300">{{ conversion.admin_note }}</div>
          </div>
        </div>
      </div>

    </div>

    <!-- Detail Modal -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="selectedConversion" class="fixed inset-0 z-50 overflow-y-auto" @click="selectedConversion = null">
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="flex min-h-full items-center justify-center p-4">
            <div 
              class="relative bg-white dark:bg-dark-950 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-border"
              @click.stop
            >
              <button 
                @click="selectedConversion = null"
                class="absolute top-6 right-6 p-2 rounded-lg text-dark-400 hover:text-emerald-600 transition-all"
              >
                <X :size="20" />
              </button>

              <h2 class="text-2xl font-bold text-dark-950 dark:text-white mb-6">
                Detail Konversi
              </h2>

              <div class="space-y-4">
                <div>
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Status</div>
                  <span 
                    class="inline-block px-3 py-1 rounded-full text-xs font-semibold"
                    :class="{
                      'bg-yellow-100 text-yellow-700': selectedConversion.status === 'pending',
                      'bg-green-100 text-green-700': selectedConversion.status === 'approved',
                      'bg-red-100 text-red-700': selectedConversion.status === 'rejected'
                    }"
                  >
                    {{ statusLabel(selectedConversion.status) }}
                  </span>
                </div>

                <div>
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">TRX ID</div>
                  <div class="flex items-center gap-2">
                    <div class="font-mono text-sm text-dark-950 dark:text-white flex-1 break-all">
                      {{ selectedConversion.trx_id }}
                    </div>
                    <button 
                      @click="copyText(selectedConversion.trx_id)"
                      class="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Salin
                    </button>
                  </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Jumlah USDT</div>
                    <div class="font-bold text-dark-950 dark:text-white">{{ selectedConversion.amount }} USDT</div>
                  </div>
                  <div>
                    <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Network</div>
                    <div class="font-semibold text-dark-950 dark:text-white">{{ selectedConversion.network }}</div>
                  </div>
                </div>

                <div v-if="selectedConversion.bank_details">
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-2">Rekening Tujuan</div>
                  <div class="bg-dark-50 dark:bg-dark-900 rounded-lg p-3 space-y-1">
                    <div class="flex justify-between text-sm">
                      <span class="text-dark-600 dark:text-dark-400">Bank:</span>
                      <span class="font-semibold text-dark-950 dark:text-white">{{ selectedConversion.bank_details.bank_name }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-dark-600 dark:text-dark-400">Nomor:</span>
                      <span class="font-mono font-semibold text-dark-950 dark:text-white">{{ selectedConversion.bank_details.account_number }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-dark-600 dark:text-dark-400">Atas Nama:</span>
                      <span class="font-semibold text-dark-950 dark:text-white">{{ selectedConversion.bank_details.account_name }}</span>
                    </div>
                  </div>
                </div>

                <div class="pt-4 border-t border-border">
                  <div class="flex justify-between items-end">
                    <div class="text-xs font-semibold text-dark-500 dark:text-dark-400">IDR Diterima</div>
                    <div class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                      Rp {{ formatPrice(selectedConversion.idr_received) }}
                    </div>
                  </div>
                </div>

                <div v-if="selectedConversion.admin_note" class="p-3 bg-dark-50 dark:bg-dark-900 rounded-lg">
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Catatan Admin:</div>
                  <div class="text-sm text-dark-950 dark:text-white">{{ selectedConversion.admin_note }}</div>
                </div>
              </div>

              <button 
                @click="selectedConversion = null"
                class="mt-6 w-full px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold transition-colors"
              >
                Tutup
              </button>
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
import { useRouter } from 'vue-router'
import { Coins, ChevronRight, TrendingUp, Check, X } from 'lucide-vue-next'

const router = useRouter()

// Mock data - nanti integrate dengan API
const usdtHistory = ref([])
const currentRate = ref(16000)
const activeFilter = ref('all')
const selectedConversion = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

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
    pending: 'Menunggu Verifikasi',
    approved: 'Disetujui',
    rejected: 'Ditolak'
  }
  return labels[status] || status
}

const viewConversionDetail = (conversion) => {
  selectedConversion.value = conversion
}

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    toastMessage.value = 'TRX ID berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal menyalin')
  }
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