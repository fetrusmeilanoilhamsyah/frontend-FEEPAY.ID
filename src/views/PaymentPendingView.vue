<template>
  <div class="pending-page">

    <!-- Header -->
    <div class="pending-header">
      <div class="header-inner">
        <button @click="$router.push('/')" class="back-btn"><ArrowLeft :size="20" /></button>
        <h1 class="header-title">Status Pembayaran</h1>
      </div>
    </div>

    <div class="page-content">

      <!-- Icon + Title -->
      <div class="status-section">
        <div class="pending-icon">
          <Clock :size="40" class="clock-icon" />
        </div>
        <h2 class="status-title">Menunggu Pembayaran</h2>
        <p class="status-sub">Selesaikan pembayaran sebelum waktu habis</p>
      </div>

      <!-- Countdown -->
      <div v-if="timeRemaining !== null" class="countdown-card">
        <span class="countdown-label">Batas Waktu</span>
        <span class="countdown-time" :class="{ urgent: timeRemaining < 300000 }">{{ formatTime(timeRemaining) }}</span>
      </div>

      <!-- Order Info -->
      <div class="order-card">
        <div v-if="loading" class="skeleton-rows">
          <div class="sk-row" v-for="i in 3" :key="i" />
        </div>
        <template v-else-if="order">
          <div class="info-row border-bottom">
            <span class="info-label">Order ID</span>
            <span class="info-value mono">{{ order.order_id }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Produk</span>
            <span class="info-value">{{ order.product_name }}</span>
          </div>
          <div class="info-row border-top">
            <span class="info-label-bold">Total</span>
            <span class="total-price">Rp{{ Number(order.total_price).toLocaleString('id') }}</span>
          </div>
        </template>
      </div>

      <!-- Steps -->
      <div class="steps-card">
        <h3 class="steps-title">Cara Pembayaran</h3>
        <div class="steps">
          <div v-for="(step, i) in steps" :key="i" class="step">
            <div class="step-num">{{ i + 1 }}</div>
            <p class="step-text">{{ step }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="actions">
        <button @click="checkStatus" :disabled="checking" class="btn-primary">
          <Loader v-if="checking" class="spin" :size="16" />
          {{ checking ? 'Mengecek...' : 'Cek Status Pembayaran' }}
        </button>
        <button @click="$router.push('/')" class="btn-secondary">Kembali ke Beranda</button>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Clock, Loader } from 'lucide-vue-next'
import api from '@/services/api'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const orderStore = useOrderStore()

const loading   = ref(true)
const checking  = ref(false)
const order     = ref(null)
const timeRemaining = ref(null)
const orderId   = route.params.orderId
let intervalId  = null

const steps = [
  'Pilih metode pembayaran di popup Midtrans',
  'Selesaikan pembayaran sesuai instruksi',
  'Tunggu notifikasi pembayaran berhasil',
]

const fetchOrder = async () => {
  loading.value = true
  try {
    const email = orderStore.currentOrder?.customer_email
    const res = await api.orders.get(orderId, email)
    order.value = res
    if (res.created_at) {
      const expires = new Date(new Date(res.created_at).getTime() + 24*60*60*1000)
      timeRemaining.value = Math.max(0, expires - new Date())
    }
  } catch {} finally { loading.value = false }
}

const checkStatus = async () => {
  checking.value = true
  try {
    const email = orderStore.currentOrder?.customer_email
    const res = await api.orders.get(orderId, email)
    if (res.status === 'success') router.push({ name:'payment-success', params:{ orderId } })
    else if (res.status === 'failed') { alert('Pembayaran gagal atau dibatalkan'); router.push('/') }
    else alert('Pembayaran masih pending. Silakan selesaikan pembayaran.')
  } catch { alert('Gagal mengecek status') } finally { checking.value = false }
}

const formatTime = (ms) => {
  const h = Math.floor(ms/3600000)
  const m = Math.floor((ms%3600000)/60000)
  const s = Math.floor((ms%60000)/1000)
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`
}

onMounted(() => {
  fetchOrder()
  intervalId = setInterval(() => {
    if (timeRemaining.value > 0) timeRemaining.value -= 1000
    else clearInterval(intervalId)
  }, 1000)
})
onUnmounted(() => { if (intervalId) clearInterval(intervalId) })
</script>

<style scoped>
.pending-page { min-height:100vh; background:var(--background,#f8fafc); padding-bottom:40px; }

.pending-header { position:sticky; top:0; z-index:40; background:var(--card,#fff); border-bottom:1px solid var(--border,#e5e7eb); }
.header-inner { max-width:520px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; gap:12px; }
.back-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:none; background:transparent; color:var(--muted-foreground,#6b7280); cursor:pointer; flex-shrink:0; }
.back-btn:hover { background:var(--muted,#f3f4f6); }
.header-title { font-size:1.0625rem; font-weight:700; color:var(--foreground,#111827); }

.page-content { max-width:520px; margin:0 auto; padding:24px 16px; display:flex; flex-direction:column; gap:16px; }

.status-section { text-align:center; display:flex; flex-direction:column; align-items:center; gap:10px; }
.pending-icon { width:96px; height:96px; border-radius:50%; background:rgba(245,158,11,0.12); border:2px solid rgba(245,158,11,0.3); display:flex; align-items:center; justify-content:center; animation:pulse 2s infinite; }
.clock-icon { color:#f59e0b; }
@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.6} }
.status-title { font-size:1.375rem; font-weight:900; color:var(--foreground,#111827); }
.status-sub { font-size:0.875rem; color:var(--muted-foreground,#6b7280); }

.countdown-card { display:flex; align-items:center; justify-content:space-between; padding:16px 20px; background:rgba(245,158,11,0.08); border:1px solid rgba(245,158,11,0.3); border-radius:14px; }
.countdown-label { font-size:0.875rem; font-weight:600; color:#92400e; }
.countdown-time { font-size:1.75rem; font-weight:900; font-family:monospace; color:#f59e0b; letter-spacing:0.05em; }
.countdown-time.urgent { color:#ef4444; animation:pulse 1s infinite; }

.order-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:20px; }
.skeleton-rows { display:flex; flex-direction:column; gap:12px; }
.sk-row { height:18px; background:var(--muted,#f3f4f6); border-radius:6px; animation:shimmer 1.5s infinite; }
@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }
.info-row { display:flex; align-items:center; justify-content:space-between; gap:12px; padding:11px 0; }
.border-bottom { border-bottom:1px solid var(--border,#e5e7eb); }
.border-top { border-top:1px solid var(--border,#e5e7eb); margin-top:4px; }
.info-label { font-size:0.8125rem; color:var(--muted-foreground,#9ca3af); }
.info-label-bold { font-size:0.9375rem; font-weight:700; color:var(--foreground,#111827); }
.info-value { font-size:0.875rem; font-weight:600; color:var(--foreground,#111827); text-align:right; }
.mono { font-family:monospace; font-size:0.8125rem; }
.total-price { font-size:1.375rem; font-weight:900; color:#16a34a; }

.steps-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:20px; }
.steps-title { font-size:0.875rem; font-weight:700; color:var(--foreground,#111827); margin-bottom:16px; }
.steps { display:flex; flex-direction:column; gap:12px; }
.step { display:flex; align-items:flex-start; gap:12px; }
.step-num { width:24px; height:24px; border-radius:50%; background:#16a34a; color:#fff; font-size:0.6875rem; font-weight:800; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
.step-text { font-size:0.875rem; color:var(--foreground,#374151); line-height:1.5; padding-top:3px; }

.actions { display:flex; flex-direction:column; gap:10px; }
.btn-primary { height:48px; background:#16a34a; color:#fff; border:none; border-radius:12px; font-size:0.9375rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.2s; }
.btn-primary:hover:not(:disabled) { background:#15803d; }
.btn-primary:disabled { opacity:0.6; cursor:not-allowed; }
.btn-secondary { height:48px; background:var(--card,#fff); color:var(--foreground,#111827); border:1.5px solid var(--border,#e5e7eb); border-radius:12px; font-size:0.9375rem; font-weight:600; cursor:pointer; transition:all 0.2s; }
.btn-secondary:hover { border-color:#16a34a; color:#16a34a; }

.spin { animation:spin 1s linear infinite; }
@keyframes spin { to{ transform:rotate(360deg); } }
</style>