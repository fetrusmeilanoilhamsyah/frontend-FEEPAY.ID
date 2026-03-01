<template>
  <div class="success-page">

    <!-- Header -->
    <div class="success-header">
      <div class="header-inner">
        <button @click="$router.push('/')" class="back-btn"><ArrowLeft :size="20" /></button>
        <h1 class="header-title">Status Pesanan</h1>
      </div>
    </div>

    <div class="page-content">

      <!-- Status Icon -->
      <div class="status-section">
        <div class="status-icon" :class="iconClass">
          <Check v-if="order?.status === 'success'" :size="40" class="icon-white" />
          <X v-else-if="order?.status === 'failed'" :size="40" class="icon-white" />
          <Loader v-else :size="40" class="icon-white spin" />
        </div>
        <h2 class="status-title">{{ pageTitle }}</h2>
        <p class="status-sub">{{ pageSubtitle }}</p>
        <div v-if="isPolling" class="polling-pill">
          <span class="polling-dot" />
          Auto-refresh setiap 5 detik...
        </div>
      </div>

      <!-- Order Card -->
      <div class="order-card">

        <!-- Loading -->
        <div v-if="loading" class="skeleton-rows">
          <div class="sk-row" v-for="i in 3" :key="i" />
        </div>

        <template v-else-if="order">
          <!-- Order ID -->
          <div class="info-row border-bottom">
            <span class="info-label">Order ID</span>
            <div class="info-value-row">
              <span class="info-value mono">{{ order.order_id }}</span>
              <button @click="copyOrderId" class="copy-btn"><Copy :size="14" /></button>
            </div>
          </div>

          <div class="info-row">
            <span class="info-label">Produk</span>
            <span class="info-value">{{ order.product_name }}</span>
          </div>

          <div class="info-row">
            <span class="info-label">Nomor Tujuan</span>
            <span class="info-value mono">{{ order.target_number }}</span>
          </div>

          <!-- SN Box -->
          <div v-if="order.sn" class="sn-box">
            <Key :size="16" class="sn-icon" />
            <div class="sn-body">
              <p class="sn-label">Serial Number / Kode Voucher</p>
              <p class="sn-value">{{ order.sn }}</p>
            </div>
            <button @click="copySN" class="copy-btn green"><Copy :size="14" /></button>
          </div>

          <!-- Total -->
          <div class="info-row border-top">
            <span class="info-label-bold">Total Bayar</span>
            <span class="total-price">Rp{{ formatPrice(order.total_price || 0) }}</span>
          </div>

          <!-- Status Chip -->
          <div class="status-chip-wrap">
            <div class="status-chip" :class="chipClass">
              <span class="chip-dot" :class="dotClass" />
              {{ statusLabel }}
            </div>
          </div>
        </template>

        <div v-else class="error-state">
          <AlertCircle :size="40" class="error-icon" />
          <p>Gagal memuat detail order</p>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="$router.push('/')" class="btn-primary">Kembali ke Beranda</button>
        <button @click="$router.push('/transactions')" class="btn-secondary">Lihat Riwayat</button>
      </div>

      <!-- CS -->
      <div class="cs-wrap">
        <button @click="openChat" class="cs-btn">
          <MessageCircle :size="15" /> Butuh bantuan? Hubungi CS
        </button>
      </div>

    </div>

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
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Check, X, Copy, Key, AlertCircle, MessageCircle, Loader } from 'lucide-vue-next'
import api from '@/services/api'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading    = ref(true)
const order      = ref(null)
const showToast  = ref(false)
const toastMessage = ref('')
const isPolling  = ref(false)
const orderId    = route.params.orderId

let pollingInterval = null
let pollCount = 0
const MAX_POLL = 20
const POLL_MS  = 5000

const pageTitle = computed(() => ({
  success: 'Pembayaran Berhasil!', failed: 'Pembayaran Gagal', processing: 'Sedang Diproses...'
}[order.value?.status] || 'Menunggu Verifikasi'))

const pageSubtitle = computed(() => ({
  success: 'Transaksi kamu telah berhasil diproses', failed: 'Transaksi gagal. Hubungi CS untuk bantuan.',
  processing: 'Produk sedang dikirim ke nomor tujuan'
}[order.value?.status] || 'Menunggu konfirmasi dari admin'))

const statusLabel = computed(() => ({ success:'Sukses', failed:'Gagal', processing:'Diproses' }[order.value?.status] || 'Menunggu'))

const iconClass = computed(() => ({
  success: 'icon-green', failed: 'icon-red', processing: 'icon-blue'
}[order.value?.status] || 'icon-blue'))

const chipClass = computed(() => ({
  success: 'chip-green', failed: 'chip-red'
}[order.value?.status] || 'chip-yellow'))

const dotClass = computed(() => ({
  success: 'dot-green', failed: 'dot-red'
}[order.value?.status] || 'dot-yellow'))

const formatPrice = (p) => Number(p).toLocaleString('id')

const fetchOrder = async () => {
  try {
    const email = orderStore.currentOrder?.customer_email || localStorage.getItem(`order_email_${orderId}`) || null
    const res = await api.orders.get(orderId, email)
    order.value = res
    return res
  } catch { return null } finally { loading.value = false }
}

const startPolling = () => {
  if (['success','failed'].includes(order.value?.status)) return
  isPolling.value = true; pollCount = 0
  pollingInterval = setInterval(async () => {
    if (++pollCount >= MAX_POLL) { stopPolling(); return }
    const updated = await fetchOrder()
    if (updated && ['success','failed'].includes(updated.status)) stopPolling()
  }, POLL_MS)
}

const stopPolling = () => {
  isPolling.value = false
  if (pollingInterval) { clearInterval(pollingInterval); pollingInterval = null }
}

const showToastMsg = (msg) => { toastMessage.value = msg; showToast.value = true; setTimeout(() => showToast.value = false, 2000) }
const copyOrderId = async () => { try { await navigator.clipboard.writeText(order.value.order_id); showToastMsg('Order ID disalin') } catch {} }
const copySN = async () => { try { await navigator.clipboard.writeText(order.value.sn); showToastMsg('Serial Number disalin') } catch {} }
const openChat = () => { window.dispatchEvent(new CustomEvent('open-chat')) }

onMounted(async () => { await fetchOrder(); startPolling() })
onUnmounted(() => stopPolling())
</script>

<style scoped>
.success-page { min-height:100vh; background:var(--background,#f8fafc); padding-bottom:40px; }

.success-header { position:sticky; top:0; z-index:40; background:var(--card,#fff); border-bottom:1px solid var(--border,#e5e7eb); }
.header-inner { max-width:520px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; gap:12px; }
.back-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:none; background:transparent; color:var(--muted-foreground,#6b7280); cursor:pointer; flex-shrink:0; }
.back-btn:hover { background:var(--muted,#f3f4f6); }
.header-title { font-size:1.0625rem; font-weight:700; color:var(--foreground,#111827); }

.page-content { max-width:520px; margin:0 auto; padding:24px 16px; display:flex; flex-direction:column; gap:20px; }

/* Status */
.status-section { text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; }
.status-icon { width:96px; height:96px; border-radius:50%; display:flex; align-items:center; justify-content:center; }
.icon-green { background:linear-gradient(135deg,#16a34a,#15803d); box-shadow:0 8px 24px rgba(22,163,74,0.3); animation:scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.icon-red   { background:linear-gradient(135deg,#ef4444,#dc2626); box-shadow:0 8px 24px rgba(239,68,68,0.3);   animation:scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1); }
.icon-blue  { background:linear-gradient(135deg,#3b82f6,#2563eb); box-shadow:0 8px 24px rgba(59,130,246,0.3); }
.icon-white { color:#fff; }
@keyframes scaleIn { 0%{transform:scale(0);opacity:0} 50%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }

.status-title { font-size:1.375rem; font-weight:900; color:var(--foreground,#111827); letter-spacing:-0.02em; }
.status-sub { font-size:0.875rem; color:var(--muted-foreground,#6b7280); }
.polling-pill { display:inline-flex; align-items:center; gap:8px; padding:6px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:999px; font-size:0.75rem; font-weight:600; color:#1e40af; }
.polling-dot { width:8px; height:8px; border-radius:50%; background:#3b82f6; animation:pulse 1.5s infinite; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

/* Order Card */
.order-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:20px; padding:20px; display:flex; flex-direction:column; gap:0; }

.info-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:12px 0; }
.border-bottom { border-bottom:1px solid var(--border,#e5e7eb); }
.border-top { border-top:1px solid var(--border,#e5e7eb); margin-top:4px; }
.info-label { font-size:0.8125rem; color:var(--muted-foreground,#9ca3af); flex-shrink:0; }
.info-label-bold { font-size:0.9375rem; font-weight:700; color:var(--foreground,#111827); }
.info-value { font-size:0.875rem; font-weight:600; color:var(--foreground,#111827); text-align:right; }
.info-value-row { display:flex; align-items:center; gap:6px; }
.mono { font-family:monospace; font-size:0.8125rem; }
.total-price { font-size:1.375rem; font-weight:900; color:#16a34a; }

.copy-btn { width:28px; height:28px; display:flex; align-items:center; justify-content:center; border-radius:6px; border:none; background:var(--muted,#f3f4f6); color:var(--muted-foreground,#6b7280); cursor:pointer; transition:all 0.15s; }
.copy-btn:hover { background:#e5e7eb; }
.copy-btn.green { background:rgba(22,163,74,0.1); color:#16a34a; }

.sn-box { display:flex; align-items:flex-start; gap:10px; padding:14px; background:rgba(22,163,74,0.06); border:1px solid rgba(22,163,74,0.2); border-radius:12px; margin:8px 0; }
.sn-icon { color:#16a34a; flex-shrink:0; margin-top:2px; }
.sn-body { flex:1; }
.sn-label { font-size:0.6875rem; font-weight:700; color:#16a34a; margin-bottom:4px; }
.sn-value { font-family:monospace; font-size:0.875rem; font-weight:700; color:#15803d; word-break:break-all; }

.status-chip-wrap { display:flex; justify-content:center; padding-top:8px; }
.status-chip { display:inline-flex; align-items:center; gap:6px; padding:5px 14px; border-radius:999px; font-size:0.75rem; font-weight:700; }
.chip-green { background:rgba(22,163,74,0.1); color:#16a34a; }
.chip-red   { background:rgba(239,68,68,0.1);  color:#ef4444; }
.chip-yellow{ background:rgba(245,158,11,0.1); color:#d97706; }
.chip-dot { width:7px; height:7px; border-radius:50%; }
.dot-green { background:#16a34a; animation:pulse 2s infinite; }
.dot-red   { background:#ef4444; }
.dot-yellow{ background:#f59e0b; animation:pulse 2s infinite; }

/* Skeleton */
.skeleton-rows { display:flex; flex-direction:column; gap:12px; }
.sk-row { height:20px; background:var(--muted,#f3f4f6); border-radius:6px; animation:shimmer 1.5s infinite; }
@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }

/* Error */
.error-state { text-align:center; padding:24px; display:flex; flex-direction:column; align-items:center; gap:8px; }
.error-icon { color:#ef4444; }

/* Actions */
.actions { display:flex; flex-direction:column; gap:10px; }
.btn-primary { height:48px; background:#16a34a; color:#fff; border:none; border-radius:12px; font-size:0.9375rem; font-weight:700; cursor:pointer; transition:background 0.2s; }
.btn-primary:hover { background:#15803d; }
.btn-secondary { height:48px; background:var(--card,#fff); color:var(--foreground,#111827); border:1.5px solid var(--border,#e5e7eb); border-radius:12px; font-size:0.9375rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
.btn-secondary:hover { border-color:#16a34a; color:#16a34a; }

/* CS */
.cs-wrap { text-align:center; }
.cs-btn { display:inline-flex; align-items:center; gap:6px; font-size:0.8125rem; font-weight:600; color:#16a34a; background:none; border:none; cursor:pointer; }
.cs-btn:hover { color:#15803d; }

/* Spin */
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to{ transform:rotate(360deg); } }

/* Toast */
.toast { position:fixed; bottom:80px; left:50%; transform:translateX(-50%); background:#111827; color:#fff; padding:10px 20px; border-radius:999px; font-size:0.8125rem; font-weight:600; display:flex; align-items:center; gap:8px; z-index:100; white-space:nowrap; box-shadow:0 8px 24px rgba(0,0,0,0.2); }
.toast-enter-active,.toast-leave-active { transition:all 0.3s cubic-bezier(0.4,0,0.2,1); }
.toast-enter-from,.toast-leave-to { opacity:0; transform:translateX(-50%) translateY(10px); }
</style>
