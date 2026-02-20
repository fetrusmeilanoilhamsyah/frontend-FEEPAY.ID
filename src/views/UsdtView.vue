<template>
  <div class="min-h-screen bg-background pb-20">
    <!-- Header -->
    <div class="sticky top-0 z-10 bg-card border-b border-border">
      <div class="max-w-lg mx-auto px-4 py-4">
        <div class="flex items-center gap-3">
          <button 
            @click="$router.back()"
            class="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <ArrowLeft :size="20" class="text-foreground" />
          </button>
          <div>
            <h1 class="text-lg font-bold text-foreground">Konversi USDT</h1>
            <p class="text-xs text-muted-foreground">USDT ke IDR instant</p>
          </div>
        </div>
      </div>
    </div>

    <div class="max-w-lg mx-auto px-4 py-6">
      <div class="bg-card border border-border rounded-2xl p-4 sm:p-6">
        <div class="text-center mb-5 sm:mb-6">
          <h2 class="text-xl sm:text-2xl font-bold text-foreground mb-1.5">
            Konversi USDT ke Rupiah
          </h2>
          <p class="text-xs sm:text-sm text-muted-foreground">
            Pencairan ke rekening atau e-wallet Anda
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Jumlah USDT + Network -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label class="block text-xs font-semibold mb-1.5 text-foreground">
                Jumlah USDT
              </label>
              <input
                v-model="form.amount"
                type="number"
                step="0.01"
                class="w-full h-11 bg-background border border-border rounded-lg px-3 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                placeholder="100.00"
                required
              />
            </div>
            <div>
              <label class="block text-xs font-semibold mb-1.5 text-foreground">
                Jaringan Blockchain
              </label>
              <div class="flex gap-2">
                <button
                  type="button"
                  v-for="net in ['TRC20', 'BEP20']"
                  :key="net"
                  @click="form.network = net"
                  class="flex-1 h-11 border rounded-lg font-semibold text-xs sm:text-sm transition-all"
                  :class="form.network === net
                    ? 'border-primary bg-primary-50 dark:bg-primary-950/20 text-primary-600 dark:text-primary-400'
                    : 'border-border text-muted-foreground hover:border-primary/50'"
                >
                  {{ net }}
                </button>
              </div>
            </div>
          </div>

          <!-- Wallet Address (readonly) -->
          <div class="bg-muted/50 p-3 rounded-xl border border-border">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-semibold text-muted-foreground">
                Alamat Wallet Tujuan Transfer
              </span>
              <button
                type="button"
                @click="copyWalletAddress"
                class="text-primary text-xs font-semibold hover:underline flex items-center gap-1"
              >
                <Copy :size="13" /> Salin
              </button>
            </div>
            <div class="bg-background p-2.5 rounded-lg font-mono text-xs break-all border border-border text-foreground">
              {{ walletAddresses[form.network] }}
            </div>
          </div>

          <!-- Info Penerima -->
          <div class="space-y-2.5">
            <label class="block text-xs font-semibold text-foreground">
              Informasi Rekening Penerima Dana
            </label>
            <input
              v-model="form.customer_email"
              type="email"
              class="w-full h-11 bg-background border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary outline-none transition-all"
              placeholder="Alamat email Anda"
              required
            />
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <input
                v-model="form.bank_name"
                type="text"
                class="w-full h-11 bg-background border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary outline-none transition-all"
                placeholder="Nama Bank atau E-Wallet"
                required
              />
              <input
                v-model="form.account_number"
                type="text"
                class="w-full h-11 bg-background border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary outline-none transition-all"
                placeholder="Nomor Rekening"
                required
              />
            </div>
            <input
              v-model="form.account_name"
              type="text"
              class="w-full h-11 bg-background border border-border rounded-lg px-3 text-sm text-foreground focus:border-primary outline-none transition-all"
              placeholder="Nama Pemilik Rekening"
              required
            />
          </div>

          <!-- Upload Bukti -->
          <div>
            <label class="block text-xs font-semibold mb-1.5 text-foreground">
              Bukti Transfer USDT
            </label>
            <div
              @click="triggerFileInput"
              class="border-2 border-dashed border-border rounded-xl p-5 text-center cursor-pointer hover:border-primary hover:bg-primary-50/50 dark:hover:bg-primary-950/10 transition-all"
            >
              <Upload class="mx-auto mb-2 text-muted-foreground" :size="24" />
              <p class="text-sm font-medium text-foreground">
                {{ form.proof ? form.proof.name : 'Klik untuk upload screenshot' }}
              </p>
              <p class="text-xs text-muted-foreground mt-1">Format JPG atau PNG, maksimal 5MB</p>
            </div>
            <input
              ref="fileInput"
              type="file"
              class="hidden"
              @change="handleFileSelect"
              accept="image/*"
              required
            />
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="w-full h-11 bg-gradient-to-r from-primary-600 to-accent-500 text-white rounded-xl font-semibold text-sm transition-all disabled:opacity-50 active:scale-95"
            :disabled="submitting"
          >
            <Loader v-if="submitting" class="inline animate-spin mr-2" :size="16" />
            {{ submitting ? 'Memproses Permintaan' : 'Kirim Permintaan Konversi' }}
          </button>
        </form>

        <!-- Info -->
        <div class="mt-4 bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-lg p-3">
          <p class="text-xs text-center text-primary-600 dark:text-primary-400 font-medium">
            Proses verifikasi 5-15 menit setelah transfer dikonfirmasi
          </p>
        </div>
      </div>
    </div>

    <!-- Toast -->
    <transition name="toast">
      <div v-if="showToast" class="fixed bottom-4 right-4 bg-card border border-primary rounded-xl shadow-lg p-3 sm:p-4 z-50 max-w-sm">
        <div class="flex items-center gap-2">
          <Check class="text-primary flex-shrink-0" :size="18" />
          <span class="text-sm font-semibold text-foreground">{{ toastMessage }}</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ArrowLeft, Copy, Upload, Loader, Check } from 'lucide-vue-next'
import api from '@/services/api'

const fileInput = ref(null)
const submitting = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

const form = ref({
  amount: '',
  network: 'TRC20',
  customer_email: '',
  bank_name: '',
  account_number: '',
  account_name: '',
  proof: null
})

const walletAddresses = {
  TRC20: import.meta.env.VITE_WALLET_TRC20 || 'TWZcN9q7q7q7q7q7q7q7q7q7q7q7q7q7q7',
  BEP20: import.meta.env.VITE_WALLET_BEP20 || '0xZcN9q7q7q7q7q7q7q7q7q7q7q7q7q7q7q7'
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (e) => {
  form.value.proof = e.target.files[0]
}

const copyWalletAddress = async () => {
  try {
    await navigator.clipboard.writeText(walletAddresses[form.value.network])
    toastMessage.value = 'Alamat berhasil disalin'
    showToast.value = true
    setTimeout(() => showToast.value = false, 2000)
  } catch {
    alert('Gagal menyalin alamat')
  }
}

const handleSubmit = async () => {
  if (!form.value.proof) {
    alert('Upload bukti transfer terlebih dahulu')
    return
  }

  submitting.value = true
  try {
    const fd = new FormData()
    const rate = 16000 // Ambil dari API nanti
    
    fd.append('amount', form.value.amount)
    fd.append('network', form.value.network)
    fd.append('customer_email', form.value.customer_email)
    fd.append('bank_name', form.value.bank_name)
    fd.append('account_number', form.value.account_number)
    fd.append('account_name', form.value.account_name)
    fd.append('proof', form.value.proof)
    fd.append('idr_received', parseFloat(form.value.amount) * rate)

    await api.usdt.submit(fd)
    
    toastMessage.value = 'Permintaan berhasil dikirim'
    showToast.value = true
    setTimeout(() => showToast.value = false, 3000)
    
    // Reset form
    form.value = {
      amount: '',
      network: 'TRC20',
      customer_email: '',
      bank_name: '',
      account_number: '',
      account_name: '',
      proof: null
    }
  } catch {
    alert('Gagal mengirim permintaan')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
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