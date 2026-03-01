<template>
  <input
    :class="[
      'w-full h-11 bg-white dark:bg-dark-950 border border-border rounded-lg px-3',
      'text-sm font-medium text-dark-700 dark:text-white',
      'focus:border-primary-500 focus:ring-2 focus:ring-primary-100 dark:focus:ring-primary-950/20',
      'outline-none transition-all placeholder:text-dark-400 dark:placeholder:text-dark-600',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      class
    ]"
    v-bind="$attrs"
  />
</template>

<script setup>
defineProps({ class: { type: String, default: '' } })
defineOptions({ inheritAttrs: false })
</script>
