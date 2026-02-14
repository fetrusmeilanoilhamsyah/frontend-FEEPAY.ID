<template>
  <div class="bg-white dark:bg-dark-900 rounded-xl p-6 border border-border">
    <!-- Product Name Skeleton -->
    <div class="mb-4">
      <div class="h-5 bg-dark-200 dark:bg-dark-800 rounded w-3/4 mb-2 animate-pulse"></div>
      <div class="h-4 bg-dark-200 dark:bg-dark-800 rounded w-1/2 animate-pulse"></div>
    </div>

    <!-- Price Skeleton -->
    <div class="mb-6">
      <div class="h-8 bg-dark-200 dark:bg-dark-800 rounded w-2/3 animate-pulse"></div>
    </div>

    <!-- Button Skeleton -->
    <div class="h-12 bg-dark-200 dark:bg-dark-800 rounded-lg animate-pulse"></div>
  </div>
</template>

<style scoped>
@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>