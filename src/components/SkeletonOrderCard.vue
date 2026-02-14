<template>
  <div class="bg-white dark:bg-dark-900 rounded-xl p-6 border border-border">
    <!-- Header -->
    <div class="flex items-start justify-between mb-4">
      <div class="flex-1">
        <div class="flex items-center gap-2 mb-2">
          <div class="h-4 bg-dark-200 dark:bg-dark-800 rounded w-20 animate-pulse"></div>
          <div class="h-6 bg-dark-200 dark:bg-dark-800 rounded w-24 animate-pulse"></div>
        </div>
        <div class="h-6 bg-dark-200 dark:bg-dark-800 rounded w-2/3 animate-pulse"></div>
      </div>
      <div class="h-5 w-5 bg-dark-200 dark:bg-dark-800 rounded animate-pulse"></div>
    </div>

    <!-- Details Grid -->
    <div class="grid grid-cols-2 gap-4 pt-4 border-t border-border">
      <div>
        <div class="h-3 bg-dark-200 dark:bg-dark-800 rounded w-16 mb-1 animate-pulse"></div>
        <div class="h-4 bg-dark-200 dark:bg-dark-800 rounded w-full animate-pulse"></div>
      </div>
      <div class="text-right">
        <div class="h-3 bg-dark-200 dark:bg-dark-800 rounded w-12 mb-1 ml-auto animate-pulse"></div>
        <div class="h-6 bg-dark-200 dark:bg-dark-800 rounded w-24 ml-auto animate-pulse"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>