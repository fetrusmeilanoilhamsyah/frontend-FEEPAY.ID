<template>
  <!-- FIX: mb-6 konsisten dengan BannerSlider.vue yang juga pakai mb-6 -->
  <div class="relative mb-6">
    <div class="overflow-hidden rounded-2xl shadow-lg">
      <div class="h-48 sm:h-56 bg-dark-200 dark:bg-dark-800 animate-pulse rounded-2xl"></div>
    </div>
    <!-- Dots -->
    <div class="flex justify-center gap-2 mt-4">
      <div v-for="i in 4" :key="i"
        class="h-2 rounded-full bg-dark-200 dark:bg-dark-700 animate-pulse"
        :class="i === 1 ? 'w-8' : 'w-2'"
      ></div>
    </div>
  </div>
</template>