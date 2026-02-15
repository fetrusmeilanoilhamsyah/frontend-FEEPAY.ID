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
            :customer-email="customerEmail"
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
import { computed } from 'vue'
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
  customerEmail: {
    type: String,
    default: 'customer@feepay.id'
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
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
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