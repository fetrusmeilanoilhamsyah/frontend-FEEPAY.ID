<template>
  <div class="pulsa-checkout-wrapper">
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
                <h1 class="text-lg sm:text-xl font-bold text-foreground">
                  Pulsa & Kredit
                </h1>
                <p class="text-xs text-muted-foreground">
                  Isi pulsa semua operator
                </p>
              </div>
            </div>
            <router-link 
              to="/checkout/data"
              class="text-xs sm:text-sm font-semibold text-primary hover:underline"
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
        <div v-if="productStore.loading" class="grid grid-cols-3 gap-3">
          <SkeletonProductCard v-for="i in 12" :key="i" />
        </div>

        <!-- Products — grouped by operator -->
        <div v-else-if="pulsaProducts.length > 0">

          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-bold text-foreground">Pilih Nominal</h2>
            <span class="text-xs text-muted-foreground font-medium">
              {{ pulsaProducts.length }} produk tersedia
            </span>
          </div>

          <!-- Group per operator -->
          <div v-for="group in groupedProducts" :key="group.operator" class="operator-group">
            <!-- Operator header -->
            <div class="operator-header">
              <img
                v-if="group.logo"
                :src="group.logo"
                :alt="group.operator"
                class="operator-logo"
                @error="(e) => e.target.style.display = 'none'"
              />
              <span class="operator-name">{{ group.operator }}</span>
              <span class="operator-count">{{ group.products.length }} nominal</span>
            </div>

            <!-- Cards -->
            <div class="grid grid-cols-3 gap-3">
              <ProductCard
                v-for="product in group.products"
                :key="product.id"
                :product="product"
                @select="handleProductSelect"
              />
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <Package class="mx-auto mb-4 text-muted-foreground" :size="64" />
          <h3 class="text-lg font-semibold text-foreground mb-2">Produk Tidak Tersedia</h3>
          <p class="text-sm text-muted-foreground">Belum ada produk pulsa untuk kategori ini</p>
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

const pulsaProducts = computed(() => productStore.productsByCategory('Pulsa'))

// Operator config — urutan tampil + logo
const OPERATOR_ORDER = [
  { name: 'Telkomsel', keys: ['telkomsel', 'simpati', 'kartu as', 'loop'], logo: '/logos/operators/telkomsel.png' },
  { name: 'Indosat',   keys: ['indosat', 'im3', 'mentari'],                logo: '/logos/operators/indosat.png'   },
  { name: 'XL',        keys: ['xl', 'xtra'],                               logo: '/logos/operators/xl.png'        },
  { name: 'Axis',      keys: ['axis'],                                     logo: '/logos/operators/axis.png'      },
  { name: 'by.U',      keys: ['by.u', 'byu'],                             logo: '/logos/operators/byu.png'       },
  { name: 'Tri',       keys: ['tri', 'three', 'hutchison'],               logo: '/logos/operators/three.png'     },
  { name: 'Smartfren', keys: ['smartfren'],                               logo: '/logos/operators/smartfren.png' },
]

const groupedProducts = computed(() => {
  const products = pulsaProducts.value
  const groups = []
  const assigned = new Set()

  for (const op of OPERATOR_ORDER) {
    const matched = products.filter(p => {
      if (assigned.has(p.id)) return false
      const name = p.name?.toLowerCase() || ''
      return op.keys.some(k => name.includes(k))
    })

    if (matched.length > 0) {
      matched.forEach(p => assigned.add(p.id))
      // Sort by price ascending
      matched.sort((a, b) => (a.selling_price || 0) - (b.selling_price || 0))
      groups.push({ operator: op.name, logo: op.logo, products: matched })
    }
  }

  // Sisa produk yang tidak masuk operator manapun
  const others = products.filter(p => !assigned.has(p.id))
  if (others.length > 0) {
    groups.push({ operator: 'Lainnya', logo: null, products: others })
  }

  return groups
})

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

<style scoped>
.operator-group {
  margin-bottom: 1.75rem;
}

.operator-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  padding-bottom: 8px;
  border-bottom: 1.5px solid var(--border);
}

.operator-logo {
  height: 18px;
  width: auto;
  max-width: 56px;
  object-fit: contain;
}

.operator-name {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--foreground);
  flex: 1;
}

.operator-count {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--muted-foreground);
}
</style>