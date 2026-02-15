<template>
  <div class="phone-input-wrapper">
    <label class="block text-sm font-semibold mb-2 text-dark-700 dark:text-dark-300">
      Nomor HP
    </label>
    
    <div class="relative">
      <div class="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
        <Smartphone :size="18" class="text-dark-400" />
        <span class="text-sm font-medium text-dark-600 dark:text-dark-400">+62</span>
      </div>
      
      <input
        :value="modelValue"
        @input="handleInput"
        type="tel"
        inputmode="numeric"
        placeholder="812-3456-7890"
        class="w-full h-12 sm:h-14 pl-20 pr-24 bg-white dark:bg-dark-900 border-2 border-border rounded-xl text-base font-medium text-dark-950 dark:text-white placeholder:text-dark-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20 outline-none transition-all"
        maxlength="15"
      />
      
      <!-- Operator Badge -->
      <div 
        v-if="detectedOperator"
        class="absolute right-3 top-1/2 -translate-y-1/2"
      >
        <OperatorBadge :operator="detectedOperator" />
      </div>

      <!-- Contact Picker Button -->
      <button
        v-if="!modelValue"
        type="button"
        @click="openContactPicker"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-2 hover:bg-dark-100 dark:hover:bg-dark-800 rounded-lg transition-colors"
        title="Pilih dari kontak"
      >
        <User :size="18" class="text-dark-500 dark:text-dark-400" />
      </button>
    </div>

    <!-- Helper Text -->
    <p class="mt-2 text-xs text-dark-500 dark:text-dark-400">
      Masukkan nomor tanpa +62 atau 0 di depan
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Smartphone, User } from 'lucide-vue-next'
import { useOperatorDetector } from '@/composables/useOperatorDetector'
import OperatorBadge from './OperatorBadge.vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { detectedOperator } = useOperatorDetector(computed(() => props.modelValue))

const handleInput = (e) => {
  let value = e.target.value.replace(/\D/g, '') // Remove non-numeric
  
  // Remove leading 0 or 62
  if (value.startsWith('0')) {
    value = value.substring(1)
  }
  if (value.startsWith('62')) {
    value = value.substring(2)
  }
  
  emit('update:modelValue', value)
}

const openContactPicker = () => {
  // Contact picker API (if supported)
  if ('contacts' in navigator && 'ContactsManager' in window) {
    navigator.contacts.select(['tel'], { multiple: false })
      .then(contacts => {
        if (contacts.length > 0) {
          const phone = contacts[0].tel[0].replace(/\D/g, '')
          emit('update:modelValue', phone)
        }
      })
      .catch(err => {
        console.log('Contact picker cancelled or not supported')
      })
  } else {
    alert('Fitur pilih kontak tidak tersedia di browser ini')
  }
}
</script>

<style scoped>
/* Remove spinner from number input */
input[type="tel"]::-webkit-outer-spin-button,
input[type="tel"]::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type="tel"] {
  -moz-appearance: textfield;
}
</style>