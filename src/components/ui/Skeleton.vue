<template>
  <div
    :class="[
      'animate-pulse rounded-lg bg-dark-100 dark:bg-dark-800',
      class
    ]"
    v-bind="$attrs"
  />
</template>

<script setup>
defineProps({ class: { type: String, default: '' } })
defineOptions({ inheritAttrs: false })
</script>