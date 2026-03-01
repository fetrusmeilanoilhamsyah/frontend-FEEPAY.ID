<template>
  <div class="checkout-page">

    <!-- Header -->
    <div class="checkout-header">
      <div class="header-inner">
        <button @click="$router.push('/')" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Konfirmasi Pesanan</h1>
          <p class="header-sub">Lengkapi data pembelian</p>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- Loading -->
      <div v-if="loading" class="state-card">
        <Loader class="spin" :size="36" />
        <p class="state-text">Memuat produk...</p>
      </div>

      <!-- Error -->
      <div v-else-if="error" class="state-card">
        <AlertCircle :size="48" class="error-icon" />
        <h2 class="state-title">Produk Tidak Ditemukan</h2>
        <p class="state-text">{{ error }}</p>
        <button @click="$router.push('/')" class="btn-primary">Kembali ke Beranda</button>
      </div>

      <!-- Product Found -->
      <template v-else-if="product">

        <!-- Product Card -->
        <div class="product-card">
          <p class="card-eyebrow">Produk Dipilih</p>
          <div class="product-row">
            <div class="product-info">
              <h2 class="product-name">{{ product.name }}</h2>
              <span class="product-category">{{ product.category }}</span>
            </div>
            <div class="product-price">Rp{{ formatPrice(product.selling_price) }}</div>
          </div>
        </div>

        <!-- Form -->
        <div class="form-card">
          <h3 class="form-title">Informasi Pelanggan</h3>

          <div class="field">
            <label class="field-label">Nomor Tujuan / ID Pelanggan <span class="req">*</span></label>
            <div class="input-wrap">
              <Phone :size="18" class="input-icon" />
              <input v-model="phoneNumber" type="tel" placeholder="081234567890" class="field-input" required />
              <span v-if="detectedOperator" class="operator-chip">{{ detectedOperator.name }}</span>
            </div>
            <p class="field-hint">{{ detectedOperator ? `Operator ${detectedOperator.name} terdeteksi` : 'Nomor HP, ID pelanggan, atau nomor meter' }}</p>
          </div>

          <div class="field">
            <label class="field-label">Email <span class="req">*</span></label>
            <div class="input-wrap">
              <Mail :size="18" class="input-icon" />
              <input v-model="formData.customer_email" type="email" placeholder="email@example.com" class="field-input" required />
            </div>
            <p class="field-hint">Notifikasi dikirim ke email ini</p>
          </div>

          <button @click="handleSubmit" :disabled="submitting" class="btn-submit">
            <Loader v-if="submitting" class="spin" :size="18" />
            <span>{{ submitting ? 'Memproses...' : 'Lanjutkan ke Pembayaran' }}</span>
          </button>
        </div>

        <!-- Info -->
        <div class="info-banner">
          <Info :size="16" class="info-icon" />
          <div class="info-body">
            <p class="info-title">Perhatian</p>
            <p class="info-text">Pastikan nomor tujuan sudah benar. Produk aktif otomatis setelah pembayaran diverifikasi.</p>
          </div>
        </div>

      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft, Loader, AlertCircle, Info, Phone, Mail } from 'lucide-vue-next'
import { useProductStore } from '@/stores/productStore'
import { useOrderStore } from '@/stores/orderStore'
import { useOperatorDetector } from '@/composables/useOperatorDetector'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()
const { phoneNumber, detectedOperator } = useOperatorDetector()

const product   = ref(null)
const loading   = ref(true)
const error     = ref(null)
const submitting = ref(false)
const formData  = ref({ customer_email: '' })

const formatPrice = (p) => Number(p).toLocaleString('id')

const loadProduct = () => {
  const found = productStore.getProductBySku(route.params.productId)
  if (!found) { error.value = 'Produk tidak ditemukan'; loading.value = false; return }
  product.value = found
  loading.value = false
}

const handleSubmit = async () => {
  if (!product.value) return
  submitting.value = true
  try {
    const order = await orderStore.createOrder({
      sku: product.value.sku,
      target_number: phoneNumber.value,
      customer_email: formData.value.customer_email
    })
    router.push(`/payment/${order.order_id}`)
  } catch (err) {
    alert(err.message || 'Gagal membuat pesanan')
  } finally {
    submitting.value = false
  }
}

onMounted(() => loadProduct())
</script>

<style scoped>
.checkout-page { min-height:100vh; background:var(--background,#f8fafc); padding-bottom:80px; }

.checkout-header { position:sticky; top:0; z-index:40; background:var(--card,#fff); border-bottom:1px solid var(--border,#e5e7eb); }
.header-inner { max-width:640px; margin:0 auto; padding:12px 16px; display:flex; align-items:center; gap:12px; }
.back-btn { width:36px; height:36px; display:flex; align-items:center; justify-content:center; border-radius:10px; border:none; background:transparent; color:var(--muted-foreground,#6b7280); cursor:pointer; transition:all 0.15s; flex-shrink:0; }
.back-btn:hover { background:var(--muted,#f3f4f6); }
.header-title { font-size:1.0625rem; font-weight:700; color:var(--foreground,#111827); margin:0; }
.header-sub { font-size:0.75rem; color:var(--muted-foreground,#6b7280); margin:0; }

.page-content { max-width:640px; margin:0 auto; padding:20px 16px; display:flex; flex-direction:column; gap:16px; }

/* States */
.state-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:40px 20px; text-align:center; display:flex; flex-direction:column; align-items:center; gap:12px; }
.state-title { font-size:1.125rem; font-weight:700; color:var(--foreground,#111827); }
.state-text { font-size:0.875rem; color:var(--muted-foreground,#6b7280); }
.error-icon { color:#ef4444; }
.spin { animation:spin 1s linear infinite; color:#16a34a; }
@keyframes spin { to{ transform:rotate(360deg); } }

/* Product Card */
.product-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:16px; }
.card-eyebrow { font-size:0.6875rem; font-weight:700; text-transform:uppercase; letter-spacing:0.06em; color:var(--muted-foreground,#9ca3af); margin-bottom:10px; }
.product-row { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
.product-name { font-size:1rem; font-weight:700; color:var(--foreground,#111827); margin-bottom:4px; }
.product-category { font-size:0.75rem; color:var(--muted-foreground,#6b7280); }
.product-price { font-size:1.25rem; font-weight:900; color:#16a34a; white-space:nowrap; }

/* Form */
.form-card { background:var(--card,#fff); border:1px solid var(--border,#e5e7eb); border-radius:16px; padding:20px; display:flex; flex-direction:column; gap:16px; }
.form-title { font-size:0.9375rem; font-weight:800; color:var(--foreground,#111827); }
.field { display:flex; flex-direction:column; gap:6px; }
.field-label { font-size:0.8125rem; font-weight:600; color:var(--foreground,#374151); }
.req { color:#ef4444; }
.input-wrap { position:relative; }
.input-icon { position:absolute; left:14px; top:50%; transform:translateY(-50%); color:var(--muted-foreground,#6b7280); }
.field-input { width:100%; height:48px; background:var(--background,#f8fafc); border:1.5px solid var(--border,#e5e7eb); border-radius:12px; padding:0 14px 0 44px; font-size:0.9rem; font-weight:500; color:var(--foreground,#111827); outline:none; transition:all 0.2s; box-sizing:border-box; }
.field-input:focus { border-color:#16a34a; box-shadow:0 0 0 3px rgba(22,163,74,0.1); }
.operator-chip { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:#16a34a; color:#fff; font-size:0.6875rem; font-weight:700; padding:3px 8px; border-radius:999px; }
.field-hint { font-size:0.75rem; color:var(--muted-foreground,#9ca3af); }

.btn-submit { width:100%; height:48px; background:#16a34a; color:#fff; border:none; border-radius:12px; font-size:0.9375rem; font-weight:700; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; transition:background 0.2s; margin-top:4px; }
.btn-submit:hover:not(:disabled) { background:#15803d; }
.btn-submit:disabled { opacity:0.6; cursor:not-allowed; }

.btn-primary { background:#16a34a; color:#fff; border:none; border-radius:10px; padding:10px 24px; font-size:0.875rem; font-weight:700; cursor:pointer; }

/* Info */
.info-banner { display:flex; align-items:flex-start; gap:10px; padding:14px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:12px; }
.info-icon { color:#3b82f6; flex-shrink:0; margin-top:2px; }
.info-title { font-size:0.8125rem; font-weight:700; color:#1e40af; margin-bottom:4px; }
.info-text { font-size:0.75rem; color:#3b82f6; line-height:1.5; }
</style>
