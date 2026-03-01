<template>
  <div>
    <transition name="scale">
      <button
        v-if="!isOpen && isVisible"
        @click="toggleChat"
        class="fixed z-50 w-14 h-14 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group active:scale-95"
        :class="isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'"
        style="background: linear-gradient(135deg, #3b82f6, #22d3ee)"
        aria-label="Open chat"
      >
        <Headphones :size="24" class="group-hover:scale-110 transition-transform duration-300" />
        <span v-if="hasUnread" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
        <span v-if="hasUnread" class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
      </button>
    </transition>

    <transition name="slide-up">
      <div
        v-if="isOpen"
        class="fixed z-50 w-96 max-w-[calc(100vw-2rem)] bg-white dark:bg-dark-900 rounded-2xl shadow-2xl border border-border overflow-hidden"
        :class="isMobile ? 'bottom-20 right-4' : 'bottom-6 right-6'"
      >
        <!-- Header -->
        <div class="p-4 flex items-center justify-between text-white" style="background: linear-gradient(135deg, #3b82f6, #22d3ee)">
          <div class="flex items-center gap-3">
            <div class="relative">
              <div class="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Headphones :size="20" />
              </div>
              <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-blue-500"></span>
            </div>
            <div>
              <h3 class="font-bold text-base">Support FEEPAY</h3>
              <p class="text-xs text-white/80">Tim kami siap membantu</p>
            </div>
          </div>
          <button
            @click="toggleChat"
            class="p-1 hover:bg-white/10 rounded-lg transition-colors"
            aria-label="Close chat"
          >
            <X :size="20" />
          </button>
        </div>

        <!-- Body -->
        <div class="p-4 space-y-4 max-h-[400px] overflow-y-auto">

          <!-- Welcome Message -->
          <div class="flex gap-3">
            <div class="w-8 h-8 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center flex-shrink-0">
              <Bot :size="16" class="text-primary-600" />
            </div>
            <div class="bg-primary-50 dark:bg-primary-900/20 rounded-2xl rounded-tl-none p-3 max-w-[80%]">
              <p class="text-sm text-dark-900 dark:text-dark-100">
                Ada pertanyaan? Hubungi kami melalui:
              </p>
            </div>
          </div>

          <!-- Platform Selection -->
          <div v-if="step === 'platform'" class="space-y-3">
            <button
              @click="selectPlatform('whatsapp')"
              class="w-full flex items-center gap-3 p-4 bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-xl transition-all duration-300 group"
            >
              <div class="w-10 h-10 bg-green-500 rounded-xl flex items-center justify-center">
                <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
              </div>
              <div class="text-left flex-1">
                <p class="font-bold text-dark-900 dark:text-white">WhatsApp</p>
                <p class="text-xs text-dark-600 dark:text-dark-400">Balas cepat & langsung</p>
              </div>
              <ChevronRight :size="20" class="text-dark-400 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              @click="selectPlatform('telegram')"
              class="w-full flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl transition-all duration-300 group"
            >
              <div class="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                <Send :size="20" class="text-white" />
              </div>
              <div class="text-left flex-1">
                <p class="font-bold text-dark-900 dark:text-white">Telegram</p>
                <p class="text-xs text-dark-600 dark:text-dark-400">Alternatif chat lainnya</p>
              </div>
              <ChevronRight :size="20" class="text-dark-400 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <!-- Form -->
          <div v-if="step === 'form'" class="space-y-3">
            <button
              @click="step = 'platform'"
              class="flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              <ChevronLeft :size="16" />
              Kembali
            </button>

            <input
              v-model="form.name"
              type="text"
              placeholder="Nama (opsional)"
              class="w-full px-4 py-2.5 bg-dark-50 dark:bg-dark-800 border border-border rounded-lg outline-none focus:border-primary-500 transition-colors text-sm text-dark-950 dark:text-white"
            />

            <input
              v-model="form.email"
              type="email"
              placeholder="Email (opsional)"
              class="w-full px-4 py-2.5 bg-dark-50 dark:bg-dark-800 border border-border rounded-lg outline-none focus:border-primary-500 transition-colors text-sm text-dark-950 dark:text-white"
            />

            <textarea
              v-model="form.message"
              placeholder="Tulis pesan Anda"
              rows="4"
              class="w-full px-4 py-2.5 bg-dark-50 dark:bg-dark-800 border border-border rounded-lg outline-none focus:border-primary-500 transition-colors text-sm resize-none text-dark-950 dark:text-white"
            ></textarea>

            <button
              @click="sendMessage"
              :disabled="!form.message.trim() || sending"
              class="w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              style="background: linear-gradient(135deg, #3b82f6, #22d3ee)"
            >
              <Loader v-if="sending" :size="18" class="animate-spin" />
              <span>{{ sending ? 'Mengirim Pesan' : 'Kirim Pesan' }}</span>
            </button>

            <p v-if="errorMessage" class="text-sm text-red-600 dark:text-red-400 text-center">
              {{ errorMessage }}
            </p>
          </div>

          <!-- Success -->
          <div v-if="step === 'success'" class="text-center py-6">
            <div class="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle :size="32" class="text-green-600" />
            </div>
            <h4 class="font-bold text-lg mb-2 text-dark-950 dark:text-white">Pesan Terkirim</h4>
            <p class="text-sm text-dark-600 dark:text-dark-400 mb-4">
              Tim kami akan segera merespons
            </p>
            <button
              @click="resetForm"
              class="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Kirim Pesan Lagi
            </button>
          </div>

        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { X, Headphones, Bot, Send, ChevronRight, ChevronLeft, Loader, CheckCircle } from 'lucide-vue-next'
import api from '../services/api'

const props = defineProps({
  newMessageCount: {
    type: Number,
    default: 0
  }
})

const isOpen = ref(false)
const isVisible = ref(true)
const step = ref('platform')
const selectedPlatform = ref(null)
const sending = ref(false)
const errorMessage = ref('')
const isMobile = ref(false)
let lastScrollY = 0

const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY < 10) {
    isVisible.value = true
  } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
    isVisible.value = false
  } else if (currentScrollY < lastScrollY) {
    isVisible.value = true
  }
  
  lastScrollY = currentScrollY
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', handleScroll)
})

const hasUnread = computed(() => props.newMessageCount > 0 && !isOpen.value)

const form = ref({
  name: '',
  email: '',
  message: ''
})

const toggleChat = () => {
  isOpen.value = !isOpen.value
}

defineExpose({
  toggleChat
})

const selectPlatform = (platform) => {
  selectedPlatform.value = platform
  step.value = 'form'
}

const sendMessage = async () => {
  if (!form.value.message.trim()) return
  sending.value = true
  errorMessage.value = ''
  try {
    await api.support.send({
      name: form.value.name || 'Guest',
      email: form.value.email || null,
      message: form.value.message,
      platform: selectedPlatform.value
    })
    step.value = 'success'
  } catch (error) {
    errorMessage.value = error.message || 'Gagal mengirim pesan. Silakan coba lagi.'
  } finally {
    sending.value = false
  }
}

const resetForm = () => {
  form.value = { name: '', email: '', message: '' }
  step.value = 'platform'
  selectedPlatform.value = null
  errorMessage.value = ''
}
</script>

<style scoped>
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.8);
}

.slide-up-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.slide-up-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.slide-up-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
