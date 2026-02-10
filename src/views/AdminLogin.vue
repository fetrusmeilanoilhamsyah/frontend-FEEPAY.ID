<template>
  <div class="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <h1 class="text-3xl font-black tracking-tighter text-foreground mb-2">
          Admin Login
        </h1>
        <p class="text-muted-foreground">
          {{ step === 1 ? 'Enter credentials' : 'Enter PIN to continue' }}
        </p>
      </div>

      <div class="card">
        <!-- Step 1: Email & Password -->
        <form v-if="step === 1" @submit.prevent="handleCredentialsSubmit">
          <div class="space-y-4 mb-6">
            <!-- Email -->
            <div>
              <label for="email" class="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                v-model="credentials.email"
                type="email"
                class="input"
                placeholder="admin@feepay.id"
                required
                autocomplete="email"
                :disabled="submitting"
              />
              <p v-if="errors.email" class="mt-1 text-sm text-destructive">
                {{ errors.email }}
              </p>
            </div>

            <!-- Password -->
            <div>
              <label for="password" class="block text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <input
                id="password"
                v-model="credentials.password"
                type="password"
                class="input"
                placeholder="Enter password"
                required
                autocomplete="current-password"
                :disabled="submitting"
              />
              <p v-if="errors.password" class="mt-1 text-sm text-destructive">
                {{ errors.password }}
              </p>
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="errorMessage" class="mb-4 p-3 bg-destructive/10 border border-destructive rounded-lg">
            <p class="text-sm text-destructive">{{ errorMessage }}</p>
          </div>

          <!-- Submit Button -->
          <button
            type="submit"
            class="btn btn-primary w-full"
            :disabled="submitting"
          >
            <Loader v-if="submitting" class="animate-spin mr-2" :size="16" />
            {{ submitting ? 'Authenticating...' : 'Continue' }}
          </button>
        </form>

        <!-- Step 2: PIN Input -->
        <form v-else @submit.prevent="handlePinSubmit">
          <div class="mb-6">
            <label class="block text-sm font-medium text-foreground mb-3">
              Enter 6-Digit PIN
            </label>
            
            <div class="flex gap-2 justify-center">
              <input
                v-for="i in 6"
                :key="i"
                :ref="el => pinInputs[i - 1] = el"
                v-model="pinDigits[i - 1]"
                type="text"
                inputmode="numeric"
                maxlength="1"
                class="w-12 h-12 text-center text-xl font-bold border-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                :class="[
                  errorMessage 
                    ? 'border-destructive' 
                    : 'border-border',
                  'bg-background text-foreground'
                ]"
                @input="handlePinInput(i - 1, $event)"
                @keydown="handlePinKeydown(i - 1, $event)"
                @paste="handlePinPaste"
              />
            </div>
            
            <p v-if="errorMessage" class="mt-3 text-sm text-destructive text-center">
              {{ errorMessage }}
            </p>
          </div>

          <!-- Actions -->
          <div class="flex gap-3">
            <button
              type="button"
              @click="step = 1"
              class="btn btn-secondary flex-1"
            >
              Back
            </button>
            <button
              type="submit"
              class="btn btn-primary flex-1"
              :disabled="!isPinComplete || submitting"
            >
              <Loader v-if="submitting" class="animate-spin mr-2" :size="16" />
              {{ submitting ? 'Verifying...' : 'Login' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { Loader } from 'lucide-vue-next'
import { useAuth } from '../composables/useAuth'

const router = useRouter()
const { login, setAdminPin } = useAuth()

const step = ref(1)
const submitting = ref(false)
const errorMessage = ref('')
const errors = ref({})

// Step 1: Credentials
const credentials = ref({
  email: '',
  password: ''
})

// Step 2: PIN
const pinDigits = ref(['', '', '', '', '', ''])
const pinInputs = ref([])

const isPinComplete = computed(() => {
  return pinDigits.value.every(digit => digit !== '')
})

const handleCredentialsSubmit = async () => {
  submitting.value = true
  errorMessage.value = ''
  errors.value = {}

  try {
    await login(credentials.value)
    step.value = 2
    
    // Focus first PIN input
    nextTick(() => {
      pinInputs.value[0]?.focus()
    })
    
  } catch (error) {
    if (error.type === 'validation') {
      errors.value = error.errors
      errorMessage.value = error.message
    } else {
      errorMessage.value = error.message || 'Login failed'
    }
  } finally {
    submitting.value = false
  }
}

const handlePinInput = (index, event) => {
  const value = event.target.value

  if (!/^\d*$/.test(value)) {
    pinDigits.value[index] = ''
    return
  }

  pinDigits.value[index] = value

  if (value && index < 5) {
    nextTick(() => {
      pinInputs.value[index + 1]?.focus()
    })
  }

  errorMessage.value = ''
}

const handlePinKeydown = (index, event) => {
  if (event.key === 'Backspace') {
    if (!pinDigits.value[index] && index > 0) {
      pinInputs.value[index - 1]?.focus()
    }
  }
  else if (event.key === 'ArrowLeft' && index > 0) {
    event.preventDefault()
    pinInputs.value[index - 1]?.focus()
  }
  else if (event.key === 'ArrowRight' && index < 5) {
    event.preventDefault()
    pinInputs.value[index + 1]?.focus()
  }
  else if (event.key === 'Enter') {
    event.preventDefault()
    if (isPinComplete.value) {
      handlePinSubmit()
    }
  }
}

const handlePinPaste = (event) => {
  event.preventDefault()
  const paste = event.clipboardData.getData('text')
  const digits = paste.replace(/\D/g, '').split('').slice(0, 6)
  
  digits.forEach((digit, index) => {
    if (index < 6) {
      pinDigits.value[index] = digit
    }
  })

  const nextIndex = Math.min(digits.length, 5)
  nextTick(() => {
    pinInputs.value[nextIndex]?.focus()
  })
}

const handlePinSubmit = async () => {
  if (!isPinComplete.value) {
    errorMessage.value = 'Please enter all 6 digits'
    return
  }

  const pin = pinDigits.value.join('')
  
  if (pin.length !== 6 || !/^\d{6}$/.test(pin)) {
    errorMessage.value = 'Invalid PIN format'
    return
  }

  submitting.value = true
  
  try {
    // Save PIN to sessionStorage
    setAdminPin(pin)
    
    // Redirect to dashboard
    router.push('/admin/dashboard')
    
  } catch (error) {
    errorMessage.value = 'Failed to verify PIN'
  } finally {
    submitting.value = false
  }
}
</script>