<template>
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
                Token PLN
              </h1>
              <p class="text-xs text-dark-500 dark:text-dark-400">
                Beli token listrik prabayar
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
      
      <!-- Meter Number Input -->
      <div class="mb-6">
        <label class="block text-sm font-semibold mb-2 text-dark-700 dark:text-dark-300">
          Nomor Meter / ID Pelanggan
        </label>
        
        <div class="relative">
          <div class="absolute left-4 top-1/2 -translate-y-1/2">
            <Zap :size="18" class="text-dark-400" />
          </div>
          
          <input
            v-model="meterNumber"
            type="text"
            inputmode="numeric"
            placeholder="Contoh: 12345678901"
            class="w-full h-12 sm:h-14 pl-12 pr-4 bg-white dark:bg-dark-900 border-2 border-border rounded-xl text-base font-medium text-dark-950 dark:text-white placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
            maxlength="15"
            @input="handleMeterInput"
          />
        </div>

        <p class="mt-2 text-xs text-dark-500 dark:text-dark-400">
          Masukkan 11-12 digit nomor meter PLN Anda
        </p>
      </div>

      <!-- Customer Info (if meter valid) -->
      <div v-if="customerInfo" class="mb-6 p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-xl">
        <div class="flex items-start gap-3">
          <Check :size="18" class="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
          <div class="flex-1">
            <p class="text-sm font-semibold text-green-700 dark:text-green-300 mb-1">
              {{ customerInfo.name }}
            </p>
            <p class="text-xs text-green-600 dark:text-green-400">
              {{ customerInfo.address }}
            </p>
          </div>
        </div>
      </div>

      <!-- Loading Skeletons -->
      <div v-if="productStore.loading" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        <SkeletonProductCard v-for="i in 8" :key="i" />
      </div>

      <!-- Products -->
      <div v-else-if="plnProducts.length > 0">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-bold text-dark-950 dark:text-white">
            Pilih Nominal Token
          </h2>
          <span class="text-xs text-dark-500 dark:text-dark-400 font-medium">
            {{ plnProducts.length }} nominal tersedia
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          <ProductCard
            v-for="product in plnProducts"
            :key="product.id"
            :product="product"
            @select="handleProductSelect"
          />
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <Zap class="mx-auto mb-4 text-dark-300 dark:text-dark-700" :size="64" />
        <h3 class="text-lg font-semibold text-dark-950 dark:text-white mb-2">
          Token PLN Tidak Tersedia
        </h3>
        <p class="text-sm text-dark-600 dark:text-dark-400">
          Belum ada produk token PLN saat ini
        </p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Zap, Check } from 'lucide-vue-next'
import ProductCard from '@/components/ProductCard.vue'
import SkeletonProductCard from '@/components/SkeletonProductCard.vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()

const meterNumber = ref('')
const customerInfo = ref(null)

const plnProducts = computed(() => {
  return productStore.products.filter(p => {
    const cat = (p.category || '').toLowerCase()
    return cat === 'pln' || cat.includes('listrik') || cat.includes('token')
  })
})

const handleMeterInput = (e) => {
  // Only allow numbers
  const value = e.target.value.replace(/\D/g, '')
  meterNumber.value = value
  
  // Mock customer info (in real app, this would call API)
  if (value.length >= 11) {
    // Simulate API call
    setTimeout(() => {
      customerInfo.value = {
        name: 'PELANGGAN PLN',
        address: 'Jakarta Selatan'
      }
    }, 500)
  } else {
    customerInfo.value = null
  }
}

const handleProductSelect = (product) => {
  // Validate meter number
  if (!meterNumber.value || meterNumber.value.length < 11) {
    alert('Masukkan nomor meter PLN yang valid (11-12 digit)')
    return
  }

  console.log('Selected token:', product, 'Meter:', meterNumber.value)
  alert(`Order token PLN ${product.name} untuk meter ${meterNumber.value}\n\nIntegrasi Midtrans coming soon!`)
}

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>