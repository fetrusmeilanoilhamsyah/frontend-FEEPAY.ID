<template>
  <div class="tx-page" ref="txPageRef">

    <!-- Premium Header -->
    <div class="tx-header squircle-bottom">
      <div class="header-inner">
        <button @click="$router.push('/')" class="back-btn-premium">
          <ArrowLeft :size="22" stroke-width="2.5" />
        </button>
        <div class="header-content">
          <h1 class="header-title-hd">Riwayat Transaksi</h1>
          <div class="header-sub-hd">
            <Clock :size="12" />
            <span>Pantau status pesanan kamu</span>
          </div>
        </div>
        <div class="header-brand-glass">FEE<span>PAY</span></div>
      </div>
    </div>

    <div class="page-content">
      <!-- Background Particles -->
      <div class="page-bg-art" style="transform: translate3d(0, calc(var(--scrollY) * 0.1px), 0)">
        <AntigravityParticles absolute :particle-count="20" class="opacity-20" />
      </div>

      <!-- Premium Search -->
      <div class="search-container-hd">
        <div class="search-wrap-hd">
          <Search :size="18" class="search-icon-hd" stroke-width="2.5" />
          <input v-model="searchQuery" type="text" placeholder="Cari order ID, produk, nomor..." class="search-input-hd" />
          <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear-hd"><X :size="16" /></button>
        </div>
      </div>

      <!-- Premium Filter Tabs -->
      <div class="filter-container-hd">
        <div class="filter-wrap-hd">
          <button v-for="f in filters" :key="f.value" @click="activeFilter = f.value"
            class="filter-pill-hd" :class="{ active: activeFilter === f.value }">
            <component :is="f.icon" :size="14" stroke-width="2.5" />
            {{ f.label }}
            <span v-if="f.count > 0" class="filter-dot-hd" :class="{ active: activeFilter === f.value }">{{ f.count }}</span>
          </button>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="orders-list">
        <div v-for="i in 4" :key="i" class="order-skeleton" />
      </div>

      <!-- Branded Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="empty-state reveal reveal--up" v-reveal>
        <div class="empty-icon-wrapper">
          <Package :size="56" class="empty-icon-hd" stroke-width="1.5" />
          <div class="empty-glow"></div>
        </div>
        <h3 class="empty-title-hd">{{ searchQuery ? 'Tidak ada hasil' : 'Belum ada transaksi' }}</h3>
        <p class="empty-sub-hd">{{ searchQuery ? 'Coba kata kunci lain atau periksa filter kamu.' : 'Mulai shopping sekarang di FEEPAY.' }}</p>
        <button v-if="!searchQuery" @click="$router.push('/')" class="btn-shop-premium squircle">
          <ShoppingBag :size="18" stroke-width="2.5" />
          Belanja Sekarang
        </button>
      </div>

      <!-- Premium Orders List -->
      <div v-else class="orders-list-hd">
        <div v-for="(order, idx) in filteredOrders" :key="order.order_id"
          class="order-card-hd reveal reveal--up" 
          v-reveal
          :style="{ '--p-delay': (Math.min(idx, 8) * 0.05) + 's' }"
          @click="viewOrderDetail(order)">
          
          <!-- Identity Side Bar -->
          <div class="status-indicator-hd" :class="'status--' + order.status"></div>

          <!-- Branded Watermark -->
          <div class="card-brand-watermark">FEEPAY</div>

          <div class="order-content-hd">
            <div class="order-top-hd">
              <div class="order-info-hd">
                <div class="order-meta-hd">
                  <Clock :size="10" />
                  <span class="order-date-hd font-mono">{{ formatDate(order.created_at) }}</span>
                </div>
                <h3 class="order-product-hd">{{ order.product_name }}</h3>
              </div>
              <div class="flex flex-col items-end gap-1">
                <StatusBadge :status="order.status" size="sm" />
                <span v-if="order.status === 'success' && order.sn" class="text-[0.6rem] text-primary font-bold opacity-80 uppercase tracking-tighter">Verified Order</span>
              </div>
            </div>

            <div class="order-details-hd">
              <div class="order-id-chip font-mono">
                <span>#{{ order.order_id }}</span>
              </div>
              <div class="order-price-hd font-mono">
                <span class="currency-hd">Rp</span>
                <span class="amount-hd">{{ formatPrice(order.total_price) }}</span>
              </div>
            </div>

            <!-- Action button in card -->
            <div v-if="order.status === 'pending'" class="order-action-hd" @click.stop>
              <button v-if="!order.midtrans_payment_type"
                @click="continuePayment(order)"
                :disabled="isProcessingPayment"
                class="btn-pay-premium squircle">
                <loader-inline v-if="isProcessingPayment" />
                <CreditCard v-else :size="14" />
                {{ isProcessingPayment ? 'Memproses...' : 'Selesaikan Pembayaran' }}
              </button>
              <button v-else @click="viewOrderDetail(order)" class="btn-info-premium squircle">
                <Eye :size="14" />
                Lanjut Bayar
              </button>
            </div>
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

              <!-- ══════════════════════════════════════════════════════ -->
              <!-- CASE 1: Mandiri Echannel (Bill Payment)               -->
              <!-- Format data: "BILLER_CODE|BILL_KEY"                   -->
              <!-- Tampil Kode Perusahaan + Kode Pembayaran secara pisah -->
              <!-- ══════════════════════════════════════════════════════ -->
              <div v-if="selectedOrder.status === 'pending' && selectedOrder.midtrans_payment_type === 'echannel'"
                   class="payment-box va-box">
                <div class="payment-header">
                  <CreditCard :size="16" />
                  <span class="payment-title">Mandiri Bill Payment</span>
                </div>
                <div class="va-bank">
                  <span class="bank-name">Mandiri</span>
                  <span class="va-expires">Bayar sebelum {{ formatExpiry(selectedOrder.created_at) }}</span>
                </div>

                <!-- Kode Perusahaan -->
                <div class="va-number-box" style="margin-bottom:8px">
                  <span class="va-label">Kode Perusahaan</span>
                  <div class="va-number-row">
                    <span class="va-number">{{ getMandiriBillerCode(selectedOrder.midtrans_transaction_id) }}</span>
                    <button @click="copyVA(getMandiriBillerCode(selectedOrder.midtrans_transaction_id))" class="btn-copy-va">
                      <Copy :size="14" />
                    </button>
                  </div>
                </div>

                <!-- Kode Pembayaran -->
                <div class="va-number-box">
                  <span class="va-label">Kode Pembayaran</span>
                  <div class="va-number-row">
                    <span class="va-number">{{ getMandiriBillKey(selectedOrder.midtrans_transaction_id) }}</span>
                    <button @click="copyVA(getMandiriBillKey(selectedOrder.midtrans_transaction_id))" class="btn-copy-va">
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
                  <span>Bayar via ATM Mandiri, Livin' by Mandiri, atau Internet Banking Mandiri</span>
                </div>
              </div>

              <!-- ══════════════════════════════════════════════════ -->
              <!-- CASE 2: Virtual Account (BNI, BCA, BRI, dll)      -->
              <!-- Tampil nomor VA + tombol copy                      -->
              <!-- ══════════════════════════════════════════════════ -->
              <div v-else-if="selectedOrder.status === 'pending' && isVA(selectedOrder.midtrans_payment_type)"
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
              <!-- CASE 3: E-Wallet & QRIS                           -->
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

            <!-- Footer -->
            <div class="modal-footer">
              <button v-if="selectedOrder.status === 'pending' && !selectedOrder.midtrans_payment_type"
                @click="continuePaymentFromModal(selectedOrder)"
                :disabled="isProcessingPayment"
                class="btn-pay full">
                <Loader v-if="isProcessingPayment" class="spin" :size="16" />
                <CreditCard v-else :size="16" />
                {{ isProcessingPayment ? 'Membuka...' : 'Pilih Metode Pembayaran' }}
              </button>

              <button v-else-if="selectedOrder.status === 'pending' && isEwallet(selectedOrder.midtrans_payment_type)"
                @click="continuePaymentFromModal(selectedOrder)"
                :disabled="isProcessingPayment"
                class="btn-pay full ewallet-cta">
                <Loader v-if="isProcessingPayment" class="spin" :size="16" />
                <component v-else :is="getPaymentIcon(selectedOrder.midtrans_payment_type)" :size="16" />
                {{ isProcessingPayment ? 'Membuka...' : getPaymentCTA(selectedOrder.midtrans_payment_type) }}
              </button>

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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, Package, ChevronRight, RefreshCw, ShoppingBag,
  Check, X, Search, CreditCard, Loader, Copy, Info, Eye,
  Smartphone, QrCode, Clock
} from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import { useMidtrans } from '@/composables/useMidtrans'
import api from '@/services/api'
import StatusBadge from '@/components/StatusBadge.vue'
import AntigravityParticles from '@/components/AntigravityParticles.vue'

const router     = useRouter()
const orderStore = useOrderStore()
const { pay }    = useMidtrans()

const activeFilter        = ref('all')
const selectedOrder       = ref(null)
const refreshing          = ref(false)
const loading             = ref(false)
const showToast           = ref(false)
const toastMessage        = ref('')
const searchQuery         = ref('')
const isProcessingPayment = ref(false)
const isSyncing           = ref(false)

const txPageRef = ref(null)
const targetScrollY = ref(0)
const smoothScrollY = ref(0)
const scrollVelocity = ref(0)
let lastSmoothY = 0
let historyRafId = null

const handleScroll = () => {
  targetScrollY.value = window.scrollY
}

const updatePhysics = () => {
  smoothScrollY.value += (targetScrollY.value - smoothScrollY.value) * 0.12
  scrollVelocity.value = smoothScrollY.value - lastSmoothY
  lastSmoothY = smoothScrollY.value

  if (txPageRef.value) {
    txPageRef.value.style.setProperty('--scrollY', smoothScrollY.value.toFixed(2))
    txPageRef.value.style.setProperty('--velocity', scrollVelocity.value.toFixed(2))
  }
  historyRafId = requestAnimationFrame(updatePhysics)
}

// ─── Payment Type Helpers ─────────────────────────────────────────────────────

// VA biasa (BNI, BCA, BRI, dll) — TIDAK termasuk echannel (Mandiri pakai sistem berbeda)
const isVA = (type) => type?.includes('_va') || type === 'other_va'

// E-wallet & paylater
const isEwallet = (type) => [
  'gopay', 'dana', 'shopeepay', 'qris',
  'akulaku', 'kredivo', 'uob_ezpay'
].includes(type)

// ✅ FIX: Parse Mandiri echannel — data disimpan sebagai "BILLER_CODE|BILL_KEY"
const getMandiriBillerCode = (transactionId) => {
  if (!transactionId || !transactionId.includes('|')) return '-'
  return transactionId.split('|')[0]
}
const getMandiriBillKey = (transactionId) => {
  if (!transactionId || !transactionId.includes('|')) return '-'
  return transactionId.split('|')[1]
}

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

const getPaymentIcon = (type) => {
  if (type === 'qris')                       return QrCode
  if (['akulaku', 'kredivo'].includes(type)) return Clock
  return Smartphone
}

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
  { value: 'all',        label: 'Semua',    icon: ShoppingBag, count: orderStore.orderHistory.length },
  { value: 'pending',    label: 'Menunggu', icon: Clock,       count: orderStore.pendingOrders.length },
  { value: 'processing', label: 'Diproses', icon: AlertCircle, count: orderStore.processingOrders.length },
  { value: 'success',    label: 'Berhasil', icon: Check,       count: orderStore.completedOrders.filter(o => o.status === 'success').length },
  { value: 'failed',     label: 'Gagal',    icon: X,           count: orderStore.completedOrders.filter(o => o.status === 'failed').length },
])

const filteredOrders = computed(() => {
  let orders = []
  if      (activeFilter.value === 'all')        orders = orderStore.orderHistory
  else if (activeFilter.value === 'pending')    orders = orderStore.pendingOrders
  else if (activeFilter.value === 'processing') orders = orderStore.processingOrders
  else if (activeFilter.value === 'success')    orders = orderStore.completedOrders.filter(o => o.status === 'success')
  else if (activeFilter.value === 'failed')     orders = orderStore.completedOrders.filter(o => o.status === 'failed')

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
  day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
}).format(new Date(d))
const formatExpiry = (createdAt) => {
  const e = new Date(createdAt)
  e.setHours(e.getHours() + 24)
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
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
  try { await navigator.clipboard.writeText(va); showToastMsg('Berhasil disalin!') }
  catch { alert('Gagal menyalin') }
}

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

const syncOrders = async () => {
  if (isSyncing.value) return
  isSyncing.value = true
  try {
    await orderStore.syncWithBackend()
    showToastMsg('Riwayat diperbarui')
  } catch (err) {
    console.error('Sync failed', err)
  } finally {
    isSyncing.value = false
  }
}

const refreshOrders = async () => {
  if (refreshing.value) return
  refreshing.value = true
  try {
    await orderStore.syncWithBackend()
  } finally {
    refreshing.value = false
  }
}

onMounted(async () => {
  window.addEventListener('scroll', handleScroll)
  updatePhysics()
  
  if (orderStore.orderHistory.length === 0) {
    loading.value = true
    await orderStore.syncWithBackend()
    loading.value = false
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (historyRafId) cancelAnimationFrame(historyRafId)
})

const formatStatus = (s) => s === 'processing' ? 'Diproses' : s === 'pending' ? 'Menunggu' : s === 'success' ? 'Selesai' : 'Gagal'

</script>

<style scoped>
.tx-page { 
  min-height: 100vh; 
  background: var(--background); 
  padding-bottom: 90px;
  color: var(--foreground);
}

/* PREMIUM HEADER (Gopay HD style) */
.tx-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px) saturate(180%);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  transition: all 0.3s;
}

.dark .tx-header {
  background: rgba(11, 14, 17, 0.85);
  border-color: rgba(255, 255, 255, 0.05);
}

.header-inner {
  max-width: 480px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.back-btn-premium {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
  box-shadow: var(--shadow-sm);
}

.back-btn-premium:active {
  transform: scale(0.9);
}

.header-content {
  flex: 1;
}

.header-title-hd {
  font-size: 1.125rem;
  font-weight: 900;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
}

.header-sub-hd {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted-foreground);
  margin-top: 2px;
}

.header-brand-glass {
  font-size: 0.8rem;
  font-weight: 900;
  color: var(--foreground);
  opacity: 0.8;
  letter-spacing: -0.01em;
}

.header-brand-glass span {
  color: var(--primary);
}

.page-content {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 16px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
  z-index: 1;
}

/* PREMIUM SEARCH */
.search-container-hd {
  position: relative;
}

.search-wrap-hd {
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon-hd {
  position: absolute;
  left: 14px;
  color: var(--primary);
  opacity: 0.7;
}

.search-input-hd {
  width: 100%;
  height: 48px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 0 40px 0 44px;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  transition: all 0.3s var(--ease-out-expo);
  box-shadow: var(--shadow-sm);
}

.search-input-hd:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 4px var(--primary-muted);
  transform: translateY(-1px);
}

.search-clear-hd {
  position: absolute;
  right: 12px;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  background: var(--muted);
  border: none;
  color: var(--muted-foreground);
  cursor: pointer;
}

/* PREMIUM FILTERS */
.filter-container-hd {
  margin: -4px 0;
}

.filter-wrap-hd {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding: 4px 2px;
  scrollbar-width: none;
}

.filter-wrap-hd::-webkit-scrollbar { display: none; }

.filter-pill-hd {
  padding: 8px 16px;
  border-radius: 99px;
  font-size: 0.75rem;
  font-weight: 800;
  white-space: nowrap;
  background: var(--card);
  border: 1px solid var(--border);
  color: var(--muted-foreground);
  transition: all 0.3s var(--ease-spring);
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: var(--shadow-sm);
}

.filter-pill-hd.active {
  background: var(--primary);
  color: #fff;
  border-color: var(--primary);
  box-shadow: 0 4px 12px rgba(0, 136, 13, 0.2);
  transform: scale(1.05);
}

.filter-dot-hd {
  font-size: 0.625rem;
  background: var(--border);
  color: var(--muted-foreground);
  padding: 1px 6px;
  border-radius: 6px;
  font-family: 'JetBrains Mono', monospace;
}

.filter-pill-hd.active .filter-dot-hd {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
}

/* PREMIUM ORDER CARDS */
.orders-list-hd {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.order-card-hd {
  background: var(--card);
  border-radius: 20px;
  display: flex;
  overflow: hidden;
  position: relative;
  transition: all 0.4s var(--ease-spring);
  box-shadow: var(--shadow-md);
  cursor: pointer;
  border: 1px solid var(--card-border);
}

.order-card-hd:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-premium);
  border-color: var(--primary-light);
}

/* Branded Watermark Identity */
.card-brand-watermark {
  position: absolute;
  top: 15%;
  right: -5%;
  font-size: 5rem;
  font-weight: 900;
  color: var(--foreground);
  opacity: 0.015; /* Extremely subtle Ghosting */
  pointer-events: none;
  z-index: 0;
  transform: rotate(-12deg);
  white-space: nowrap;
  letter-spacing: -0.05em;
  user-select: none;
}

.dark .card-brand-watermark {
  opacity: 0.03;
}

.status-indicator-hd {
  width: 6px;
  flex-shrink: 0;
  position: relative;
}

/* Gradient Status Bars with Glow */
.status--success { 
  background: linear-gradient(180deg, #00880D, #00AA13);
  box-shadow: 2px 0 10px rgba(0, 136, 13, 0.2);
}
.status--pending { 
  background: linear-gradient(180deg, #D97706, #FBBF24);
  box-shadow: 2px 0 10px rgba(217, 119, 6, 0.2);
}
.status--failed { 
  background: linear-gradient(180deg, #B91C1C, #EF4444);
  box-shadow: 2px 0 10px rgba(185, 28, 28, 0.2);
}
.status--processing { 
  background: linear-gradient(180deg, #0369A1, #00AED6);
  box-shadow: 2px 0 10px rgba(3, 105, 161, 0.2);
}

.order-content-hd {
  flex: 1;
  padding: 18px 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 1;
}

.order-top-hd {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.order-meta-hd {
  display: flex;
  align-items: center;
  gap: 6px;
  color: var(--muted-foreground);
  margin-bottom: 4px;
}

.order-date-hd {
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  opacity: 0.8;
}

.order-product-hd {
  font-size: 1rem;
  font-weight: 900;
  color: var(--foreground);
  margin: 0;
  line-height: 1.1;
  letter-spacing: -0.01em;
}

.order-details-hd {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 14px;
  border-top: 1px dashed var(--border);
}

.order-id-chip {
  font-size: 0.725rem;
  font-weight: 800;
  padding: 6px 12px;
  background: var(--muted);
  border-radius: 10px;
  color: var(--muted-foreground);
  letter-spacing: 0.08em;
  border: 1px solid var(--border);
}

.order-price-hd {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.currency-hd {
  font-size: 0.8rem;
  font-weight: 900;
  color: var(--primary);
  opacity: 0.9;
}

.amount-hd {
  font-size: 1.25rem;
  font-weight: 950;
  color: var(--primary);
  letter-spacing: -0.04em;
}

/* ACTIONS */
.order-action-hd {
  margin-top: 4px;
}

.btn-pay-premium {
  width: 100%;
  padding: 12px;
  background: var(--primary);
  color: #fff;
  border: none;
  font-size: 0.8125rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 136, 13, 0.2);
}

.btn-info-premium {
  width: 100%;
  padding: 10px;
  background: var(--primary-muted);
  color: var(--primary);
  border: 1.5px solid var(--primary);
  font-size: 0.8125rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
}

/* MODAL & OTHERS */
.modal-box {
  background: var(--card);
  box-shadow: var(--shadow-premium);
}

.total-price {
  font-family: 'JetBrains Mono', monospace;
  color: var(--primary);
}

.dr-value.mono {
  font-family: 'JetBrains Mono', monospace;
  letter-spacing: 0.05em;
  font-size: 0.8rem;
}

/* UTILS */
.font-mono {
  font-family: 'JetBrains Mono', monospace;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* EMPTY STATE HD */
.empty-state {
  padding: 80px 20px;
  text-align: center;
  background: var(--card);
  border-radius: 32px;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.empty-icon-wrapper {
  position: relative;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.empty-icon-hd { 
  color: var(--primary); 
  opacity: 0.8;
  position: relative;
  z-index: 2;
}

.empty-glow {
  position: absolute;
  width: 80px;
  height: 80px;
  background: var(--primary);
  filter: blur(40px);
  opacity: 0.15;
  z-index: 1;
}

.empty-title-hd { 
  font-size: 1.25rem; 
  font-weight: 950; 
  margin: 0;
  letter-spacing: -0.02em;
}

.empty-sub-hd { 
  font-size: 0.875rem; 
  color: var(--muted-foreground); 
  max-width: 260px;
  line-height: 1.5;
}

.btn-shop-premium {
  margin-top: 12px;
  background: var(--primary);
  color: #fff;
  padding: 12px 28px;
  border: none;
  font-size: 0.875rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 8px 20px rgba(0, 136, 13, 0.25);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
}

.btn-shop-premium:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 136, 13, 0.3);
}

.refresh-wrap { margin-top: 24px; display: flex; justify-content: center; }
.btn-refresh {
  background: var(--card);
  border: 1px solid var(--border);
  padding: 12px 24px;
  border-radius: 14px;
  font-size: 0.875rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  color: var(--primary);
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: all 0.3s var(--ease-spring);
}

.btn-refresh:hover:not(:disabled) {
  transform: scale(1.02);
  border-color: var(--primary-light);
}

/* TOAST & REVEALS */
.toast {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  background: #111827; color: #fff; padding: 12px 28px; border-radius: 999px;
  font-size: 0.8125rem; font-weight: 800; display: flex; align-items: center;
  gap: 10px; z-index: 200; white-space: nowrap; box-shadow: var(--shadow-premium);
}

.toast-enter-active, .toast-leave-active { transition: all 0.4s var(--ease-spring); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(24px); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.3s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }

.reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s var(--ease-out-expo);
  will-change: transform, opacity;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0) !important;
  transition-delay: var(--p-delay, 0s);
}

.squircle-bottom {
  clip-path: inset(0 0 0 0 round 0 0 24px 24px);
}
</style>
