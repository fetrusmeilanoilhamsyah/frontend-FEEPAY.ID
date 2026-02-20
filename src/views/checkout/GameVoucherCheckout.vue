<template>
  <div class="game-voucher-wrapper">
    <div class="min-h-screen bg-background pb-20">

      <!-- Header -->
      <div class="sticky top-0 z-40 bg-card border-b border-border">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center gap-3">
            <button 
              @click="$router.back()"
              class="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft :size="20" class="text-foreground" />
            </button>
            <div>
              <h1 class="text-lg sm:text-xl font-bold text-foreground">Voucher Game</h1>
              <p class="text-xs text-muted-foreground">Beli voucher game favorit</p>
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

        <!-- Info banner -->
        <div v-if="selectedGame" class="mb-6 p-4 bg-primary/5 border border-primary/20 rounded-xl">
          <div class="flex items-start gap-3">
            <Info :size="18" class="text-primary flex-shrink-0 mt-0.5" />
            <div>
              <p class="text-sm font-semibold text-foreground mb-1">
                Voucher {{ selectedGame }}
              </p>
              <p class="text-xs text-muted-foreground">
                Voucher akan dikirim otomatis setelah pembayaran berhasil
              </p>
            </div>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <SkeletonProductCard v-for="i in 8" :key="i" />
        </div>

        <!-- Products -->
        <div v-else-if="filteredProducts.length > 0">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-foreground">Pilih Nominal Voucher</h2>
            <span class="text-xs text-muted-foreground font-medium">
              {{ filteredProducts.length }} voucher tersedia
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

        <!-- Empty: belum pilih game -->
        <div v-else-if="!selectedGame" class="text-center py-16">
          <Gamepad2 class="mx-auto mb-4 text-muted-foreground" :size="64" />
          <h3 class="text-lg font-semibold text-foreground mb-2">Pilih Game Terlebih Dahulu</h3>
          <p class="text-sm text-muted-foreground">Pilih game dari daftar di atas untuk melihat voucher yang tersedia</p>
        </div>

        <!-- Empty: tidak ada produk -->
        <div v-else class="text-center py-16">
          <Package class="mx-auto mb-4 text-muted-foreground" :size="64" />
          <h3 class="text-lg font-semibold text-foreground mb-2">Voucher Tidak Tersedia</h3>
          <p class="text-sm text-muted-foreground">Belum ada voucher {{ selectedGame }} saat ini</p>
        </div>

      </div>
    </div>

    <PaymentModal
      v-if="selectedProduct"
      :product="selectedProduct"
      customer-data="VOUCHER"
      customer-label="Tipe"
      :show-info="true"
      info-message="Voucher akan dikirim ke email setelah pembayaran berhasil"
      @close="closeModal"
      @success="handlePaymentSuccess"
      @pending="handlePaymentPending"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Gamepad2, Package, Info } from 'lucide-vue-next'
import GameSelector from '@/components/checkout/GameSelector.vue'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonProductCard from '@/components/SkeletonProductCard.vue'
import PaymentModal from '@/components/checkout/PaymentModal.vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const selectedGame = ref(null)
const selectedProduct = ref(null)

const availableGames = computed(() => {
  const gameProducts = productStore.products.filter(p => {
    const cat = (p.category || '').toLowerCase()
    return cat === 'games' || cat === 'game'
  })

  const games = gameProducts.map(p => {
    if (p.brand) return p.brand
    const name = (p.name || '').toLowerCase()
    if (name.includes('mobile legends') || name.includes('ml ')) return 'MOBILE LEGENDS'
    if (name.includes('free fire') || name.includes('ff '))       return 'FREE FIRE'
    if (name.includes('pubg'))                                     return 'PUBG MOBILE'
    if (name.includes('genshin'))                                  return 'GENSHIN IMPACT'
    if (name.includes('call of duty') || name.includes('cod '))   return 'CALL OF DUTY'
    if (name.includes('valorant'))                                 return 'VALORANT'
    if (name.includes('league of legends') || name.includes('lol ')) return 'LEAGUE OF LEGENDS'
    return null
  })

  return [...new Set(games)].filter(Boolean).sort()
})

const filteredProducts = computed(() => {
  if (!selectedGame.value) return []
  return productStore.products.filter(p => {
    const cat = (p.category || '').toLowerCase()
    if (cat !== 'games' && cat !== 'game') return false
    if (p.brand === selectedGame.value) return true
    const name = (p.name || '').toLowerCase()
    return name.includes(selectedGame.value.split(' ')[0].toLowerCase())
  })
})

const handleProductSelect = (product) => { selectedProduct.value = product }
const closeModal = () => { selectedProduct.value = null }
const handlePaymentSuccess = () => closeModal()
const handlePaymentPending = () => closeModal()

onMounted(async () => { await productStore.fetchProducts() })
</script>