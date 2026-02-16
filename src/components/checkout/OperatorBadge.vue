<template>
  <div 
    v-if="operator"
    class="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold"
    :class="badgeClasses"
  >
    <img 
      v-if="operatorLogo && !logoError"
      :src="operatorLogo" 
      :alt="operator"
      class="w-3.5 h-3.5 object-contain"
      @error="handleLogoError"
    />

    <span 
      v-else
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
  'telkomsel': '/logos/operators/telkomsel.png',
  'indosat': '/logos/operators/indosat.png',
  'xl': '/logos/operators/xl.png',
  'axis': '/logos/operators/axis.png',
  'smartfren': '/logos/operators/smartfren.png',
  'by.u': '/logos/operators/byu.png',
  'three': '/logos/operators/three.png'
}

const operatorColors = {
  'telkomsel': {
    bg: 'bg-gradient-to-br from-red-50 to-red-100 dark:from-red-950/30 dark:to-red-900/20',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-600',
    border: 'border border-red-200 dark:border-red-800/50'
  },
  'indosat': {
    bg: 'bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/30 dark:to-amber-900/20',
    text: 'text-amber-700 dark:text-amber-400',
    dot: 'bg-amber-600',
    border: 'border border-amber-200 dark:border-amber-800/50'
  },
  'xl': {
    bg: 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20',
    text: 'text-blue-700 dark:text-blue-400',
    dot: 'bg-blue-600',
    border: 'border border-blue-200 dark:border-blue-800/50'
  },
  'axis': {
    bg: 'bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/30 dark:to-purple-900/20',
    text: 'text-purple-700 dark:text-purple-400',
    dot: 'bg-purple-600',
    border: 'border border-purple-200 dark:border-purple-800/50'
  },
  'smartfren': {
    bg: 'bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950/30 dark:to-pink-900/20',
    text: 'text-pink-700 dark:text-pink-400',
    dot: 'bg-pink-600',
    border: 'border border-pink-200 dark:border-pink-800/50'
  },
  'by.u': {
    bg: 'bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950/30 dark:to-cyan-900/20',
    text: 'text-cyan-700 dark:text-cyan-400',
    dot: 'bg-cyan-600',
    border: 'border border-cyan-200 dark:border-cyan-800/50'
  },
  'three': {
    bg: 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/20',
    text: 'text-orange-700 dark:text-orange-400',
    dot: 'bg-orange-600',
    border: 'border border-orange-200 dark:border-orange-800/50'
  }
}

const operatorKey = computed(() => props.operator?.toLowerCase() || null)

const operatorLogo = computed(() => operatorLogos[operatorKey.value] || null)

const badgeClasses = computed(() => {
  const colors = operatorColors[operatorKey.value] || {
    bg: 'bg-gray-100 dark:bg-gray-800',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border border-gray-200 dark:border-gray-700'
  }
  return `${colors.bg} ${colors.text} ${colors.border}`
})

const dotClasses = computed(() => {
  return (operatorColors[operatorKey.value] || { dot: 'bg-gray-500' }).dot
})

const handleLogoError = () => {
  logoError.value = true
}
</script>