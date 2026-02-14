<template>
  <div class="min-h-screen bg-stone-50 dark:bg-dark-950 py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Loading Skeleton -->
      <div v-if="loading">
        <!-- Avatar Skeleton -->
        <div class="mb-8 text-center">
          <div class="w-24 h-24 bg-dark-200 dark:bg-dark-800 rounded-full mx-auto mb-4 animate-pulse"></div>
          <div class="h-7 bg-dark-200 dark:bg-dark-800 rounded w-32 mx-auto mb-2 animate-pulse"></div>
          <div class="h-4 bg-dark-200 dark:bg-dark-800 rounded w-48 mx-auto animate-pulse"></div>
        </div>

        <!-- Stats Skeleton -->
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div v-for="i in 3" :key="i" class="bg-white dark:bg-dark-900 rounded-xl p-4 border border-border">
            <div class="w-6 h-6 bg-dark-200 dark:bg-dark-800 rounded mx-auto mb-2 animate-pulse"></div>
            <div class="h-8 bg-dark-200 dark:bg-dark-800 rounded w-12 mx-auto mb-2 animate-pulse"></div>
            <div class="h-3 bg-dark-200 dark:bg-dark-800 rounded w-16 mx-auto animate-pulse"></div>
          </div>
        </div>

        <!-- Menu Skeleton -->
        <div class="space-y-3">
          <div v-for="i in 4" :key="i" class="bg-white dark:bg-dark-900 rounded-xl p-4 border border-border">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-dark-200 dark:bg-dark-800 rounded-lg animate-pulse"></div>
              <div class="flex-1">
                <div class="h-4 bg-dark-200 dark:bg-dark-800 rounded w-32 mb-2 animate-pulse"></div>
                <div class="h-3 bg-dark-200 dark:bg-dark-800 rounded w-48 animate-pulse"></div>
              </div>
              <div class="w-5 h-5 bg-dark-200 dark:bg-dark-800 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actual Content -->
      <div v-else>
        <!-- Header -->
        <div class="mb-8 text-center">
          <div class="w-24 h-24 bg-primary-100 dark:bg-primary-950/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User class="text-primary-600 dark:text-primary-400" :size="48" />
          </div>
          <h1 class="text-2xl font-bold text-dark-950 dark:text-white mb-1">
            Profil Pengguna
          </h1>
          <p class="text-sm text-dark-600 dark:text-dark-400">
            Kelola informasi akun Anda
          </p>
        </div>

        <!-- Coming Soon -->
        <div class="bg-white dark:bg-dark-900 rounded-2xl p-8 border border-border text-center">
          <Construction class="mx-auto mb-4 text-primary-600" :size="64" />
          <h3 class="text-xl font-bold text-dark-950 dark:text-white mb-2">
            Segera Hadir
          </h3>
          <p class="text-sm text-dark-600 dark:text-dark-400 mb-6">
            Fitur profil sedang dalam pengembangan
          </p>
          <button 
            @click="$router.push('/')"
            class="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-semibold transition-colors"
          >
            Kembali ke Beranda
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { User, Construction } from 'lucide-vue-next'

const loading = ref(true)

onMounted(() => {
  // Simulate loading
  setTimeout(() => {
    loading.value = false
  }, 500)
})
</script>

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