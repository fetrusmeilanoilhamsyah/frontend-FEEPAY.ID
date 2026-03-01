<template>
  <span 
    v-if="operator"
    class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border"
    :class="operatorConfig.className"
  >
    <img
      v-if="showLogo && operator.logo"
      :src="operator.logo"
      :alt="operator.name"
      class="w-4 h-4 object-contain"
      @error="showLogo = false"
    />
    {{ operator.name }}
  </span>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  operator: {
    type: Object, // Ubah dari String menjadi Object
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md'].includes(val)
  }
})

const showLogo = ref(true)

// Reset state logo jika operator berubah
watch(() => props.operator, () => {
  showLogo.value = true
})

// Konfigurasi warna Tailwind disesuaikan dengan key dari useOperatorDetector
const operatorConfigs = {
  'telkomsel': {
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800'
  },
  'indosat': {
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800'
  },
  'xl': {
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800'
  },
  'axis': {
    className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800'
  },
  'tri': {
    className: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-800'
  },
  'smartfren': {
    className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800'
  },
  'byu': { // Key disesuaikan dengan composable ('byu' bukan 'by.u')
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800'
  }
}

const operatorConfig = computed(() => {
  const key = props.operator?.key
  return operatorConfigs[key] || {
    className: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
  }
})
</script>
