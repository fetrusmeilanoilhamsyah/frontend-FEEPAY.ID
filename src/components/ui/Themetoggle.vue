<template>
  <button
    @click="toggleDark()"
    :class="cn(
      'inline-flex items-center justify-center w-9 h-9 rounded-lg',
      'text-muted-foreground hover:text-foreground hover:bg-muted',
      'transition-all duration-200',
      class
    )"
    :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <Sun v-if="isDark" class="h-4 w-4" />
    <Moon v-else class="h-4 w-4" />
  </button>
</template>

<script setup lang="ts">
import { Sun, Moon } from 'lucide-vue-next'
import { cn } from '../utils'
import { useTheme } from '../composables/useTheme'

defineProps<{ class?: string }>()

const { isDark, toggleDark } = useTheme()
</script>