<template>
  <div class="min-h-screen bg-background">
    <div class="border-b border-border bg-white dark:bg-dark-900">
      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div class="flex items-center justify-between">
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight">
            <span class="text-dark-800 dark:text-white">FEE</span><span class="text-primary-600 dark:text-primary-400">PAY.ID</span>
          </h1>
          <div class="hidden sm:block">
            <p class="text-xs font-semibold text-dark-500 dark:text-dark-400">Transaksi Digital Mudah & Aman</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

      <!-- Banner Slider -->
      <SkeletonBanner v-if="productStore.loading" class="mb-6" />
      <BannerSlider v-else class="mb-6" @action="handleBannerAction" />

      <!-- Tabs -->
      <div class="mb-4 sm:mb-6">
        <div class="inline-flex w-full sm:w-auto bg-white dark:bg-dark-900 p-1 rounded-xl border border-border shadow-sm">
          <button @click="activeTab = 'products'"
            class="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-all"
            :class="activeTab === 'products'
              ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 shadow-sm'
              : 'text-dark-600 dark:text-dark-400'">
            Layanan Digital
          </button>
          <button @click="activeTab = 'usdt'"
            class="flex-1 sm:flex-initial px-4 sm:px-8 py-2.5 sm:py-3 font-semibold text-xs sm:text-sm rounded-lg transition-all"
            :class="activeTab === 'usdt'
              ? 'bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400 shadow-sm'
              : 'text-dark-600 dark:text-dark-400'">
            Konversi USDT
          </button>
        </div>
      </div>

      <!-- ==================== PRODUCTS TAB ==================== -->
      <div v-if="activeTab === 'products'">

        <!-- Search -->
        <div class="mb-4 sm:mb-6">
          <div class="relative">
            <Search class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-dark-400" :size="18" />
            <input v-model="searchQuery" type="text"
              placeholder="Cari produk..."
              class="w-full h-11 sm:h-12 bg-white dark:bg-dark-900 border border-border rounded-xl pl-10 sm:pl-12 pr-3 sm:pr-4 text-sm font-medium text-dark-700 dark:text-white placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all" />
          </div>
        </div>

        <!-- Category Pills -->
        <div class="flex gap-2 overflow-x-auto pb-3 mb-4 sm:mb-6 scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
          <button v-for="cat in productStore.categories" :key="cat" @click="selectedCategory = cat"
            class="flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold border transition-all"
            :class="selectedCategory === cat
              ? 'bg-primary-600 border-primary-600 text-white shadow-sm'
              : 'bg-white dark:bg-dark-900 border-border text-dark-600 dark:text-dark-400 hover:border-primary-300'">
            {{ cat }}
          </button>
        </div>

        <!-- Loading Skeletons -->
        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <SkeletonProductCard v-for="i in 8" :key="i" />
        </div>

        <!-- Products -->
        <div v-else class="space-y-8 sm:space-y-12">

          <section v-if="showCategory('Pulsa')" class="space-y-3 sm:space-y-4">
            <div class="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-primary-600">
              <Smartphone class="text-dark-700 dark:text-dark-300" :size="18" />
              <h2 class="text-base sm:text-lg font-bold text-dark-800 dark:text-white">Pulsa</h2>
              <span class="ml-auto text-xs text-dark-500 dark:text-dark-400 font-medium hidden sm:inline">Semua operator tersedia</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <ProductCard v-for="product in getDisplayedProducts('Pulsa')"
                :key="product.id" :product="product" @select="openCheckout" />
            </div>
            <button v-if="hasMoreProducts('Pulsa')" @click="loadMore('Pulsa')"
              class="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 border border-border rounded-lg transition-all">
              Tampilkan Produk Lainnya
            </button>
          </section>

          <section v-if="showCategory('Data')" class="space-y-3 sm:space-y-4">
            <div class="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-primary-600">
              <Globe class="text-dark-700 dark:text-dark-300" :size="18" />
              <h2 class="text-base sm:text-lg font-bold text-dark-800 dark:text-white">Paket Data</h2>
              <span class="ml-auto text-xs text-dark-500 dark:text-dark-400 font-medium hidden sm:inline">Aktif otomatis</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <ProductCard v-for="product in getDisplayedProducts('Data')"
                :key="product.id" :product="product" @select="openCheckout" />
            </div>
            <button v-if="hasMoreProducts('Data')" @click="loadMore('Data')"
              class="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 border border-border rounded-lg transition-all">
              Tampilkan Produk Lainnya
            </button>
          </section>

          <section v-if="showCategory('E-Wallet')" class="space-y-3 sm:space-y-4">
            <div class="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-primary-600">
              <CreditCard class="text-dark-700 dark:text-dark-300" :size="18" />
              <h2 class="text-base sm:text-lg font-bold text-dark-800 dark:text-white">E-Wallet</h2>
              <span class="ml-auto text-xs text-dark-500 dark:text-dark-400 font-medium hidden sm:inline">Proses instan</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <ProductCard v-for="product in getDisplayedProducts('E-Wallet')"
                :key="product.id" :product="product" @select="openCheckout" />
            </div>
            <button v-if="hasMoreProducts('E-Wallet')" @click="loadMore('E-Wallet')"
              class="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 border border-border rounded-lg transition-all">
              Tampilkan Produk Lainnya
            </button>
          </section>

          <section v-if="showCategory('Game')" class="space-y-3 sm:space-y-4">
            <div class="flex items-center gap-2 sm:gap-3 pb-2 sm:pb-3 border-b-2 border-primary-600">
              <Gamepad2 class="text-dark-700 dark:text-dark-300" :size="18" />
              <h2 class="text-base sm:text-lg font-bold text-dark-800 dark:text-white">Voucher Game</h2>
              <span class="ml-auto text-xs text-dark-500 dark:text-dark-400 font-medium hidden sm:inline">Harga kompetitif</span>
            </div>
            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              <ProductCard v-for="product in getDisplayedProducts('Game')"
                :key="product.id" :product="product" @select="openCheckout" />
            </div>
            <button v-if="hasMoreProducts('Game')" @click="loadMore('Game')"
              class="w-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/20 border border-border rounded-lg transition-all">
              Tampilkan Produk Lainnya
            </button>
          </section>

          <div v-if="filteredProducts.length === 0" class="text-center py-12">
            <Package class="mx-auto mb-3 text-dark-300 dark:text-dark-700" :size="48" />
            <p class="text-sm text-dark-500 dark:text-dark-400 font-medium">Produk tidak ditemukan</p>
          </div>

        </div>
      </div>

      <!-- ==================== USDT TAB ==================== -->
      <div v-if="activeTab === 'usdt'">
        <div class="max-w-2xl mx-auto">
          <div class="bg-white dark:bg-dark-900 border border-border rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">
            <div class="text-center mb-5 sm:mb-6">
              <h2 class="text-xl sm:text-2xl lg:text-3xl font-bold text-dark-800 dark:text-white mb-2">Konversi USDT ke Rupiah</h2>
              <p class="text-xs sm:text-sm text-dark-500 dark:text-dark-400">Proses pencairan cepat langsung ke rekening bank atau e-wallet Anda</p>
            </div>

            <form @submit.prevent="handleUsdtSubmit" class="space-y-4 sm:space-y-5">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label class="block text-xs font-semibold mb-2 text-dark-600 dark:text-dark-400">Jumlah USDT</label>
                  <input v-model="usdtForm.amount" type="number" step="0.01"
                    class="w-full h-11 sm:h-12 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 sm:px-4 text-sm font-medium text-dark-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
                    placeholder="100.00" required />
                </div>
                <div>
                  <label class="block text-xs font-semibold mb-2 text-dark-600 dark:text-dark-400">Jaringan Blockchain</label>
                  <div class="flex gap-2">
                    <button type="button" v-for="net in ['TRC20', 'BEP20']" :key="net" @click="usdtForm.network = net"
                      class="flex-1 h-11 sm:h-12 border rounded-lg font-semibold text-xs sm:text-sm transition-all"
                      :class="usdtForm.network === net
                        ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20 text-primary-700 dark:text-primary-400'
                        : 'border-border text-dark-600 dark:text-dark-400 hover:border-primary-300'">
                      {{ net }}
                    </button>
                  </div>
                </div>
              </div>

              <div class="bg-dark-50 dark:bg-dark-800 p-3 sm:p-4 rounded-xl border border-border">
                <div class="flex justify-between items-center mb-2">
                  <span class="text-xs font-semibold text-dark-600 dark:text-dark-400">Alamat Wallet Tujuan Transfer</span>
                  <button type="button" @click="copyWalletAddress"
                    class="text-primary-600 dark:text-primary-400 text-xs font-semibold hover:underline flex items-center gap-1">
                    <Copy :size="13" /> Salin
                  </button>
                </div>
                <div class="bg-white dark:bg-dark-900 p-2.5 sm:p-3 rounded-lg font-mono text-xs break-all border border-border text-dark-700 dark:text-dark-300">
                  {{ walletAddresses[usdtForm.network] }}
                </div>
              </div>

              <div class="space-y-3">
                <label class="block text-xs font-semibold text-dark-600 dark:text-dark-400">Informasi Rekening Penerima Dana</label>
                <input v-model="usdtForm.customer_email" type="email"
                  class="w-full h-10 sm:h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 sm:px-4 text-sm text-dark-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
                  placeholder="Alamat email Anda" required />
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input v-model="usdtForm.bank_name" type="text"
                    class="w-full h-10 sm:h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 sm:px-4 text-sm text-dark-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
                    placeholder="Nama Bank atau E-Wallet" required />
                  <input v-model="usdtForm.account_number" type="text"
                    class="w-full h-10 sm:h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 sm:px-4 text-sm text-dark-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
                    placeholder="Nomor Rekening" required />
                </div>
                <input v-model="usdtForm.account_name" type="text"
                  class="w-full h-10 sm:h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3 sm:px-4 text-sm text-dark-700 dark:text-white focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
                  placeholder="Nama Pemilik Rekening" required />
              </div>

              <div>
                <label class="block text-xs font-semibold mb-2 text-dark-600 dark:text-dark-400">Bukti Transfer USDT</label>
                <div @click="triggerUsdtFileInput"
                  class="border-2 border-dashed border-border rounded-xl p-5 sm:p-6 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-950/10 transition-all">
                  <Upload class="mx-auto mb-2 text-dark-400" :size="26" />
                  <p class="text-sm font-medium text-dark-600 dark:text-dark-400">
                    {{ usdtForm.proof ? usdtForm.proof.name : 'Klik untuk upload screenshot' }}
                  </p>
                  <p class="text-xs text-dark-400 mt-1">Format JPG atau PNG, maksimal 5MB</p>
                </div>
                <input ref="usdtFileInput" type="file" class="hidden" @change="handleUsdtFileSelect" accept="image/*" required />
              </div>

              <button type="submit"
                class="w-full h-11 sm:h-12 bg-primary-600 text-white rounded-xl font-semibold text-sm shadow-sm hover:bg-primary-700 transition-all disabled:opacity-50"
                :disabled="usdtSubmitting">
                <Loader v-if="usdtSubmitting" class="inline animate-spin mr-2" :size="16" />
                {{ usdtSubmitting ? 'Sedang Memproses...' : 'Kirim Permintaan Konversi' }}
              </button>
            </form>

            <div class="mt-4 sm:mt-5 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
              <p class="text-xs text-center text-primary-700 dark:text-primary-400 font-medium">
                Pencairan akan diproses dalam waktu 5-15 menit setelah verifikasi transfer
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>

    <CheckoutModal v-if="selectedProduct" :product="selectedProduct" @close="closeCheckout" />

    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-white dark:bg-dark-900 border border-primary-600 rounded-xl shadow-lg p-3 sm:p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-primary-600 flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-dark-800 dark:text-white">{{ toastMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { Search, Smartphone, Globe, CreditCard, Gamepad2, Package, Check, Upload, Loader, Copy } from 'lucide-vue-next'
import ProductCard from '../components/ProductCard.vue'
import CheckoutModal from '../components/CheckoutModal.vue'
import BannerSlider from '@/components/BannerSlider.vue'
import SkeletonProductCard from '@/components/SkeletonProductCard.vue'
import SkeletonBanner from '@/components/SkeletonBanner.vue'
import { useProductStore } from '@/stores/productStore'
import api from '../services/api'

const productStore = useProductStore()

const activeTab = ref('products')
const selectedCategory = ref('Semua')
const searchQuery = ref('')
const selectedProduct = ref(null)
const usdtSubmitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const usdtFileInput = ref(null)

const loadLimits = ref({
  Pulsa: 20,
  Data: 20,
  'E-Wallet': 20,
  Game: 20
})

const usdtForm = ref({
  amount: '',
  network: 'TRC20',
  customer_email: '',
  bank_name: '',
  account_number: '',
  account_name: '',
  proof: null
})

const walletAddresses = {
  TRC20: import.meta.env.VITE_WALLET_TRC20 || 'TSetWalletAddressInENV',
  BEP20: import.meta.env.VITE_WALLET_BEP20 || 'BSetWalletAddressInENV'
}

// FIX: handler untuk BannerSlider @action emit
const handleBannerAction = ({ type, value }) => {
  if (type === 'tab') {
    activeTab.value = value
  }
  if (type === 'category') {
    activeTab.value = 'products'
    selectedCategory.value = value
  }
}

const filteredProducts = computed(() => {
  if (searchQuery.value) {
    return productStore.searchProducts(searchQuery.value)
  }
  return productStore.productsByCategory(selectedCategory.value)
})

const getProductsByCategory = (category) => {
  return productStore.productsByCategory(category)
}

const getDisplayedProducts = (category) => {
  const allProducts = getProductsByCategory(category)
  return allProducts.slice(0, loadLimits.value[category])
}

const hasMoreProducts = (category) => {
  const total = getProductsByCategory(category).length
  return loadLimits.value[category] < total
}

const loadMore = (category) => {
  loadLimits.value[category] += 20
}

const showCategory = (category) => {
  if (selectedCategory.value !== 'Semua' && selectedCategory.value !== category) {
    return false
  }
  if (searchQuery.value) {
    return getProductsByCategory(category).length > 0
  }
  return true
}

onMounted(async () => {
  await productStore.fetchProducts()
})

const triggerUsdtFileInput = () => { usdtFileInput.value?.click() }
const handleUsdtFileSelect = (e) => { usdtForm.value.proof = e.target.files[0] }

const copyWalletAddress = async () => {
  try {
    await navigator.clipboard.writeText(walletAddresses[usdtForm.value.network])
    toastMessage.value = 'Alamat berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal menyalin alamat')
  }
}

const handleUsdtSubmit = async () => {
  if (!usdtForm.value.proof) {
    alert('Upload bukti transfer terlebih dahulu')
    return
  }

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

    usdtForm.value = {
      amount: '',
      network: 'TRC20',
      customer_email: '',
      bank_name: '',
      account_number: '',
      account_name: '',
      proof: null
    }
  } catch (e) {
    alert('Gagal mengirim permintaan')
  } finally {
    usdtSubmitting.value = false
  }
}

const openCheckout = (p) => { selectedProduct.value = p }
const closeCheckout = () => { selectedProduct.value = null }
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

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