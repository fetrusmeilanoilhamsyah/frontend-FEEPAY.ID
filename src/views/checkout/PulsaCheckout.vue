<template>
  <div class="pulsa-page">

    <!-- Header -->
    <div class="pulsa-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Pulsa Reguler</h1>
          <p class="header-sub">Isi pulsa semua operator</p>
        </div>
        <router-link to="/checkout/data" class="switch-btn">
          Beli Kuota →
        </router-link>
      </div>
    </div>

    <div class="page-content">

      <!-- Phone Input -->
      <div class="phone-card">
        <PhoneInput v-model="phoneNumber" />
      </div>

      <!-- Recent Numbers -->
      <RecentNumbers
        v-if="recentNumbers.length > 0"
        :numbers="recentNumbers"
        @select="phoneNumber = $event.replace(/\D/g,'').replace(/^0+/,'')"
      />

      <!-- Operator Badge -->
      <div v-if="detectedOperator?.name" class="operator-detected">
        <div class="operator-dot" />
        <span class="operator-name">{{ detectedOperator.name }}</span>
        <span class="operator-hint">terdeteksi</span>
      </div>

      <!-- Nominal Grid -->
      <div>
        <p class="section-label">Pilih Nominal</p>

        <div v-if="productStore.loading" class="nominal-grid">
          <div v-for="i in 8" :key="i" class="skeleton-card" />
        </div>

        <div v-else class="nominal-grid">
          <button
            v-for="(item, index) in displayedProducts"
            :key="item.id || `dummy-${index}`"
            class="nominal-card"
            :class="{
              selected: selectedProduct?.id === item.id && !item.isDummy,
              disabled: item.isDummy
            }"
            :disabled="item.isDummy"
            @click="handleSelect(item)"
          >
            <div v-if="selectedProduct?.id === item.id && !item.isDummy" class="check-icon">
              <CheckCircle2 :size="16" />
            </div>
            <div class="card-content">
              <div class="nominal-header">
                <span class="card-nominal">{{ item.displayLabel }}</span>
                <span class="card-subtitle">Pulsa Reguler</span>
              </div>
              <div class="price-footer">
                <span class="card-price" v-if="!item.isDummy">{{ formatPrice(item.selling_price) }}</span>
                <span class="card-unavailable" v-else>
                  {{ !detectedOperator ? 'Masukkan nomor HP' : 'Tidak tersedia' }}
                </span>
              </div>
            </div>
          </button>
        </div>
      </div>

    </div>

    <PaymentModal
      :product="selectedProduct"
      :customer-data="'0' + phoneNumber"
      customer-label="Nomor HP"
      @close="selectedProduct = null"
      @success="selectedProduct = null"
      @pending="selectedProduct = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ArrowLeft, CheckCircle2 } from 'lucide-vue-next'
import PhoneInput from '@/components/checkout/PhoneInput.vue'
import RecentNumbers from '@/components/checkout/RecentNumbers.vue'
import PaymentModal from '@/components/checkout/PaymentModal.vue'
import { useProductStore } from '@/stores/productStore'
import { useRecentNumbers } from '@/composables/useRecentNumbers'
import { useOperatorDetector } from '@/composables/useOperatorDetector'

const productStore = useProductStore()
const { recentNumbers, addNumber } = useRecentNumbers()
const { detectedOperator, detectOperator } = useOperatorDetector()

const phoneNumber = ref('')
const selectedProduct = ref(null)

const OPERATOR_KEYS = {
  telkomsel: ['telkomsel', 'simpati', 'kartu as', 'loop'],
  indosat:   ['indosat', 'im3', 'mentari'],
  xl:        ['xl', 'xtra', 'axiata'],
  tri:       ['tri', 'three', 'hutchison'],
  smartfren: ['smartfren'],
  axis:      ['axis'],
  byu:       ['by.u', 'byu'],
}

const DUMMY_LIST = [5, 10, 15, 20, 25, 30, 50, 100].map(n => ({
  displayLabel: `${n}rb`, isDummy: true
}))

watch(phoneNumber, (val) => {
  if (!val || val.length < 3) { detectOperator(''); return }
  detectOperator('0' + val.replace(/\D/g, ''))
}, { immediate: true })

const pulsaProducts = computed(() => productStore.productsByCategory('Pulsa'))

const displayedProducts = computed(() => {
  if (!detectedOperator.value?.key) return DUMMY_LIST
  const keys = OPERATOR_KEYS[detectedOperator.value.key] || []
  const filtered = pulsaProducts.value.filter(p =>
    keys.some(k => (p.name?.toLowerCase() || '').includes(k))
  )
  const processed = filtered.map(p => {
    const nameMatch = p.name?.match(/\d[\d.,]*/)?.[0]
    const nominalValue = nameMatch ? parseInt(nameMatch.replace(/\D/g, '')) : 0
    let label = p.name
    if (nominalValue >= 1000) {
      const rb = nominalValue / 1000
      label = Number.isInteger(rb) ? `${rb}rb` : `${rb.toFixed(1).replace('.0','')}rb`
    }
    return { ...p, parsedNominal: nominalValue, displayLabel: label, isDummy: false }
  }).sort((a, b) => a.parsedNominal - b.parsedNominal)
  return processed.length > 0 ? processed : DUMMY_LIST
})

const formatPrice = (price) => price ? 'Rp' + Number(price).toLocaleString('id') : '-'

const handleSelect = (product) => {
  if (product.isDummy) return
  if (!phoneNumber.value || phoneNumber.value.replace(/\D/g,'').length < 9) {
    alert('Masukkan nomor HP yang valid'); return
  }
  addNumber('0' + phoneNumber.value.replace(/\D/g,''))
  selectedProduct.value = product
}

onMounted(async () => { await productStore.fetchProducts() })
</script>

<style scoped>
.pulsa-page { min-height:100vh; background:var(--background,#f8fafc); padding-bottom:80px; }

/* HEADER */
.pulsa-header { position:sticky; top:0; z-index:40; background:var(--card,#fff); border-bottom:1px solid var(--border,#e5e7eb); }
.header-inner { max-width:640px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; gap:12px; }
.back-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:none; background:transparent; color:var(--muted-foreground,#6b7280); cursor:pointer; transition:all 0.15s; flex-shrink:0; }
.back-btn:hover { background:var(--muted,#f3f4f6); color:var(--foreground,#111827); }
.header-title { font-size:1.0625rem; font-weight:700; color:var(--foreground,#111827); margin:0; }
.header-sub { font-size:0.75rem; color:var(--muted-foreground,#6b7280); margin:0; }
.switch-btn { margin-left:auto; font-size:0.75rem; font-weight:700; color:#16a34a; background:rgba(22,163,74,0.08); padding:6px 12px; border-radius:999px; text-decoration:none; white-space:nowrap; flex-shrink:0; transition:background 0.2s; }
.switch-btn:hover { background:rgba(22,163,74,0.15); }

/* CONTENT */
.page-content { max-width:640px; margin:0 auto; padding:20px 16px; display:flex; flex-direction:column; gap:16px; }

/* PHONE CARD */
.phone-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:16px; }

/* OPERATOR DETECTED */
.operator-detected { display:flex; align-items:center; gap:8px; padding:10px 14px; background:rgba(22,163,74,0.06); border:1px solid rgba(22,163,74,0.2); border-radius:10px; }
.operator-dot { width:8px; height:8px; border-radius:50%; background:#16a34a; flex-shrink:0; }
.operator-name { font-size:0.8125rem; font-weight:700; color:#16a34a; }
.operator-hint { font-size:0.75rem; color:var(--muted-foreground,#6b7280); }

/* SECTION LABEL */
.section-label { font-size:0.75rem; font-weight:700; color:var(--foreground,#111827); text-transform:uppercase; letter-spacing:0.05em; margin-bottom:12px; }

/* NOMINAL GRID */
.nominal-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
@media(min-width:480px){ .nominal-grid{ grid-template-columns:repeat(3,1fr); } }

.nominal-card {
  position:relative; background:var(--card,#fff);
  border:1.5px solid var(--border,#e5e7eb);
  border-radius:16px; cursor:pointer;
  transition:all 0.2s cubic-bezier(0.4,0,0.2,1);
  text-align:left; overflow:hidden;
}
.nominal-card::before {
  content:''; position:absolute; top:0; left:0; width:4px; height:100%;
  background:transparent; transition:all 0.2s;
}
.nominal-card:hover:not(.disabled) { border-color:rgba(22,163,74,0.4); transform:translateY(-2px); box-shadow:0 8px 16px rgba(0,0,0,0.06); }
.nominal-card:active:not(.disabled) { transform:scale(0.97); }
.nominal-card.selected { border-color:#16a34a; background:rgba(22,163,74,0.04); box-shadow:0 6px 16px rgba(22,163,74,0.15); }
.nominal-card.selected::before { background:#16a34a; }
.nominal-card.disabled { opacity:0.5; cursor:not-allowed; background:var(--muted,#f3f4f6); border-style:dashed; }

.check-icon { position:absolute; top:10px; right:10px; color:#16a34a; background:#fff; border-radius:50%; }

.card-content { padding:14px; display:flex; flex-direction:column; gap:10px; }
.nominal-header { display:flex; flex-direction:column; }
.card-nominal { font-size:1.375rem; font-weight:900; color:var(--foreground,#111827); letter-spacing:-0.03em; line-height:1; }
.card-subtitle { font-size:0.625rem; font-weight:600; color:var(--muted-foreground,#9ca3af); text-transform:uppercase; letter-spacing:0.05em; margin-top:4px; }
.price-footer { padding-top:10px; border-top:1.5px dashed var(--border,#e5e7eb); }
.card-price { font-size:0.9rem; font-weight:800; color:#16a34a; }
.card-unavailable { font-size:0.6875rem; color:var(--muted-foreground,#9ca3af); font-weight:600; }

/* SKELETON */
.skeleton-card { height:96px; background:var(--muted,#f3f4f6); border-radius:16px; overflow:hidden; position:relative; }
.skeleton-card::after { content:''; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent); animation:shimmer 1.5s infinite; }
@keyframes shimmer { 100%{ transform:translateX(100%); } }
</style>
