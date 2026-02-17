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
          class="min-w-full relative cursor-pointer"
          @click="handleAction(banner.action, banner.route)"
        >
          <div
            class="h-48 sm:h-56 flex items-center justify-center p-8"
            :style="{ background: banner.gradient }"
          >
            <div class="text-center">
              <div class="text-4xl mb-3">{{ banner.icon }}</div>
              <h2 class="text-2xl sm:text-3xl font-black text-white mb-2 drop-shadow-lg">
                {{ banner.title }}
              </h2>
              <p class="text-white/90 text-sm sm:text-base font-semibold drop-shadow">
                {{ banner.subtitle }}
              </p>
              <button
                class="mt-4 px-6 py-2.5 bg-white text-primary-600 rounded-xl font-bold shadow-lg hover:scale-105 active:scale-95 transition-transform"
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

    <!-- Arrow Navigation -->
    <button
      @click.stop="prevSlide"
      class="absolute left-4 top-[calc(50%-20px)] -translate-y-1/2 w-10 h-10 bg-white/90 dark:bg-dark-900/90 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
      aria-label="Previous slide"
    >
      <ChevronLeft :size="20" class="text-dark-950 dark:text-white" />
    </button>
    <button
      @click.stop="nextSlide"
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
    icon: '📱',
    title: 'Pulsa & Kuota',
    subtitle: 'Semua operator tersedia',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    buttonText: 'Isi Sekarang',
    action: 'route',
    route: '/checkout/pulsa'
  },
  {
    icon: '💰',
    title: 'Konversi USDT',
    subtitle: 'Pencairan cepat ke rekening Anda',
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    buttonText: 'Tukar USDT',
    action: 'tab',
    route: 'usdt'
  },
  {
    icon: '⚡',
    title: 'Token Listrik PLN',
    subtitle: 'Proses otomatis 24 jam',
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    buttonText: 'Beli Token',
    action: 'route',
    route: '/checkout/pln'
  },
  {
    icon: '🎮',
    title: 'Voucher Game',
    subtitle: 'Mobile Legends, Free Fire, PUBG & lainnya',
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    buttonText: 'Lihat Voucher',
    action: 'route',
    route: '/checkout/game-voucher'
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

const handleAction = (action, route) => {
  stopAutoPlay()
  
  if (action === 'tab') {
    // Pindah ke tab (contoh: USDT)
    emit('action', { type: 'tab', value: route })
  } else if (action === 'route') {
    // Redirect ke halaman checkout
    router.push(route)
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