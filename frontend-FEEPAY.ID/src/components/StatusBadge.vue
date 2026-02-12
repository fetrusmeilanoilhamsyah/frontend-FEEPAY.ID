<template>
  <span 
    :class="badgeClasses"
    class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    {{ label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (value) => ['pending', 'processing', 'success', 'failed'].includes(value)
  }
})

const badgeClasses = computed(() => {
  const classes = {
    pending: 'bg-yellow-50 text-yellow-700 border border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-800',
    processing: 'bg-blue-50 text-blue-700 border border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-800',
    success: 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-800',
    failed: 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-800'
  }
  return classes[props.status] || classes.pending
})

const dotClass = computed(() => {
  const classes = {
    pending: 'bg-yellow-500 dark:bg-yellow-400',
    processing: 'bg-blue-500 dark:bg-blue-400 animate-pulse',
    success: 'bg-green-500 dark:bg-green-400',
    failed: 'bg-red-500 dark:bg-red-400'
  }
  return classes[props.status] || classes.pending
})

const label = computed(() => {
  const labels = {
    pending: 'Menunggu Verifikasi',
    processing: 'Sedang Diproses',
    success: 'Berhasil',
    failed: 'Gagal'
  }
  return labels[props.status] || 'Unknown'
})
</script>