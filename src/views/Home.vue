<template>
  <div class="min-h-screen bg-background">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

      <!-- Banner -->
      <SkeletonBanner v-if="productStore.loading" class="mb-4" />
      <BannerSlider v-else class="mb-4" @action="handleBannerAction" />

      <!-- Trust bar -->
      <div class="trust-bar mb-4">
        <div class="trust-item">
          <span class="trust-dot"></span>
          <span>Semua layanan aktif</span>
        </div>
        <div class="trust-divider"></div>
        <div class="trust-item">⚡ Proses instan</div>
        <div class="trust-divider"></div>
        <div class="trust-item">🔒 Transaksi aman</div>
      </div>

      <!-- Tabs -->
      <div class="tab-wrapper mb-4">
        <button
          @click="activeTab = 'products'"
          class="tab-btn"
          :class="activeTab === 'products' ? 'tab-active' : 'tab-inactive'"
        >
          Layanan Digital
        </button>
        <button
          @click="activeTab = 'usdt'"
          class="tab-btn"
          :class="activeTab === 'usdt' ? 'tab-active' : 'tab-inactive'"
        >
          Konversi USDT
        </button>
      </div>

      <!-- PRODUCTS TAB -->
      <div v-if="activeTab === 'products'">
        <QuickGrid @select="handleServiceSelect" />
      </div>

      <!-- USDT TAB -->
      <div v-if="activeTab === 'usdt'">
        <div class="max-w-2xl mx-auto">
          <div class="bg-white dark:bg-dark-900 border border-border rounded-2xl p-4 sm:p-6 lg:p-8">
            <div class="text-center mb-5 sm:mb-6">
              <h2 class="text-xl sm:text-2xl font-bold text-dark-800 dark:text-white mb-1.5">
                Konversi USDT ke Rupiah
              </h2>
              <p class="text-xs sm:text-sm text-dark-500 dark:text-dark-400">
                Proses pencairan cepat langsung ke rekening bank atau e-wallet Anda
              </p>
            </div>

            <form @submit.prevent="handleUsdtSubmit" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-xs font-semibold mb-1.5 text-dark-600 dark:text-dark-400">
                    Jumlah USDT
                  </label>
                  <input
                    v-model="usdtForm.amount"
                    type="number"
                    step="0.01"
                    class="w-full h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 text-sm font-medium text-dark-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
                    placeholder="100.00"
                    required
                  />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-1.5 text-dark-600 dark:text-dark-400">
                    Jaringan Blockchain
                  </label>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      v-for="net in ['TRC20', 'BEP20']"
                      :key="net"
                      @click="usdtForm.network = net"
                      class="flex-1 h-11 border rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      :class="usdtForm.network === net
                        ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                        : 'border-border text-dark-600 dark:text-dark-400 hover:border-primary-300'"
                    >
                      {{ net }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="bg-dark-50 dark:bg-dark-800 p-3 rounded-xl border border-border">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-semibold text-dark-600 dark:text-dark-400">
                    Alamat Wallet Tujuan Transfer
                  </span>
                  <button
                    type="button"
                    @click="copyWalletAddress"
                    class="text-primary-500 text-xs font-semibold hover:underline flex items-center gap-1"
                  >
                    <Copy :size="13" /> Salin
                  </button>
                </div>
                <div class="bg-white dark:bg-dark-900 p-2.5 rounded-lg font-mono text-xs break-all border border-border text-dark-700 dark:text-dark-300">
                  {{ walletAddresses[usdtForm.network] }}
                </div>
              </div>

              <div class="space-y-2.5">
                <label class="block text-xs font-semibold text-dark-600 dark:text-dark-400">
                  Informasi Rekening Penerima Dana
                </label>
                <input
                  v-model="usdtForm.customer_email"
                  type="email"
                  class="w-full h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 text-sm text-dark-700 dark:text-white focus:border-primary-500 outline-none transition-all"
                  placeholder="Alamat email Anda"
                  required
                />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    v-model="usdtForm.bank_name"
                    type="text"
                    class="w-full h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 text-sm text-dark-700 dark:text-white focus:border-primary-500 outline-none transition-all"
                    placeholder="Nama Bank atau E-Wallet"
                    required
                  />
                  <input
                    v-model="usdtForm.account_number"
                    type="text"
                    class="w-full h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 text-sm text-dark-700 dark:text-white focus:border-primary-500 outline-none transition-all"
                    placeholder="Nomor Rekening"
                    required
                  />
                </div>
                <input
                  v-model="usdtForm.account_name"
                  type="text"
                  class="w-full h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 text-sm text-dark-700 dark:text-white focus:border-primary-500 outline-none transition-all"
                  placeholder="Nama Pemilik Rekening"
                  required
                />
              </div>

              <div>
                <label class="block text-xs font-semibold mb-1.5 text-dark-600 dark:text-dark-400">
                  Bukti Transfer USDT
                </label>
                <div
                  @click="triggerUsdtFileInput"
                  class="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/10 transition-all"
                >
                  <Upload class="mx-auto mb-2 text-dark-400" :size="24" />
                  <p class="text-sm font-medium text-dark-600 dark:text-dark-400">
                    {{ usdtForm.proof ? usdtForm.proof.name : 'Klik untuk upload screenshot' }}
                  </p>
                  <p class="text-xs text-dark-400 mt-1">Format JPG atau PNG, maksimal 5MB</p>
                </div>
                <input
                  ref="usdtFileInput"
                  type="file"
                  class="hidden"
                  @change="handleUsdtFileSelect"
                  accept="image/*"
                  required
                />
              </div>

              <button
                type="submit"
                class="w-full h-11 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 active:scale-95"
                style="background: linear-gradient(135deg, #3b82f6, #22d3ee)"
                :disabled="usdtSubmitting"
              >
                <Loader v-if="usdtSubmitting" class="inline animate-spin mr-2" :size="16" />
                {{ usdtSubmitting ? 'Sedang Memproses...' : 'Kirim Permintaan Konversi' }}
              </button>
            </form>

            <div class="mt-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
              <p class="text-xs text-center text-primary-600 dark:text-primary-400 font-medium">
                Pencairan akan diproses dalam waktu 5–15 menit setelah verifikasi transfer
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-white dark:bg-dark-900 border border-primary-500 rounded-xl shadow-lg p-3 sm:p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-primary-500 flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-dark-800 dark:text-white">{{ toastMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { Check, Upload, Loader, Copy } from 'lucide-vue-next'
import BannerSlider from '@/components/BannerSlider.vue'
import QuickGrid from '@/components/home/QuickGrid.vue'
import SkeletonBanner from '@/components/SkeletonBanner.vue'
import { useProductStore } from '@/stores/productStore'
import api from '../services/api'

const productStore = useProductStore()
const activeTab = ref('products')
const usdtSubmitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const usdtFileInput = ref(null)

const usdtForm = ref({
  amount: '', network: 'TRC20', customer_email: '',
  bank_name: '', account_number: '', account_name: '', proof: null
})

const walletAddresses = {
  TRC20: import.meta.env.VITE_WALLET_TRC20 || 'TSetWalletAddressInENV',
  BEP20: import.meta.env.VITE_WALLET_BEP20 || 'BSetWalletAddressInENV'
}

const handleServiceSelect = (type) => { console.log('Service selected:', type) }
const handleBannerAction = ({ type, value }) => { if (type === 'tab') activeTab.value = value }

onMounted(async () => { await productStore.fetchProducts() })

const triggerUsdtFileInput = () => { usdtFileInput.value?.click() }
const handleUsdtFileSelect = (e) => { usdtForm.value.proof = e.target.files[0] }

const copyWalletAddress = async () => {
  try {
    await navigator.clipboard.writeText(walletAddresses[usdtForm.value.network])
    toastMessage.value = 'Alamat berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch { alert('Gagal menyalin alamat') }
}

const handleUsdtSubmit = async () => {
  if (!usdtForm.value.proof) { alert('Upload bukti transfer terlebih dahulu'); return }
  usdtSubmitting.value = true
  try {
    const fd = new FormData()
    const rate = 16000
    fd.append('amount', usdtForm.value.amount)
    fd.append('network', usdtForm.value.network)
    fd.append('customer_email', usdtForm.value.customer_email)
    fd.append('bank_name', usdtForm.value.bank_name)
    fd.append('account_number', usdtForm.value.account_number)
    fd.append('account_name', usdtForm.value.account_name)
    fd.append('proof', usdtForm.value.proof)
    fd.append('idr_received', parseFloat(usdtForm.value.amount) * rate)
    await api.usdt.submit(fd)
    toastMessage.value = 'Permintaan berhasil dikirim'
    showToast.value = true
    setTimeout(() => showToast.value = false, 3000)
    usdtForm.value = { amount: '', network: 'TRC20', customer_email: '', bank_name: '', account_number: '', account_name: '', proof: null }
  } catch { alert('Gagal mengirim permintaan') }
  finally { usdtSubmitting.value = false }
}
</script>

<style scoped>
/* Trust bar */
.trust-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: white;
  border: 1px solid rgba(56, 189, 248, 0.2);
  border-radius: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.trust-bar::-webkit-scrollbar { display: none; }

.dark .trust-bar {
  background: rgb(15 20 30);
  border-color: rgba(56, 189, 248, 0.1);
}

.trust-item {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.7rem;
  font-weight: 600;
  color: rgb(75 85 99);
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
}

.dark .trust-item { color: rgb(156 163 175); }

.trust-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #00c853;
  box-shadow: 0 0 0 2px rgba(0, 200, 83, 0.2);
}

.trust-divider {
  width: 1px;
  height: 12px;
  background: rgb(229 231 235);
  flex-shrink: 0;
}

.dark .trust-divider { background: rgb(42 49 66); }

/* Tabs */
.tab-wrapper {
  display: flex;
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 12px;
  padding: 3px;
  gap: 3px;
}

.dark .tab-wrapper {
  background: rgb(15 20 30);
  border-color: rgb(42 49 66);
}

.tab-btn {
  flex: 1;
  padding: 0.5rem 1rem;
  font-size: 0.8125rem;
  font-weight: 600;
  border-radius: 9px;
  transition: all 0.2s;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.01em;
}

.tab-active {
  background: linear-gradient(135deg, #3b82f6, #22d3ee);
  color: white;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.3);
}

.tab-inactive {
  color: rgb(107 114 128);
  background: transparent;
}

.dark .tab-inactive { color: rgb(156 163 175); }
.tab-inactive:hover { background: rgb(243 244 246); }
.dark .tab-inactive:hover { background: rgb(31 41 55); }

/* Toast */
.toast-enter-active, .toast-leave-active { transition: all 0.3s ease; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(100%); }
</style>