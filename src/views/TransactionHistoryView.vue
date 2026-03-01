<template>
  <div class="tx-page">

    <!-- Header -->
    <div class="tx-header">
      <div class="header-inner">
        <button @click="$router.push('/')" class="back-btn"><ArrowLeft :size="20" /></button>
        <div>
          <h1 class="header-title">Riwayat Transaksi</h1>
          <p class="header-sub">Pantau status pesanan kamu</p>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- Search -->
      <div class="search-wrap">
        <Search :size="18" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="Cari order ID, produk, nomor..." class="search-input" />
        <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear"><X :size="16" /></button>
      </div>

      <!-- Filter Tabs -->
      <div class="filter-wrap">
        <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
          class="filter-tab" :class="{ active: activeFilter === f.value }">
          {{ f.label }}
          <span v-if="f.count > 0" class="filter-count" :class="{ active: activeFilter === f.value }">{{ f.count }}</span>
        </button>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="orders-list">
        <div v-for="i in 4" :key="i" class="order-skeleton" />
      </div>

      <!-- Empty -->
      <div v-else-if="filteredOrders.length === 0" class="empty-state">
        <Package :size="56" class="empty-icon" />
        <p class="empty-title">{{ searchQuery ? 'Tidak ada hasil' : 'Belum ada transaksi' }}</p>
        <p class="empty-sub">{{ searchQuery ? 'Coba kata kunci lain' : 'Mulai berbelanja sekarang' }}</p>
        <button v-if="!searchQuery" @click="$router.push('/')" class="btn-shop">
          <ShoppingBag :size="16" /> Belanja Sekarang
        </button>
      </div>

      <!-- Orders -->
      <div v-else class="orders-list">
        <div v-for="order in filteredOrders" :key="order.order_id"
          class="order-card" @click="viewOrderDetail(order)">

          <div class="order-top">
            <div class="order-left">
              <div class="order-meta">
                <span class="order-date">{{ formatDate(order.created_at) }}</span>
                <StatusBadge :status="order.status" />
              </div>
              <p class="order-name">{{ order.product_name }}</p>
            </div>
            <ChevronRight :size="18" class="order-chevron" />
          </div>

          <div class="order-bottom">
            <div>
              <p class="detail-label">Order ID</p>
              <p class="detail-value mono">{{ order.order_id }}</p>
            </div>
            <div class="text-right">
              <p class="detail-label">Total</p>
              <p class="detail-price">Rp{{ formatPrice(order.total_price) }}</p>
            </div>
          </div>

          <!-- Continue Payment -->
          <div v-if="order.status === 'pending'" class="order-action" @click.stop>
            <button @click="continuePayment(order)" :disabled="isProcessingPayment" class="btn-pay">
              <Loader v-if="isProcessingPayment" class="spin" :size="16" />
              <CreditCard v-else :size="16" />
              {{ isProcessingPayment ? 'Membuka...' : 'Lanjutkan Pembayaran' }}
            </button>
          </div>

          <!-- Success actions -->
          <div v-else-if="order.status === 'success'" class="order-action" @click.stop>
            <button @click="repeatOrder" class="btn-secondary">Pesan Lagi</button>
            <button v-if="order.sn" @click="copySN(order.sn)" class="btn-copy">Salin SN</button>
          </div>
        </div>
      </div>

      <!-- Refresh -->
      <div v-if="filteredOrders.length > 0" class="refresh-wrap">
        <button @click="refreshOrders" :disabled="refreshing" class="btn-refresh">
          <RefreshCw :size="16" :class="{ spin: refreshing }" />
          {{ refreshing ? 'Memuat...' : 'Muat Ulang' }}
        </button>
      </div>

    </div>

    <!-- Detail Modal -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="selectedOrder" class="modal-overlay" @click="selectedOrder = null">
          <div class="modal-box" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">Detail Pesanan</h2>
              <button @click="selectedOrder = null" class="modal-close"><X :size="20" /></button>
            </div>

            <div class="modal-body">
              <div class="detail-row">
                <span class="dr-label">Status</span>
                <StatusBadge :status="selectedOrder.status" />
              </div>
              <div class="detail-row">
                <span class="dr-label">Produk</span>
                <span class="dr-value">{{ selectedOrder.product_name }}</span>
              </div>
              <div class="detail-row">
                <span class="dr-label">Nomor Tujuan</span>
                <span class="dr-value mono">{{ selectedOrder.target_number }}</span>
              </div>
              <div class="detail-row">
                <span class="dr-label">Order ID</span>
                <span class="dr-value mono small">{{ selectedOrder.order_id }}</span>
              </div>
              <div v-if="selectedOrder.sn" class="detail-row">
                <span class="dr-label">Serial Number</span>
                <div class="sn-row">
                  <span class="dr-value mono small">{{ selectedOrder.sn }}</span>
                  <button @click="copySN(selectedOrder.sn)" class="btn-copy-sm">Salin</button>
                </div>
              </div>
              <div class="detail-total">
                <span class="dr-label">Total Pembayaran</span>
                <span class="total-price">Rp{{ formatPrice(selectedOrder.total_price) }}</span>
              </div>
            </div>

            <div class="modal-footer">
              <button v-if="selectedOrder.status === 'pending'"
                @click="continuePaymentFromModal(selectedOrder)"
                :disabled="isProcessingPayment" class="btn-pay full">
                <Loader v-if="isProcessingPayment" class="spin" :size="16" />
                <CreditCard v-else :size="16" />
                {{ isProcessingPayment ? 'Membuka...' : 'Lanjutkan Pembayaran' }}
              </button>
              <button v-else @click="selectedOrder = null" class="btn-close-modal">Tutup</button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast">
        <Check :size="14" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Package, ChevronRight, RefreshCw, ShoppingBag, Check, X, Search, CreditCard, Loader } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import { useMidtrans } from '@/composables/useMidtrans'
import api from '@/services/api'
import StatusBadge from '@/components/StatusBadge.vue'

const router = useRouter()
const orderStore = useOrderStore()
const { pay } = useMidtrans()

const activeFilter = ref('all')
const selectedOrder = ref(null)
const refreshing = ref(false)
const loading = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const searchQuery = ref('')
const isProcessingPayment = ref(false)
const isSyncing = ref(false)

const filters = computed(() => [
  { value: 'all',        label: 'Semua',    count: orderStore.orderHistory.length },
  { value: 'pending',    label: 'Menunggu', count: orderStore.pendingOrders.length },
  { value: 'processing', label: 'Diproses', count: orderStore.processingOrders.length },
  { value: 'success',    label: 'Berhasil', count: orderStore.completedOrders.filter(o=>o.status==='success').length },
  { value: 'failed',     label: 'Gagal',    count: orderStore.completedOrders.filter(o=>o.status==='failed').length },
])

const filteredOrders = computed(() => {
  let orders = []
  if      (activeFilter.value === 'all')        orders = orderStore.orderHistory
  else if (activeFilter.value === 'pending')    orders = orderStore.pendingOrders
  else if (activeFilter.value === 'processing') orders = orderStore.processingOrders
  else if (activeFilter.value === 'success')    orders = orderStore.completedOrders.filter(o=>o.status==='success')
  else if (activeFilter.value === 'failed')     orders = orderStore.completedOrders.filter(o=>o.status==='failed')

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

const formatPrice = (price) => Number(price).toLocaleString('id')
const formatDate = (d) => new Intl.DateTimeFormat('id-ID', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }).format(new Date(d))

const viewOrderDetail = (order) => { selectedOrder.value = order }
const repeatOrder = () => { router.push('/') }

const copySN = async (sn) => {
  try {
    await navigator.clipboard.writeText(sn)
    toastMessage.value = 'SN berhasil disalin'; showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch { alert('Gagal menyalin SN') }
}

const continuePayment = async (order) => {
  if (isProcessingPayment.value) return
  isProcessingPayment.value = true
  try {
    await pay(order.order_id, {
      onSuccess: (result, orderId) => {
        isProcessingPayment.value = false
        orderStore.updateOrderStatus(orderId, 'success')
        toastMessage.value = 'Pembayaran berhasil!'; showToast.value = true
        setTimeout(() => { showToast.value = false; router.push(`/payment/${orderId}/success`) }, 1500)
      },
      onPending: (result, orderId) => {
        isProcessingPayment.value = false
        router.push(`/payment/${orderId}/pending`)
      },
      onError: () => { isProcessingPayment.value = false; alert('Gagal membuka pembayaran.') },
      onClose: () => { isProcessingPayment.value = false }
    })
  } catch { isProcessingPayment.value = false; alert('Terjadi kesalahan.') }
}

const continuePaymentFromModal = async (order) => {
  selectedOrder.value = null
  await continuePayment(order)
}

const syncOrdersFromBackend = async () => {
  if (isSyncing.value) return
  isSyncing.value = true
  try {
    const toSync = orderStore.orderHistory.filter(o => !['success','failed'].includes(o.status))
    if (toSync.length === 0) return
    await Promise.allSettled(toSync.map(async (order) => {
      try {
        const latest = await api.orders.get(order.order_id, order.customer_email)
        orderStore.addToHistory(latest)
      } catch (err) {
        if ((err?.status || err?.response?.status) === 404) orderStore.removeFromHistory(order.order_id)
      }
    }))
  } finally { isSyncing.value = false }
}

const refreshOrders = async () => {
  refreshing.value = true
  try {
    await syncOrdersFromBackend()
    toastMessage.value = 'Status berhasil diperbarui'; showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } finally { refreshing.value = false }
}

onMounted(async () => {
  loading.value = true
  try { await syncOrdersFromBackend() } finally { loading.value = false }
})
</script>

<style scoped>
.tx-page { min-height:100vh; background:var(--background,#f8fafc); padding-bottom:80px; }

.tx-header { position:sticky; top:0; z-index:40; background:var(--card,#fff); border-bottom:1px solid var(--border,#e5e7eb); }
.header-inner { max-width:720px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; gap:12px; }
.back-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:none; background:transparent; color:var(--muted-foreground,#6b7280); cursor:pointer; transition:all 0.15s; flex-shrink:0; }
.back-btn:hover { background:var(--muted,#f3f4f6); }
.header-title { font-size:1.0625rem; font-weight:700; color:var(--foreground,#111827); margin:0; }
.header-sub { font-size:0.75rem; color:var(--muted-foreground,#6b7280); margin:0; }

.page-content { max-width:720px; margin:0 auto; padding:20px 16px; display:flex; flex-direction:column; gap:16px; }

/* Search */
.search-wrap { position:relative; }
.search-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--muted-foreground,#6b7280); }
.search-input { width:100%; height:46px; background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:12px; padding:0 40px 0 44px; font-size:0.9rem; color:var(--foreground,#111827); outline:none; transition:all 0.2s; box-sizing:border-box; }
.search-input:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }
.search-clear { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; color:var(--muted-foreground,#6b7280); display:flex; padding:4px; border-radius:6px; }

/* Filters */
.filter-wrap { display:flex; gap:8px; overflow-x:auto; scrollbar-width:none; }
.filter-wrap::-webkit-scrollbar { display:none; }
.filter-tab { padding:7px 14px; border-radius:999px; font-size:0.8125rem; font-weight:600; color:var(--muted-foreground,#6b7280); background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); cursor:pointer; white-space:nowrap; transition:all 0.2s; display:flex; align-items:center; gap:6px; }
.filter-tab:hover { border-color:#16a34a; color:var(--foreground,#111827); }
.filter-tab.active { background:#16a34a; color:#fff; border-color:#16a34a; }
.filter-count { font-size:0.6875rem; padding:1px 6px; border-radius:999px; background:rgba(255,255,255,0.2); }
.filter-count:not(.active) { background:var(--muted,#f3f4f6); color:var(--muted-foreground,#6b7280); }

/* Orders */
.orders-list { display:flex; flex-direction:column; gap:10px; }

.order-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:16px; cursor:pointer; transition:all 0.2s; }
.order-card:hover { border-color:#16a34a; box-shadow:0 4px 16px rgba(22,163,74,0.08); }

.order-top { display:flex; align-items:flex-start; justify-content:space-between; gap:10px; margin-bottom:12px; }
.order-left { flex:1; }
.order-meta { display:flex; align-items:center; gap:8px; margin-bottom:4px; flex-wrap:wrap; }
.order-date { font-size:0.6875rem; color:var(--muted-foreground,#9ca3af); font-weight:500; }
.order-name { font-size:0.9375rem; font-weight:700; color:var(--foreground,#111827); }
.order-chevron { color:var(--muted-foreground,#9ca3af); flex-shrink:0; margin-top:2px; }

.order-bottom { display:flex; justify-content:space-between; align-items:flex-end; padding-top:12px; border-top:1px solid var(--border,#e5e7eb); }
.detail-label { font-size:0.6875rem; color:var(--muted-foreground,#9ca3af); margin-bottom:2px; }
.detail-value { font-size:0.8125rem; font-weight:600; color:var(--foreground,#111827); }
.detail-price { font-size:1rem; font-weight:800; color:#16a34a; }
.mono { font-family:monospace; }

.order-action { margin-top:12px; padding-top:12px; border-top:1px solid var(--border,#e5e7eb); display:flex; gap:8px; }
.btn-pay { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 16px; background:#16a34a; color:#fff; border:none; border-radius:10px; font-size:0.8125rem; font-weight:700; cursor:pointer; transition:background 0.2s; }
.btn-pay:hover:not(:disabled) { background:#15803d; }
.btn-pay:disabled { opacity:0.6; cursor:not-allowed; }
.btn-pay.full { width:100%; }
.btn-secondary { flex:1; padding:9px; background:var(--muted,#f3f4f6); color:var(--foreground,#374151); border:none; border-radius:10px; font-size:0.8125rem; font-weight:600; cursor:pointer; }
.btn-copy { padding:9px 14px; background:rgba(22,163,74,0.08); color:#16a34a; border:none; border-radius:10px; font-size:0.8125rem; font-weight:600; cursor:pointer; }

/* Skeleton */
.order-skeleton { height:120px; background:var(--muted,#f3f4f6); border-radius:16px; overflow:hidden; position:relative; }
.order-skeleton::after { content:''; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent); animation:shimmer 1.5s infinite; }
@keyframes shimmer { 100%{ transform:translateX(100%); } }

/* Empty */
.empty-state { text-align:center; padding:48px 20px; }
.empty-icon { color:var(--muted-foreground,#d1d5db); margin:0 auto 16px; display:block; }
.empty-title { font-size:1rem; font-weight:700; color:var(--foreground,#111827); margin-bottom:6px; }
.empty-sub { font-size:0.875rem; color:var(--muted-foreground,#6b7280); margin-bottom:20px; }
.btn-shop { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; background:#16a34a; color:#fff; border:none; border-radius:999px; font-size:0.875rem; font-weight:700; cursor:pointer; }

/* Refresh */
.refresh-wrap { display:flex; justify-content:center; }
.btn-refresh { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:10px; font-size:0.875rem; font-weight:600; color:var(--foreground,#374151); cursor:pointer; transition:all 0.2s; }
.btn-refresh:hover:not(:disabled) { border-color:#16a34a; color:#16a34a; }
.btn-refresh:disabled { opacity:0.5; }

/* Modal */
.modal-overlay { position:fixed; inset:0; z-index:50; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); display:flex; align-items:flex-end; justify-content:center; padding:16px; }
@media(min-width:480px){ .modal-overlay { align-items:center; } }
.modal-box { background:var(--card,#fff); border-radius:24px 24px 16px 16px; width:100%; max-width:480px; overflow:hidden; }
@media(min-width:480px){ .modal-box { border-radius:20px; } }
.modal-header { display:flex; align-items:center; justify-content:space-between; padding:20px 20px 0; }
.modal-title { font-size:1.0625rem; font-weight:800; color:var(--foreground,#111827); }
.modal-close { width:32px; height:32px; display:flex; align-items:center; justify-content:center; border-radius:8px; border:none; background:var(--muted,#f3f4f6); color:var(--muted-foreground,#6b7280); cursor:pointer; }
.modal-body { padding:16px 20px; display:flex; flex-direction:column; gap:12px; }
.detail-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid var(--border,#e5e7eb); }
.dr-label { font-size:0.75rem; color:var(--muted-foreground,#9ca3af); font-weight:500; flex-shrink:0; }
.dr-value { font-size:0.875rem; font-weight:600; color:var(--foreground,#111827); text-align:right; }
.small { font-size:0.75rem; }
.sn-row { display:flex; align-items:center; gap:8px; }
.btn-copy-sm { padding:4px 10px; background:#16a34a; color:#fff; border:none; border-radius:6px; font-size:0.6875rem; font-weight:700; cursor:pointer; white-space:nowrap; }
.detail-total { display:flex; align-items:center; justify-content:space-between; padding-top:8px; }
.total-price { font-size:1.25rem; font-weight:900; color:#16a34a; }
.modal-footer { padding:0 20px 20px; }
.btn-close-modal { width:100%; padding:12px; background:#16a34a; color:#fff; border:none; border-radius:12px; font-size:0.9375rem; font-weight:700; cursor:pointer; }

/* Spin */
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to{ transform:rotate(360deg); } }

/* Toast */
.toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#111827; color:#fff; padding:10px 20px; border-radius:999px; font-size:0.8125rem; font-weight:600; display:flex; align-items:center; gap:8px; z-index:100; white-space:nowrap; box-shadow:0 8px 24px rgba(0,0,0,0.2); }
.toast-enter-active,.toast-leave-active { transition:all 0.3s cubic-bezier(0.4,0,0.2,1); }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }

/* Modal transition */
.modal-enter-active,.modal-leave-active { transition:opacity 0.3s; }
.modal-enter-from,.modal-leave-to { opacity:0; }
</style>