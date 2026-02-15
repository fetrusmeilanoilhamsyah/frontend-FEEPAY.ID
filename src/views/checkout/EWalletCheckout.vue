<template>
  <div class="e-wallet-wrapper">
    <div class="min-h-screen bg-background pb-20">
      <div class="sticky top-0 z-40 bg-white dark:bg-dark-900 border-b border-border">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button 
                @click="$router.back()"
                class="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
              >
                <ArrowLeft :size="20" class="text-dark-700 dark:text-dark-300" />
              </button>
              <div>
                <h1 class="text-lg sm:text-xl font-bold text-dark-950 dark:text-white">
                  Top Up E-Wallet
                </h1>
                <p class="text-xs text-dark-500 dark:text-dark-400">
                  Isi saldo GoPay, OVO, DANA, dll
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <WalletSelector 
          v-model="selectedWallet"
          :wallets="availableWallets"
          class="mb-6"
        />

        <div v-if="selectedWallet" class="mb-6">
          <label class="block text-sm font-semibold mb-2 text-dark-700 dark:text-dark-300">
            Nomor HP / Email
          </label>
          
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <Smartphone :size="18" class="text-dark-400" />
              <span class="text-sm font-medium text-dark-600 dark:text-dark-400">+62</span>
            </div>
            
            <input
              v-model="phoneNumber"
              type="text"
              placeholder="812-3456-7890"
              class="w-full h-12 sm:h-14 pl-20 pr-4 bg-white dark:bg-dark-900 border-2 border-border rounded-xl text-base font-medium text-dark-950 dark:text-white placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
              maxlength="15"
              @input="handlePhoneInput"
            />
          </div>

          <p class="mt-2 text-xs text-dark-500 dark:text-dark-400">
            {{ walletHint }}
          </p>
        </div>

        <RecentNumbers 
          v-if="selectedWallet && recentNumbers.length > 0"
          :numbers="recentNumbers"
          @select="phoneNumber = $event"
          class="mb-6"
        />

        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <SkeletonProductCard v-for="i in 8" :key="i" />
        </div>

        <div v-else-if="filteredProducts.length > 0">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-dark-950 dark:text-white">
              Pilih Nominal
            </h2>
            <span class="text-xs text-dark-500 dark:text-dark-400 font-medium">
              {{ filteredProducts.length }} nominal tersedia
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <ProductCard
              v-for="product in filteredProducts"
              :key="product.id"
              :product="product"
              @select="handleProductSelect"
            />
          </div>
        </div>

        <div v-else-if="!selectedWallet" class="text-center py-16">
          <Wallet class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
          <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
            Pilih E-Wallet Terlebih Dahulu
          </h3>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Pilih e-wallet dari daftar di atas untuk melanjutkan
          </p>
        </div>

        <div v-else class="text-center py-16">
          <Package class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
          <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
            Nominal Tidak Tersedia
          </h3>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Belum ada nominal top up untuk {{ selectedWallet }}
          </p>
        </div>

      </div>
    </div>

    <PaymentModal
      v-if="selectedProduct"
      :product="selectedProduct"
      :customer-data="'0' + phoneNumber"
      customer-label="Nomor HP"
      @close="closeModal"
      @success="handlePaymentSuccess"
      @pending="handlePaymentPending"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Wallet, Package, Smartphone } from 'lucide-vue-next'
import WalletSelector from '@/components/checkout/WalletSelector.vue'
import RecentNumbers from '@/components/checkout/RecentNumbers.vue'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonProductCard from '@/components/SkeletonProductCard.vue'
import PaymentModal from '@/components/checkout/PaymentModal.vue'
import { useProductStore } from '@/stores/productStore'
import { useRecentNumbers } from '@/composables/useRecentNumbers'

const productStore = useProductStore()
const { recentNumbers, addNumber } = useRecentNumbers()

const selectedWallet = ref(null)
const selectedProduct = ref(null)
const phoneNumber = ref('')

// Get available wallets
const availableWallets = computed(() => {
  const walletProducts = productStore.products.filter(p => {
    const cat = (p.category || '').toLowerCase()
    return cat === 'e-money' || cat === 'emoney' || cat === 'e-wallet' || cat === 'ewallet'
  })
  
  const wallets = walletProducts.map(p => {
    if (p.brand) return p.brand
    
    const name = (p.name || '').toLowerCase()
    if (name.includes('gopay')) return 'GOPAY'
    if (name.includes('ovo')) return 'OVO'
    if (name.includes('dana')) return 'DANA'
    if (name.includes('shopeepay') || name.includes('shopee pay')) return 'SHOPEEPAY'
    if (name.includes('linkaja') || name.includes('link aja')) return 'LINKAJA'
    if (name.includes('sakuku')) return 'SAKUKU'
    
    return null
  })
  
  return [...new Set(wallets)].filter(Boolean).sort()
})

// Filter products by selected wallet
const filteredProducts = computed(() => {
  if (!selectedWallet.value) return []
  
  return productStore.products.filter(p => {
    const cat = (p.category || '').toLowerCase()
    if (!cat.includes('money') && !cat.includes('wallet')) return false
    
    if (p.brand === selectedWallet.value) return true
    
    const name = (p.name || '').toLowerCase()
    const wallet = selectedWallet.value.toLowerCase()
    return name.includes(wallet)
  })
})

// Wallet-specific hints
const walletHint = computed(() => {
  const hints = {
    'GOPAY': 'Nomor HP yang terdaftar di akun GoPay',
    'OVO': 'Nomor HP yang terdaftar di akun OVO',
    'DANA': 'Nomor HP yang terdaftar di akun DANA',
    'SHOPEEPAY': 'Nomor HP yang terdaftar di akun ShopeePay',
    'LINKAJA': 'Nomor HP yang terdaftar di akun LinkAja',
    'SAKUKU': 'Nomor HP yang terdaftar di akun Sakuku'
  }
  return hints[selectedWallet.value] || 'Nomor HP yang terdaftar di akun e-wallet'
})

const handlePhoneInput = (e) => {
  let value = e.target.value.replace(/\D/g, '')
  
  if (value.startsWith('0')) {
    value = value.substring(1)
  }
  if (value.startsWith('62')) {
    value = value.substring(2)
  }
  
  phoneNumber.value = value
}

const handleProductSelect = (product) => {
  if (!phoneNumber.value || phoneNumber.value.length < 10) {
    alert('Masukkan nomor HP yang valid')
    return
  }

  addNumber(phoneNumber.value)
  selectedProduct.value = product
}

const closeModal = () => {
  console.log('🚪 Closing modal...')
  selectedProduct.value = null
}

const handlePaymentSuccess = (orderId) => {
  console.log('✅ Payment success handler, closing modal...', orderId)
  closeModal()
}

const handlePaymentPending = (orderId) => {
  console.log('⏳ Payment pending handler, closing modal...', orderId)
  closeModal()
}

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>