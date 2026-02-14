<template>
  <div class="min-h-screen bg-stone-50 dark:bg-dark-950 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="mb-6">
        <h1 class="text-3xl font-bold text-dark-950 dark:text-white mb-2">
          Riwayat Transaksi
        </h1>
        <p class="text-sm text-dark-600 dark:text-dark-400">
          Pantau status pesanan Anda
        </p>
      </div>

      <!-- Search Bar -->
      <div class="mb-6">
        <div class="relative">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 text-dark-400" :size="20" />
          <input 
            v-model="searchQuery"
            type="text"
            placeholder="Cari order ID, produk, atau nomor..."
            class="w-full h-12 pl-12 pr-4 bg-white dark:bg-dark-900 border-2 border-border rounded-xl text-dark-950 dark:text-white font-medium outline-none focus:border-primary-600 transition-colors"
          />
          <button 
            v-if="searchQuery"
            @click="searchQuery = ''"
            class="absolute right-4 top-1/2 -translate-y-1/2 text-dark-400 hover:text-dark-950 dark:hover:text-white"
          >
            <X :size="18" />
          </button>
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
              ? 'bg-primary-600 text-white shadow-sm' 
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

      <!-- Loading Skeletons -->
      <div v-if="loading" class="space-y-4">
        <SkeletonOrderCard v-for="i in 5" :key="i" />
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="text-center py-16">
        <Package class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
        <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
          {{ searchQuery ? 'Tidak ada hasil' : (activeFilter === 'all' ? 'Belum ada transaksi' : 'Tidak ada transaksi ' + activeFilterLabel) }}
        </h3>
        <p class="text-sm text-dark-600 dark:text-dark-400 mb-6">
          {{ searchQuery ? 'Coba kata kunci lain' : 'Mulai berbelanja untuk melihat riwayat transaksi' }}
        </p>
        <button 
          v-if="!searchQuery"
          @click="$router.push('/')"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
        >
          <ShoppingBag :size="18" />
          Belanja Sekarang
        </button>
      </div>

      <div v-else class="space-y-4">
        <div 
          v-for="order in filteredOrders" 
          :key="order.order_id"
          class="bg-white dark:bg-dark-900 rounded-xl p-6 border border-border hover:border-primary-600 dark:hover:border-primary-600 transition-all cursor-pointer group"
          @click="viewOrderDetail(order)"
        >
          <!-- Order Header -->
          <div class="flex items-start justify-between mb-4">
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-2">
                <span class="text-xs font-semibold text-dark-500 dark:text-dark-400">
                  {{ formatDate(order.created_at) }}
                </span>
                <StatusBadge :status="order.status" />
              </div>
              <h3 class="font-bold text-lg text-dark-950 dark:text-white group-hover:text-primary-600 transition-colors">
                {{ order.product_name }}
              </h3>
            </div>
            <ChevronRight class="text-dark-400 dark:text-dark-600 group-hover:text-primary-600 transition-colors flex-shrink-0" :size="20" />
          </div>

          <!-- Order Details -->
          <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
            <div>
              <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">Order ID</div>
              <div class="font-mono text-sm font-semibold text-dark-950 dark:text-white">
                {{ order.order_id }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">Total</div>
              <div class="text-lg font-bold text-primary-600 dark:text-primary-400">
                Rp {{ formatPrice(order.total_price) }}
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div v-if="order.status === 'success' || order.status === 'failed'" class="mt-4 pt-4 border-t border-border flex gap-2">
            <button 
              @click.stop="repeatOrder(order)"
              class="flex-1 px-4 py-2 bg-dark-100 dark:bg-dark-800 hover:bg-dark-200 dark:hover:bg-dark-700 text-dark-950 dark:text-white rounded-lg text-sm font-semibold transition-colors"
            >
              Pesan Lagi
            </button>
            <button 
              v-if="order.sn && order.status === 'success'"
              @click.stop="copySN(order.sn)"
              class="px-4 py-2 bg-primary-50 dark:bg-primary-950/20 hover:bg-primary-100 dark:hover:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-lg text-sm font-semibold transition-colors"
            >
              Salin SN
            </button>
          </div>
        </div>
      </div>

      <!-- Refresh Button -->
      <div v-if="filteredOrders.length > 0" class="mt-6 text-center">
        <button 
          @click="refreshOrders"
          :disabled="refreshing"
          class="inline-flex items-center gap-2 px-6 py-3 bg-white dark:bg-dark-900 border border-border hover:border-primary-600 text-dark-950 dark:text-white rounded-lg font-semibold transition-all disabled:opacity-50"
        >
          <RefreshCw :class="{ 'animate-spin': refreshing }" :size="18" />
          {{ refreshing ? 'Memuat ulang...' : 'Muat Ulang' }}
        </button>
      </div>

    </div>

    <!-- Order Detail Modal (Simple) -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="selectedOrder" class="fixed inset-0 z-50 overflow-y-auto" @click="selectedOrder = null">
          <div class="fixed inset-0 bg-black/70 backdrop-blur-sm"></div>
          <div class="flex min-h-full items-center justify-center p-4">
            <div 
              class="relative bg-white dark:bg-dark-950 rounded-2xl shadow-2xl max-w-md w-full p-8 border border-border"
              @click.stop
            >
              <button 
                @click="selectedOrder = null"
                class="absolute top-6 right-6 p-2 rounded-lg text-dark-400 hover:text-primary-600 transition-all"
              >
                <X :size="20" />
              </button>

              <h2 class="text-2xl font-bold text-dark-950 dark:text-white mb-6">
                Detail Pesanan
              </h2>

              <div class="space-y-4">
                <div>
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Status</div>
                  <StatusBadge :status="selectedOrder.status" />
                </div>

                <div>
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Produk</div>
                  <div class="font-bold text-dark-950 dark:text-white">{{ selectedOrder.product_name }}</div>
                </div>

                <div>
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Nomor Tujuan</div>
                  <div class="font-mono text-dark-950 dark:text-white">{{ selectedOrder.target_number }}</div>
                </div>

                <div>
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Order ID</div>
                  <div class="font-mono text-sm text-dark-950 dark:text-white">{{ selectedOrder.order_id }}</div>
                </div>

                <div v-if="selectedOrder.sn">
                  <div class="text-xs font-semibold text-dark-500 dark:text-dark-400 mb-1">Serial Number (SN)</div>
                  <div class="flex items-center gap-2">
                    <div class="font-mono text-sm text-dark-950 dark:text-white flex-1">{{ selectedOrder.sn }}</div>
                    <button 
                      @click="copySN(selectedOrder.sn)"
                      class="px-3 py-1 bg-primary-600 hover:bg-primary-700 text-white rounded text-xs font-semibold transition-colors"
                    >
                      Salin
                    </button>
                  </div>
                </div>

                <div class="pt-4 border-t border-border">
                  <div class="flex justify-between items-end">
                    <div class="text-xs font-semibold text-dark-500 dark:text-dark-400">Total Pembayaran</div>
                    <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      Rp {{ formatPrice(selectedOrder.total_price) }}
                    </div>
                  </div>
                </div>
              </div>

              <button 
                @click="selectedOrder = null"
                class="mt-6 w-full px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Package, ChevronRight, RefreshCw, ShoppingBag, Check, X, Search } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import StatusBadge from '@/components/StatusBadge.vue'
import SkeletonOrderCard from '@/components/SkeletonOrderCard.vue'

const router = useRouter()
const orderStore = useOrderStore()

const activeFilter = ref('all')
const selectedOrder = ref(null)
const refreshing = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const searchQuery = ref('')

const filters = computed(() => [
  { value: 'all', label: 'Semua', count: orderStore.orderHistory.length },
  { value: 'pending', label: 'Menunggu', count: orderStore.pendingOrders.length },
  { value: 'processing', label: 'Diproses', count: orderStore.processingOrders.length },
  { value: 'success', label: 'Berhasil', count: orderStore.completedOrders.filter(o => o.status === 'success').length },
  { value: 'failed', label: 'Gagal', count: orderStore.completedOrders.filter(o => o.status === 'failed').length }
])

const activeFilterLabel = computed(() => {
  const filter = filters.value.find(f => f.value === activeFilter.value)
  return filter?.label.toLowerCase() || ''
})

const filteredOrders = computed(() => {
  let orders = []
  if (activeFilter.value === 'all') orders = orderStore.orderHistory
  else if (activeFilter.value === 'pending') orders = orderStore.pendingOrders
  else if (activeFilter.value === 'processing') orders = orderStore.processingOrders
  else if (activeFilter.value === 'success') orders = orderStore.completedOrders.filter(o => o.status === 'success')
  else if (activeFilter.value === 'failed') orders = orderStore.completedOrders.filter(o => o.status === 'failed')

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    orders = orders.filter(o =>
      o.order_id?.toLowerCase().includes(q) ||
      o.product_name?.toLowerCase().includes(q) ||
      o.target_number?.toLowerCase().includes(q)
    )
  }

  return orders
})

const loading = computed(() => orderStore.loading)

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

const viewOrderDetail = (order) => {
  selectedOrder.value = order
}

const repeatOrder = (order) => {
  router.push('/')
  // TODO: Auto-fill form dengan data order
}

const copySN = async (sn) => {
  try {
    await navigator.clipboard.writeText(sn)
    toastMessage.value = 'Serial Number berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal menyalin SN')
  }
}

const refreshOrders = async () => {
  refreshing.value = true
  try {
    // Refresh semua order dari localStorage
    orderStore.restoreHistory()
    
    // TODO: Optionally sync with API
    toastMessage.value = 'Riwayat berhasil dimuat ulang'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal memuat ulang')
  } finally {
    refreshing.value = false
  }
}

onMounted(() => {
  orderStore.restoreHistory()
})
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