<template>
  <div class="home">
    <div class="home-inner">

      <!-- Banner -->
      <SkeletonBanner v-if="productStore.loading" class="mb-3" />
      <BannerSlider v-else class="mb-3" @action="handleBannerAction" />

      <!-- Trust bar -->
      <div class="trust-bar mb-3">
        <div class="trust-item">
          <span class="trust-dot"></span>
          <span>24 Jam Aktif</span>
        </div>
        <div class="trust-sep"></div>
        <div class="trust-item">
          <Zap :size="12" class="trust-icon" />
          <span>Proses Cepat</span>
        </div>
        <div class="trust-sep"></div>
        <div class="trust-item">
          <ShieldCheck :size="12" class="trust-icon" />
          <span>Aman Terpercaya</span>
        </div>
      </div>

      <!-- Pending Order Banner -->
      <div
        v-if="pendingOrders.length > 0"
        class="notif-bar mb-3"
        @click="router.push('/transactions')"
      >
        <div class="notif-dot"></div>
        <div class="notif-text">
          <span class="notif-title">{{ pendingOrders.length }} pesanan sedang diproses</span>
          <span class="notif-sub">{{ pendingOrders[0].product_name }} · Ketuk untuk lihat</span>
        </div>
        <ChevronRight :size="16" class="notif-arrow" />
      </div>

      <!-- Tabs -->
      <div class="tabs mb-4">
        <button
          @click="activeTab = 'products'"
          class="tab"
          :class="{ 'tab--active': activeTab === 'products' }"
        >
          Layanan Digital
        </button>
        <button
          @click="activeTab = 'usdt'"
          class="tab"
          :class="{ 'tab--active': activeTab === 'usdt' }"
        >
          Konversi USDT
        </button>
      </div>

      <!-- PRODUCTS TAB -->
      <div v-if="activeTab === 'products'">
        <QuickGrid @select="handleServiceSelect" />
        <HowItWorks />
      </div>

      <!-- USDT TAB -->
      <div v-if="activeTab === 'usdt'">
        <div class="usdt-card">
          <div class="usdt-header">
            <p class="usdt-title">Konversi USDT ke Rupiah</p>
            <p class="usdt-sub">Pencairan ke rekening atau e-wallet Anda</p>
          </div>

          <form @submit.prevent="handleUsdtSubmit" class="usdt-form">

            <div class="field">
              <label class="field-label">Jumlah USDT</label>
              <input v-model="usdtForm.amount" type="number" step="0.01" class="field-input" placeholder="0.00" required />
            </div>

            <div class="field">
              <label class="field-label">Jaringan</label>
              <div class="network-btns">
                <button
                  type="button"
                  v-for="net in ['TRC20', 'BEP20']"
                  :key="net"
                  @click="usdtForm.network = net"
                  class="network-btn"
                  :class="{ 'network-btn--active': usdtForm.network === net }"
                >
                  {{ net }}
                </button>
              </div>
            </div>

            <div class="wallet-box">
              <div class="wallet-top">
                <span class="field-label">Alamat Wallet Tujuan</span>
                <button type="button" class="copy-btn" @click="copyWalletAddress">
                  <Copy :size="12" />
                  <span>{{ copied ? 'Disalin!' : 'Salin' }}</span>
                </button>
              </div>
              <p class="wallet-addr">{{ walletAddresses[usdtForm.network] }}</p>
            </div>

            <div class="form-divider">
              <span>Informasi Rekening Penerima</span>
            </div>

            <div class="field">
              <input v-model="usdtForm.customer_email" type="email" class="field-input" placeholder="Email Anda" required />
            </div>

            <div class="field-row">
              <div class="field">
                <input v-model="usdtForm.bank_name" type="text" class="field-input" placeholder="Bank / E-Wallet" required />
              </div>
              <div class="field">
                <input v-model="usdtForm.account_number" type="text" class="field-input" placeholder="No. Rekening" required />
              </div>
            </div>

            <div class="field">
              <input v-model="usdtForm.account_name" type="text" class="field-input" placeholder="Nama Pemilik Rekening" required />
            </div>

            <div class="upload-area" @click="triggerUsdtFileInput" :class="{ 'upload-area--filled': usdtForm.proof }">
              <Upload :size="20" class="upload-icon" />
              <span class="upload-text">{{ usdtForm.proof ? usdtForm.proof.name : 'Upload bukti transfer' }}</span>
              <span class="upload-hint">JPG / PNG, maks 5MB</span>
            </div>
            <input ref="usdtFileInput" type="file" class="hidden" @change="handleUsdtFileSelect" accept="image/*" required />

            <button type="submit" class="submit-btn" :disabled="usdtSubmitting">
              <Loader v-if="usdtSubmitting" class="animate-spin" :size="16" />
              <span>{{ usdtSubmitting ? 'Memproses...' : 'Kirim Permintaan' }}</span>
            </button>

          </form>

          <p class="usdt-note">Verifikasi 5–15 menit setelah transfer dikonfirmasi</p>
        </div>
      </div>

    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" class="toast">
        <Check :size="15" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check, Upload, Loader, Copy, Zap, ShieldCheck, ChevronRight } from 'lucide-vue-next'
import BannerSlider from '@/components/BannerSlider.vue'
import QuickGrid from '@/components/home/QuickGrid.vue'
import SkeletonBanner from '@/components/SkeletonBanner.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import { useProductStore } from '@/stores/productStore'
import { useOrderStore } from '@/stores/orderStore'
import api from '../services/api'

const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()

const activeTab = ref('products')
const usdtSubmitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const usdtFileInput = ref(null)
const copied = ref(false)

const pendingOrders = computed(() => orderStore.pendingOrders)

const usdtForm = ref({
  amount: '', network: 'TRC20', customer_email: '',
  bank_name: '', account_number: '', account_name: '', proof: null
})

const walletAddresses = {
  TRC20: import.meta.env.VITE_WALLET_TRC20 || 'TSetWalletAddressInENV',
  BEP20: import.meta.env.VITE_WALLET_BEP20 || 'BSetWalletAddressInENV'
}

const handleServiceSelect = (type) => {}
const handleBannerAction = ({ type, value }) => { if (type === 'tab') activeTab.value = value }

onMounted(async () => { await productStore.fetchProducts() })

const triggerUsdtFileInput = () => { usdtFileInput.value?.click() }
const handleUsdtFileSelect = (e) => { usdtForm.value.proof = e.target.files[0] }

const showToastMsg = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 2000)
}

const copyWalletAddress = async () => {
  const text = walletAddresses[usdtForm.value.network]
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text)
    } else {
      const el = document.createElement('textarea')
      el.value = text
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.focus()
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    copied.value = true
    showToastMsg('Alamat berhasil disalin')
    setTimeout(() => copied.value = false, 2000)
  } catch {
    showToastMsg('Gagal menyalin')
  }
}

const handleUsdtSubmit = async () => {
  if (!usdtForm.value.proof) { alert('Upload bukti transfer terlebih dahulu'); return }
  usdtSubmitting.value = true
  try {
    const fd = new FormData()
    fd.append('amount', usdtForm.value.amount)
    fd.append('network', usdtForm.value.network)
    fd.append('customer_email', usdtForm.value.customer_email)
    fd.append('bank_name', usdtForm.value.bank_name)
    fd.append('account_number', usdtForm.value.account_number)
    fd.append('account_name', usdtForm.value.account_name)
    fd.append('proof', usdtForm.value.proof)
    fd.append('idr_received', parseFloat(usdtForm.value.amount) * 16000)
    await api.usdt.submit(fd)
    showToastMsg('Permintaan berhasil dikirim')
    usdtForm.value = { amount: '', network: 'TRC20', customer_email: '', bank_name: '', account_number: '', account_name: '', proof: null }
  } catch {
    showToastMsg('Gagal mengirim permintaan')
  } finally {
    usdtSubmitting.value = false
  }
}
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--background);
}

.home-inner {
  max-width: 480px;
  margin: 0 auto;
  padding: 12px 16px 32px;
}

/* Trust bar */
.trust-bar {
  display: flex;
  align-items: center;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 10px 16px;
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 5px;
  flex: 1;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
}

.trust-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  flex-shrink: 0;
  animation: glow 2s ease-in-out infinite;
}

.trust-icon {
  color: var(--muted-foreground);
  flex-shrink: 0;
}

@keyframes glow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
  50% { box-shadow: 0 0 0 4px rgba(34,197,94,0.1); }
}

.trust-sep {
  width: 1px;
  height: 16px;
  background: var(--border);
  flex-shrink: 0;
}

/* Notif bar */
.notif-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--card);
  border: 1px solid var(--border);
  border-left: 3px solid #f59e0b;
  border-radius: 12px;
  cursor: pointer;
  transition: background 0.15s;
}

.notif-bar:hover { background: var(--muted); }

.notif-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #f59e0b;
  flex-shrink: 0;
  animation: glow-yellow 1.5s ease-in-out infinite;
}

@keyframes glow-yellow {
  0%, 100% { box-shadow: 0 0 0 0 rgba(245,158,11,0.5); }
  50% { box-shadow: 0 0 0 4px rgba(245,158,11,0.1); }
}

.notif-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.notif-title {
  font-size: 12px;
  font-weight: 700;
  color: var(--foreground);
}

.notif-sub {
  font-size: 11px;
  color: var(--muted-foreground);
}

.notif-arrow { color: var(--muted-foreground); flex-shrink: 0; }

/* Tabs */
.tabs {
  display: flex;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 3px;
  gap: 3px;
}

.tab {
  flex: 1;
  padding: 8px 12px;
  font-size: 13px;
  font-weight: 600;
  border-radius: 9px;
  transition: all 0.2s;
  color: var(--muted-foreground);
  background: transparent;
}

.tab--active {
  background: var(--primary);
  color: var(--primary-foreground);
  box-shadow: 0 2px 8px rgba(59,130,246,0.25);
}

.tab:not(.tab--active):hover {
  background: var(--muted);
  color: var(--foreground);
}

/* USDT Card */
.usdt-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  overflow: hidden;
}

.usdt-header {
  padding: 20px 20px 0;
  text-align: center;
}

.usdt-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 4px;
}

.usdt-sub {
  font-size: 12px;
  color: var(--muted-foreground);
}

.usdt-form {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.field { display: flex; flex-direction: column; gap: 6px; }

.field-label {
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.field-input {
  height: 44px;
  background: var(--background);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 0 14px;
  font-size: 14px;
  color: var(--foreground);
  outline: none;
  transition: border-color 0.15s;
  width: 100%;
}

.field-input:focus { border-color: var(--primary); }
.field-input::placeholder { color: var(--muted-foreground); opacity: 0.6; }

.field-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.network-btns { display: flex; gap: 8px; }

.network-btn {
  flex: 1;
  height: 40px;
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  color: var(--muted-foreground);
  background: var(--background);
  transition: all 0.15s;
}

.network-btn--active {
  border-color: var(--primary);
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 8%, transparent);
}

.wallet-box {
  background: var(--background);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
}

.wallet-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.copy-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 700;
  color: var(--primary);
  padding: 4px 10px;
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  border-radius: 6px;
  transition: all 0.15s;
}

.copy-btn:hover { background: color-mix(in srgb, var(--primary) 15%, transparent); }

.wallet-addr {
  font-family: 'Courier New', monospace;
  font-size: 11px;
  color: var(--foreground);
  word-break: break-all;
  line-height: 1.5;
}

.form-divider {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 11px;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.form-divider::before,
.form-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border);
}

.upload-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 20px;
  border: 1.5px dashed var(--border);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
}

.upload-area:hover,
.upload-area--filled {
  border-color: var(--primary);
  background: color-mix(in srgb, var(--primary) 5%, transparent);
}

.upload-icon { color: var(--muted-foreground); }
.upload-text { font-size: 13px; font-weight: 600; color: var(--foreground); }
.upload-hint { font-size: 11px; color: var(--muted-foreground); }

.submit-btn {
  height: 48px;
  background: var(--primary);
  color: var(--primary-foreground);
  border-radius: 12px;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: opacity 0.15s, transform 0.1s;
}

.submit-btn:hover:not(:disabled) { opacity: 0.92; }
.submit-btn:active:not(:disabled) { transform: scale(0.98); }
.submit-btn:disabled { opacity: 0.5; cursor: not-allowed; }

.usdt-note {
  text-align: center;
  font-size: 11px;
  color: var(--muted-foreground);
  padding: 12px 20px 16px;
  border-top: 1px solid var(--border);
}

/* Toast */
.toast {
  position: fixed;
  bottom: 80px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--foreground);
  color: var(--background);
  padding: 10px 18px;
  border-radius: 100px;
  font-size: 13px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
  z-index: 100;
  white-space: nowrap;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
}

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(8px); }
</style>