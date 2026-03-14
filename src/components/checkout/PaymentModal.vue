<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="product"
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-4"
        @click.self="emit('close')"
      >
        <div class="modal-content">

          <!-- Header -->
          <div class="modal-header">
            <div class="modal-header-left">
              <div class="modal-icon">
                <ShoppingBag :size="18" />
              </div>
              <div>
                <h3 class="modal-title">Konfirmasi Pembelian</h3>
                <p class="modal-subtitle">Periksa detail sebelum bayar</p>
              </div>
            </div>
            <button @click="emit('close')" class="modal-close">
              <X :size="18" />
            </button>
          </div>

          <!-- Product Card -->
          <div class="product-card">

            <!-- Produk & Customer -->
            <div class="info-row">
              <span class="info-label">Produk</span>
              <div class="info-value-wrap">
                <img v-if="operatorLogo" :src="operatorLogo" :alt="operatorName"
                  class="operator-logo" @error="(e) => e.target.style.display='none'" />
                <span class="info-value font-semibold">{{ product.name }}</span>
              </div>
            </div>

            <div class="info-row">
              <span class="info-label">{{ customerLabel }}</span>
              <span class="info-value font-mono">{{ customerData }}</span>
            </div>

            <div v-if="zoneId" class="info-row">
              <span class="info-label">Zone ID</span>
              <span class="info-value font-mono">{{ zoneId }}</span>
            </div>

            <div class="card-divider" />

            <!-- Breakdown harga -->
            <div class="info-row">
              <span class="info-label">Harga Produk</span>
              <span class="info-value">Rp{{ formatPrice(costPrice) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Biaya Layanan</span>
              <span class="info-value fee-value">+Rp{{ formatPrice(serviceFee) }}</span>
            </div>

            <!-- Total Bayar — hero -->
            <div class="total-row">
              <div class="total-left">
                <span class="total-label">Total Bayar</span>
                <span class="total-badge">Sudah termasuk pajak</span>
              </div>
              <span class="total-value">
                Rp{{ formatPrice(product.selling_price || product.price || 0) }}
              </span>
            </div>
          </div>

          <!-- Email Input -->
          <div class="email-section">
            <label class="email-label">
              Email Penerima
              <span class="required">*</span>
            </label>
            <div class="email-input-wrap" :class="{ 'email-input-wrap--error': emailError, 'email-input-wrap--valid': isEmailValid && localEmail }">
              <Mail :size="16" class="email-icon" />
              <input
                v-model="localEmail"
                type="email"
                class="email-input"
                placeholder="email@example.com"
                @input="emailError = ''"
                @blur="saveEmail"
              />
              <CheckCircle v-if="isEmailValid && localEmail" :size="16" class="email-valid-icon" />
            </div>
            <p v-if="emailError" class="email-error">{{ emailError }}</p>
            <p v-else class="email-hint">
              <Info :size="11" />
              Notifikasi & bukti transaksi dikirim ke email ini
            </p>
          </div>

          <!-- Info Box -->
          <div v-if="showInfo" class="info-box">
            <Info :size="14" class="info-box-icon" />
            <p class="info-box-text">{{ infoMessage }}</p>
          </div>

          <!-- Pay Button -->
          <MidtransButton
            :product="product"
            :target-number="customerData"
            :zone-id="zoneId"
            :customer-email="localEmail"
            :disabled="!isEmailValid"
            @close="emit('close')"
            @success="(orderId) => emit('success', orderId)"
            @pending="(orderId) => emit('pending', orderId)"
          />

          <!-- Security note -->
          <div class="security-note">
            <ShieldCheck :size="12" />
            <span>Transaksi aman & terenkripsi · Powered by Midtrans</span>
          </div>

        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Info, Mail, CheckCircle, ShoppingBag, ShieldCheck } from 'lucide-vue-next'
import { useMidtrans } from '@/composables/useMidtrans'
import { useProductStore } from '@/stores/productStore'
import { formatPrice as utilsFormatPrice } from '@/utils/format'
import { ZONE_ID_BRANDS } from '@/constants/operators'
import { OPERATOR_KEYS } from '@/constants/operators'
import MidtransButton from './MidtransButton.vue'

const SAVED_EMAIL_KEY = 'feepay_last_email'

const props = defineProps({
  product:       { type: Object,  default: null },
  customerData:  { type: String,  required: true },
  customerLabel: { type: String,  default: 'Nomor Tujuan' },
  customerEmail: { type: String,  default: '' },
  zoneId:        { type: String,  default: undefined },
  showInfo:      { type: Boolean, default: false },
  infoMessage:   { type: String,  default: '' }
})

const emit = defineEmits(['close', 'success', 'pending'])

const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || ''
const localEmail = ref(props.customerEmail || savedEmail)
const emailError = ref('')

const saveEmail = () => {
  if (isEmailValid.value) localStorage.setItem(SAVED_EMAIL_KEY, localEmail.value)
}

watch(() => props.customerEmail, (val) => { if (val) localEmail.value = val })
watch(() => props.product, (val) => {
  if (val && !props.customerEmail) {
    localEmail.value = localStorage.getItem(SAVED_EMAIL_KEY) || ''
    emailError.value = ''
  }
})

const isEmailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(localEmail.value))
const formatPrice = (price) => utilsFormatPrice(price, { useShorthand: true, withPrefix: false })

const costPrice    = computed(() => Number(props.product?.cost_price || 0))
const sellingPrice = computed(() => Number(props.product?.selling_price || props.product?.price || 0))
const serviceFee   = computed(() => sellingPrice.value - costPrice.value)

const detectedOperator = computed(() => {
  if (!props.product?.name) return null
  const name = props.product.name.toLowerCase()
  
  // Use keys from centralized constants
  for (const [key, prefixes] of Object.entries(OPERATOR_KEYS)) {
    if (prefixes.some(p => name.includes(p))) {
      return { file: key === 'tri' ? 'three' : key, label: key.toUpperCase() }
    }
  }
  return null
})

const operatorLogo = computed(() =>
  detectedOperator.value ? `/logos/operators/${detectedOperator.value.file}.webp` : null
)
const operatorName = computed(() => detectedOperator.value?.label ?? '')
</script>

<style scoped>
.modal-content {
  width: 100%;
  max-width: 26rem;
  background: var(--card);
  border-radius: 24px 24px 0 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 -8px 40px rgba(0,0,0,0.15);
  border: 1px solid var(--border);
}
.dark .modal-content {
  background: var(--glass-bg);
  backdrop-filter: blur(16px);
  border-color: var(--glass-border);
}
@media (min-width: 640px) {
  .modal-content {
    border-radius: 24px;
    padding: 28px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
  }
}

/* HEADER */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.modal-header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}
.modal-icon {
  width: 38px; height: 38px;
  background: linear-gradient(135deg, var(--accent), var(--accent-hover));
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  color: var(--accent-foreground);
  flex-shrink: 0;
}
.modal-title {
  font-size: 1rem;
  font-weight: 800;
  color: var(--foreground);
  letter-spacing: -0.02em;
}
.modal-subtitle {
  font-size: 0.6875rem;
  color: var(--muted-foreground);
  margin-top: 1px;
}
.modal-close {
  width: 34px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: transparent;
  color: var(--muted-foreground);
  cursor: pointer;
  transition: all 0.15s;
}
.modal-close:hover {
  background: var(--muted);
  color: var(--foreground);
}

/* PRODUCT CARD */
.product-card {
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
  overflow: hidden;
}
.product-card::before {
  content: '';
  position: absolute;
  top: -20px; right: -20px;
  width: 80px; height: 80px;
  background: radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%);
  pointer-events: none;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}
.info-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted-foreground);
  flex-shrink: 0;
}
.operator-logo {
  height: 16px; width: auto;
  max-width: 48px;
  object-fit: contain;
}
.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  text-align: right;
}
.fee-value {
  color: var(--muted-foreground);
  font-weight: 500;
  font-size: 0.8125rem;
}
.card-divider {
  height: 1px;
  background: var(--border);
  margin: 2px 0;
}

/* TOTAL ROW */
.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 14px;
  background: var(--accent-light);
  border: 1.5px solid var(--accent);
  border-radius: 12px;
  margin-top: 2px;
  opacity: 0.95;
}
.total-left {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.total-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--foreground);
}
.total-badge {
  font-size: 0.625rem;
  color: var(--accent);
  font-weight: 600;
}
.total-value {
  font-size: 1.375rem;
  font-weight: 900;
  color: var(--accent);
  letter-spacing: -0.03em;
}

/* EMAIL */
.email-section { display: flex; flex-direction: column; gap: 6px; }
.email-label {
  font-size: 0.8125rem;
  font-weight: 700;
  color: var(--foreground);
}
.required { color: #ef4444; margin-left: 2px; }

.email-input-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 14px;
  height: 46px;
  background: var(--input-background);
  border: 1.5px solid var(--border);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.email-input-wrap:focus-within {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22,163,74,0.1);
}
.email-input-wrap--error { border-color: #ef4444 !important; }
.email-input-wrap--valid { border-color: #16a34a; }

.email-icon { color: var(--muted-foreground, #9ca3af); flex-shrink: 0; }
.email-valid-icon { color: #16a34a; flex-shrink: 0; }

.email-input {
  flex: 1;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  outline: none;
}
.email-input::placeholder { color: var(--muted-foreground); }

.email-hint {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.6875rem;
  color: var(--muted-foreground, #9ca3af);
}
.email-error {
  font-size: 0.6875rem;
  color: #ef4444;
}

/* INFO BOX */
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  background: var(--info-light);
  border: 1px solid var(--info);
  border-radius: 12px;
  padding: 12px;
}
.info-box-icon { color: var(--info); flex-shrink: 0; margin-top: 1px; }
.info-box-text { font-size: 0.75rem; color: var(--info); opacity: 0.9; }

/* SECURITY NOTE */
.security-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  font-size: 0.625rem;
  color: var(--muted-foreground, #9ca3af);
  font-weight: 500;
}
.security-note svg { color: #16a34a; }

/* TRANSITIONS */
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.25s ease; }
.modal-enter-from,  .modal-leave-to      { opacity: 0; }
</style>