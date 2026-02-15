<template>
  <div class="top-up-game-wrapper">
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
                  Top Up Game
                </h1>
                <p class="text-xs text-dark-500 dark:text-dark-400">
                  Isi diamond, UC, CP langsung ke akun
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <GameSelector 
          v-model="selectedGame"
          :games="availableGames"
          class="mb-6"
        />

        <div v-if="selectedGame" class="mb-6">
          <label class="block text-sm font-semibold mb-2 text-dark-700 dark:text-dark-300">
            {{ userIdLabel }}
          </label>
          
          <div class="relative">
            <div class="absolute left-4 top-1/2 -translate-y-1/2">
              <User :size="18" class="text-dark-400" />
            </div>
            
            <input
              v-model="userId"
              type="text"
              :placeholder="userIdPlaceholder"
              class="w-full h-12 sm:h-14 pl-12 pr-4 bg-white dark:bg-dark-900 border-2 border-border rounded-xl text-base font-medium text-dark-950 dark:text-white placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
            />
          </div>

          <div v-if="needsZoneId" class="mt-3">
            <label class="block text-sm font-semibold mb-2 text-dark-700 dark:text-dark-300">
              Zone ID
            </label>
            <input
              v-model="zoneId"
              type="text"
              placeholder="Contoh: 1234"
              class="w-full h-12 pl-4 pr-4 bg-white dark:bg-dark-900 border-2 border-border rounded-xl text-base font-medium text-dark-950 dark:text-white placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
            />
          </div>

          <p class="mt-2 text-xs text-dark-500 dark:text-dark-400">
            {{ userIdHint }}
          </p>
        </div>

        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <SkeletonProductCard v-for="i in 8" :key="i" />
        </div>

        <div v-else-if="filteredProducts.length > 0">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-dark-950 dark:text-white">
              Pilih Nominal
            </h2>
            <span class="text-xs text-dark-500 dark:text-dark-400 font-medium">
              {{ filteredProducts.length }} paket tersedia
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

        <div v-else-if="!selectedGame" class="text-center py-16">
          <Gamepad2 class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
          <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
            Pilih Game Terlebih Dahulu
          </h3>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Pilih game dari daftar di atas untuk melanjutkan
          </p>
        </div>

        <div v-else class="text-center py-16">
          <Package class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
          <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
            Paket Tidak Tersedia
          </h3>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Belum ada paket top up untuk {{ selectedGame }}
          </p>
        </div>

      </div>
    </div>

    <PaymentModal
      v-if="selectedProduct"
      :product="selectedProduct"
      :customer-data="fullUserId"
      customer-label="User ID"
      @close="closeModal"
      @success="handlePaymentSuccess"
      @pending="handlePaymentPending"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Gamepad2, Package, User } from 'lucide-vue-next'
import GameSelector from '@/components/checkout/GameSelector.vue'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonProductCard from '@/components/SkeletonProductCard.vue'
import PaymentModal from '@/components/checkout/PaymentModal.vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()

const selectedGame = ref(null)
const selectedProduct = ref(null)
const userId = ref('')
const zoneId = ref('')

// Get available games (same as voucher)
const availableGames = computed(() => {
  const gameProducts = productStore.products.filter(p => {
    const cat = (p.category || '').toLowerCase()
    return cat === 'games' || cat === 'game'
  })
  
  const games = gameProducts.map(p => {
    if (p.brand) return p.brand
    
    const name = (p.name || '').toLowerCase()
    if (name.includes('mobile legends') || name.includes('ml ')) return 'MOBILE LEGENDS'
    if (name.includes('free fire') || name.includes('ff ')) return 'FREE FIRE'
    if (name.includes('pubg')) return 'PUBG MOBILE'
    if (name.includes('genshin')) return 'GENSHIN IMPACT'
    if (name.includes('call of duty') || name.includes('cod ')) return 'CALL OF DUTY'
    
    return null
  })
  
  return [...new Set(games)].filter(Boolean).sort()
})

// Filter products by selected game
const filteredProducts = computed(() => {
  if (!selectedGame.value) return []
  
  return productStore.products.filter(p => {
    const cat = (p.category || '').toLowerCase()
    if (cat !== 'games' && cat !== 'game') return false
    
    if (p.brand === selectedGame.value) return true
    
    const name = (p.name || '').toLowerCase()
    const game = selectedGame.value.toLowerCase()
    return name.includes(game.split(' ')[0].toLowerCase())
  })
})

// Dynamic labels based on game
const userIdLabel = computed(() => {
  const labels = {
    'MOBILE LEGENDS': 'User ID',
    'FREE FIRE': 'User ID',
    'PUBG MOBILE': 'Player ID',
    'GENSHIN IMPACT': 'UID',
    'CALL OF DUTY': 'Player ID'
  }
  return labels[selectedGame.value] || 'User ID / Player ID'
})

const userIdPlaceholder = computed(() => {
  const placeholders = {
    'MOBILE LEGENDS': 'Contoh: 12345678',
    'FREE FIRE': 'Contoh: 123456789',
    'PUBG MOBILE': 'Contoh: 51234567890',
    'GENSHIN IMPACT': 'Contoh: 600123456',
    'CALL OF DUTY': 'Contoh: 1234567890'
  }
  return placeholders[selectedGame.value] || 'Masukkan ID'
})

const userIdHint = computed(() => {
  const hints = {
    'MOBILE LEGENDS': 'Cek di Profile → Account → User ID',
    'FREE FIRE': 'Cek di Profile → User ID',
    'PUBG MOBILE': 'Cek di Settings → Basic → Character ID',
    'GENSHIN IMPACT': 'Cek di Settings → Account → UID',
    'CALL OF DUTY': 'Cek di Settings → Legal and Privacy → UID'
  }
  return hints[selectedGame.value] || 'Masukkan User ID yang valid'
})

const needsZoneId = computed(() => {
  return selectedGame.value === 'MOBILE LEGENDS'
})

const fullUserId = computed(() => {
  if (needsZoneId.value && zoneId.value) {
    return `${userId.value} (${zoneId.value})`
  }
  return userId.value
})

const handleProductSelect = (product) => {
  // Validate user ID
  if (!userId.value || userId.value.length < 6) {
    alert('Masukkan User ID yang valid')
    return
  }

  // Validate zone ID for ML
  if (needsZoneId.value && (!zoneId.value || zoneId.value.length < 4)) {
    alert('Masukkan Zone ID yang valid untuk Mobile Legends')
    return
  }

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