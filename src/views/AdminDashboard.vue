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
          Kelola pesanan, produk, dan konversi USDT
        </p>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
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
              <ShoppingBag :size="24" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Total Pesanan</div>
              <div class="stat-value">{{ stats.overview?.total_orders || 0 }}</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon orange">
              <Clock :size="24" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Pending</div>
              <div class="stat-value">{{ stats.overview?.pending_orders || 0 }}</div>
            </div>
          </div>

          <div class="stat-card lg:col-span-2">
            <div class="stat-icon green">
              <TrendingUp :size="24" />
            </div>
            <div class="stat-info">
              <div class="stat-label">Total Revenue</div>
              <div class="stat-value green">Rp {{ formatPrice(stats.overview?.total_revenue || 0) }}</div>
            </div>
          </div>
        </template>
      </div>

      <!-- ✅ SALDO DIGIFLAZZ WIDGET -->
      <div class="mb-6">
        <div 
          class="rounded-2xl border p-5 flex items-center justify-between gap-4"
          :class="digiflazzBalance?.is_low 
            ? 'bg-red-50 dark:bg-red-950/20 border-red-300 dark:border-red-800' 
            : 'bg-white dark:bg-dark-900 border-border'"
        >
          <div class="flex items-center gap-4">
            <div 
              class="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              :class="digiflazzBalance?.is_low 
                ? 'bg-red-100 dark:bg-red-900/30' 
                : 'bg-emerald-100 dark:bg-emerald-900/30'"
            >
              <Wallet 
                :size="24" 
                :class="digiflazzBalance?.is_low 
                  ? 'text-red-600 dark:text-red-400' 
                  : 'text-emerald-600 dark:text-emerald-400'"
              />
            </div>
            <div>
              <div class="text-xs font-semibold uppercase tracking-wide text-dark-500 dark:text-dark-400 mb-1">
                Saldo Digiflazz
              </div>
              <!-- Loading skeleton -->
              <div v-if="loadingBalance" class="h-7 w-32 bg-dark-100 dark:bg-dark-800 rounded animate-pulse"></div>
              <!-- Belum pernah fetch -->
              <div v-else-if="!digiflazzBalance" class="text-sm text-dark-500 dark:text-dark-400">
                Klik refresh untuk cek saldo
              </div>
              <!-- Tampilkan saldo -->
              <div v-else>
                <div 
                  class="text-2xl font-black"
                  :class="digiflazzBalance.is_low 
                    ? 'text-red-600 dark:text-red-400' 
                    : 'text-emerald-600 dark:text-emerald-400'"
                >
                  {{ digiflazzBalance.balance_formatted }}
                </div>
                <div v-if="digiflazzBalance.is_low" class="flex items-center gap-1 mt-1">
                  <AlertTriangle :size="14" class="text-red-500" />
                  <span class="text-xs font-semibold text-red-600 dark:text-red-400">
                    Saldo rendah! Segera top up Digiflazz
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            @click="fetchBalance"
            :disabled="loadingBalance"
            class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all disabled:opacity-50 flex-shrink-0"
            :class="digiflazzBalance?.is_low
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-200'
              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-200'"
          >
            <Loader v-if="loadingBalance" class="animate-spin" :size="16" />
            <RefreshCw v-else :size="16" />
            {{ loadingBalance ? 'Mengecek...' : 'Refresh Saldo' }}
          </button>
        </div>
      </div>

      <!-- Tabs -->
      <div class="mb-6">
        <div class="inline-flex w-full sm:w-auto bg-white dark:bg-dark-900 p-1 rounded-xl border border-border shadow-sm">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="activeTab = tab.value"
            class="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-all"
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
        <div class="mb-4 flex flex-wrap items-center gap-3 justify-between">
          <div class="flex items-center gap-2 bg-white dark:bg-dark-900 border border-border rounded-xl px-4 py-2">
            <span class="text-sm font-semibold text-dark-700 dark:text-dark-300 whitespace-nowrap">
              Margin Semua:
            </span>
            <div class="flex items-center gap-1">
              <span class="text-sm text-dark-500">Rp</span>
              <input
                v-model.number="bulkMargin"
                type="number"
                min="0"
                placeholder="2000"
                class="w-24 px-2 py-1 text-sm font-bold border-2 border-border rounded-lg bg-dark-50 dark:bg-dark-800 text-dark-950 dark:text-white outline-none focus:border-primary-500 transition-colors"
              />
            </div>
            <button
              @click="handleBulkMargin"
              :disabled="isBulkUpdating || !bulkMargin"
              class="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Loader v-if="isBulkUpdating" class="animate-spin" :size="14" />
              <Zap v-else :size="14" />
              {{ isBulkUpdating ? 'Updating...' : 'Terapkan Semua' }}
            </button>
          </div>

          <button 
            @click="handleSyncProducts"
            :disabled="isSyncing"
            class="sync-btn"
          >
            <Loader v-if="isSyncing" class="animate-spin" :size="18" />
            <RefreshCw v-else :size="18" />
            {{ isSyncing ? 'Syncing...' : 'Sync Products' }}
          </button>
        </div>

        <div class="card-table">
          <table class="w-full text-sm">
            <thead>
              <tr>
                <th>Nama Produk</th>
                <th>Kategori</th>
                <th>Harga Modal</th>
                <th>Harga Jual</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in products" :key="product.id">
                <td class="font-semibold">{{ product.name }}</td>
                <td>
                  <span class="category-badge">{{ product.category }}</span>
                </td>
                <td class="text-dark-500 dark:text-dark-400">
                  Rp {{ formatPrice(product.cost_price) }}
                </td>
                <td class="font-bold text-primary-600 dark:text-primary-400">
                  Rp {{ formatPrice(product.selling_price) }}
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

      <!-- Orders Tab -->
      <div v-if="activeTab === 'orders'">
        <div class="card-table">
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
      </div>

      <!-- USDT Tab -->
      <div v-if="activeTab === 'usdt'">
        <div class="card-table">
          <table class="w-full text-sm">
            <thead>
              <tr>
                <th>ID Transaksi / Rekening</th>
                <th>Jumlah</th>
                <th class="text-center">Bukti</th>
                <th class="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in usdtConversions" :key="u.id">
                <td>
                  <div class="font-mono text-xs font-semibold mb-2 text-primary-600 dark:text-primary-400">
                    {{ u.trx_id }}
                  </div>
                  <div v-if="u.bank_details" class="bank-info">
                    <div class="font-bold text-dark-950 dark:text-white">{{ u.bank_details.bank_name }}</div>
                    <div class="font-semibold text-dark-700 dark:text-dark-300">{{ u.bank_details.account_number }}</div>
                    <div class="text-dark-500 dark:text-dark-400 text-xs">a.n. {{ u.bank_details.account_name }}</div>
                  </div>
                </td>
                <td>
                  <div class="font-bold text-green-600 dark:text-green-400 text-base">{{ u.amount }} USDT</div>
                  <div class="text-xs text-dark-500 dark:text-dark-400 mt-1">≈ Rp {{ formatPrice(u.idr_received) }}</div>
                </td>
                <td class="text-center">
                  <button v-if="u.proof_path && !u.proof_blob" @click="loadProof(u)" class="action-link">
                    Lihat Bukti
                  </button>
                  <a v-if="u.proof_blob" :href="u.proof_blob" target="_blank" class="proof-image">
                    <img :src="u.proof_blob" alt="Bukti Transfer" />
                  </a>
                  <span v-if="!u.proof_path" class="text-xs text-dark-400">-</span>
                </td>
                <td class="text-center">
                  <div v-if="u.status === 'pending'" class="flex gap-2 justify-center">
                    <button @click="openApproveUsdtModal(u, 'approved')" class="action-btn success">Setujui</button>
                    <button @click="openApproveUsdtModal(u, 'rejected')" class="action-btn danger">Tolak</button>
                  </div>
                  <span v-else class="status-badge" :class="u.status">{{ u.status }}</span>
                </td>
              </tr>
            </tbody>
          </table>
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
import { ref, onMounted, onUnmounted } from 'vue'
// ✅ Wallet & AlertTriangle ditambahkan
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
const usdtConversions = ref([])
const lastOrderCount = ref(0)
const isSyncing = ref(false)
const isFetching = ref(false)
const isBulkUpdating = ref(false)
const bulkMargin = ref(null)

// ✅ State saldo Digiflazz
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
  { value: 'orders', label: 'Pesanan' },
  { value: 'usdt', label: 'Konversi USDT' }
]

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
    const [s, p, o, u] = await Promise.all([
      api.dashboard.getStats().catch(() => stats.value || {}),
      api.products.getAll().catch(() => products.value || []),
      api.orders.getAll().catch(() => ({ data: orders.value || [] })),
      api.usdt.getAll().catch(() => usdtConversions.value || [])
    ])

    const currentOrders = o.data || o

    if (lastOrderCount.value > 0 && currentOrders.length > lastOrderCount.value) {
      new Audio('/sounds/notification.mp3').play().catch(() => {})
      showToastNotification('Pesanan Baru Masuk!')
    }

    if (s && Object.keys(s).length > 0) stats.value = s
    if (p && p.length > 0) products.value = p
    if (currentOrders && currentOrders.length >= 0) orders.value = currentOrders
    if (u && u.length >= 0) usdtConversions.value = u

    lastOrderCount.value = currentOrders.length
  } catch (e) {
    console.error('Fetch Error:', e)
  } finally {
    loadingStats.value = false
    isFetching.value = false
  }
}

// ✅ Fetch saldo Digiflazz dari backend
// Dipanggil saat onMounted dan saat klik tombol Refresh Saldo
// Tidak di-auto-refresh tiap menit supaya tidak spam API Digiflazz
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

    if (action.type === 'approve_usdt') {
      await api.usdt.approve(action.data.id, {
        status: action.data.s,
        admin_note: 'Verified by Admin'
      })
      const conversion = usdtConversions.value.find(u => u.id === action.data.id)
      if (conversion) conversion.status = action.data.s
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

const openApproveUsdtModal = (u, s) => {
  pinModalTitle.value = s === 'approved' ? 'Setujui Konversi USDT' : 'Tolak Konversi USDT'
  pinModalSubtitle.value = 'Masukkan PIN untuk melanjutkan'
  pendingAction.value = { type: 'approve_usdt', data: { id: u.id, s } }
  showPinModal.value = true
}

const closePinModal = () => {
  showPinModal.value = false
  pendingAction.value = null
}

const loadProof = async (conversion) => {
  try {
    const blob = await api.usdt.getProof(conversion.id)
    conversion.proof_blob = URL.createObjectURL(blob)
  } catch {
    showToastNotification('Gagal memuat bukti transfer')
  }
}

// ✅ fetchBalance() dipanggil saat dashboard pertama kali load
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
.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.25rem;
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 16px;
  transition: all 0.3s ease;
}
.dark .stat-card { background: rgb(15 20 25); border-color: rgb(42 49 66); }
.stat-card:hover { transform: translateY(-2px); box-shadow: 0 8px 16px rgba(0,0,0,0.08); }
.stat-icon { display: flex; align-items: center; justify-content: center; width: 48px; height: 48px; border-radius: 12px; color: white; }
.stat-icon.blue { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); }
.stat-icon.orange { background: linear-gradient(135deg, #fb923c 0%, #f97316 100%); }
.stat-icon.green { background: linear-gradient(135deg, #34d399 0%, #10b981 100%); }
.stat-info { flex: 1; }
.stat-label { font-size: 0.75rem; font-weight: 600; color: rgb(107 114 128); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.25rem; }
.dark .stat-label { color: rgb(156 163 175); }
.stat-value { font-size: 1.5rem; font-weight: 800; color: rgb(17 24 39); letter-spacing: -0.025em; }
.dark .stat-value { color: rgb(243 244 246); }
.stat-value.green { color: rgb(16 185 129); }

.sync-btn { display: flex; align-items: center; gap: 0.5rem; padding: 0.625rem 1.25rem; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; font-size: 0.875rem; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3); }
.sync-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(79, 172, 254, 0.4); }
.sync-btn:disabled { opacity: 0.6; cursor: not-allowed; }

.card-table { background: white; border: 1px solid rgb(229 231 235); border-radius: 16px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.05); }
.dark .card-table { background: rgb(15 20 25); border-color: rgb(42 49 66); }
.card-table table { width: 100%; border-collapse: collapse; }
.card-table thead { background: rgb(249 250 251); border-bottom: 1px solid rgb(229 231 235); }
.dark .card-table thead { background: rgb(26 31 46); border-bottom-color: rgb(42 49 66); }
.card-table th { padding: 1rem; text-align: left; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: rgb(107 114 128); }
.dark .card-table th { color: rgb(156 163 175); }
.card-table tbody tr { border-bottom: 1px solid rgb(229 231 235); transition: background 0.2s ease; }
.dark .card-table tbody tr { border-bottom-color: rgb(42 49 66); }
.card-table tbody tr:hover { background: rgb(249 250 251); }
.dark .card-table tbody tr:hover { background: rgb(26 31 46); }
.card-table td { padding: 1rem; font-size: 0.875rem; }

.category-badge { display: inline-block; padding: 0.25rem 0.625rem; background: rgb(243 244 246); border-radius: 6px; font-size: 0.75rem; font-weight: 600; color: rgb(107 114 128); }
.dark .category-badge { background: rgb(31 41 55); color: rgb(156 163 175); }

.status-badge { display: inline-block; padding: 0.375rem 0.75rem; border-radius: 8px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.025em; }
.status-badge.pending { background: rgba(251,146,60,0.1); color: rgb(234,88,12); border: 1px solid rgba(251,146,60,0.2); }
.status-badge.processing { background: rgba(59,130,246,0.1); color: rgb(37,99,235); border: 1px solid rgba(59,130,246,0.2); }
.status-badge.success, .status-badge.approved { background: rgba(34,197,94,0.1); color: rgb(22,163,74); border: 1px solid rgba(34,197,94,0.2); }
.status-badge.failed, .status-badge.rejected { background: rgba(239,68,68,0.1); color: rgb(220,38,38); border: 1px solid rgba(239,68,68,0.2); }

.bank-info { margin-top: 0.5rem; padding: 0.75rem; background: rgb(249 250 251); border: 1px solid rgb(229 231 235); border-radius: 8px; }
.dark .bank-info { background: rgb(26 31 46); border-color: rgb(42 49 66); }

.proof-image { display: inline-block; transition: transform 0.3s ease; }
.proof-image:hover { transform: scale(1.1); }
.proof-image img { width: 56px; height: 56px; object-fit: cover; border-radius: 8px; border: 1px solid rgb(229 231 235); }
.dark .proof-image img { border-color: rgb(42 49 66); }

.action-link { color: rgb(79 172 254); font-weight: 600; font-size: 0.875rem; transition: all 0.2s ease; background: none; border: none; cursor: pointer; padding: 0; }
.action-link:hover { color: rgb(59 143 212); text-decoration: underline; }

.action-btn { padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 700; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; }
.action-btn.primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
.action-btn.success { background: rgb(34 197 94); color: white; }
.action-btn.danger { background: rgb(239 68 68); color: white; }
.action-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.15); }

.modal-overlay { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 1rem; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); }
.modal-content { background: white; border: 1px solid rgb(229 231 235); border-radius: 16px; padding: 1.5rem; max-width: 28rem; width: 100%; box-shadow: 0 20px 40px rgba(0,0,0,0.15); }
.dark .modal-content { background: rgb(15 20 25); border-color: rgb(42 49 66); }
.modal-title { font-size: 1.25rem; font-weight: 800; color: rgb(17 24 39); margin-bottom: 0.5rem; }
.dark .modal-title { color: rgb(243 244 246); }
.modal-subtitle { font-size: 0.875rem; color: rgb(107 114 128); margin-bottom: 1.5rem; }
.dark .modal-subtitle { color: rgb(156 163 175); }
.modal-input { width: 100%; padding: 0.75rem; border: 2px solid rgb(229 231 235); border-radius: 12px; font-size: 1rem; font-weight: 600; margin-bottom: 1.5rem; transition: all 0.3s ease; }
.dark .modal-input { background: rgb(26 31 46); border-color: rgb(42 49 66); color: rgb(243 244 246); }
.modal-input:focus { outline: none; border-color: rgb(79 172 254); box-shadow: 0 0 0 3px rgba(79,172,254,0.1); }
.modal-actions { display: flex; gap: 0.75rem; }
.modal-btn { flex: 1; padding: 0.75rem; font-size: 0.875rem; font-weight: 700; border: none; border-radius: 12px; cursor: pointer; transition: all 0.3s ease; }
.modal-btn.secondary { background: rgb(243 244 246); color: rgb(17 24 39); }
.dark .modal-btn.secondary { background: rgb(31 41 55); color: rgb(243 244 246); }
.modal-btn.primary { background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: white; }
.modal-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }

.toast { position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 50; display: flex; align-items: center; gap: 0.75rem; padding: 1rem 1.25rem; background: white; border: 2px solid rgb(79 172 254); border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.15); font-size: 0.875rem; font-weight: 600; max-width: 24rem; }
.dark .toast { background: rgb(15 20 25); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100%); }

@media (max-width: 640px) {
  .stat-card { padding: 1rem; }
  .stat-icon { width: 40px; height: 40px; }
  .stat-value { font-size: 1.25rem; }
  .card-table { overflow-x: auto; }
}
</style>