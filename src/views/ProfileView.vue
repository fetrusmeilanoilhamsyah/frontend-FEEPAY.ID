<template>
  <div class="min-h-screen bg-background py-8">
    <div class="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

      <!-- Loading Skeleton -->
      <div v-if="loading">
        <div class="mb-8 text-center">
          <div class="w-24 h-24 bg-muted rounded-full mx-auto mb-4 animate-pulse"></div>
          <div class="h-7 bg-muted rounded w-32 mx-auto mb-2 animate-pulse"></div>
          <div class="h-4 bg-muted rounded w-48 mx-auto animate-pulse"></div>
        </div>
        <div class="grid grid-cols-3 gap-4 mb-8">
          <div v-for="i in 3" :key="i" class="bg-card rounded-xl p-4 border border-border">
            <div class="w-6 h-6 bg-muted rounded mx-auto mb-2 animate-pulse"></div>
            <div class="h-8 bg-muted rounded w-12 mx-auto mb-2 animate-pulse"></div>
            <div class="h-3 bg-muted rounded w-16 mx-auto animate-pulse"></div>
          </div>
        </div>
        <div class="space-y-3">
          <div v-for="i in 4" :key="i" class="bg-card rounded-xl p-4 border border-border">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-muted rounded-lg animate-pulse"></div>
              <div class="flex-1">
                <div class="h-4 bg-muted rounded w-32 mb-2 animate-pulse"></div>
                <div class="h-3 bg-muted rounded w-48 animate-pulse"></div>
              </div>
              <div class="w-5 h-5 bg-muted rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Actual Content -->
      <div v-else>
        <div class="mb-8 text-center">
          <div class="w-24 h-24 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
            <User class="text-primary" :size="48" />
          </div>
          <h1 class="text-2xl font-bold text-foreground mb-1">Profil Pengguna</h1>
          <p class="text-sm text-muted-foreground">Kelola informasi akun Anda</p>
        </div>

        <div class="bg-card rounded-2xl p-8 border border-border text-center">
          <Construction class="mx-auto mb-4 text-primary" :size="64" />
          <h3 class="text-xl font-bold text-foreground mb-2">Segera Hadir</h3>
          <p class="text-sm text-muted-foreground mb-6">Fitur profil sedang dalam pengembangan</p>
          <button 
            @click="$router.push('/')"
            class="px-6 py-3 bg-primary hover:opacity-90 text-primary-foreground rounded-lg font-semibold transition-all active:scale-95"
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
  setTimeout(() => { loading.value = false }, 500)
})
</script>