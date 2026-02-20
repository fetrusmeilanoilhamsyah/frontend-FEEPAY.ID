<template>
  <span 
    v-if="operator"
    class="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-bold border"
    :class="operatorConfig.className"
  >
    <!-- ✅ Tambah logo dari public/logos/operators/ -->
    <img
      v-if="showLogo"
      :src="`/logos/operators/${operatorKey}.png`"
      :alt="operatorConfig.label"
      class="w-4 h-4 object-contain"
      @error="showLogo = false"
    />
    {{ operatorConfig.label }}
  </span>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  operator: {
    type: String,
    default: null
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md'].includes(val)
  }
})

const showLogo = ref(true)

// Mapping key ke nama file logo (untuk kasus nama file berbeda dari key)
const logoFilenames = {
  'by.u': 'byu', // file di folder: byu.png, bukan by.u.png
}

const operatorKey = computed(() => {
  const key = props.operator?.toLowerCase()
  return logoFilenames[key] || key
})

const operatorConfigs = {
  'telkomsel': {
    label: 'Telkomsel',
    className: 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800'
  },
  'indosat': {
    label: 'Indosat',
    className: 'bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/30 dark:text-yellow-400 dark:border-yellow-800'
  },
  'xl': {
    label: 'XL',
    className: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800'
  },
  'axis': {
    label: 'AXIS',
    className: 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-800'
  },
  'tri': {
    label: 'Tri',
    className: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-800'
  },
  'three': {
    label: 'Three',
    className: 'bg-pink-50 text-pink-700 border-pink-200 dark:bg-pink-950/30 dark:text-pink-400 dark:border-pink-800'
  },
  'smartfren': {
    label: 'Smartfren',
    className: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800'
  },
  'by.u': {
    label: 'by.U',
    className: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/30 dark:text-cyan-400 dark:border-cyan-800'
  }
}

const operatorConfig = computed(() => {
  const key = props.operator?.toLowerCase()
  return operatorConfigs[key] || {
    label: props.operator || 'Unknown',
    className: 'bg-neutral-100 text-neutral-700 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:border-neutral-700'
  }
})
</script>