<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="modal-overlay"
        aria-labelledby="pin-modal-title"
        role="dialog"
        aria-modal="true"
        @click.self="handleClose"
      >
        <div class="modal-content" @click.stop>
          <!-- Header -->
          <h2 id="pin-modal-title" class="modal-title">
            {{ title }}
          </h2>
          
          <p class="modal-subtitle">
            Masukkan PIN Admin untuk melanjutkan
          </p>

          <!-- Subtitle Info (if provided) -->
          <div v-if="subtitle" class="info-box">
            <p class="info-text">{{ subtitle }}</p>
          </div>

          <!-- PIN Input -->
          <div class="pin-container">
            <input
              v-for="i in 6"
              :key="i"
              :ref="el => pinInputs[i - 1] = el"
              v-model="pinDigits[i - 1]"
              type="text"
              inputmode="numeric"
              maxlength="1"
              class="pin-input"
              :class="{ 'error': error }"
              @input="handleInput(i - 1, $event)"
              @keydown="handleKeydown(i - 1, $event)"
              @paste="handlePaste"
            />
          </div>

          <!-- Error Message -->
          <p v-if="error" class="error-message">
            {{ error }}
          </p>

          <!-- Actions -->
          <div class="modal-actions">
            <button @click="handleClose" class="modal-btn secondary">
              Batal
            </button>
            <button 
              @click="handleSubmit" 
              class="modal-btn primary"
              :disabled="!isComplete"
            >
              Konfirmasi
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Verifikasi PIN'
  },
  subtitle: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['confirmed', 'close'])

const isOpen = ref(true)
const pinDigits = ref(['', '', '', '', '', ''])
const pinInputs = ref([])
const error = ref('')

const isComplete = computed(() => {
  return pinDigits.value.every(digit => digit !== '')
})

const handleInput = (index, event) => {
  const value = event.target.value

  // Only allow numbers
  if (!/^\d*$/.test(value)) {
    pinDigits.value[index] = ''
    return
  }

  pinDigits.value[index] = value

  // Auto-focus next input
  if (value && index < 5) {
    nextTick(() => {
      pinInputs.value[index + 1]?.focus()
    })
  }

  // Clear error when user types
  error.value = ''
}

const handleKeydown = (index, event) => {
  // Handle backspace
  if (event.key === 'Backspace') {
    if (!pinDigits.value[index] && index > 0) {
      pinInputs.value[index - 1]?.focus()
    }
  }
  // Handle arrow keys
  else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    pinInputs.value[index - 1]?.focus()
  }
  else if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    pinInputs.value[index + 1]?.focus()
  }
  // Handle Enter
  else if (event.key === 'Enter') {
    event.preventDefault()
    if (isComplete.value) {
      handleSubmit()
    }
  }
}

const handlePaste = (event) => {
  event.preventDefault()
  const paste = event.clipboardData.getData('text')
  const digits = paste.replace(/\D/g, '').split('').slice(0, 6)
  
  digits.forEach((digit, index) => {
    if (index < 6) {
      pinDigits.value[index] = digit
    }
  })

  // Focus last filled input or next empty
  const nextIndex = Math.min(digits.length, 5)
  nextTick(() => {
    pinInputs.value[nextIndex]?.focus()
  })
}

const handleSubmit = () => {
  if (!isComplete.value) {
    error.value = 'Masukkan semua 6 digit PIN'
    return
  }

  const pin = pinDigits.value.join('')
  
  if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    error.value = 'Format PIN tidak valid'
    return
  }

  emit('confirmed', pin)
}

const handleClose = () => {
  isOpen.value = false
  setTimeout(() => {
    emit('close')
  }, 300)
}

// Focus first input on mount
onMounted(() => {
  nextTick(() => {
    pinInputs.value[0]?.focus()
  })
})

// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
}

/* Modal Content */
.modal-content {
  position: relative;
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 16px;
  padding: 1.5rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.dark .modal-content {
  background: rgb(15 20 25);
  border-color: rgb(42 49 66);
}

/* Modal Title */
.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: rgb(17 24 39);
  margin-bottom: 0.5rem;
  letter-spacing: -0.025em;
}

.dark .modal-title {
  color: rgb(243 244 246);
}

/* Modal Subtitle */
.modal-subtitle {
  font-size: 0.875rem;
  color: rgb(107 114 128);
  margin-bottom: 1.5rem;
}

.dark .modal-subtitle {
  color: rgb(156 163 175);
}

/* Info Box */
.info-box {
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;
  background: rgb(239 246 255);
  border: 1px solid rgb(191 219 254);
  border-radius: 12px;
}

.dark .info-box {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.info-text {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgb(37 99 235);
  word-break: break-word;
}

.dark .info-text {
  color: rgb(147 197 253);
}

/* PIN Container */
.pin-container {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
  margin-bottom: 1rem;
}

/* PIN Input */
.pin-input {
  width: 3rem;
  height: 3rem;
  text-align: center;
  font-size: 1.25rem;
  font-weight: 700;
  border: 2px solid rgb(229 231 235);
  border-radius: 12px;
  background: white;
  color: rgb(17 24 39);
  transition: all 0.3s ease;
}

.dark .pin-input {
  background: rgb(26 31 46);
  border-color: rgb(42 49 66);
  color: rgb(243 244 246);
}

.pin-input:focus {
  outline: none;
  border-color: rgb(79 172 254);
  box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
}

.pin-input.error {
  border-color: rgb(239 68 68);
  animation: shake 0.3s ease;
}

.dark .pin-input.error {
  border-color: rgb(239 68 68);
}

/* Error Message */
.error-message {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(220 38 38);
  text-align: center;
  margin-bottom: 1rem;
}

.dark .error-message {
  color: rgb(248 113 113);
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 0.75rem;
}

/* Modal Buttons */
.modal-btn {
  flex: 1;
  padding: 0.75rem;
  font-size: 0.875rem;
  font-weight: 700;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-btn.secondary {
  background: rgb(243 244 246);
  color: rgb(17 24 39);
}

.dark .modal-btn.secondary {
  background: rgb(31 41 55);
  color: rgb(243 244 246);
}

.modal-btn.secondary:hover {
  background: rgb(229 231 235);
}

.dark .modal-btn.secondary:hover {
  background: rgb(42 49 66);
}

.modal-btn.primary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
}

.modal-btn.primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(79, 172, 254, 0.4);
}

.modal-btn.primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

/* Shake Animation */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

/* Modal Transitions */
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
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease;
}

.modal-enter-from .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

.modal-leave-to .modal-content {
  transform: scale(0.95);
  opacity: 0;
}

/* Responsive */
@media (max-width: 640px) {
  .modal-content {
    padding: 1.25rem;
  }
  
  .pin-input {
    width: 2.5rem;
    height: 2.5rem;
    font-size: 1.125rem;
  }
}
</style>