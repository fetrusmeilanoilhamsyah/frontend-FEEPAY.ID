<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="border-b border-border bg-white dark:bg-dark-900">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <h1 class="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight mb-1">
          <span class="text-dark-800 dark:text-white">Dashboard </span>
          <span class="text-primary-600 dark:text-primary-400">Admin</span>
        </h1>
        <p class="text-sm text-dark-500 dark:text-dark-400 font-medium">
          Kelola pesanan dan produk digital
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <template v-if="loadingStats">
          <div v-for="i in 3" :key="i" class="stat-card animate-pulse">
            <div class="stat-icon blue opacity-50"></div>
            <div class="stat-info">
              <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-20 mb-2"></div>
              <div class="h-6 bg-gray-300 dark:bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        </template>
        
        <template v-else>
          <div class="stat-card">
            <div class="stat-icon blue">
              <ShoppingBag :size="20" class="sm:w-6 sm:h-6" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Total Pesanan</div>
              <div class="stat-value">{{ stats.overview?.total_orders || 0 }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <Clock :size="20" class="sm:w-6 sm:h-6" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Pending</div>
              <div class="stat-value">{{ stats.overview?.pending_orders || 0 }}</div>
            </div>
          </div>

          <div class="stat-card sm:col-span-2">
            <div class="stat-icon green">
              <TrendingUp :size="20" class="sm:w-6 sm:h-6" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Total Revenue</div>
              <div class="stat-value green">Rp {{ formatPrice(stats.overview?.total_revenue || 0) }}</div>
            </div>
          </div>
        </template>
      </div>

      <!-- Saldo Digiflazz Widget -->
      <div class="mb-6">
        <div 
          class="rounded-2xl border p-4 sm:p-5"
          :class="digiflazzBalance?.is_low 
            ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800' 
            : 'bg-white dark:bg-dark-900 border-border'"
        >
          <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div class="flex items-center gap-3 sm:gap-4">
              <div 
                class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                :class="digiflazzBalance?.is_low 
                  ? 'bg-red-100 dark:bg-red-900/30' 
                  : 'bg-emerald-100 dark:bg-emerald-900/30'"
              >
                <Wallet 
                  :size="20" 
                  class="sm:w-6 sm:h-6"
                  :class="digiflazzBalance?.is_low 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-emerald-600 dark:text-emerald-400'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <div class="text-xs font-semibold uppercase tracking-wide text-dark-500 dark:text-dark-400 mb-1">
                  Saldo Digiflazz
                </div>
                <div v-if="loadingBalance" class="h-6 sm:h-7 w-28 sm:w-32 bg-dark-100 dark:bg-dark-800 rounded animate-pulse"></div>
                <div v-else-if="!digiflazzBalance" class="text-xs sm:text-sm text-dark-500 dark:text-dark-400">
                  Klik refresh untuk cek saldo
                </div>
                <div v-else>
                  <div 
                    class="text-xl sm:text-2xl font-black"
                    :class="digiflazzBalance.is_low 
                      ? 'text-red-600 dark:text-red-400' 
                      : 'text-emerald-600 dark:text-emerald-400'"
                  >
                    {{ digiflazzBalance.balance_formatted }}
                  </div>
                  <div v-if="digiflazzBalance.is_low" class="flex items-center gap-1 mt-1">
                    <AlertTriangle :size="12" class="text-red-500 flex-shrink-0" />
                    <span class="text-xs font-semibold text-red-600 dark:text-red-400 truncate">
                      Saldo rendah! Segera top up
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <button
              @click="fetchBalance"
              :disabled="loadingBalance"
              class="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-50 w-full sm:w-auto flex-shrink-0"
              :class="digiflazzBalance?.is_low
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200'
                : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'"
            >
              <Loader v-if="loadingBalance" class="animate-spin" :size="14" />
              <RefreshCw v-else :size="14" />
              <span>{{ loadingBalance ? 'Mengecek...' : 'Refresh Saldo' }}</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6 overflow-x-auto -mx-3 px-3 sm:mx-0 sm:px-0">
        <div class="inline-flex min-w-full sm:w-auto bg-white dark:bg-dark-900 p-1 rounded-xl border border-border shadow-sm">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="activeTab = tab.value"
            class="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-all whitespace-nowrap"
            :class="activeTab === tab.value
              ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 shadow-sm'
              : 'text-dark-600 dark:text-dark-400'"
          >
            {{ tab.label }}
          </button>
        </div>
      </div>

      <!-- Products Tab -->
      <div v-if="activeTab === 'products'">
        <div class="mb-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
          <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 bg-white dark:bg-dark-900 border border-border rounded-xl p-3 sm:px-4 sm:py-2">
            <span class="text-xs sm:text-sm font-semibold text-dark-700 dark:text-dark-300">
              Margin Semua:
            </span>
            <div class="flex items-center gap-2">
              <div class="flex items-center gap-1 flex-1 sm:flex-initial">
                <span class="text-sm text-dark-500">Rp</span>
                <input
                  v-model.number="bulkMargin"
                  type="number"
                  min="0"
                  placeholder="2000"
                  class="w-full sm:w-24 px-2 py-1.5 text-sm font-bold border-2 border-border rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-950 dark:text-white outline-none focus:border-primary-500 transition-colors"
                />
              </div>
              <button
                @click="handleBulkMargin"
                :disabled="isBulkUpdating || !bulkMargin"
                class="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                <Loader v-if="isBulkUpdating" class="animate-spin" :size="14" />
                <Zap v-else :size="14" />
                <span class="hidden sm:inline">{{ isBulkUpdating ? 'Updating...' : 'Terapkan' }}</span>
                <span class="sm:hidden">Apply</span>
              </button>
            </div>
          </div>

          <button 
            @click="handleSyncProducts"
            :disabled="isSyncing"
            class="sync-btn w-full sm:w-auto"
          >
            <Loader v-if="isSyncing" class="animate-spin" :size="16" />
            <RefreshCw v-else :size="16" />
            <span>{{ isSyncing ? 'Syncing...' : 'Sync Products' }}</span>
          </button>
        </div>

        <!-- Grouped Products - Desktop -->
        <div class="hidden sm:block space-y-4">
          <div v-for="(group, category) in groupedProducts" :key="category" class="category-group">
            <div class="category-header">
              <h3 class="category-title">{{ category }}</h3>
              <span class="category-count">{{ group.length }} produk</span>
            </div>
            <div class="card-table">
              <table class="w-full text-sm">
                <thead>
                  <tr>
                    <th>Nama Produk</th>
                    <th>Harga Modal</th>
                    <th>Harga Jual</th>
                    <th>Margin</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="product in group" :key="product.id">
                    <td class="font-semibold">{{ product.name }}</td>
                    <td class="text-dark-500 dark:text-dark-400">
                      Rp {{ formatPrice(product.cost_price) }}
                    </td>
                    <td class="font-bold text-primary-600 dark:text-primary-400">
                      Rp {{ formatPrice(product.selling_price) }}
                    </td>
                    <td class="font-semibold text-emerald-600 dark:text-emerald-400">
                      +Rp {{ formatPrice(product.selling_price - product.cost_price) }}
                    </td>
                    <td>
                      <button @click="openEditPriceModal(product)" class="action-link">
                        Edit Harga
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Grouped Products - Mobile -->
        <div class="sm:hidden space-y-4">
          <div v-for="(group, category) in groupedProducts" :key="category" class="category-group">
            <div class="category-header">
              <h3 class="category-title">{{ category }}</h3>
              <span class="category-count">{{ group.length }}</span>
            </div>
            <div class="space-y-2">
              <div v-for="product in group" :key="product.id" class="mobile-card">
                <div class="mb-2">
                  <h3 class="font-bold text-dark-950 dark:text-white text-sm mb-1">{{ product.name }}</h3>
                </div>
                <div class="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <div class="text-xs text-dark-500 dark:text-dark-400 mb-0.5">Harga Modal</div>
                    <div class="text-sm font-semibold text-dark-700 dark:text-dark-300">Rp {{ formatPrice(product.cost_price) }}</div>
                  </div>
                  <div>
                    <div class="text-xs text-dark-500 dark:text-dark-400 mb-0.5">Harga Jual</div>
                    <div class="text-sm font-bold text-primary-600 dark:text-primary-400">Rp {{ formatPrice(product.selling_price) }}</div>
                  </div>
                </div>
                <div class="flex items-center justify-between mb-3">
                  <div class="text-xs text-dark-500 dark:text-dark-400">Margin</div>
                  <div class="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                    +Rp {{ formatPrice(product.selling_price - product.cost_price) }}
                  </div>
                </div>
                <button @click="openEditPriceModal(product)" class="mobile-action-btn">
                  Edit Harga
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'">
        <!-- Desktop Table -->
        <div class="hidden sm:block card-table">
          <table class="w-full text-sm">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Target</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="font-mono font-semibold">{{ order.order_id }}</td>
                <td class="font-mono text-dark-600 dark:text-dark-400">{{ order.target_number }}</td>
                <td>
                  <span class="status-badge" :class="order.status">{{ order.status }}</span>
                </td>
                <td>
                  <button 
                    v-if="order.status === 'processing'" 
                    @click="handleSyncOrder(order.order_id)"
                    class="action-link"
                  >
                    Sinkronisasi
                  </button>
                  <button 
                    v-if="order.status === 'pending' && order.payment?.status === 'verified'"
                    @click="openConfirmModal(order)"
                    class="action-btn primary"
                  >
                    Konfirmasi
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Mobile Cards -->
        <div class="sm:hidden space-y-3">
          <div v-for="order in orders" :key="order.id" class="mobile-card">
            <div class="flex items-start justify-between mb-3">
              <div class="flex-1 min-w-0">
                <div class="text-xs text-dark-500 dark:text-dark-400 mb-1">Order ID</div>
                <div class="font-mono font-bold text-sm text-dark-950 dark:text-white mb-2">{{ order.order_id }}</div>
                <div class="text-xs text-dark-500 dark:text-dark-400 mb-0.5">Target</div>
                <div class="font-mono text-sm text-dark-700 dark:text-dark-300">{{ order.target_number }}</div>
              </div>
              <span class="status-badge" :class="order.status">{{ order.status }}</span>
            </div>
            <div class="flex gap-2">
              <button 
                v-if="order.status === 'processing'" 
                @click="handleSyncOrder(order.order_id)"
                class="mobile-action-btn secondary flex-1"
              >
                Sinkronisasi
              </button>
              <button 
                v-if="order.status === 'pending' && order.payment?.status === 'verified'"
                @click="openConfirmModal(order)"
                class="mobile-action-btn flex-1"
              >
                Konfirmasi
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Edit Price Modal -->
    <Teleport to="body">
      <Transition name="modal">
        <div v-if="showEditPriceModal" class="modal-overlay" @click.self="closeEditPriceModal">
          <div class="modal-content">
            <h2 class="modal-title">Edit Harga Produk</h2>
            <p class="modal-subtitle">{{ editingProduct?.name }}</p>
            <input v-model="newSellingPrice" type="number" class="modal-input" placeholder="Masukkan harga baru" />
            <div class="modal-actions">
              <button @click="closeEditPriceModal" class="modal-btn secondary">Batal</button>
              <button @click="saveNewPrice" class="modal-btn primary">Simpan</button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- PIN Modal -->
    <PINModal 
      v-if="showPinModal" 
      :title="pinModalTitle" 
      :subtitle="pinModalSubtitle" 
      @confirmed="handlePinConfirmed" 
      @close="closePinModal" 
    />

    <!-- Toast -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        <Check class="text-primary-600" :size="18" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { ShoppingBag, Clock, TrendingUp, RefreshCw, Loader, Check, Zap, Wallet, AlertTriangle } from 'lucide-vue-next'
import PINModal from '../components/PINModal.vue'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'

const { setAdminPin } = useAuth()

const activeTab = ref('products')
const stats = ref({})
const loadingStats = ref(true)
const products = ref([])
const orders = ref([])
const lastOrderCount = ref(0)
const isSyncing = ref(false)
const isFetching = ref(false)
const isBulkUpdating = ref(false)
const bulkMargin = ref(null)

const digiflazzBalance = ref(null)
const loadingBalance = ref(false)

const showPinModal = ref(false)
const pinModalTitle = ref('')
const pinModalSubtitle = ref('')
const pendingAction = ref(null)
const showEditPriceModal = ref(false)
const editingProduct = ref(null)
const newSellingPrice = ref(0)
const showToast = ref(false)
const toastMessage = ref('')

const AUTO_REFRESH_INTERVAL = 60000
let autoRefreshTimer = null

const tabs = [
  { value: 'products', label: 'Produk' },
  { value: 'orders', label: 'Pesanan' }
]

const groupedProducts = computed(() => {
  const groups = {}
  products.value.forEach(product => {
    const category = product.category || 'Lainnya'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(product)
  })
  
  Object.keys(groups).forEach(category => {
    groups[category].sort((a, b) => a.name.localeCompare(b.name))
  })
  
  return groups
})

const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p)

const showToastNotification = (m) => {
  toastMessage.value = m
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000)
}

const fetchAllData = async (silent = false) => {
  if (isFetching.value) return
  isFetching.value = true

  if (!silent && products.value.length === 0) {
    loadingStats.value = true
  }

  try {
    const [s, p, o] = await Promise.all([
      api.dashboard.getStats().catch(() => stats.value || {}),
      api.products.getAll().catch(() => products.value || []),
      api.orders.getAll().catch(() => ({ data: orders.value || [] }))
    ])

    const currentOrders = o.data || o

    if (lastOrderCount.value > 0 && currentOrders.length > lastOrderCount.value) {
      new Audio('/sounds/notification.mp3').play().catch(() => {})
      showToastNotification('Pesanan Baru Masuk!')
    }

    if (s && Object.keys(s).length > 0) stats.value = s
    if (p && p.length > 0) products.value = p
    if (currentOrders && currentOrders.length >= 0) orders.value = currentOrders

    lastOrderCount.value = currentOrders.length
  } catch (e) {
    console.error('Fetch Error:', e)
  } finally {
    loadingStats.value = false
    isFetching.value = false
  }
}

const fetchBalance = async () => {
  if (loadingBalance.value) return
  loadingBalance.value = true
  try {
    const result = await api.dashboard.getBalance()
    digiflazzBalance.value = result
    if (result.is_low) {
      showToastNotification('⚠️ Saldo Digiflazz hampir habis! Segera top up.')
    }
  } catch (e) {
    showToastNotification('Gagal cek saldo: ' + (e.message || 'Error'))
    digiflazzBalance.value = null
  } finally {
    loadingBalance.value = false
  }
}

const handleSyncProducts = async () => {
  if (isSyncing.value) return
  isSyncing.value = true
  showToastNotification('Memulai sinkronisasi produk...')
  try {
    const result = await api.products.sync()
    showToastNotification(result.message || 'Produk berhasil disinkronkan!')
    await fetchAllData()
  } catch (e) {
    showToastNotification(e.message || 'Gagal sinkronisasi produk')
  } finally {
    isSyncing.value = false
  }
}

const handleBulkMargin = async () => {
  if (!bulkMargin.value || bulkMargin.value <= 0) {
    showToastNotification('Masukkan nominal margin dulu!')
    return
  }
  pinModalTitle.value = 'Terapkan Margin Semua Produk'
  pinModalSubtitle.value = `Margin Rp ${formatPrice(bulkMargin.value)} akan diterapkan ke SEMUA produk`
  pendingAction.value = { type: 'bulk_margin', data: { margin: bulkMargin.value } }
  showPinModal.value = true
}

const handleSyncOrder = async (id) => {
  showToastNotification('Menyinkronkan...')
  try {
    const res = await api.orders.sync(id)
    showToastNotification(res.message)
    await fetchAllData(true)
  } catch (e) {
    showToastNotification('Sinkronisasi gagal')
  }
}

const handlePinConfirmed = async (pin) => {
  setAdminPin(pin)
  const action = pendingAction.value
  showPinModal.value = false
  showToastNotification('Memproses...')

  try {
    if (action.type === 'confirm_order') {
      await api.orders.confirm(action.data.id)
      const order = orders.value.find(o => o.id === action.data.id)
      if (order) order.status = 'processing'
    }

    if (action.type === 'bulk_margin') {
      isBulkUpdating.value = true
      try {
        const result = await api.products.bulkMargin(action.data.margin)
        showToastNotification(result.message || 'Margin berhasil diterapkan!')
        await fetchAllData(true)
        bulkMargin.value = null
      } catch (e) {
        showToastNotification(e.message || 'Gagal update margin')
      } finally {
        isBulkUpdating.value = false
      }
      return
    }

    showToastNotification('Berhasil!')
    fetchAllData(true)
  } catch (e) {
    showToastNotification('Terjadi kesalahan')
    console.error('Action Error:', e)
  }
}

const openEditPriceModal = (p) => {
  editingProduct.value = p
  newSellingPrice.value = p.selling_price
  showEditPriceModal.value = true
}

const closeEditPriceModal = () => {
  showEditPriceModal.value = false
}

const saveNewPrice = async () => {
  try {
    await api.products.update(editingProduct.value.id, { selling_price: newSellingPrice.value })
    showToastNotification('Harga berhasil diperbarui!')
    closeEditPriceModal()
    await fetchAllData(true)
  } catch (e) {
    showToastNotification('Gagal memperbarui harga')
  }
}

const openConfirmModal = (o) => {
  pinModalTitle.value = 'Konfirmasi Pesanan'
  pinModalSubtitle.value = 'Masukkan PIN untuk melanjutkan'
  pendingAction.value = { type: 'confirm_order', data: o }
  showPinModal.value = true
}

const closePinModal = () => {
  showPinModal.value = false
  pendingAction.value = null
}

onMounted(() => {
  fetchAllData()
  fetchBalance()
  autoRefreshTimer = setInterval(() => {
    if (!showPinModal.value && !showEditPriceModal.value) {
      fetchAllData(true)
    }
  }, AUTO_REFRESH_INTERVAL)
})

onUnmounted(() => {
  if (autoRefreshTimer) clearInterval(autoRefreshTimer)
})
</script>

<style scoped>
/* (CSS tetap sama, hanya hapus style yang related ke USDT seperti .bank-info, .proof-image jika tidak digunakan lagi) */
/* Stats Cards */
.stat-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 16px;
  transition: all 0.3s ease;
}
.dark .stat-card { background: rgb(15 20 25); border-color: rgb(42 49 66); }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); }

.stat-icon { 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  width: 40px; 
  height: 40px; 
  border-radius: 12px; 
  color: white; 
  flex-shrink: 0;
}
@media (min-width: 640px) {
  .stat-icon { width: 48px; height: 48px; }
}
.stat-icon.blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.orange { background: linear-gradient(135deg, #fb923c 0%, #f97316 100%); }
.stat-icon.green { background: linear-gradient(135deg, #34d399 0%, #10b981 100%); }

.stat-info { 
    flex: 1; 
    min-width: 0; 
}

.stat-label {
    font-size: 0.7rem;
    font-weight: 600;
    color: rgb(107 114 128);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 0.25rem;
}

@media (min-width: 640px) {
    .stat-label { font-size: 0.75rem; }
}

.dark .stat-label { color: rgb(156 163 175); }

.stat-value { 
  font-size: 1.25rem; 
  font-weight: 800; 
  color: rgb(17 24 39); 
  letter-spacing: -0.025em; 
}
@media (min-width: 640px) {
  .stat-value { font-size: 1.5rem; }
}
.dark .stat-value { color: rgb(243 244 246); }
.stat-value.green { color: rgb(16 185 129); }

.sync-btn { 
  display: flex; 
  align-items: center; 
  justify-content: center;
  gap: 0.5rem; 
  padding: 0.625rem 1.25rem; 
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); 
  color: white; 
  font-size: 0.875rem; 
  font-weight: 700; 
  border: none; 
  border-radius: 12px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3); 
}
.sync-btn:hover:not(:disabled) { 
  transform: translateY(-2px); 
  box-shadow: 0 6px 16px rgba(79, 172, 254, 0.4); 
}
.sync-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.card-table { 
  background: white; 
  border: 1px solid rgb(229 231 235); 
  border-radius: 16px; 
  overflow: hidden; 
  box-shadow: 0 1px 3px rgba(0,0,0,0.05); 
}
.dark .card-table { background: rgb(15 20 25); border-color: rgb(42 49 66); }
.card-table table { width: 100%; border-collapse: collapse; }
.card-table thead { background: rgb(249 250 251); border-bottom: 1px solid rgb(229 231 235); }
.dark .card-table thead { background: rgb(26 31 46); border-bottom-color: rgb(42 49 66); }
.card-table th { 
  padding: 1rem; 
  text-align: left; 
  font-size: 0.75rem; 
  font-weight: 700; 
  text-transform: uppercase; 
  letter-spacing: 0.05em; 
  color: rgb(107 114 128); 
}
.dark .card-table th { color: rgb(156 163 175); }
.card-table tbody tr { border-bottom: 1px solid rgb(229 231 235); transition: background 0.2s ease; }
.dark .card-table tbody tr { border-bottom-color: rgb(42 49 66); }
.card-table tbody tr:hover { background: rgb(249 250 251); }
.dark .card-table tbody tr:hover { background: rgb(26 31 46); }
.card-table td { padding: 1rem; font-size: 0.875rem; }

.mobile-card {
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 12px;
  padding: 1rem;
  transition: all 0.2s ease;
}
.dark .mobile-card { background: rgb(15 20 25); border-color: rgb(42 49 66); }
.mobile-card:active { transform: scale(0.98); }

.category-group {
  margin-bottom: 1.5rem;
}

.category-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border: 1px solid rgb(229 231 235);
  border-radius: 12px;
  margin-bottom: 0.75rem;
}
.dark .category-header {
  background: linear-gradient(135deg, rgb(26 31 46) 0%, rgb(31 41 55) 100%);
  border-color: rgb(42 49 66);
}

.category-title {
  font-size: 0.875rem;
  font-weight: 800;
  color: rgb(17 24 39);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.dark .category-title {
  color: rgb(243 244 246);
}

.category-count {
  display: inline-block;
  padding: 0.25rem 0.625rem;
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 6px;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgb(107 114 128);
}
.dark .category-count {
  background: rgb(15 20 25);
  border-color: rgb(42 49 66);
  color: rgb(156 163 175);
}

.mobile-action-btn {
  width: 100%;
  padding: 0.625rem 1rem;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
}
.mobile-action-btn.secondary {
  background: rgb(243 244 246);
  color: rgb(17 24 39);
}
.dark .mobile-action-btn.secondary {
  background: rgb(31 41 55);
  color: rgb(243 244 246);
}
.mobile-action-btn:active { transform: scale(0.95); }

.status-badge { 
  display: inline-block; 
  padding: 0.375rem 0.75rem; 
  border-radius: 8px; 
  font-size: 0.7rem; 
  font-weight: 700; 
  text-transform: uppercase; 
  letter-spacing: 0.025em; 
}
.status-badge.pending { background: rgba(251,146,60,0.1); color: rgb(234,88,12); border: 1px solid rgba(251,146,60,0.2); }
.status-badge.processing { background: rgba(59,130,246,0.1); color: rgb(37,99,235); border: 1px solid rgba(59,130,246,0.2); }
.status-badge.success { background: rgba(34,197,94,0.1); color: rgb(22,163,74); border: 1px solid rgba(34,197,94,0.2); }
.status-badge.failed { background: rgba(239,68,68,0.1); color: rgb(220,38,38); border: 1px solid rgba(239,68,68,0.2); }

.action-link { 
  color: rgb(79 172 254); 
  font-weight: 600; 
  font-size: 0.875rem; 
  transition: all 0.2s ease; 
  background: none; 
  border: none; 
  cursor: pointer; 
  padding: 0; 
}
.action-link:hover { color: rgb(59 143 212); text-decoration: underline; }

.action-btn { 
  padding: 0.5rem 1rem; 
  font-size: 0.75rem; 
  font-weight: 700; 
  border: none; 
  border-radius: 8px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}
.action-btn.primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
.action-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }

.modal-overlay { 
  position: fixed; 
  inset: 0; 
  z-index: 50; 
  display: flex; 
  align-items: center; 
  justify-content: center; 
  padding: 1rem; 
  background: rgba(0,0,0,0.6); 
  backdrop-filter: blur(4px); 
}
.modal-content { 
  background: white; 
  border: 1px solid rgb(229 231 235); 
  border-radius: 16px; 
  padding: 1.5rem; 
  max-width: 28rem; 
  width: 100%; 
  box-shadow: 0 20px 40px rgba(0,0,0,0.15); 
}
.dark .modal-content { background: rgb(15 20 25); border-color: rgb(42 49 66); }
.modal-title { font-size: 1.125rem; font-weight: 800; color: rgb(17 24 39); margin-bottom: 0.5rem; }
@media (min-width: 640px) {
  .modal-title { font-size: 1.25rem; }
}
.dark .modal-title { color: rgb(243 244 246); }
.modal-subtitle { font-size: 0.875rem; color: rgb(107 114 128); margin-bottom: 1.5rem; }
.dark .modal-subtitle { color: rgb(156 163 175); }
.modal-input { 
  width: 100%; 
  padding: 0.75rem; 
  border: 2px solid rgb(229 231 235); 
  border-radius: 12px; 
  font-size: 1rem; 
  font-weight: 600; 
  margin-bottom: 1.5rem; 
  transition: all 0.3s ease; 
}
.dark .modal-input { background: rgb(26 31 46); border-color: rgb(42 49 66); color: rgb(243 244 246); }
.modal-input:focus { outline: none; border-color: rgb(79 172 254); box-shadow: 0 0 0 3px rgba(79,172,254,0.1); }
.modal-actions { display: flex; gap: 0.75rem; }
.modal-btn { 
  flex: 1; 
  padding: 0.75rem; 
  font-size: 0.875rem; 
  font-weight: 700; 
  border: none; 
  border-radius: 12px; 
  cursor: pointer; 
  transition: all 0.3s ease; 
}
.modal-btn.secondary { background: rgb(243 244 246); color: rgb(17 24 39); }
.dark .modal-btn.secondary { background: rgb(31 41 55); color: rgb(243 244 246); }
.modal-btn.primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
.modal-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }

.toast { 
  position: fixed; 
  bottom: 1.5rem; 
  right: 1.5rem; 
  z-index: 50; 
  display: flex; 
  align-items: center; 
  gap: 0.75rem; 
  padding: 1rem 1.25rem; 
  background: white; 
  border: 2px solid rgb(79 172 254); 
  border-radius: 12px; 
  box-shadow: 0 10px 30px rgba(0,0,0,0.15); 
  font-size: 0.875rem; 
  font-weight: 600; 
  max-width: 20rem; 
}
@media (min-width: 640px) {
  .toast { max-width: 24rem; }
}
.dark .toast { background: rgb(15 20 25); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>
