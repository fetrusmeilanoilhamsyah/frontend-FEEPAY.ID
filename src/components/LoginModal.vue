<template>
  <transition name="modal">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div class="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
        
        <!-- Header -->
        <div class="bg-green-50 p-6 flex items-center justify-center relative">
          <button @click="closeModal" class="absolute top-4 right-4 p-2 bg-white/50 hover:bg-white rounded-full transition-colors">
            <svg class="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
          
          <div class="text-center">
            <h2 class="text-2xl font-bold bg-gradient-to-r from-gray-900 to-green-600 bg-clip-text text-transparent">Login FEEPAY</h2>
            <p class="text-xs text-gray-500 mt-1">Satu akun untuk semua kemudahan</p>
          </div>
        </div>

        <!-- Tabs -->
        <div class="flex border-b border-gray-100">
          <button @click="activeTab = 'google'" :class="['flex-1 py-3 text-sm font-semibold transition-colors', activeTab === 'google' ? 'text-green-600 border-b-2 border-green-600 bg-green-50/30' : 'text-gray-400']">Google</button>
          <button @click="activeTab = 'otp'" :class="['flex-1 py-3 text-sm font-semibold transition-colors', activeTab === 'otp' ? 'text-green-600 border-b-2 border-green-600 bg-green-50/30' : 'text-gray-400']">WhatsApp</button>
          <button @click="activeTab = 'email'" :class="['flex-1 py-3 text-sm font-semibold transition-colors', activeTab === 'email' ? 'text-green-600 border-b-2 border-green-600 bg-green-50/30' : 'text-gray-400']">Email</button>
        </div>

        <!-- Content -->
        <div class="p-6">
          
          <!-- TAB: GOOGLE -->
          <div v-if="activeTab === 'google'" class="flex flex-col items-center justify-center space-y-4 py-4">
            <p class="text-sm text-gray-600 text-center mb-2">Masuk cepat dan aman menggunakan akun Google Anda.</p>
            <GoogleLogin :callback="handleGoogleLogin" prompt />
            
            <PulseLoader v-if="loading" color="#16a34a" size="10px" class="mt-4" />
            <p v-if="error" class="text-xs text-red-500 text-center mt-2">{{ error }}</p>
          </div>

          <!-- TAB: WHATSAPP OTP -->
          <div v-if="activeTab === 'otp'" class="space-y-4">
            <div v-if="!otpSent">
              <label class="block text-xs font-semibold text-gray-700 mb-1">Nomor WhatsApp</label>
              <input v-model="form.phone" type="tel" placeholder="081234567890" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm" />
              <button @click="requestOtp" :disabled="loading || !form.phone" class="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm">
                {{ loading ? 'Mengirim...' : 'Kirim Kode OTP' }}
              </button>
            </div>
            
            <div v-else>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Masukkan Kode OTP</label>
              <input v-model="form.otp" type="text" placeholder="6 Digit Angka" class="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-center tracking-widest font-bold text-lg" maxlength="6" />
              
              <button @click="verifyOtp" :disabled="loading || form.otp.length !== 6" class="w-full mt-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm">
                {{ loading ? 'Memverifikasi...' : 'Verifikasi & Login' }}
              </button>

              <div class="mt-4 flex flex-col items-center space-y-2">
                <button v-if="resendTimer === 0" @click="requestOtp" :disabled="loading" class="text-xs text-green-600 hover:text-green-700 font-bold">Kirim Ulang OTP</button>
                <p v-else class="text-xs text-gray-400">Kirim ulang dalam <span class="font-mono font-bold text-gray-600">{{ resendTimer }}s</span></p>
                
                <button @click="resetOtpForm" class="text-xs text-gray-400 hover:text-gray-600 underline">Ubah Nomor WhatsApp</button>
              </div>
            </div>
            <p v-if="error" class="text-xs text-red-500 text-center">{{ error }}</p>
            <p v-if="successMsg" class="text-xs text-green-600 text-center font-medium">{{ successMsg }}</p>
          </div>

          <!-- TAB: EMAIL/PASSWORD -->
          <div v-if="activeTab === 'email'" class="space-y-4">
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Email / Phone</label>
              <input v-model="form.email" type="text" placeholder="user@gmail.com" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm" />
            </div>
            <div>
              <label class="block text-xs font-semibold text-gray-700 mb-1">Password</label>
              <input v-model="form.password" type="password" placeholder="••••••••" class="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all text-sm" @keyup.enter="loginEmail" />
            </div>
            <button @click="loginEmail" :disabled="loading || !form.email || !form.password" class="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 text-sm mt-2">
                {{ loading ? 'Memproses...' : 'Login' }}
            </button>
            <p v-if="error" class="text-xs text-red-500 text-center">{{ error }}</p>
          </div>

        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { GoogleLogin } from 'vue3-google-login'
import { useCustomerAuth } from '../composables/useCustomerAuth'

const props = defineProps({
  isOpen: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'loginSuccess'])

const { loginWithGoogle, requestOtp: doRequestOtp, verifyOtp: doVerifyOtp, loginWithEmail } = useCustomerAuth()

const activeTab = ref('google')
const loading = ref(false)
const error = ref('')
const successMsg = ref('')

const otpSent = ref(false)
const resendTimer = ref(0)
let timerInterval = null

const startTimer = () => {
  resendTimer.value = 60
  clearInterval(timerInterval)
  timerInterval = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      clearInterval(timerInterval)
    }
  }, 1000)
}

const resetOtpForm = () => {
  otpSent.value = false
  form.otp = ''
  clearInterval(timerInterval)
  resendTimer.value = 0
}

const form = reactive({
  phone: '',
  otp: '',
  email: '',
  password: ''
})

const closeModal = () => {
  emit('close')
  error.value = ''
  successMsg.value = ''
  resetOtpForm()
}

// 1. GOOGLE
const handleGoogleLogin = async (response) => {
  loading.value = true
  error.value = ''
  try {
    const res = await loginWithGoogle(response.credential)
    if(res.success) {
      emit('loginSuccess', res.user)
      closeModal()
    }
  } catch (err) {
    error.value = err.message || 'Gagal login dari Google.'
  } finally {
    loading.value = false
  }
}

// 2. OTP
const requestOtp = async () => {
  loading.value = true
  error.value = ''
  successMsg.value = ''
  try {
    const res = await doRequestOtp(form.phone)
    otpSent.value = true
    startTimer()
    successMsg.value = res.message || 'OTP terkirim ke WhatsApp'
    
    // Auto-fill OTP in Dev mode if provided
    if(res.simulate_otp) {
      form.otp = res.simulate_otp.toString()
    }
  } catch (err) {
    error.value = err.message || 'Gagal mengirim OTP.'
  } finally {
    loading.value = false
  }
}

const verifyOtp = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await doVerifyOtp(form.phone, form.otp)
    if(res.success) {
      emit('loginSuccess', res.user)
      closeModal()
    }
  } catch (err) {
    error.value = err.message || 'OTP Salah / Expired.'
  } finally {
    loading.value = false
  }
}

// 3. EMAIL/PASSWORD
const loginEmail = async () => {
  loading.value = true
  error.value = ''
  try {
    const res = await loginWithEmail(form.email, form.password)
    if(res.success) {
      emit('loginSuccess', res.user)
      closeModal()
    }
  } catch (err) {
    error.value = err.message || 'Email atau password salah.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.modal-enter-active, .modal-leave-active {
  transition: opacity 0.3s ease;
}
.modal-enter-from, .modal-leave-to {
  opacity: 0;
}
.modal-enter-active .bg-white, .modal-leave-active .bg-white {
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}
.modal-enter-from .bg-white, .modal-leave-to .bg-white {
  transform: scale(0.9) translateY(20px);
}
</style>
