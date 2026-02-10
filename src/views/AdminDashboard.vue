<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-foreground mb-2">Dashboard Admin</h1>
      <p class="text-muted-foreground font-medium">Kelola pesanan, produk, dan konversi USDT</p>
    </div>

    <!-- Stats Cards -->
    <div v-if="!loadingStats" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="card p-5 border border-border rounded-xl bg-card shadow-sm">
        <div class="text-sm text-muted-foreground font-medium mb-1">Total Pesanan</div>
        <div class="text-2xl font-bold">{{ stats.overview?.total_orders || 0 }}</div>
      </div>
      <div class="card p-5 border border-border rounded-xl bg-card shadow-sm">
        <div class="text-sm text-muted-foreground font-medium mb-1">Pesanan Pending</div>
        <div class="text-2xl font-bold text-yellow-600">{{ stats.overview?.pending_orders || 0 }}</div>
      </div>
      <div class="card p-5 border border-border rounded-xl bg-card shadow-sm">
        <div class="text-sm text-muted-foreground font-medium mb-1">Total Revenue</div>
        <div class="text-2xl font-bold text-green-600">Rp {{ formatPrice(stats.overview?.total_revenue || 0) }}</div>
      </div>
      <div class="card p-5 border border-border rounded-xl bg-card shadow-sm">
        <div class="text-sm text-muted-foreground font-medium mb-1">Pembayaran Pending</div>
        <div class="text-2xl font-bold text-orange-600">{{ stats.overview?.pending_payments || 0 }}</div>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="mb-6 border-b border-border">
      <nav class="flex gap-4">
        <button v-for="tab in tabs" :key="tab.value"
          @click="activeTab = tab.value"
          class="px-4 py-3 font-semibold text-sm border-b-2 transition-all"
          :class="activeTab === tab.value ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
        >
          {{ tab.label }}
        </button>
      </nav>
    </div>

    <!-- Products Tab -->
    <div v-if="activeTab === 'products'" class="card overflow-x-auto border border-border rounded-xl shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="bg-muted/50 border-b border-border">
          <tr>
            <th class="p-4 font-semibold">Nama Produk</th>
            <th class="p-4 font-semibold">Kategori</th>
            <th class="p-4 font-semibold">Harga Modal</th>
            <th class="p-4 font-semibold">Harga Jual</th>
            <th class="p-4 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products" :key="product.id" class="border-b border-border hover:bg-muted/10">
            <td class="p-4 font-medium">{{ product.name }}</td>
            <td class="p-4">{{ product.category }}</td>
            <td class="p-4 text-muted-foreground">Rp {{ formatPrice(product.cost_price) }}</td>
            <td class="p-4 font-bold text-primary">Rp {{ formatPrice(product.selling_price) }}</td>
            <td class="p-4">
              <button @click="openEditPriceModal(product)" class="text-primary font-semibold hover:underline">
                Edit Harga
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Orders Tab -->
    <div v-if="activeTab === 'orders'" class="card overflow-x-auto border border-border rounded-xl shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="bg-muted/50 border-b border-border">
          <tr>
            <th class="p-4 font-semibold">ID Pesanan</th>
            <th class="p-4 font-semibold">Target</th>
            <th class="p-4 font-semibold">Status</th>
            <th class="p-4 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="order in orders" :key="order.id" class="border-b border-border hover:bg-muted/10">
            <td class="p-4 font-mono font-semibold">{{ order.order_id }}</td>
            <td class="p-4 font-mono">{{ order.target_number }}</td>
            <td class="p-4">
              <span class="px-2 py-1 rounded text-xs font-semibold uppercase"
                :class="{
                  'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20': order.status === 'pending',
                  'bg-blue-500/10 text-blue-600 border border-blue-500/20': order.status === 'processing',
                  'bg-green-500/10 text-green-600 border border-green-500/20': order.status === 'success',
                  'bg-red-500/10 text-red-600 border border-red-500/20': order.status === 'failed'
                }">{{ order.status }}</span>
            </td>
            <td class="p-4 flex gap-2">
              <button v-if="order.status === 'processing'" @click="handleSyncOrder(order.order_id)" 
                class="text-blue-600 font-semibold hover:underline">
                Sinkronisasi
              </button>
              <button v-if="order.status === 'pending' && order.payment?.status === 'verified'" 
                @click="openConfirmModal(order)" 
                class="bg-primary text-white px-3 py-1 rounded text-xs font-semibold hover:bg-primary/90 transition-colors">
                Konfirmasi
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Payments Tab -->
    <div v-if="activeTab === 'payments'" class="card overflow-x-auto border border-border rounded-xl shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="bg-muted/50 border-b border-border">
          <tr>
            <th class="p-4 font-semibold">ID Pembayaran</th>
            <th class="p-4 font-semibold">Jumlah</th>
            <th class="p-4 font-semibold">Bukti</th>
            <th class="p-4 font-semibold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pay in payments" :key="pay.id" class="border-b border-border hover:bg-muted/10">
            <td class="p-4 font-mono text-xs">{{ pay.payment_id }}</td>
            <td class="p-4 font-bold">Rp {{ formatPrice(pay.amount) }}</td>
            <td class="p-4">
              <a v-if="pay.proof_url" :href="pay.proof_url" target="_blank" class="block">
                <img :src="pay.proof_url" class="w-12 h-12 object-cover rounded border hover:scale-110 transition-transform" alt="Bukti Pembayaran" />
              </a>
            </td>
            <td class="p-4 text-xs">
              <div v-if="pay.status === 'pending'" class="flex gap-2">
                <button @click="openVerifyPaymentModal(pay.id, 'verified')" 
                  class="text-green-600 font-semibold hover:underline">
                  Verifikasi
                </button>
                <button @click="openVerifyPaymentModal(pay.id, 'rejected')" 
                  class="text-red-600 font-semibold hover:underline">
                  Tolak
                </button>
              </div>
              <span v-else class="font-semibold uppercase text-muted-foreground">{{ pay.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- USDT Tab -->
    <div v-if="activeTab === 'usdt'" class="card overflow-x-auto border border-border rounded-xl shadow-sm">
      <table class="w-full text-sm text-left">
        <thead class="bg-muted/50 border-b border-border">
          <tr>
            <th class="p-4 font-semibold">ID Transaksi / Rekening</th>
            <th class="p-4 font-semibold">Jumlah</th>
            <th class="p-4 font-semibold text-center">Bukti</th>
            <th class="p-4 font-semibold text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in usdtConversions" :key="u.id" class="border-b border-border hover:bg-muted/10">
            <td class="p-4">
              <div class="font-mono text-xs font-semibold mb-2">{{ u.trx_id }}</div>
              <div v-if="u.bank_details" class="mt-2 p-3 bg-muted rounded-lg border border-border text-xs space-y-1">
                <div class="font-bold text-primary">{{ u.bank_details.bank_name }}</div>
                <div class="font-semibold text-foreground">{{ u.bank_details.account_number }}</div>
                <div class="text-muted-foreground">a.n. {{ u.bank_details.account_name }}</div>
              </div>
            </td>
            <td class="p-4">
              <div class="font-bold text-green-600 text-base">{{ u.amount }} USDT</div>
              <div class="text-xs text-muted-foreground mt-1">≈ Rp {{ formatPrice(u.idr_received) }}</div>
            </td>
            <td class="p-4 text-center">
              <a v-if="u.proof_url" :href="u.proof_url" target="_blank" class="inline-block">
                <img :src="u.proof_url" class="w-14 h-14 object-cover rounded-lg border shadow-sm mx-auto hover:scale-110 transition-transform" alt="Bukti Transfer" />
              </a>
            </td>
            <td class="p-4 text-center text-xs">
              <div v-if="u.status === 'pending'" class="flex gap-2 justify-center">
                <button @click="openApproveUsdtModal(u, 'approved')" 
                  class="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded font-semibold text-xs transition-colors">
                  Setujui
                </button>
                <button @click="openApproveUsdtModal(u, 'rejected')" 
                  class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded font-semibold text-xs transition-colors">
                  Tolak
                </button>
              </div>
              <span v-else class="font-semibold uppercase text-muted-foreground">{{ u.status }}</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Price Modal -->
    <teleport to="body" v-if="showEditPriceModal">
      <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div class="bg-card border border-border rounded-xl p-6 max-w-md w-full shadow-2xl">
          <h2 class="text-xl font-bold mb-2">Edit Harga Produk</h2>
          <p class="text-sm text-muted-foreground mb-4">{{ editingProduct?.name }}</p>
          <input v-model="newSellingPrice" type="number" 
            class="w-full p-3 border-2 border-border rounded-lg mb-6 bg-muted font-semibold focus:ring-2 focus:ring-primary focus:border-primary outline-none" 
            placeholder="Masukkan harga baru" />
          <div class="flex gap-3">
            <button @click="closeEditPriceModal" 
              class="flex-1 p-3 bg-muted hover:bg-muted/80 rounded-lg font-semibold transition-colors">
              Batal
            </button>
            <button @click="saveNewPrice" 
              class="flex-1 p-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-colors">
              Simpan
            </button>
          </div>
        </div>
      </div>
    </teleport>

    <!-- PIN Modal -->
    <PINModal v-if="showPinModal" :title="pinModalTitle" :subtitle="pinModalSubtitle" @confirmed="handlePinConfirmed" @close="closePinModal" />

    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 bg-card border-2 border-primary rounded-xl shadow-2xl p-4 z-50 flex items-center gap-3 max-w-sm">
        <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <span class="text-sm font-semibold">{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import PINModal from '../components/PINModal.vue'
import api from '../services/api'
import { useAuth } from '../composables/useAuth'

const { setAdminPin } = useAuth()

// State
const activeTab = ref('products')
const stats = ref({})
const loadingStats = ref(true)
const products = ref([])
const orders = ref([])
const payments = ref([])
const usdtConversions = ref([])
const lastOrderCount = ref(0) 

const showPinModal = ref(false)
const pinModalTitle = ref('')
const pinModalSubtitle = ref('')
const pendingAction = ref(null)
const showEditPriceModal = ref(false)
const editingProduct = ref(null)
const newSellingPrice = ref(0)
const showToast = ref(false)
const toastMessage = ref('')

let autoRefreshTimer = null

// Tabs configuration
const tabs = [
  { value: 'products', label: 'Produk' },
  { value: 'orders', label: 'Pesanan' },
  { value: 'payments', label: 'Pembayaran' },
  { value: 'usdt', label: 'Konversi USDT' }
]

// Utilities
const formatPrice = (p) => new Intl.NumberFormat('id-ID').format(p)

const showToastNotification = (m) => { 
  toastMessage.value = m
  showToast.value = true
  setTimeout(() => showToast.value = false, 3000) 
}

// Data Fetching
const fetchAllData = async () => {
  try {
    const [s, p, o, pay, u] = await Promise.all([
      api.dashboard.getStats().catch(() => ({})),
      api.products.getAll().catch(() => []),
      api.orders.getAll().catch(() => ({ data: [] })),
      api.payments.getAll().catch(() => []),
      api.usdt.getAll().catch(() => [])
    ])
    
    const currentOrders = o.data || o
    
    // New order notification
    if (lastOrderCount.value > 0 && currentOrders.length > lastOrderCount.value) {
      new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play().catch(() => {})
      showToastNotification('Pesanan Baru Masuk!')
    }
    
    stats.value = s
    products.value = p
    orders.value = currentOrders
    payments.value = pay
    usdtConversions.value = u
    lastOrderCount.value = currentOrders.length
  } catch (e) { 
    console.error('Fetch Error:', e) 
  } finally { 
    loadingStats.value = false 
  }
}

// Order Actions
const handleSyncOrder = async (id) => {
  showToastNotification('Menyinkronkan...')
  try {
    const res = await api.orders.sync(id)
    showToastNotification(res.message)
    await fetchAllData()
  } catch (e) { 
    showToastNotification('Sinkronisasi gagal') 
  }
}

// PIN Confirmation Handler
const handlePinConfirmed = async (pin) => {
  setAdminPin(pin)
  const action = pendingAction.value
  showPinModal.value = false
  showToastNotification('Memproses...')

  try {
    if (action.type === 'confirm_order') {
      await api.orders.confirm(action.data.id)
      // Update lokal instant
      const order = orders.value.find(o => o.id === action.data.id)
      if (order) order.status = 'processing'
    }
    
    if (action.type === 'verify_payment') {
      await api.payments.verify(action.data.id, { status: action.data.s })
      // Update lokal instant
      const payment = payments.value.find(p => p.id === action.data.id)
      if (payment) payment.status = action.data.s
    }
    
    if (action.type === 'approve_usdt') {
      await api.usdt.approve(action.data.id, { 
        status: action.data.s,
        admin_note: 'Verified by Admin' 
      })
      // Update lokal instant ⚡
      const conversion = usdtConversions.value.find(u => u.id === action.data.id)
      if (conversion) conversion.status = action.data.s
    }
    
    showToastNotification('Berhasil!')
    // Langsung fetch tanpa delay
    fetchAllData()
  } catch (e) { 
    showToastNotification('Terjadi kesalahan') 
    console.error('Action Error:', e)
  }
}

// Product Price Edit
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
    await fetchAllData()
  } catch (e) { 
    showToastNotification('Gagal memperbarui harga') 
  }
}

// Modal Openers
const openConfirmModal = (o) => { 
  pinModalTitle.value = 'Konfirmasi Pesanan'
  pinModalSubtitle.value = 'Masukkan PIN untuk melanjutkan'
  pendingAction.value = { type: 'confirm_order', data: o }
  showPinModal.value = true 
}

const openVerifyPaymentModal = (id, s) => { 
  pinModalTitle.value = s === 'verified' ? 'Verifikasi Pembayaran' : 'Tolak Pembayaran'
  pinModalSubtitle.value = 'Masukkan PIN untuk melanjutkan'
  pendingAction.value = { type: 'verify_payment', data: { id, s } }
  showPinModal.value = true 
}

const openApproveUsdtModal = (u, s) => { 
  pinModalTitle.value = s === 'approved' ? 'Setujui Konversi USDT' : 'Tolak Konversi USDT'
  pinModalSubtitle.value = 'Masukkan PIN untuk melanjutkan'
  pendingAction.value = { 
    type: 'approve_usdt', 
    data: { id: u.id, s: s } 
  }
  showPinModal.value = true 
}

const closePinModal = () => { 
  showPinModal.value = false
  pendingAction.value = null
}

// Lifecycle
onMounted(() => {
  fetchAllData()
  autoRefreshTimer = setInterval(() => {
    if (!showPinModal.value && !showEditPriceModal.value) { 
      fetchAllData() 
    }
  }, 5000)
})

onUnmounted(() => { 
  if (autoRefreshTimer) clearInterval(autoRefreshTimer) 
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