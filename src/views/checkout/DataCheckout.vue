=<template>
  <div class="data-checkout-wrapper">
    <div class="min-h-screen bg-background pb-20">

      <!-- Header -->
      <div class="sticky top-0 z-40 bg-card border-b border-border">
        <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <button 
                @click="$router.back()"
                class="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <ArrowLeft :size="20" class="text-foreground" />
              </button>
              <div>
                <h1 class="text-lg sm:text-xl font-bold text-foreground">Paket Data Internet</h1>
                <p class="text-xs text-muted-foreground">Kuota internet cepat & murah</p>
              </div>
            </div>
            <router-link 
              to="/checkout/pulsa"
              class="text-xs sm:text-sm font-semibold text-primary hover:underline"
            >
              ← Pulsa
            </router-link>
          </div>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">

        <PhoneInput v-model="phoneNumber" class="mb-6" />

        <RecentNumbers 
          v-if="recentNumbers.length > 0"
          :numbers="recentNumbers"
          @select="phoneNumber = $event"
          class="mb-6"
        />

        <!-- Loading -->
        <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <SkeletonProductCard v-for="i in 8" :key="i" />
        </div>

        <!-- Products -->
        <div v-else-if="dataProducts.length > 0">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-foreground">Pilih Paket Data</h2>
            <span class="text-xs text-muted-foreground font-medium">
              {{ dataProducts.length }} paket tersedia
            </span>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            <ProductCard
              v-for="product in dataProducts"
              :key="product.id"
              :product="product"
              @select="handleProductSelect"
            />
          </div>
        </div>

        <!-- Empty -->
        <div v-else class="text-center py-16">
          <Wifi class="mx-auto mb-4 text-muted-foreground" :size="64" />
          <h3 class="text-lg font-semibold text-foreground mb-2">Paket Data Tidak Tersedia</h3>
          <p class="text-sm text-muted-foreground">Belum ada paket data untuk kategori ini</p>
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
import { ArrowLeft, Wifi } from 'lucide-vue-next'
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

const dataProducts = computed(() => productStore.productsByCategory('Data'))

const handleProductSelect = (product) => {
  if (!phoneNumber.value || phoneNumber.value.length < 10) {
    alert('Masukkan nomor HP yang valid')
    return
  }
  addNumber(phoneNumber.value)
  selectedProduct.value = product
}

const closeModal = () => { selectedProduct.value = null }
const handlePaymentSuccess = () => closeModal()
const handlePaymentPending = () => closeModal()

onMounted(async () => { await productStore.fetchProducts() })
</script>