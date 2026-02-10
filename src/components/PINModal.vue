<template>
  <teleport to="body">
    <transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 overflow-y-auto"
        aria-labelledby="pin-modal-title"
        role="dialog"
        aria-modal="true"
      >
        <div
          class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300"
          @click="handleClose"
        ></div>

        <div class="flex min-h-full items-center justify-center p-4">
          <div
            class="relative bg-white dark:bg-dark-900 rounded-lg shadow-xl max-w-sm w-full p-6 transform transition-all duration-500 ease-in-out"
            @click.stop
          >
            <h2 id="pin-modal-title" class="text-xl font-black tracking-tighter text-dark-950 dark:text-white mb-2">
              Enter Admin PIN
            </h2>
            
            <p class="text-sm text-dark-600 dark:text-dark-400 mb-4">
              {{ title }}
            </p>

            <div 
              v-if="subtitle" 
              class="mb-6 p-3 bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 rounded-lg"
            >
              <p class="text-sm font-bold text-primary-900 dark:text-primary-100 break-words">
                {{ subtitle }}
              </p>
            </div>

            <div class="flex gap-2 mb-4 justify-center">
              <input
                v-for="i in 6"
                :key="i"
                :ref="el => pinInputs[i - 1] = el"
                v-model="pinDigits[i - 1]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
                :class="[
                  error 
                    ? 'border-red-500 dark:border-red-500' 
                    : 'border-dark-300 dark:border-dark-600',
                  'bg-white dark:bg-dark-800 text-dark-950 dark:text-white'
                ]"
                @input="handleInput(i - 1, $event)"
                @keydown="handleKeydown(i - 1, $event)"
                @paste="handlePaste"
              />
            </div>

            <p v-if="error" class="text-sm text-center text-red-600 dark:text-red-400 mb-4">
              {{ error }}
            </p>

            <div class="flex gap-3">
              <button
                @click="handleClose"
                class="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                @click="handleSubmit"
                class="btn btn-primary flex-1"
                :disabled="!isComplete"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

const props = defineProps({
  title: {
    type: String,
    default: 'Verify action'
  },
  // [BARU] Tambahan prop subtitle sesuai instruksi
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
    error.value = 'Please enter all 6 digits'
    return
  }

  const pin = pinDigits.value.join('')
  
  // Basic validation (must be 6 digits)
  if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    error.value = 'Invalid PIN format'
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

// Trap focus and handle escape
const trapFocus = (event) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

onMounted(() => {
  document.addEventListener('keydown', trapFocus)
})

onUnmounted(() => {
  document.removeEventListener('keydown', trapFocus)
})
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

.modal-enter-active > div > div,
.modal-leave-active > div > div {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from > div > div {
  transform: scale(0.95);
  opacity: 0;
}

.modal-leave-to > div > div {
  transform: scale(0.95);
  opacity: 0;
}
</style>