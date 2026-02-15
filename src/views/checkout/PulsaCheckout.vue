<template>
  <div class="pulsa-checkout-wrapper">
    <div class="min-h-screen bg-background pb-20">
      <!-- Header -->
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
                  Pulsa & Kredit
                </h1>
                <p class="text-xs text-dark-500 dark:text-dark-400">
                  Isi pulsa semua operator
                </p>
              </div>
            </div>
            <router-link 
              to="/checkout/data"
              class="text-xs sm:text-sm font-semibold text-primary-600 dark:text-primary-400 hover:underline"
            >
              Kuota Data →
            </router-link>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        
        <!-- Phone Input -->
        <PhoneInput v-model="phoneNumber" class="mb-6" />

        <!-- Recent Numbers -->
        <RecentNumbers 
          v-if="recentNumbers.length > 0"
          :numbers="recentNumbers"
          @select="phoneNumber = $event"
          class="mb-6"
        />

        <!-- Loading Skeletons -->
        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <SkeletonProductCard v-for="i in 8" :key="i" />
        </div>

        <!-- Products -->
        <div v-else-if="pulsaProducts.length > 0">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-dark-950 dark:text-white">
              Pilih Nominal
            </h2>
            <span class="text-xs text-dark-500 dark:text-dark-400 font-medium">
              {{ pulsaProducts.length }} produk tersedia
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <ProductCard
              v-for="product in pulsaProducts"
              :key="product.id"
              :product="product"
              @select="handleProductSelect"
            />
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <Package class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
          <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
            Produk Tidak Tersedia
          </h3>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Belum ada produk pulsa untuk kategori ini
          </p>
        </div>

      </div>
    </div>

    <!-- Payment Modal -->
    <PaymentModal
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
import { ArrowLeft, Package } from 'lucide-vue-next'
import PhoneInput from '@/components/checkout/PhoneInput.vue'
import RecentNumbers from '@/components/checkout/RecentNumbers.vue'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonProductCard from '@/components/SkeletonProductCard.vue'
import PaymentModal from '@/components/checkout/PaymentModal.vue'
import { useProductStore } from '@/stores/productStore'
import { useRecentNumbers } from '@/composables/useRecentNumbers'

const productStore = useProductStore()
const { recentNumbers, addNumber } = useRecentNumbers()

const phoneNumber = ref('')
const selectedProduct = ref(null)

const pulsaProducts = computed(() => {
  return productStore.productsByCategory('Pulsa')
})

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