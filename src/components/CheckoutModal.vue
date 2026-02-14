<template>
  <teleport to="body">
    <transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" role="dialog" aria-modal="true">
        <div class="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity" @click="handleClose"></div>
        <div class="flex min-h-full items-center justify-center p-4">
          <div class="relative bg-white dark:bg-dark-950 rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all border border-border" @click.stop>

            <button @click="handleClose" class="absolute top-6 right-6 p-2 rounded-lg text-dark-400 hover:text-primary-600 transition-all">
              <X :size="20" />
            </button>

            <!-- ==================== STEP 1: ORDER FORM ==================== -->
            <div v-if="step === 1">
              <h2 class="text-2xl font-bold text-dark-950 dark:text-white mb-6 text-left">
                Konfirmasi Pesanan
              </h2>

              <!-- Product Summary -->
              <div class="bg-dark-50 dark:bg-dark-900 border border-border rounded-xl p-5 mb-6 text-left">
                <div class="text-xs font-semibold uppercase text-dark-500 dark:text-dark-400 mb-2">Produk Dipilih</div>
                <div class="font-bold text-lg text-dark-950 dark:text-white mb-1">{{ product.name }}</div>
                <div class="text-2xl font-bold text-primary-600 dark:text-primary-400">
                  Rp {{ formatPrice(product.selling_price) }}
                </div>
              </div>

              <form @submit.prevent="handleSubmitOrder">
                <div class="space-y-5 mb-8 text-left">

                  <!-- FIX: Nomor dengan operator detector -->
                  <div>
                    <label class="block text-xs font-semibold text-dark-700 dark:text-dark-300 mb-2 uppercase">
                      Nomor Tujuan / ID
                    </label>
                    <div class="relative">
                      <input
                        v-model="phoneNumber"
                        type="text"
                        class="w-full bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-lg h-12 px-4 font-medium text-base outline-none focus:border-primary-600 transition-colors text-dark-950 dark:text-white"
                        :class="detectedOperator ? 'pr-36' : ''"
                        placeholder="Contoh: 081234567890"
                        required
                      />
                      <!-- Operator Badge -->
                      <div
                        v-if="detectedOperator"
                        class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                        :style="{ backgroundColor: detectedOperator.color + '15' }"
                      >
                        <span class="text-lg">{{ detectedOperator.logo }}</span>
                        <span class="text-xs font-bold" :style="{ color: detectedOperator.color }">
                          {{ detectedOperator.name }}
                        </span>
                      </div>
                    </div>
                    <p class="mt-1.5 text-xs text-dark-500 dark:text-dark-400">
                      {{ detectedOperator
                         ? `✓ Operator ${detectedOperator.name} terdeteksi`
                         : 'Masukkan nomor HP, ID pelanggan, atau nomor meter'
                      }}
                    </p>
                  </div>

                  <!-- Email -->
                  <div>
                    <label class="block text-xs font-semibold text-dark-700 dark:text-dark-300 mb-2 uppercase">Email</label>
                    <input
                      v-model="formData.customer_email"
                      type="email"
                      class="w-full bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-lg h-12 px-4 font-medium outline-none focus:border-primary-600 transition-colors text-dark-950 dark:text-white"
                      placeholder="email@example.com"
                      required
                    />
                    <p class="mt-1.5 text-xs text-dark-500 dark:text-dark-400">
                      Notifikasi akan dikirim ke email ini
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  class="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg h-12 text-base font-semibold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  :disabled="submitting"
                >
                  <Loader v-if="submitting" class="animate-spin" :size="18" />
                  {{ submitting ? 'Memproses...' : 'Lanjutkan Pembayaran' }}
                </button>
              </form>
            </div>

            <!-- ==================== STEP 2: PAYMENT ==================== -->
            <div v-else-if="step === 2">
              <h2 class="text-2xl font-bold text-dark-950 dark:text-white mb-6 text-center">
                Pembayaran
              </h2>

              <!-- Order Summary -->
              <div class="bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-xl p-5 mb-6 text-left">
                <div class="space-y-2 mb-3">
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-semibold uppercase text-dark-500 dark:text-dark-400">Order ID</span>
                    <span class="font-mono font-semibold text-primary-600 dark:text-primary-400">{{ orderData.order_id }}</span>
                  </div>
                  <div class="flex justify-between items-center">
                    <span class="text-xs font-semibold uppercase text-dark-500 dark:text-dark-400">Status</span>
                    <StatusBadge :status="orderData.status" />
                  </div>
                </div>
                <div class="flex justify-between items-end border-t border-border pt-3">
                  <span class="text-xs font-semibold uppercase text-dark-500 dark:text-dark-400">Total Tagihan</span>
                  <span class="text-xl font-bold text-dark-950 dark:text-white">Rp {{ formatPrice(orderData.total_price) }}</span>
                </div>
              </div>

              <!-- Payment Method -->
              <div class="grid grid-cols-2 gap-4 mb-6">
                <button @click="paymentType = 'qris'" type="button"
                  class="p-4 border-2 rounded-xl transition-all"
                  :class="paymentType === 'qris'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20'
                    : 'border-border opacity-60 hover:opacity-100'">
                  <QrCode class="mx-auto mb-1 text-primary-600 dark:text-primary-400" :size="24" />
                  <div class="text-xs font-semibold uppercase text-dark-950 dark:text-white">QRIS</div>
                </button>
                <button @click="paymentType = 'bank_transfer'" type="button"
                  class="p-4 border-2 rounded-xl transition-all"
                  :class="paymentType === 'bank_transfer'
                    ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20'
                    : 'border-border opacity-60 hover:opacity-100'">
                  <Building2 class="mx-auto mb-1 text-primary-600 dark:text-primary-400" :size="24" />
                  <div class="text-xs font-semibold uppercase text-dark-950 dark:text-white">Transfer Bank</div>
                </button>
              </div>

              <!-- QRIS -->
              <div v-if="paymentType === 'qris'" class="mb-6 bg-white dark:bg-dark-900 p-4 rounded-xl border-2 border-border shadow-lg">
                <div class="mx-auto w-64 h-64 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950 dark:to-primary-900 rounded-xl flex items-center justify-center border-2 border-primary-300 dark:border-primary-700 overflow-hidden">
                  <img src="/qris.png" alt="QRIS Payment" class="w-full h-full object-contain" />
                </div>
                <p class="mt-4 text-xs font-medium text-dark-500 dark:text-dark-400 text-center">
                  Scan QR Code menggunakan aplikasi pembayaran Anda
                </p>
              </div>

              <!-- Bank Transfer -->
              <div v-else class="mb-6 bg-dark-50 dark:bg-dark-900 border-2 border-border rounded-xl p-5 text-left space-y-3">
                <div class="flex justify-between text-xs font-semibold uppercase">
                  <span class="text-dark-500 dark:text-dark-400">Bank</span>
                  <span class="text-dark-950 dark:text-white">{{ bankInfo.name }}</span>
                </div>
                <div class="bg-white dark:bg-dark-950 p-3 rounded-lg border border-border flex justify-between items-center gap-3">
                  <span class="text-sm font-mono font-medium text-dark-950 dark:text-white flex-1">{{ bankInfo.number }}</span>
                  <button @click="copyBankNumber" type="button"
                    class="text-xs font-semibold bg-primary-600 text-white px-3 py-1.5 rounded-lg hover:bg-primary-700 transition-colors flex-shrink-0">
                    SALIN
                  </button>
                </div>
                <div class="text-xs font-medium text-dark-500 dark:text-dark-400">
                  a.n. {{ bankInfo.accountName }}
                </div>
              </div>

              <!-- Upload Proof -->
              <form @submit.prevent="handleSubmitPayment">
                <div class="mb-6">
                  <label class="block text-xs font-semibold uppercase text-center mb-3 text-dark-600 dark:text-dark-400">
                    Bukti Pembayaran
                  </label>
                  <div @click="triggerFileInput"
                    class="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors"
                    :class="uploadedFile
                      ? 'border-primary-600 bg-primary-50 dark:bg-primary-950/20'
                      : 'border-border hover:border-primary-600 bg-dark-50/50 dark:bg-dark-800/50'">
                    <Upload class="mx-auto mb-2 text-dark-400" :size="32" />
                    <p class="text-sm font-medium text-dark-950 dark:text-white">
                      {{ uploadedFile ? uploadedFile.name : 'Klik untuk upload bukti transfer' }}
                    </p>
                    <p class="text-xs text-dark-400 mt-2">Format: JPG, PNG (Max 5MB)</p>
                  </div>
                  <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileSelect" />
                </div>

                <button type="submit"
                  class="w-full bg-primary-600 hover:bg-primary-700 text-white rounded-lg h-12 text-base font-semibold shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  :disabled="submitting || !uploadedFile">
                  <Loader v-if="submitting" class="animate-spin" :size="18" />
                  {{ submitting ? 'Memproses...' : 'Konfirmasi Pembayaran' }}
                </button>
              </form>
            </div>

          </div>
        </div>
      </div>
    </transition>
  </teleport>

  <!-- FIX: Toast menggantikan alert() yang jelek -->
  <transition name="toast">
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-white dark:bg-dark-900 border border-primary-600 rounded-xl shadow-lg p-4 z-[60] max-w-sm">
      <div class="flex items-center gap-2">
        <Check class="text-primary-600 flex-shrink-0" :size="18" />
        <span class="text-sm font-semibold text-dark-950 dark:text-white">{{ toastMessage }}</span>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { X, Loader, QrCode, Building2, Upload, Check } from 'lucide-vue-next'
import { useOrderStore } from '@/stores/orderStore'
import { useOperatorDetector } from '@/composables/useOperatorDetector'
import StatusBadge from './StatusBadge.vue'

const props = defineProps({
  product: { type: Object, required: true }
})

const emit = defineEmits(['close'])
const router = useRouter()
const orderStore = useOrderStore()

// FIX: Operator detector terintegrasi
const { phoneNumber, detectedOperator } = useOperatorDetector()

const bankInfo = {
  name: import.meta.env.VITE_BANK_NAME || 'BCA',
  number: import.meta.env.VITE_BANK_ACCOUNT_NUMBER || '3000944636',
  accountName: import.meta.env.VITE_BANK_ACCOUNT_NAME || 'FETRUS MEILANO ILHAMSYAH'
}

const isOpen = ref(true)
const step = ref(1)
const submitting = ref(false)
const formData = ref({ customer_email: '' })
const orderData = ref(null)
const paymentType = ref('qris')
const uploadedFile = ref(null)
const fileInput = ref(null)
const showToast = ref(false)
const toastMessage = ref('')

const formatPrice = (price) => new Intl.NumberFormat('id-ID').format(price)

const toast = (msg) => {
  toastMessage.value = msg
  showToast.value = true
  setTimeout(() => showToast.value = false, 2000)
}

const handleClose = () => {
  isOpen.value = false
  setTimeout(() => { emit('close') }, 300)
}

// FIX: copyBankNumber pakai toast bukan alert()
const copyBankNumber = async () => {
  try {
    await navigator.clipboard.writeText(bankInfo.number)
    toast('Nomor rekening berhasil disalin')
  } catch (err) {
    toast('Gagal menyalin nomor rekening')
  }
}

const handleSubmitOrder = async () => {
  submitting.value = true
  try {
    const order = await orderStore.createOrder({
      sku: props.product.sku,
      target_number: phoneNumber.value,
      customer_email: formData.value.customer_email
    })
    orderData.value = order
    step.value = 2
  } catch (error) {
    toast(error.message || 'Gagal membuat pesanan')
  } finally {
    submitting.value = false
  }
}

const triggerFileInput = () => { fileInput.value?.click() }

const handleFileSelect = (e) => {
  const file = e.target.files[0]
  if (file && file.size > 5 * 1024 * 1024) {
    toast('Ukuran file maksimal 5MB')
    return
  }
  uploadedFile.value = file
}

const handleSubmitPayment = async () => {
  if (!uploadedFile.value) {
    toast('Silakan upload bukti pembayaran terlebih dahulu')
    return
  }

  submitting.value = true
  try {
    const fd = new FormData()
    fd.append('order_id', orderData.value.order_id)
    fd.append('type', paymentType.value)
    fd.append('amount', orderData.value.total_price)
    fd.append('proof', uploadedFile.value)

    await orderStore.submitPayment(orderData.value.order_id, fd)

    handleClose()
    router.push(`/payment/${orderData.value.order_id}/pending`)
  } catch (error) {
    toast('Gagal mengirim bukti pembayaran. Silakan coba lagi.')
  } finally {
    submitting.value = false
  }
}

onMounted(() => { document.body.style.overflow = 'hidden' })
onUnmounted(() => { document.body.style.overflow = '' })
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active > div > div {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-enter-from > div > div {
  transform: scale(0.95) translateY(20px);
  opacity: 0;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}
</style>