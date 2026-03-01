<template>
  <div class="pln-page">

    <!-- Header -->
    <div class="pln-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Token PLN</h1>
          <p class="header-sub">Beli token listrik prabayar</p>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- Meter Input -->
      <div class="input-card">
        <label class="input-label">Nomor Meter / ID Pelanggan <span class="required">*</span></label>
        <div class="input-wrap">
          <Zap :size="18" class="input-icon" />
          <input
            v-model="meterNumber"
            type="text"
            inputmode="numeric"
            placeholder="Contoh: 12345678901"
            class="meter-input"
            maxlength="15"
            @input="handleMeterInput"
          />
        </div>
        <p class="input-hint">Masukkan 11-12 digit nomor meter PLN</p>
      </div>

      <!-- Valid meter indicator -->
      <div v-if="meterNumber.length >= 11" class="meter-valid">
        <Check :size="16" class="valid-icon" />
        <span>Nomor meter valid — pilih nominal di bawah</span>
      </div>

      <!-- Info email -->
      <div class="info-banner">
        <Info :size="16" class="info-icon" />
        <p class="info-text">Token PLN dikirim otomatis ke email setelah pembayaran berhasil</p>
      </div>

      <!-- Products -->
      <div>
        <div class="section-header">
          <h2 class="section-title">Pilih Nominal Token</h2>
          <span class="section-count">{{ plnProducts.length }} nominal</span>
        </div>

        <div v-if="productStore.loading" class="product-grid">
          <div v-for="i in 6" :key="i" class="skeleton-card" />
        </div>

        <div v-else-if="plnProducts.length > 0" class="product-grid">
          <button
            v-for="product in plnProducts"
            :key="product.id"
            @click="handleProductSelect(product)"
            class="pln-card"
            :class="{ selected: selectedProduct?.id === product.id, inactive: product.status !== 'active' }"
            :disabled="product.status !== 'active'"
          >
            <div v-if="selectedProduct?.id === product.id" class="check-icon">
              <CheckCircle2 :size="16" />
            </div>
            <div class="pln-icon-wrap">
              <Zap :size="20" class="pln-zap" />
            </div>
            <div class="card-content">
              <p class="pln-nominal">{{ formatNominal(product.name) }}</p>
              <p class="pln-label">Token PLN</p>
            </div>
            <div class="price-footer">
              <span class="pln-price">{{ formatPrice(product.selling_price) }}</span>
              <span v-if="product.status !== 'active'" class="unavail">Tidak tersedia</span>
            </div>
          </button>
        </div>

        <div v-else class="empty-state">
          <Zap :size="48" class="empty-icon" />
          <p class="empty-title">Token PLN tidak tersedia</p>
        </div>
      </div>

    </div>

    <PaymentModal
      v-if="selectedProduct"
      :product="selectedProduct"
      :customer-data="meterNumber"
      customer-label="Nomor Meter"
      @close="selectedProduct = null"
      @success="selectedProduct = null"
      @pending="selectedProduct = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, Zap, Check, Info, CheckCircle2 } from 'lucide-vue-next'
import PaymentModal from '@/components/checkout/PaymentModal.vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const meterNumber    = ref('')
const selectedProduct = ref(null)

const plnProducts = computed(() => productStore.products.filter(p => {
  const cat  = (p.category || '').toLowerCase()
  const brand = (p.brand || '').toLowerCase()
  const name  = (p.name || '').toLowerCase()
  return cat === 'pln' || brand === 'pln' || name.includes('token pln') || name.includes('token listrik')
}).sort((a, b) => parseFloat(a.selling_price) - parseFloat(b.selling_price)))

const handleMeterInput = (e) => {
  meterNumber.value = e.target.value.replace(/\D/g, '')
}

const formatNominal = (name) => {
  const m = name?.match(/[\d.,]+\.?000/)
  if (m) {
    const n = parseInt(m[0].replace(/\D/g,''))
    if (n >= 1000000) return (n/1000000) + ' Juta'
    if (n >= 1000) return (n/1000) + ' Ribu'
  }
  return name?.replace(/PLN\s*/i,'').trim() || name
}

const formatPrice = (price) => price ? 'Rp' + Number(price).toLocaleString('id') : '-'

const handleProductSelect = (product) => {
  if (!meterNumber.value || meterNumber.value.length < 11) {
    alert('Masukkan nomor meter PLN yang valid (11-12 digit)'); return
  }
  selectedProduct.value = product
}

onMounted(async () => { await productStore.fetchProducts() })
</script>

<style scoped>
.pln-page { min-height:100vh; background:var(--background,#f8fafc); padding-bottom:80px; }

.pln-header { position:sticky; top:0; z-index:40; background:var(--card,#fff); border-bottom:1px solid var(--border,#e5e7eb); }
.header-inner { max-width:640px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; gap:12px; }
.back-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:none; background:transparent; color:var(--muted-foreground,#6b7280); cursor:pointer; transition:all 0.15s; }
.back-btn:hover { background:var(--muted,#f3f4f6); color:var(--foreground,#111827); }
.header-title { font-size:1.0625rem; font-weight:700; color:var(--foreground,#111827); margin:0; }
.header-sub { font-size:0.75rem; color:var(--muted-foreground,#6b7280); margin:0; }

.page-content { max-width:640px; margin:0 auto; padding:20px 16px; display:flex; flex-direction:column; gap:16px; }

.input-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:16px; }
.input-label { display:block; font-size:0.8125rem; font-weight:600; color:var(--foreground,#374151); margin-bottom:8px; }
.required { color:#ef4444; }
.input-wrap { position:relative; }
.input-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--muted-foreground,#6b7280); }
.meter-input { width:100%; height:48px; background:var(--background,#f8fafc); border:1.5px solid var(--border,#e5e7eb); border-radius:12px; padding:0 14px 0 44px; color:var(--foreground,#111827); font-size:1rem; font-weight:600; outline:none; transition:all 0.2s; box-sizing:border-box; letter-spacing:0.05em; }
.meter-input:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }
.input-hint { font-size:0.75rem; color:var(--muted-foreground,#9ca3af); margin-top:6px; }

.meter-valid { display:flex; align-items:center; gap:8px; padding:10px 14px; background:rgba(22,163,74,0.06); border:1px solid rgba(22,163,74,0.2); border-radius:10px; font-size:0.8125rem; font-weight:600; color:#16a34a; }
.valid-icon { flex-shrink:0; }

.info-banner { display:flex; align-items:center; gap:10px; padding:12px 14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; }
.info-icon { color:#3b82f6; flex-shrink:0; }
.info-text { font-size:0.75rem; color:#1e40af; font-weight:500; }

.section-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.section-title { font-size:0.9375rem; font-weight:800; color:var(--foreground,#111827); letter-spacing:-0.02em; }
.section-count { font-size:0.75rem; font-weight:600; color:var(--muted-foreground,#6b7280); }

.product-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
@media(min-width:480px){ .product-grid{ grid-template-columns:repeat(3,1fr); } }

.pln-card { position:relative; background:var(--card,#fff); border:1.5px solid var(--border,#e5e7eb); border-radius:16px; padding:14px 12px; cursor:pointer; transition:all 0.2s; text-align:left; overflow:hidden; }
.pln-card::before { content:''; position:absolute; top:0; left:0; width:4px; height:100%; background:transparent; transition:all 0.2s; }
.pln-card:hover:not(:disabled) { border-color:rgba(22,163,74,0.4); transform:translateY(-2px); box-shadow:0 8px 16px rgba(0,0,0,0.06); }
.pln-card.selected { border-color:#16a34a; background:rgba(22,163,74,0.04); box-shadow:0 6px 16px rgba(22,163,74,0.15); }
.pln-card.selected::before { background:#16a34a; }
.pln-card.inactive { opacity:0.5; cursor:not-allowed; border-style:dashed; }
.check-icon { position:absolute; top:10px; right:10px; color:#16a34a; background:#fff; border-radius:50%; }

.pln-icon-wrap { width:34px; height:34px; background:rgba(251,191,36,0.15); border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:10px; }
.pln-zap { color:#f59e0b; }
.card-content { margin-bottom:10px; }
.pln-nominal { font-size:1.25rem; font-weight:900; color:var(--foreground,#111827); letter-spacing:-0.03em; line-height:1; }
.pln-label { font-size:0.625rem; font-weight:600; color:var(--muted-foreground,#9ca3af); text-transform:uppercase; letter-spacing:0.05em; margin-top:4px; }
.price-footer { padding-top:10px; border-top:1.5px dashed var(--border,#e5e7eb); }
.pln-price { font-size:0.9rem; font-weight:800; color:#16a34a; }
.unavail { font-size:0.6875rem; color:#ef4444; }

.skeleton-card { height:120px; background:var(--muted,#f3f4f6); border-radius:16px; overflow:hidden; position:relative; }
.skeleton-card::after { content:''; position:absolute; inset:0; transform:translateX(-100%); background:linear-gradient(90deg,transparent,rgba(255,255,255,0.4),transparent); animation:shimmer 1.5s infinite; }
@keyframes shimmer { 100%{ transform:translateX(100%); } }

.empty-state { text-align:center; padding:40px 20px; }
.empty-icon { color:var(--muted-foreground,#9ca3af); margin:0 auto 12px; display:block; }
.empty-title { font-size:0.9375rem; font-weight:600; color:var(--muted-foreground,#6b7280); }
</style>