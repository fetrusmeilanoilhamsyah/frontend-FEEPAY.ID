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

          <!-- Action button di card -->
          <div v-if="order.status === 'pending'" class="order-action" @click.stop>
            <!-- Belum pilih metode bayar sama sekali -->
            <button v-if="!order.midtrans_payment_type"
              @click="continuePayment(order)"
              :disabled="isProcessingPayment"
              class="btn-pay">
              <Loader v-if="isProcessingPayment" class="spin" :size="16" />
              <CreditCard v-else :size="16" />
              {{ isProcessingPayment ? 'Membuka...' : 'Pilih Pembayaran' }}
            </button>
            <!-- Sudah pilih → lihat info / lanjut bayar -->
            <button v-else @click="viewOrderDetail(order)" class="btn-va">
              <Eye :size="16" />
              {{ isEwallet(order.midtrans_payment_type) ? 'Lanjut Bayar' : 'Lihat Info Pembayaran' }}
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

              <!-- ══════════════════════════════════════════════════ -->
              <!-- CASE 1: Virtual Account (BNI, BCA, BRI, Mandiri)  -->
              <!-- Tampil nomor rekening + tombol copy               -->
              <!-- ══════════════════════════════════════════════════ -->
              <div v-if="selectedOrder.status === 'pending' && isVA(selectedOrder.midtrans_payment_type)"
                   class="payment-box va-box">
                <div class="payment-header">
                  <CreditCard :size="16" />
                  <span class="payment-title">Virtual Account {{ getPaymentName(selectedOrder.midtrans_payment_type) }}</span>
                </div>
                <div class="va-bank">
                  <span class="bank-name">{{ getPaymentName(selectedOrder.midtrans_payment_type) }}</span>
                  <span class="va-expires">Bayar sebelum {{ formatExpiry(selectedOrder.created_at) }}</span>
                </div>
                <div class="va-number-box">
                  <span class="va-label">Nomor Virtual Account</span>
                  <div class="va-number-row">
                    <span class="va-number">{{ selectedOrder.midtrans_transaction_id }}</span>
                    <button @click="copyVA(selectedOrder.midtrans_transaction_id)" class="btn-copy-va">
                      <Copy :size="14" />
                    </button>
                  </div>
                </div>
                <div class="va-amount">
                  <span class="va-amount-label">Jumlah yang harus dibayar</span>
                  <span class="va-amount-value">Rp{{ formatPrice(selectedOrder.total_price) }}</span>
                </div>
                <div class="payment-note">
                  <Info :size="12" />
                  <span>Transfer melalui ATM, M-Banking, atau Internet Banking</span>
                </div>
              </div>

              <!-- ══════════════════════════════════════════════════ -->
              <!-- CASE 2: E-Wallet & QRIS                           -->
              <!-- gopay, dana, shopeepay, qris, akulaku, kredivo    -->
              <!-- Tampil instruksi + tombol buka app di footer      -->
              <!-- ══════════════════════════════════════════════════ -->
              <div v-else-if="selectedOrder.status === 'pending' && isEwallet(selectedOrder.midtrans_payment_type)"
                   class="payment-box ewallet-box">
                <div class="payment-header">
                  <component :is="getPaymentIcon(selectedOrder.midtrans_payment_type)" :size="16" />
                  <span class="payment-title">{{ getPaymentName(selectedOrder.midtrans_payment_type) }}</span>
                </div>
                <div class="ewallet-status">
                  <div class="ewallet-pulse" />
                  <span class="ewallet-status-text">Menunggu pembayaran</span>
                </div>
                <div class="ewallet-instruction">
                  <p class="ewallet-main">
                    Klik <strong>"{{ getPaymentCTA(selectedOrder.midtrans_payment_type) }}"</strong> di bawah
                    untuk melanjutkan pembayaran via
                    <strong>{{ getPaymentName(selectedOrder.midtrans_payment_type) }}</strong>
                  </p>
                  <div class="ewallet-amount">
                    <span class="va-amount-label">Jumlah yang harus dibayar</span>
                    <span class="va-amount-value">Rp{{ formatPrice(selectedOrder.total_price) }}</span>
                  </div>
                </div>
                <div class="payment-note">
                  <Info :size="12" />
                  <span>Bayar sebelum {{ formatExpiry(selectedOrder.created_at) }} — status otomatis update setelah bayar</span>
                </div>
              </div>

              <!-- SN kalau success -->
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

            <!-- ══════════════════════════════════════════════════ -->
            <!-- FOOTER: tombol disesuaikan per payment type        -->
            <!-- ══════════════════════════════════════════════════ -->
            <div class="modal-footer">

              <!-- Belum pilih metode bayar sama sekali -->
              <button v-if="selectedOrder.status === 'pending' && !selectedOrder.midtrans_payment_type"
                @click="continuePaymentFromModal(selectedOrder)"
                :disabled="isProcessingPayment"
                class="btn-pay full">
                <Loader v-if="isProcessingPayment" class="spin" :size="16" />
                <CreditCard v-else :size="16" />
                {{ isProcessingPayment ? 'Membuka...' : 'Pilih Metode Pembayaran' }}
              </button>

              <!-- E-wallet: buka snap lagi (reuse token → langsung ke step e-wallet) -->
              <button v-else-if="selectedOrder.status === 'pending' && isEwallet(selectedOrder.midtrans_payment_type)"
                @click="continuePaymentFromModal(selectedOrder)"
                :disabled="isProcessingPayment"
                class="btn-pay full ewallet-cta">
                <Loader v-if="isProcessingPayment" class="spin" :size="16" />
                <component v-else :is="getPaymentIcon(selectedOrder.midtrans_payment_type)" :size="16" />
                {{ isProcessingPayment ? 'Membuka...' : getPaymentCTA(selectedOrder.midtrans_payment_type) }}
              </button>

              <!-- VA atau status lain: tutup modal -->
              <button v-else @click="selectedOrder = null" class="btn-close-modal">
                {{ selectedOrder.status === 'pending' ? 'Saya Sudah Paham' : 'Tutup' }}
              </button>

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
import {
  ArrowLeft, Package, ChevronRight, RefreshCw, ShoppingBag,
  Check, X, Search, CreditCard, Loader, Copy, Info, Eye,
  Smartphone, QrCode, Wallet, Clock
} from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import { useMidtrans } from '@/composables/useMidtrans'
import api from '@/services/api'
import StatusBadge from '@/components/StatusBadge.vue'

const router     = useRouter()
const orderStore = useOrderStore()
const { pay }    = useMidtrans()

const activeFilter       = ref('all')
const selectedOrder      = ref(null)
const refreshing         = ref(false)
const loading            = ref(false)
const showToast          = ref(false)
const toastMessage       = ref('')
const searchQuery        = ref('')
const isProcessingPayment = ref(false)
const isSyncing          = ref(false)

// ─── Payment Type Helpers ─────────────────────────────────────────────────────

// VA: pakai nomor rekening, transfer manual
const isVA = (type) => type?.includes('_va') || type === 'echannel'

// E-wallet & paylater: butuh buka aplikasi / popup Midtrans
const isEwallet = (type) => [
  'gopay', 'dana', 'shopeepay', 'qris',
  'akulaku', 'kredivo', 'uob_ezpay'
].includes(type)

// Nama tampilan per payment type
const getPaymentName = (type) => ({
  'bni_va':     'BNI',
  'bca_va':     'BCA',
  'bri_va':     'BRI',
  'permata_va': 'Permata',
  'echannel':   'Mandiri',
  'other_va':   'Bank Lain',
  'gopay':      'GoPay',
  'dana':       'DANA',
  'shopeepay':  'ShopeePay',
  'qris':       'QRIS',
  'akulaku':    'Akulaku PayLater',
  'kredivo':    'Kredivo',
  'uob_ezpay':  'UOB EzPay',
})[type] ?? type

// Icon per payment type (dari lucide)
const getPaymentIcon = (type) => {
  if (type === 'qris')                        return QrCode
  if (['akulaku', 'kredivo'].includes(type))  return Clock    // paylater
  return Smartphone                                            // gopay, dana, shopeepay
}

// Label tombol CTA per payment type
const getPaymentCTA = (type) => ({
  'gopay':     'Buka GoPay',
  'dana':      'Buka DANA',
  'shopeepay': 'Buka ShopeePay',
  'qris':      'Tampilkan QR Code',
  'akulaku':   'Lanjut ke Akulaku',
  'kredivo':   'Lanjut ke Kredivo',
  'uob_ezpay': 'Lanjut ke UOB',
})[type] ?? 'Lanjutkan Pembayaran'

// ─── Filters ──────────────────────────────────────────────────────────────────

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

// ─── Formatters ───────────────────────────────────────────────────────────────

const formatPrice = (price) => Number(price).toLocaleString('id')
const formatDate  = (d) => new Intl.DateTimeFormat('id-ID', {
  day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
}).format(new Date(d))
const formatExpiry = (createdAt) => {
  const e = new Date(createdAt)
  e.setHours(e.getHours() + 24)
  return new Intl.DateTimeFormat('id-ID', {
    day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit'
  }).format(e)
}

// ─── Actions ──────────────────────────────────────────────────────────────────

const viewOrderDetail = (order) => { selectedOrder.value = order }
const repeatOrder     = () => { router.push('/') }

const showToastMsg = (msg) => {
  toastMessage.value = msg
  showToast.value    = true
  setTimeout(() => showToast.value = false, 2000)
}

const copySN = async (sn) => {
  try { await navigator.clipboard.writeText(sn); showToastMsg('SN berhasil disalin') }
  catch { alert('Gagal menyalin SN') }
}

const copyVA = async (va) => {
  try { await navigator.clipboard.writeText(va); showToastMsg('Nomor VA berhasil disalin') }
  catch { alert('Gagal menyalin nomor VA') }
}

// Buka Midtrans Snap — reuse snap token yang sudah ada
// Backend sudah handle: kalau token ada → return token lama, tidak buat baru
// Jadi untuk e-wallet: snap akan langsung buka ke step GoPay/QRIS/dll
const continuePayment = async (order) => {
  if (isProcessingPayment.value) return
  isProcessingPayment.value = true
  try {
    await pay(order.order_id, {
      onSuccess: (result, orderId) => {
        isProcessingPayment.value = false
        orderStore.updateOrderStatus(orderId, 'success')
        showToastMsg('Pembayaran berhasil!')
        setTimeout(() => router.push(`/payment/${orderId}/success`), 1500)
      },
      onPending: (result, orderId) => {
        isProcessingPayment.value = false
        router.push(`/payment/${orderId}/pending`)
      },
      onError:  () => { isProcessingPayment.value = false; alert('Gagal membuka pembayaran.') },
      onClose:  () => { isProcessingPayment.value = false },
    })
  } catch {
    isProcessingPayment.value = false
    alert('Terjadi kesalahan.')
  }
}

const continuePaymentFromModal = async (order) => {
  selectedOrder.value = null
  await continuePayment(order)
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

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
  } finally {
    isSyncing.value = false
  }
}

const refreshOrders = async () => {
  refreshing.value = true
  try { await syncOrdersFromBackend(); showToastMsg('Status berhasil diperbarui') }
  finally { refreshing.value = false }
}

onMounted(async () => {
  loading.value = true
  try { await syncOrdersFromBackend() }
  finally { loading.value = false }
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

/* Action buttons */
.order-action { margin-top:12px; padding-top:12px; border-top:1px solid var(--border,#e5e7eb); display:flex; gap:8px; }
.btn-pay { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 16px; background:#16a34a; color:#fff; border:none; border-radius:10px; font-size:0.8125rem; font-weight:700; cursor:pointer; transition:background 0.2s; }
.btn-pay:hover:not(:disabled) { background:#15803d; }
.btn-pay:disabled { opacity:0.6; cursor:not-allowed; }
.btn-pay.full { width:100%; }
.btn-va { flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 16px; background:rgba(22,163,74,0.1); color:#16a34a; border:1.5px solid #16a34a; border-radius:10px; font-size:0.8125rem; font-weight:700; cursor:pointer; transition:all 0.2s; }
.btn-va:hover { background:#16a34a; color:#fff; }
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
.modal-body { padding:16px 20px; display:flex; flex-direction:column; gap:12px; max-height:70vh; overflow-y:auto; }
.detail-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:10px 0; border-bottom:1px solid var(--border,#e5e7eb); }
.dr-label { font-size:0.75rem; color:var(--muted-foreground,#9ca3af); font-weight:500; flex-shrink:0; }
.dr-value { font-size:0.875rem; font-weight:600; color:var(--foreground,#111827); text-align:right; }
.small { font-size:0.75rem; }
.sn-row { display:flex; align-items:center; gap:8px; }
.btn-copy-sm { padding:4px 10px; background:#16a34a; color:#fff; border:none; border-radius:6px; font-size:0.6875rem; font-weight:700; cursor:pointer; white-space:nowrap; }
.detail-total { display:flex; align-items:center; justify-content:space-between; padding-top:8px; }
.total-price { font-size:1.25rem; font-weight:900; color:#16a34a; }
.modal-footer { padding:12px 20px 20px; display:flex; flex-direction:column; gap:8px; }
.btn-close-modal { width:100%; padding:12px; background:#16a34a; color:#fff; border:none; border-radius:12px; font-size:0.9375rem; font-weight:700; cursor:pointer; }

/* ── Payment Box base ── */
.payment-box { border-radius:16px; padding:16px; margin:4px 0; }
.payment-header { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.payment-header svg { color:#16a34a; }
.payment-title { font-size:0.875rem; font-weight:700; color:#15803d; }
.payment-note { display:flex; align-items:flex-start; gap:6px; font-size:0.6875rem; color:#16a34a; line-height:1.4; }
.payment-note svg { flex-shrink:0; margin-top:1px; }

/* ── VA Box ── */
.va-box { background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%); border:1.5px solid #86efac; }
.va-bank { display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.bank-name { font-size:1rem; font-weight:800; color:#15803d; }
.va-expires { font-size:0.6875rem; color:#16a34a; font-weight:600; }
.va-number-box { background:#fff; border:1px solid #86efac; border-radius:12px; padding:12px; margin-bottom:12px; }
.va-label { display:block; font-size:0.6875rem; color:#16a34a; font-weight:600; margin-bottom:6px; }
.va-number-row { display:flex; align-items:center; justify-content:space-between; gap:8px; }
.va-number { font-family:'Courier New',monospace; font-size:1.125rem; font-weight:700; color:#15803d; letter-spacing:0.5px; }
.btn-copy-va { width:36px; height:36px; display:flex; align-items:center; justify-content:center; background:#16a34a; color:#fff; border:none; border-radius:8px; cursor:pointer; flex-shrink:0; transition:background 0.2s; }
.btn-copy-va:hover { background:#15803d; }
.va-amount { background:rgba(255,255,255,0.6); border-radius:10px; padding:10px 12px; display:flex; justify-content:space-between; align-items:center; margin-bottom:12px; }
.va-amount-label { font-size:0.75rem; color:#16a34a; font-weight:600; }
.va-amount-value { font-size:1.125rem; font-weight:900; color:#15803d; }

/* ── E-Wallet Box ── */
.ewallet-box { background:linear-gradient(135deg,#f0fdf4 0%,#dcfce7 100%); border:1.5px solid #86efac; }
.ewallet-status { display:flex; align-items:center; gap:8px; margin-bottom:12px; }
.ewallet-pulse { width:8px; height:8px; border-radius:50%; background:#16a34a; animation:pulse 1.5s ease-in-out infinite; flex-shrink:0; }
@keyframes pulse { 0%,100%{ opacity:1; transform:scale(1); } 50%{ opacity:0.4; transform:scale(1.3); } }
.ewallet-status-text { font-size:0.75rem; font-weight:600; color:#16a34a; }
.ewallet-instruction { background:#fff; border:1px solid #86efac; border-radius:12px; padding:14px; margin-bottom:12px; }
.ewallet-main { font-size:0.875rem; color:#15803d; font-weight:500; margin:0 0 12px; line-height:1.5; }
.ewallet-amount { display:flex; justify-content:space-between; align-items:center; padding-top:10px; border-top:1px solid #bbf7d0; }

/* E-wallet CTA button — sedikit beda dari btn-pay biasa */
.ewallet-cta { background:linear-gradient(135deg,#16a34a,#15803d); box-shadow:0 4px 12px rgba(22,163,74,0.3); }
.ewallet-cta:hover:not(:disabled) { background:linear-gradient(135deg,#15803d,#166534); box-shadow:0 6px 16px rgba(22,163,74,0.4); }

/* Spin */
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to{ transform:rotate(360deg); } }

/* Toast */
.toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#111827; color:#fff; padding:10px 20px; border-radius:999px; font-size:0.8125rem; font-weight:600; display:flex; align-items:center; gap:8px; z-index:100; white-space:nowrap; box-shadow:0 8px 24px rgba(0,0,0,0.2); }
.toast-enter-active,.toast-leave-active { transition:all 0.3s cubic-bezier(0.4,0,0.2,1); }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }
.modal-enter-active,.modal-leave-active { transition:opacity 0.3s; }
.modal-enter-from,.modal-leave-to { opacity:0; }
</style>