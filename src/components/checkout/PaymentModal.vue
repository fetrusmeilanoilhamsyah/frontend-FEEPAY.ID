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
            <h3 class="text-xl font-black text-dark-950 dark:text-white">
              Konfirmasi Pembelian
            </h3>
            <button 
              @click="emit('close')" 
              class="p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-xl transition-colors"
            >
              <X :size="20" class="text-dark-500 dark:text-dark-400" />
            </button>
          </div>

          <!-- Product Info -->
          <div class="product-info">
            <!-- Product Name -->
            <div class="info-row">
              <span class="info-label">Produk</span>
              <span class="info-value">{{ product.name }}</span>
            </div>

            <!-- Customer Data -->
            <div class="info-row">
              <span class="info-label">{{ customerLabel }}</span>
              <span class="info-value">{{ customerDisplay }}</span>
            </div>

            <!-- Price -->
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
              <span class="text-red-500">*</span>
            </label>
            <input
              v-model="localEmail"
              type="email"
              class="email-input"
              :class="{ 'email-input--error': emailError }"
              placeholder="email@example.com"
              @input="emailError = ''"
            />
            <p v-if="emailError" class="email-error">{{ emailError }}</p>
            <p v-else class="email-hint">Notifikasi & bukti transaksi dikirim ke email ini</p>
          </div>

          <!-- Additional Info (optional) -->
          <div v-if="showInfo" class="info-box">
            <div class="flex items-start gap-2">
              <Info :size="16" class="text-primary-600 dark:text-primary-400 flex-shrink-0 mt-0.5" />
              <p class="text-xs text-primary-700 dark:text-primary-300">
                {{ infoMessage }}
              </p>
            </div>
          </div>

          <!-- Payment Button -->
          <MidtransButton
            :product="product"
            :target-number="customerData"
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

const props = defineProps({
  product: {
    type: Object,
    default: null
  },
  customerData: {
    type: String,
    required: true
  },
  customerLabel: {
    type: String,
    default: 'Nomor Tujuan'
  },
  // Opsional: kalau parent sudah punya email (misal dari auth), bisa di-pass sini
  customerEmail: {
    type: String,
    default: ''
  },
  showInfo: {
    type: Boolean,
    default: false
  },
  infoMessage: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close', 'success', 'pending'])

// Email state lokal — pakai prop kalau ada, kosong kalau tidak
const localEmail = ref(props.customerEmail || '')
const emailError = ref('')

// Sync kalau prop berubah dari luar (misal user login)
watch(() => props.customerEmail, (val) => {
  if (val) localEmail.value = val
})

// Reset email tiap modal dibuka (product berubah dari null ke ada)
watch(() => props.product, (val) => {
  if (val && !props.customerEmail) {
    localEmail.value = ''
    emailError.value = ''
  }
})

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(localEmail.value)
})

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const customerDisplay = computed(() => {
  return props.customerData
})
</script>

<style scoped>
/* Modal Content */
.modal-content {
  width: 100%;
  max-width: 28rem;
  background: white;
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

.dark .modal-content {
  background: rgb(15 20 25);
  border: 1px solid rgb(42 49 66);
}

/* Product Info Box */
.product-info {
  background: rgb(249 250 251);
  border-radius: 16px;
  padding: 16px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.dark .product-info {
  background: rgb(31 41 55);
}

/* Info Row */
.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
}

.info-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: rgb(107 114 128);
  flex-shrink: 0;
}

.dark .info-label {
  color: rgb(156 163 175);
}

.info-value {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(17 24 39);
  text-align: right;
}

.dark .info-value {
  color: rgb(243 244 246);
}

/* Price Row */
.price-row {
  padding-top: 12px;
  border-top: 1.5px solid rgb(229 231 235);
  margin-top: 4px;
}

.dark .price-row {
  border-top-color: rgb(55 65 81);
}

.price-value {
  font-size: 1.375rem;
  font-weight: 800;
  color: rgb(79 172 254);
  letter-spacing: -0.025em;
}

.dark .price-value {
  color: rgb(59 143 212);
}

/* Email Input */
.email-input-wrapper {
  margin-bottom: 16px;
}

.email-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: rgb(55 65 81);
  margin-bottom: 6px;
}

.dark .email-label {
  color: rgb(209 213 219);
}

.email-input {
  width: 100%;
  height: 44px;
  background: white;
  border: 2px solid rgb(229 231 235);
  border-radius: 10px;
  padding: 0 14px;
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(17 24 39);
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.email-input:focus {
  border-color: rgb(79 172 254);
}

.email-input--error {
  border-color: rgb(239 68 68);
}

.dark .email-input {
  background: rgb(17 24 39);
  border-color: rgb(55 65 81);
  color: rgb(243 244 246);
}

.dark .email-input:focus {
  border-color: rgb(79 172 254);
}

.email-hint {
  margin-top: 4px;
  font-size: 0.75rem;
  color: rgb(107 114 128);
}

.dark .email-hint {
  color: rgb(156 163 175);
}

.email-error {
  margin-top: 4px;
  font-size: 0.75rem;
  color: rgb(239 68 68);
}

/* Info Box */
.info-box {
  background: rgb(239 246 255);
  border: 1px solid rgb(191 219 254);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 16px;
}

.dark .info-box {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

/* Animations */
@keyframes slideUp {
  from { transform: translateY(100%); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: translateY(100%);
}

@media (min-width: 640px) {
  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: scale(0.95);
  }
}
</style>