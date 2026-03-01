\<template>
  <label
    :class="[
      'block text-xs font-semibold mb-1.5 text-dark-600 dark:text-dark-400',
      class
    ]"
    v-bind="$attrs"
  >
    <slot />
  </label>
</template>

<script setup>
defineProps({ class: { type: String, default: '' } })
defineOptions({ inheritAttrs: false })
</script>
