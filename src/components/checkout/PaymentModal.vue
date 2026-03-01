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
          <div class="flex items-center justify-between mb-6">
            <h3 class="text-xl font-black text-foreground">
              Konfirmasi Pembelian
            </h3>
            <button
              @click="emit('close')"
              class="p-2 hover:bg-muted rounded-xl transition-colors"
            >
              <X :size="20" class="text-muted-foreground" />
            </button>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <div class="info-row">
              <span class="info-label">Produk</span>
              <div class="info-value-wrap">
                <img
                  v-if="operatorLogo"
                  :src="operatorLogo"
                  :alt="operatorName"
                  class="operator-logo"
                  @error="(e) => e.target.style.display = 'none'"
                />
                <span class="info-value">{{ product.name }}</span>
              </div>
            </div>

            <!-- ✅ FIX S1: Tampilkan customerData apa adanya, bukan format nomor HP -->
            <div class="info-row">
              <span class="info-label">{{ customerLabel }}</span>
              <span class="info-value font-mono">{{ customerData }}</span>
            </div>

            <!-- Zone ID — tampilkan kalau ada -->
            <div v-if="zoneId" class="info-row">
              <span class="info-label">Zone ID</span>
              <span class="info-value font-mono">{{ zoneId }}</span>
            </div>

            <div class="breakdown-divider" />

            <div class="info-row">
              <span class="info-label">Harga Produk</span>
              <span class="info-value">Rp{{ formatPrice(costPrice) }}</span>
            </div>
            <div class="info-row">
              <span class="info-label">Biaya Layanan</span>
              <span class="info-value fee-value">+Rp{{ formatPrice(serviceFee) }}</span>
            </div>
            <div class="info-row price-row">
              <span class="info-label">Total Bayar</span>
              <span class="price-value">
                Rp{{ formatPrice(product.selling_price || product.price || 0) }}
              </span>
            </div>
          </div>

          <!-- Email Input -->
          <div class="email-input-wrapper">
            <label class="email-label">
              Email
              <span class="text-error">*</span>
            </label>
            <input
              v-model="localEmail"
              type="email"
              class="email-input"
              :class="{ 'email-input--error': emailError }"
              placeholder="email@example.com"
              @input="emailError = ''"
              @blur="saveEmail"
            />
            <p v-if="emailError" class="email-error">{{ emailError }}</p>
            <p v-else class="email-hint">
              Notifikasi & bukti transaksi dikirim ke email ini
            </p>
          </div>

          <!-- Info Box -->
          <div v-if="showInfo" class="info-box">
            <div class="flex items-start gap-2">
              <Info :size="16" class="text-primary flex-shrink-0 mt-0.5" />
              <p class="text-xs text-primary">{{ infoMessage }}</p>
            </div>
          </div>

          <!-- ✅ FIX F2 + F4: zoneId dan email diteruskan ke MidtransButton -->
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
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { X, Info } from 'lucide-vue-next'
import MidtransButton from './MidtransButton.vue'

const SAVED_EMAIL_KEY = 'feepay_last_email'

const props = defineProps({
  product:       { type: Object,  default: null },
  customerData:  { type: String,  required: true },
  customerLabel: { type: String,  default: 'Nomor Tujuan' },
  customerEmail: { type: String,  default: '' },
  // ✅ FIX F2: prop zoneId baru — diteruskan ke MidtransButton
  zoneId:        { type: String,  default: undefined },
  showInfo:      { type: Boolean, default: false },
  infoMessage:   { type: String,  default: '' }
})

const emit = defineEmits(['close', 'success', 'pending'])

const savedEmail = localStorage.getItem(SAVED_EMAIL_KEY) || ''
const localEmail = ref(props.customerEmail || savedEmail)
const emailError = ref('')

const saveEmail = () => {
  if (isEmailValid.value) {
    localStorage.setItem(SAVED_EMAIL_KEY, localEmail.value)
  }
}

watch(() => props.customerEmail, (val) => { if (val) localEmail.value = val })
watch(() => props.product, (val) => {
  if (val && !props.customerEmail) {
    localEmail.value = localStorage.getItem(SAVED_EMAIL_KEY) || ''
    emailError.value = ''
  }
})

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(localEmail.value)
})

const formatPrice = (price) =>
  new Intl.NumberFormat('id-ID').format(Math.round(Number(price) || 0))

const costPrice    = computed(() => Number(props.product?.cost_price || 0))
const sellingPrice = computed(() => Number(props.product?.selling_price || props.product?.price || 0))
const serviceFee   = computed(() => sellingPrice.value - costPrice.value)

const OPERATORS = [
  { keys: ['telkomsel', 'simpati', 'kartu as', 'loop'], label: 'Telkomsel', file: 'telkomsel' },
  { keys: ['by.u', 'byu'],                              label: 'by.U',      file: 'byu'       },
  { keys: ['axis'],                                     label: 'Axis',      file: 'axis'      },
  { keys: ['xl', 'xtra'],                               label: 'XL Axiata', file: 'xl'        },
  { keys: ['indosat', 'im3', 'mentari', 'ooredoo'],     label: 'Indosat',   file: 'indosat'   },
  { keys: ['tri', 'three', 'hutchison'],                label: 'Tri',       file: 'three'     },
  { keys: ['smartfren'],                                label: 'Smartfren', file: 'smartfren' },
]

const detectedOperator = computed(() => {
  if (!props.product?.name) return null
  const name = props.product.name.toLowerCase()
  return OPERATORS.find(op => op.keys.some(k => name.includes(k))) ?? null
})

const operatorLogo = computed(() =>
  detectedOperator.value ? `/logos/operators/${detectedOperator.value.file}.png` : null
)
const operatorName = computed(() => detectedOperator.value?.label ?? '')
</script>

<style scoped>
.modal-content {
  width: 100%;
  max-width: 28rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 24px 24px 0 0;
  padding: 24px;
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
@media (min-width: 640px) {
  .modal-content {
    border-radius: 24px;
    padding: 28px;
    animation: scaleIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}
.product-info {
  background: var(--muted);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
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
.info-value-wrap {
  display: flex;
  align-items: center;
  gap: 6px;
  justify-content: flex-end;
}
.operator-logo {
  height: 16px;
  width: auto;
  max-width: 48px;
  object-fit: contain;
  flex-shrink: 0;
}
.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  text-align: right;
}
.breakdown-divider {
  height: 1px;
  background: var(--border);
  margin: 2px 0;
}
.fee-value {
  color: var(--muted-foreground);
  font-weight: 500;
  font-size: 0.8125rem;
}
.price-row {
  padding-top: 8px;
  border-top: 1.5px solid var(--border);
  margin-top: 2px;
}
.price-value {
  font-size: 1.375rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.025em;
}
.email-input-wrapper { margin-bottom: 16px; }
.email-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 6px;
}
.email-input {
  width: 100%;
  height: 44px;
  background: var(--input-background);
  border: 2px solid var(--border);
  border-radius: 10px;
  padding: 0 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}
.email-input:focus { border-color: var(--primary); }
.email-input--error { border-color: var(--error); }
.email-hint {
  margin-top: 4px;
  font-size: 0.75rem;
  color: var(--muted-foreground);
}
.email-error {
  margin-top: 4px;
  font-size: 0.75rem;
  color: var(--error);
}
.info-box {
  background: rgba(37, 99, 235, 0.05);
  border: 1px solid rgba(37, 99, 235, 0.2);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}
.dark .info-box {
  background: rgba(37, 99, 235, 0.1);
  border-color: rgba(37, 99, 235, 0.2);
}
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to   { transform: translateY(0);    opacity: 1; }
}
@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to   { transform: scale(1);    opacity: 1; }
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.3s ease; }
.modal-enter-from,  .modal-leave-to      { opacity: 0; }
.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.modal-enter-from .modal-content,
.modal-leave-to   .modal-content { transform: translateY(100%); }
@media (min-width: 640px) {
  .modal-enter-from .modal-content,
  .modal-leave-to   .modal-content { transform: scale(0.95); }
}
</style>