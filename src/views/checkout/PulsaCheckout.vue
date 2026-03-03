<template>
  <div class="pulsa-page">

    <!-- Header -->
    <div class="pulsa-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div class="header-title-wrap">
          <div class="header-icon">
            <img src="/icons/pulsa.webp" class="w-5 h-5 object-contain"
              @error="(e) => e.target.style.display='none'" />
          </div>
          <div>
            <h1 class="header-title">Pulsa Reguler</h1>
            <p class="header-sub">Isi pulsa semua operator</p>
          </div>
        </div>
        <router-link to="/checkout/data" class="switch-btn">
          Beli Kuota →
        </router-link>
      </div>
    </div>

    <div class="page-content">

      <!-- Phone Card -->
      <div class="phone-card">
        <div class="phone-card-header">
          <div class="phone-label-wrap">
            <Smartphone :size="15" class="phone-label-icon" />
            <span class="phone-label">Nomor HP</span>
          </div>
          <span v-if="detectedOperator?.name" class="operator-chip">
            <span class="operator-chip-dot" />
            {{ detectedOperator.name }}
          </span>
        </div>
        <PhoneInput v-model="phoneNumber" />
      </div>

      <!-- Recent Numbers -->
      <RecentNumbers
        v-if="recentNumbers.length > 0"
        :numbers="recentNumbers"
        @select="phoneNumber = $event.replace(/\D/g,'').replace(/^0+/,'')"
      />

      <!-- Nominal Grid -->
      <div class="nominal-section">
        <div class="nominal-section-header">
          <div class="nominal-section-title-wrap">
            <img src="/icons/sim-card.webp" class="w-5 h-5 object-contain"
              @error="(e) => e.target.style.display='none'" />
            <span class="section-label">Pilih Nominal</span>
          </div>
          <span class="nominal-count" v-if="detectedOperator?.name">
            {{ displayedProducts.filter(p => !p.isDummy).length }} tersedia
          </span>
        </div>

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
            <!-- Selected check -->
            <div v-if="selectedProduct?.id === item.id && !item.isDummy" class="check-icon">
              <CheckCircle2 :size="15" />
            </div>

            <!-- Popular badge -->
            <div v-if="['25rb','50rb'].includes(item.displayLabel) && !item.isDummy" class="popular-badge">
              🔥 Populer
            </div>

            <div class="card-content">
              <div class="nominal-top">
                <span class="card-nominal">{{ item.displayLabel }}</span>
                <span class="card-subtitle">Pulsa Reguler</span>
              </div>
              <div class="price-footer">
                <span class="card-price" v-if="!item.isDummy">
                  {{ formatPrice(item.selling_price) }}
                </span>
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
import { ArrowLeft, CheckCircle2, Smartphone } from 'lucide-vue-next'
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
.pulsa-page {
  min-height: 100vh;
  background: var(--background, #f8fafc);
  padding-bottom: 80px;
}

/* HEADER */
.pulsa-header {
  position: sticky; top: 0; z-index: 40;
  background: var(--card, #fff);
  border-bottom: 1px solid var(--border, #e5e7eb);
}
.header-inner {
  max-width: 640px; margin: 0 auto;
  padding: 12px 16px;
  display: flex; align-items: center; gap: 12px;
}
.back-btn {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px; border: none; background: transparent;
  color: var(--muted-foreground, #6b7280); cursor: pointer;
  transition: all 0.15s; flex-shrink: 0;
}
.back-btn:hover { background: var(--muted, #f3f4f6); }

.header-title-wrap {
  display: flex; align-items: center; gap: 10px; flex: 1;
}
.header-icon {
  width: 36px; height: 36px;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
  border: 1px solid rgba(22,163,74,0.2);
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.header-title {
  font-size: 1rem; font-weight: 800;
  color: var(--foreground, #111827); margin: 0;
  letter-spacing: -0.02em;
}
.header-sub {
  font-size: 0.6875rem;
  color: var(--muted-foreground, #9ca3af); margin: 0;
}
.switch-btn {
  font-size: 0.75rem; font-weight: 700; color: #16a34a;
  background: rgba(22,163,74,0.08);
  padding: 6px 12px; border-radius: 999px;
  text-decoration: none; white-space: nowrap; flex-shrink: 0;
  transition: background 0.2s;
}
.switch-btn:hover { background: rgba(22,163,74,0.15); }

/* CONTENT */
.page-content {
  max-width: 640px; margin: 0 auto;
  padding: 16px 16px;
  display: flex; flex-direction: column; gap: 16px;
}

/* PHONE CARD */
.phone-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  padding: 16px;
  display: flex; flex-direction: column; gap: 12px;
  position: relative; overflow: hidden;
}
.phone-card::before {
  content: '';
  position: absolute; top: -20px; right: -20px;
  width: 80px; height: 80px;
  background: radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%);
  pointer-events: none;
}
.phone-card-header {
  display: flex; align-items: center; justify-content: space-between;
}
.phone-label-wrap {
  display: flex; align-items: center; gap: 6px;
}
.phone-label-icon { color: #16a34a; }
.phone-label {
  font-size: 0.8125rem; font-weight: 700;
  color: var(--foreground, #111827);
}
.operator-chip {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 3px 10px;
  background: rgba(22,163,74,0.1);
  border: 1px solid rgba(22,163,74,0.2);
  border-radius: 999px;
  font-size: 0.6875rem; font-weight: 700; color: #16a34a;
}
.operator-chip-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: #16a34a;
  animation: pulse-green 2s infinite;
}
@keyframes pulse-green {
  0%,100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
  50%     { box-shadow: 0 0 0 4px rgba(22,163,74,0); }
}

/* NOMINAL SECTION */
.nominal-section {
  display: flex; flex-direction: column; gap: 12px;
}
.nominal-section-header {
  display: flex; align-items: center; justify-content: space-between;
}
.nominal-section-title-wrap {
  display: flex; align-items: center; gap: 8px;
}
.section-label {
  font-size: 0.8125rem; font-weight: 800;
  color: var(--foreground, #111827);
  text-transform: uppercase; letter-spacing: 0.05em;
}
.nominal-count {
  font-size: 0.6875rem; font-weight: 600;
  color: #16a34a;
  background: rgba(22,163,74,0.08);
  padding: 3px 10px; border-radius: 999px;
}

/* NOMINAL GRID */
.nominal-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
@media (min-width: 480px) {
  .nominal-grid { grid-template-columns: repeat(3, 1fr); }
}

.nominal-card {
  position: relative;
  background: var(--card, #fff);
  border: 1.5px solid var(--border, #e5e7eb);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
  text-align: left; overflow: hidden;
}
.nominal-card::after {
  content: '';
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, #16a34a, #4ade80);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
  border-radius: 0 0 16px 16px;
}
.nominal-card:hover:not(.disabled) {
  border-color: rgba(22,163,74,0.4);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(22,163,74,0.12);
}
.nominal-card:hover:not(.disabled)::after { transform: scaleX(1); }
.nominal-card:active:not(.disabled) { transform: scale(0.96); }
.nominal-card.selected {
  border-color: #16a34a;
  background: linear-gradient(135deg, rgba(22,163,74,0.06) 0%, rgba(22,163,74,0.02) 100%);
  box-shadow: 0 6px 20px rgba(22,163,74,0.15);
}
.nominal-card.selected::after { transform: scaleX(1); }
.nominal-card.disabled {
  opacity: 0.5; cursor: not-allowed;
  background: var(--muted, #f3f4f6);
  border-style: dashed;
}

.check-icon {
  position: absolute; top: 8px; right: 8px;
  color: #16a34a;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 1px 4px rgba(22,163,74,0.2);
}

.popular-badge {
  position: absolute; top: 8px; left: 8px;
  font-size: 0.5625rem; font-weight: 800;
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  color: #fff;
  padding: 2px 7px; border-radius: 6px;
  white-space: nowrap;
}

.card-content {
  padding: 14px;
  display: flex; flex-direction: column; gap: 10px;
}
.nominal-top { display: flex; flex-direction: column; gap: 3px; }
.card-nominal {
  font-size: 1.5rem; font-weight: 900;
  color: var(--foreground, #111827);
  letter-spacing: -0.04em; line-height: 1;
}
.card-subtitle {
  font-size: 0.5625rem; font-weight: 700;
  color: var(--muted-foreground, #9ca3af);
  text-transform: uppercase; letter-spacing: 0.06em;
}
.price-footer {
  padding-top: 10px;
  border-top: 1.5px dashed var(--border, #e5e7eb);
}
.card-price {
  font-size: 0.875rem; font-weight: 800; color: #16a34a;
}
.card-unavailable {
  font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); font-weight: 600;
}

/* SKELETON */
.skeleton-card {
  height: 100px;
  background: var(--muted, #f3f4f6);
  border-radius: 16px; overflow: hidden; position: relative;
}
.skeleton-card::after {
  content: ''; position: absolute; inset: 0;
  transform: translateX(-100%);
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 100% { transform: translateX(100%); } }
</style>