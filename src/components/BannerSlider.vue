<template>
  <div class="relative mb-6">
    <!-- Slider Container -->
    <div class="relative overflow-hidden rounded-2xl shadow-lg">
      <div
        class="flex transition-transform duration-500 ease-out"
        :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
      >
        <div
          v-for="(banner, index) in banners"
          :key="index"
          class="min-w-full relative"
        >
          <div
            class="h-48 sm:h-56 flex items-center justify-center p-8"
            :style="{ background: banner.gradient }"
          >
            <div class="text-center">
              <div class="text-4xl mb-3">{{ banner.emoji }}</div>
              <h2 class="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg">
                {{ banner.title }}
              </h2>
              <p class="text-white/90 text-sm sm:text-base font-semibold drop-shadow">
                {{ banner.subtitle }}
              </p>
              <button
                v-if="banner.action"
                @click.stop="handleAction(banner.action)"
                class="mt-4 px-6 py-2 bg-white text-primary-600 rounded-lg font-bold shadow-lg hover:scale-105 transition-transform"
              >
                {{ banner.buttonText }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Dots -->
    <div class="flex justify-center gap-2 mt-4">
      <button
        v-for="(_, index) in banners"
        :key="index"
        @click="goToSlide(index)"
        class="h-2 rounded-full transition-all duration-300"
        :class="currentIndex === index
          ? 'bg-primary-600 w-8'
          : 'bg-dark-300 dark:bg-dark-700 hover:bg-dark-400 w-2'"
      ></button>
    </div>

    <!-- Arrow Navigation — FIX: top dihitung dari banner saja bukan seluruh wrapper -->
    <button
      @click="prevSlide"
      class="absolute left-4 top-[calc(50%-20px)] -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-dark-900/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Previous slide"
    >
      <ChevronLeft :size="20" class="text-dark-950 dark:text-white" />
    </button>
    <button
      @click="nextSlide"
      class="absolute right-4 top-[calc(50%-20px)] -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-dark-900/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Next slide"
    >
      <ChevronRight :size="20" class="text-dark-950 dark:text-white" />
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const router = useRouter()

const emit = defineEmits(['action'])

const banners = [
  {
    emoji: '🎉',
    title: 'Diskon 50% Pulsa!',
    subtitle: 'Khusus hari ini untuk semua operator',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonText: 'Beli Sekarang',
    action: 'Pulsa'
  },
  {
    emoji: '💱',
    title: 'Jual USDT Mudah',
    subtitle: 'Rate terbaik, transfer instant',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    buttonText: 'Jual USDT',
    action: 'usdt'
  },
  {
    emoji: '⚡',
    title: 'Token PLN Instan',
    subtitle: 'Langsung masuk tanpa menunggu',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    buttonText: 'Beli Token',
    action: 'E-Wallet'
  },
  {
    emoji: '🎮',
    title: 'Top Up Game Cepat',
    subtitle: 'Mobile Legends, Free Fire, PUBG',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    buttonText: 'Top Up',
    action: 'Game'
  }
]

const currentIndex = ref(0)
let autoPlayInterval = null

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.length
}

const prevSlide = () => {
  currentIndex.value = currentIndex.value === 0 ? banners.length - 1 : currentIndex.value - 1
}

const goToSlide = (index) => {
  currentIndex.value = index
}

// FIX: handleAction sekarang emit ke parent (Home.vue)
// agar Home.vue bisa filter kategori sesuai tombol yang diklik
const handleAction = (action) => {
  if (action === 'usdt') {
    // Khusus USDT: pindah ke tab USDT di Home
    emit('action', { type: 'tab', value: 'usdt' })
  } else {
    // Kategori produk: filter kategori di tab products
    emit('action', { type: 'category', value: action })
  }
}

const startAutoPlay = () => {
  autoPlayInterval = setInterval(nextSlide, 5000)
}

const stopAutoPlay = () => {
  if (autoPlayInterval) {
    clearInterval(autoPlayInterval)
    autoPlayInterval = null
  }
}

onMounted(() => startAutoPlay())
onUnmounted(() => stopAutoPlay())
</script>