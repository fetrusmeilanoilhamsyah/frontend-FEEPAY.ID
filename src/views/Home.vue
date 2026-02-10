<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <!-- Hero Section -->
    <div class="text-center mb-16 relative">
      <div class="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent rounded-3xl -z-10"></div>
      <div class="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-6 py-2 rounded-full text-primary text-sm font-bold mb-8">
        LAYANAN TERPERCAYA SEJAK 2020
      </div>
      <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-tight">
        FEEPAY<span class="text-primary">.ID</span>
      </h1>
      <p class="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed font-medium">
        Platform Profesional untuk Layanan Digital & Konversi USDT. Transaksi Cepat, Aman, dan Terpercaya
      </p>
    </div>

    <!-- Main Navigation Tabs -->
    <div class="mb-12 text-center">
      <nav class="inline-flex p-1 bg-muted rounded-xl border border-border shadow-sm">
        <button @click="activeTab = 'products'" class="px-8 py-3 font-bold text-sm rounded-lg transition-all"
          :class="activeTab === 'products' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'">
          LAYANAN DIGITAL
        </button>
        <button @click="activeTab = 'usdt'" class="px-8 py-3 font-bold text-sm rounded-lg transition-all"
          :class="activeTab === 'usdt' ? 'bg-background text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'">
          KONVERSI USDT
        </button>
      </nav>
    </div>

    <!-- Products Tab -->
    <div v-if="activeTab === 'products'">
      <!-- Search Bar -->
      <div class="max-w-2xl mx-auto mb-10">
        <div class="relative group">
          <input v-model="searchQuery" type="text" placeholder="Cari produk: Telkomsel, Dana, Mobile Legends..." 
            class="w-full h-14 bg-muted border-2 border-border rounded-2xl px-6 pl-14 font-bold focus:border-primary outline-none transition-all" />
          <Search class="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" :size="24" />
        </div>
      </div>

      <!-- Category Filter -->
      <div class="flex flex-wrap justify-center gap-3 mb-12">
        <button v-for="cat in categories" :key="cat"
          @click="selectedCategory = cat"
          class="px-6 py-2.5 rounded-full text-xs font-bold border-2 transition-all"
          :class="selectedCategory === cat ? 'bg-primary border-primary text-white shadow-lg scale-105' : 'bg-transparent border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'">
          {{ cat.toUpperCase() }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div v-for="i in 8" :key="i" class="h-48 bg-muted animate-pulse rounded-2xl"></div>
      </div>

      <!-- Products by Category -->
      <div v-else class="space-y-16">
        <!-- Pulsa Section -->
        <section v-if="showCategory('Pulsa')" class="space-y-6">
          <div class="flex items-center gap-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 px-6 py-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
            <Smartphone class="text-blue-600" :size="28" />
            <h2 class="text-3xl font-bold tracking-tight text-blue-900 dark:text-blue-100">PULSA</h2>
          </div>
          <transition-group name="list" tag="div" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <ProductCard v-for="product in getProductsByCategory('Pulsa')" :key="product.id" :product="product" @select="openCheckout" />
          </transition-group>
        </section>

        <!-- Paket Data Section -->
        <section v-if="showCategory('Data')" class="space-y-6">
          <div class="flex items-center gap-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 px-6 py-4 rounded-xl border border-purple-100 dark:border-purple-900/30">
            <Globe class="text-purple-600" :size="28" />
            <h2 class="text-3xl font-bold tracking-tight text-purple-900 dark:text-purple-100">PAKET DATA</h2>
          </div>
          <transition-group name="list" tag="div" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <ProductCard v-for="product in getProductsByCategory('Data')" :key="product.id" :product="product" @select="openCheckout" />
          </transition-group>
        </section>

        <!-- E-Wallet Section -->
        <section v-if="showCategory('E-Wallet')" class="space-y-6">
          <div class="flex items-center gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 px-6 py-4 rounded-xl border border-green-100 dark:border-green-900/30">
            <CreditCard class="text-green-600" :size="28" />
            <h2 class="text-3xl font-bold tracking-tight text-green-900 dark:text-green-100">E-WALLET</h2>
          </div>
          <transition-group name="list" tag="div" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <ProductCard v-for="product in getProductsByCategory('E-Wallet')" :key="product.id" :product="product" @select="openCheckout" />
          </transition-group>
        </section>

        <!-- Voucher Game Section -->
        <section v-if="showCategory('Game')" class="space-y-6">
          <div class="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 px-6 py-4 rounded-xl border border-orange-100 dark:border-orange-900/30">
            <Gamepad2 class="text-orange-600" :size="28" />
            <h2 class="text-3xl font-bold tracking-tight text-orange-900 dark:text-orange-100">VOUCHER GAME</h2>
          </div>
          <transition-group name="list" tag="div" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            <ProductCard v-for="product in getProductsByCategory('Game')" :key="product.id" :product="product" @select="openCheckout" />
          </transition-group>
        </section>

        <!-- Empty State -->
        <div v-if="filteredProducts.length === 0" class="text-center py-16">
          <Package class="mx-auto mb-4 text-muted-foreground opacity-30" :size="64" />
          <p class="text-muted-foreground font-bold">Produk tidak ditemukan</p>
        </div>
      </div>
    </div>

    <!-- USDT Conversion Tab -->
    <div v-if="activeTab === 'usdt'">
      <div class="max-w-3xl mx-auto">
        <!-- Feature Badge -->
        <div class="text-center mb-8">
          <span class="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full text-primary text-xs font-black">
            FITUR UNGGULAN
          </span>
        </div>

        <div class="card bg-gradient-to-br from-card via-card to-primary/5 border-2 border-border shadow-2xl p-8 rounded-3xl relative overflow-hidden text-left">
          <div class="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-0"></div>
          <div class="relative z-10">
            <h2 class="text-3xl font-bold mb-2">KONVERSI USDT KE RUPIAH</h2>
            <p class="text-muted-foreground mb-8 font-medium">Proses pencairan cepat langsung ke rekening bank atau e-wallet Anda</p>

          <form @submit.prevent="handleUsdtSubmit" class="space-y-6">
            <!-- Amount & Network -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-xs font-bold uppercase mb-3 text-muted-foreground">JUMLAH USDT</label>
                <input v-model="usdtForm.amount" type="number" step="0.01" 
                  class="w-full h-14 bg-muted rounded-xl px-4 font-semibold outline-none border-2 border-transparent focus:border-primary transition-colors" 
                  placeholder="Contoh: 100.00" required />
              </div>
              <div>
                <label class="block text-xs font-bold uppercase mb-3 text-muted-foreground">JARINGAN BLOCKCHAIN</label>
                <div class="flex gap-2">
                  <button type="button" v-for="net in ['TRC20', 'BEP20']" :key="net" @click="usdtForm.network = net"
                    class="flex-1 h-14 border-2 rounded-xl font-bold text-sm transition-all"
                    :class="usdtForm.network === net ? 'border-primary bg-primary/5 text-primary' : 'border-border text-muted-foreground hover:border-primary/30'">
                    {{ net }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Wallet Address Display -->
            <div class="bg-muted p-5 rounded-2xl border border-border">
              <div class="flex justify-between items-center mb-3">
                <span class="text-xs font-bold uppercase text-muted-foreground">ALAMAT TUJUAN TRANSFER:</span>
                <button type="button" @click="copyWalletAddress" 
                  class="text-primary text-xs font-bold uppercase hover:underline flex items-center gap-1 transition-colors">
                  <Copy :size="14" />
                  SALIN
                </button>
              </div>
              <div class="bg-background p-4 rounded-xl font-mono text-sm break-all border border-border text-center font-semibold">
                {{ walletAddresses[usdtForm.network] }}
              </div>
            </div>

            <!-- Bank Details -->
            <div class="space-y-4">
              <label class="block text-xs font-bold uppercase text-muted-foreground">INFORMASI REKENING PENERIMA</label>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input v-model="usdtForm.customer_email" type="email" 
                  class="w-full h-12 bg-muted rounded-xl px-4 font-medium outline-none border-2 border-transparent focus:border-primary transition-colors" 
                  placeholder="Email Anda" required />
                <input v-model="usdtForm.bank_name" type="text" 
                  class="w-full h-12 bg-muted rounded-xl px-4 font-medium outline-none border-2 border-transparent focus:border-primary transition-colors" 
                  placeholder="Bank/E-Wallet (Contoh: BCA)" required />
                <input v-model="usdtForm.account_number" type="text" 
                  class="w-full h-12 bg-muted rounded-xl px-4 font-medium outline-none border-2 border-transparent focus:border-primary transition-colors" 
                  placeholder="Nomor Rekening" required />
                <input v-model="usdtForm.account_name" type="text" 
                  class="w-full h-12 bg-muted rounded-xl px-4 font-medium outline-none border-2 border-transparent focus:border-primary transition-colors" 
                  placeholder="Nama Pemilik Rekening" required />
              </div>
            </div>

            <!-- Proof Upload -->
            <div>
              <label class="block text-xs font-bold uppercase mb-3 text-center text-muted-foreground">BUKTI TRANSFER</label>
              <div @click="triggerUsdtFileInput" 
                class="border-2 border-dashed border-border rounded-2xl p-8 text-center cursor-pointer hover:border-primary hover:bg-primary/5 bg-muted/30 transition-all">
                <Upload class="mx-auto mb-2 opacity-50" :size="32" />
                <p class="text-sm font-semibold">{{ usdtForm.proof ? usdtForm.proof.name : 'Klik untuk upload screenshot bukti transfer' }}</p>
                <p class="text-xs text-muted-foreground mt-2">Format: JPG, PNG (Max 5MB)</p>
              </div>
              <input ref="usdtFileInput" type="file" class="hidden" @change="handleUsdtFileSelect" accept="image/*" required />
            </div>

            <!-- Submit Button -->
            <button type="submit" 
              class="w-full h-14 bg-primary text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
              :disabled="usdtSubmitting">
              <Loader v-if="usdtSubmitting" class="inline animate-spin mr-2" :size="20" />
              {{ usdtSubmitting ? 'MEMPROSES...' : 'KIRIM PERMINTAAN' }}
            </button>
          </form>

          <!-- Info Box -->
          <div class="mt-6 bg-primary/5 border border-primary/20 rounded-xl p-4">
            <p class="text-xs font-bold text-center text-primary">
              Pencairan diproses dalam 5-15 menit setelah konfirmasi transfer
            </p>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Checkout Modal -->
    <CheckoutModal v-if="selectedProduct" :product="selectedProduct" @close="closeCheckout" />
    
    <!-- Toast Notification -->
    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-6 right-6 bg-card border-2 border-primary rounded-xl shadow-2xl p-5 z-50 max-w-sm">
        <div class="flex items-center gap-3">
          <Check class="text-primary" :size="20" />
          <span class="text-sm font-semibold">{{ toastMessage }}</span>
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
import api from '../services/api'

// STATE
const activeTab = ref('products')
const selectedCategory = ref('Semua')
const searchQuery = ref('')
const products = ref([])
const loading = ref(true)
const selectedProduct = ref(null)
const usdtSubmitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const usdtFileInput = ref(null)

// Categories
const categories = ['Semua', 'Pulsa', 'Data', 'E-Wallet', 'Game']

const usdtForm = ref({
  amount: '', 
  network: 'TRC20', 
  customer_email: '', 
  bank_name: '', 
  account_number: '', 
  account_name: '', 
  proof: null
})

// Wallet Addresses from ENV
const walletAddresses = {
  TRC20: import.meta.env.VITE_WALLET_TRC20 || 'TSetWalletAddressInENV',
  BEP20: import.meta.env.VITE_WALLET_BEP20 || 'BSetWalletAddressInENV'
}

// Computed: Filtered Products
const filteredProducts = computed(() => {
  let results = [...products.value]
  
  // Search Filter
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    results = results.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q)
    )
  }
  
  // Category Filter
  if (selectedCategory.value !== 'Semua') {
    const s = selectedCategory.value.toLowerCase()
    results = results.filter(p => {
      const cat = p.category.toLowerCase()
      const name = p.name.toLowerCase()
      
      if (s === 'e-wallet') {
        // Check both category AND name for e-wallet keywords
        return cat.includes('wallet') || 
               cat.includes('dana') || 
               cat.includes('ovo') || 
               cat.includes('gopay') || 
               cat.includes('shopeepay') ||
               cat.includes('linkaja') ||
               cat.includes('e-money') ||
               name.includes('dana') || 
               name.includes('ovo') || 
               name.includes('gopay') ||
               name.includes('shopeepay') ||
               name.includes('linkaja')
      }
      return cat.includes(s)
    })
  }
  
  return results.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
})

// Get products by specific category
const getProductsByCategory = (category) => {
  const cat = category.toLowerCase()
  return products.value.filter(p => {
    const pCat = p.category.toLowerCase()
    const pName = p.name.toLowerCase()
    
    if (cat === 'e-wallet') {
      // Check category OR product name for e-wallet keywords
      return pCat.includes('wallet') || 
             pCat.includes('dana') || 
             pCat.includes('ovo') || 
             pCat.includes('gopay') || 
             pCat.includes('shopeepay') ||
             pCat.includes('linkaja') ||
             pCat.includes('e-money') ||
             pName.includes('dana') || 
             pName.includes('ovo') || 
             pName.includes('gopay') ||
             pName.includes('shopeepay') ||
             pName.includes('linkaja')
    }
    return pCat.includes(cat)
  }).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
}

// Show category section based on filters
const showCategory = (category) => {
  if (selectedCategory.value !== 'Semua' && selectedCategory.value !== category) {
    return false
  }
  if (searchQuery.value) {
    return getProductsByCategory(category).length > 0
  }
  return true
}

// Fetch Products
const fetchProducts = async () => {
  loading.value = true
  try { 
    products.value = await api.products.getAll() 
  } catch (e) { 
    console.error('Error fetching products:', e) 
  } finally { 
    loading.value = false 
  }
}

// USDT Form Handlers
const triggerUsdtFileInput = () => { usdtFileInput.value?.click() }
const handleUsdtFileSelect = (e) => { usdtForm.value.proof = e.target.files[0] }

const copyWalletAddress = async () => { 
  try {
    await navigator.clipboard.writeText(walletAddresses[usdtForm.value.network])
    toastMessage.value = 'ALAMAT BERHASIL DISALIN'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch (err) {
    alert('Gagal menyalin alamat')
  }
}

const handleUsdtSubmit = async () => {
  if (!usdtForm.value.proof) {
    alert('Silakan upload bukti transfer terlebih dahulu')
    return
  }
  
  usdtSubmitting.value = true
  try {
    const fd = new FormData()
    const rate = 16000 // Rate USDT to IDR
    
    fd.append('amount', usdtForm.value.amount)
    fd.append('network', usdtForm.value.network)
    fd.append('customer_email', usdtForm.value.customer_email)
    fd.append('bank_name', usdtForm.value.bank_name)
    fd.append('account_number', usdtForm.value.account_number)
    fd.append('account_name', usdtForm.value.account_name)
    fd.append('proof', usdtForm.value.proof)
    fd.append('idr_received', parseFloat(usdtForm.value.amount) * rate)

    await api.usdt.submit(fd)
    
    toastMessage.value = 'PERMINTAAN BERHASIL DIKIRIM'
    showToast.value = true
    setTimeout(() => showToast.value = false, 3000)
    
    // Reset form
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
    alert('Gagal mengirim permintaan. Silakan coba lagi.')
  } finally { 
    usdtSubmitting.value = false 
  }
}

// Lifecycle
onMounted(fetchProducts)

// Modal Handlers
const openCheckout = (p) => { selectedProduct.value = p }
const closeCheckout = () => { selectedProduct.value = null }
</script>

<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.list-leave-to {
  opacity: 0;
  transform: scale(0.9);
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