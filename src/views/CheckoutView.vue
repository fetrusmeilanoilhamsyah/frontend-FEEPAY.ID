<template>
  <div class="min-h-screen bg-stone-50 dark:bg-dark-950 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <!-- Header -->
      <div class="mb-6">
        <button 
          @click="$router.push('/')"
          class="inline-flex items-center gap-2 text-sm text-dark-600 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400 font-semibold mb-4 transition-colors"
        >
          <ChevronLeft :size="16" />
          Kembali
        </button>
        <h1 class="text-3xl font-bold text-dark-950 dark:text-white">
          Konfirmasi Pesanan
        </h1>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-border text-center">
        <Loader class="animate-spin mx-auto mb-4 text-primary-600" :size="48" />
        <p class="text-sm text-dark-600 dark:text-dark-400">Memuat produk...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-border text-center">
        <AlertCircle class="mx-auto mb-4 text-red-500" :size="48" />
        <h2 class="text-xl font-bold text-dark-950 dark:text-white mb-2">Produk Tidak Ditemukan</h2>
        <p class="text-sm text-dark-600 dark:text-dark-400 mb-6">{{ error }}</p>
        <button 
          @click="$router.push('/')"
          class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
        >
          Kembali ke Beranda
        </button>
      </div>

      <!-- Checkout Form -->
      <div v-else-if="product" class="space-y-6">
        
        <!-- Product Info Card -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          <div class="text-xs font-semibold uppercase text-dark-500 dark:text-dark-400 mb-3">
            Produk Dipilih
          </div>
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <h2 class="font-bold text-xl text-dark-950 dark:text-white mb-2">
                {{ product.name }}
              </h2>
              <div class="text-sm text-dark-600 dark:text-dark-400">
                {{ product.category }}
              </div>
            </div>
            <div class="text-right">
              <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                Rp {{ formatPrice(product.selling_price) }}
              </div>
            </div>
          </div>
        </div>

        <!-- Customer Info Form -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-6 border border-border">
          <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-4">
            Informasi Pelanggan
          </h3>
          
          <form @submit.prevent="handleSubmit" class="space-y-5">
            <!-- Target Number -->
            <div>
              <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Nomor Tujuan / ID Pelanggan
                <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.target_number" 
                type="text" 
                class="w-full h-12 bg-white dark:bg-dark-950 border-2 border-border rounded-lg px-4 text-dark-950 dark:text-white font-medium outline-none focus:border-primary-600 transition-colors" 
                placeholder="Contoh: 081234567890" 
                required 
              />
              <p class="mt-1 text-xs text-dark-500 dark:text-dark-400">
                Masukkan nomor HP, ID pelanggan, atau nomor meter
              </p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-dark-700 dark:text-dark-300 mb-2">
                Email
                <span class="text-red-500">*</span>
              </label>
              <input 
                v-model="formData.customer_email" 
                type="email" 
                class="w-full h-12 bg-white dark:bg-dark-950 border-2 border-border rounded-lg px-4 text-dark-950 dark:text-white font-medium outline-none focus:border-primary-600 transition-colors" 
                placeholder="email@example.com" 
                required 
              />
              <p class="mt-1 text-xs text-dark-500 dark:text-dark-400">
                Notifikasi akan dikirim ke email ini
              </p>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              :disabled="submitting"
              class="w-full h-12 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Loader v-if="submitting" class="animate-spin" :size="18" />
              <span>{{ submitting ? 'Memproses...' : 'Lanjutkan ke Pembayaran' }}</span>
            </button>
          </form>
        </div>

        <!-- Info Card -->
        <div class="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
          <div class="flex gap-3">
            <Info class="text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" :size="20" />
            <div class="text-sm text-blue-700 dark:text-blue-300">
              <p class="font-semibold mb-1">Catatan:</p>
              <ul class="space-y-1 text-blue-600 dark:text-blue-400">
                <li>• Pastikan nomor tujuan sudah benar sebelum melanjutkan</li>
                <li>• Produk akan aktif otomatis setelah pembayaran diverifikasi</li>
                <li>• Notifikasi akan dikirim ke email yang Anda daftarkan</li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft, Loader, AlertCircle, Info } from 'lucide-vue-next'
import { useProductStore } from '@/stores/productStore'
import { useOrderStore } from '@/stores/orderStore'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()

const product = ref(null)
const loading = ref(true)
const error = ref(null)
const submitting = ref(false)

const formData = ref({
  target_number: '',
  customer_email: ''
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const loadProduct = () => {
  const productId = route.params.productId
  
  if (!productId) {
    error.value = 'Product ID tidak ditemukan'
    loading.value = false
    return
  }

  // Get product by SKU from store
  const foundProduct = productStore.getProductBySku(productId)
  
  if (!foundProduct) {
    error.value = 'Produk tidak ditemukan'
    loading.value = false
    return
  }

  product.value = foundProduct
  loading.value = false
}

const handleSubmit = async () => {
  if (!product.value) return
  
  submitting.value = true
  
  try {
    const order = await orderStore.createOrder({
      sku: product.value.sku,
      target_number: formData.value.target_number,
      customer_email: formData.value.customer_email
    })
    
    // Redirect to payment page
    router.push(`/payment/${order.order_id}`)
  } catch (err) {
    alert(err.message || 'Gagal membuat pesanan')
  } finally {
    submitting.value = false
  }
}

onMounted(() => {
  loadProduct()
})
</script>