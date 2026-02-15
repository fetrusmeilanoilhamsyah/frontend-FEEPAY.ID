<template>
  <div 
    v-if="operator"
    class="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg text-xs font-bold"
    :class="badgeClasses"
  >
    <!-- Logo (if exists) -->
    <img 
      v-if="operatorLogo"
      :src="operatorLogo" 
      :alt="operator"
      class="w-4 h-4 object-contain"
      @error="logoError = true"
      v-show="!logoError"
    />
    
    <!-- Fallback Dot (if logo not found) -->
    <span 
      v-if="!operatorLogo || logoError"
      class="w-1.5 h-1.5 rounded-full" 
      :class="dotClasses"
    ></span>
    
    {{ operator }}
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  operator: {
    type: String,
    default: null
  }
})

const logoError = ref(false)

const operatorLogos = {
  'Telkomsel': '/logos/operators/telkomsel.png',
  'Indosat': '/logos/operators/indosat.png',
  'XL': '/logos/operators/xl.png',
  'Axis': '/logos/operators/axis.png',
  'Tri': '/logos/operators/tri.png',
  'Smartfren': '/logos/operators/smartfren.png'
}

const operatorColors = {
  'Telkomsel': {
    bg: 'bg-red-50 dark:bg-red-950/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-600'
  },
  'Indosat': {
    bg: 'bg-yellow-50 dark:bg-yellow-950/20',
    text: 'text-yellow-700 dark:text-yellow-400',
    dot: 'bg-yellow-600'
  },
  'XL': {
    bg: 'bg-blue-50 dark:bg-blue-950/20',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-600'
  },
  'Axis': {
    bg: 'bg-purple-50 dark:bg-purple-950/20',
    text: 'text-purple-700 dark:text-purple-400',
    dot: 'bg-purple-600'
  },
  'Tri': {
    bg: 'bg-pink-50 dark:bg-pink-950/20',
    text: 'text-pink-700 dark:text-pink-400',
    dot: 'bg-pink-600'
  },
  'Smartfren': {
    bg: 'bg-orange-50 dark:bg-orange-950/20',
    text: 'text-orange-700 dark:text-orange-400',
    dot: 'bg-orange-600'
  }
}

const operatorLogo = computed(() => {
  return operatorLogos[props.operator] || null
})

const badgeClasses = computed(() => {
  const colors = operatorColors[props.operator] || {
    bg: 'bg-dark-100 dark:bg-dark-800',
    text: 'text-dark-700 dark:text-dark-300',
    dot: 'bg-dark-500'
  }
  return `${colors.bg} ${colors.text}`
})

const dotClasses = computed(() => {
  const colors = operatorColors[props.operator] || { dot: 'bg-dark-500' }
  return colors.dot
})
</script>