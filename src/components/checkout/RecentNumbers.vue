<template>
  <div v-if="numbers.length > 0" class="recent-numbers">
    <h3 class="text-sm font-semibold mb-3 text-dark-700 dark:text-dark-300">
      Nomor yang Sering Dipakai
    </h3>
    
    <div class="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0 scrollbar-hide">
      <button
        v-for="(number, index) in numbers"
        :key="index"
        @click="$emit('select', number)"
        class="flex-shrink-0 flex items-center gap-2 px-3 py-2 bg-white dark:bg-dark-900 border-2 border-border hover:border-primary-500 rounded-lg transition-all"
      >
        <Phone :size="14" class="text-dark-500 dark:text-dark-400" />
        <span class="text-sm font-medium text-dark-700 dark:text-dark-300">
          {{ formatNumber(number) }}
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Phone } from 'lucide-vue-next'

defineProps({
  numbers: {
    type: Array,
    default: () => []
  }
})

defineEmits(['select'])

const formatNumber = (number) => {
  // Format: 0812-3456-7890
  const cleaned = number.replace(/\D/g, '')
  if (cleaned.length > 10) {
    return `0${cleaned.substring(0, 3)}-${cleaned.substring(3, 7)}-${cleaned.substring(7)}`
  }
  return `0${cleaned}`
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>