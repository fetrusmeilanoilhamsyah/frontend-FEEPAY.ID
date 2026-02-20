<template>
  <div class="relative rounded-2xl overflow-hidden select-none" @mouseenter="pauseAutoplay" @mouseleave="resumeAutoplay">
    
    <!-- Slides Wrapper -->
    <div
      class="flex transition-transform duration-500 ease-in-out"
      :style="{ transform: `translateX(-${currentIndex * 100}%)` }"
    >
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="w-full flex-shrink-0"
      >
        <img
          :src="banner.image"
          :alt="banner.alt"
          class="w-full object-cover rounded-2xl"
          style="aspect-ratio: 16/6; min-height: 140px;"
          draggable="false"
        />
      </div>
    </div>

    <!-- Dots Indicator -->
    <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      <button
        v-for="(_, i) in banners"
        :key="i"
        @click="goTo(i)"
        class="transition-all duration-300 rounded-full"
        :class="i === currentIndex
          ? 'w-5 h-2 bg-white'
          : 'w-2 h-2 bg-white/50 hover:bg-white/80'"
      />
    </div>

    <!-- Arrow Prev -->
    <button
      @click="prev"
      class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition z-10 text-lg font-bold"
    >
      ‹
    </button>

    <!-- Arrow Next -->
    <button
      @click="next"
      class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full w-8 h-8 flex items-center justify-center transition z-10 text-lg font-bold"
    >
      ›
    </button>

  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const emit = defineEmits(['action'])

// =============================================
// DAFTAR BANNER — edit di sini
// Taruh gambar di folder: public/banners/
// =============================================
const banners = [
  {
    image: '/banners/banner1.jpg',
    alt: 'Banner 1',
    action: null  // bisa diisi: { type: 'tab', value: 'products' }
  },
  {
    image: '/banners/banner2.jpg',
    alt: 'Banner 2',
    action: null
  },
  {
    image: '/banners/banner3.jpg',
    alt: 'Banner 3',
    action: null
  }
]
// =============================================

const currentIndex = ref(0)
let autoplayInterval = null

const next = () => {
  currentIndex.value = (currentIndex.value + 1) % banners.length
}

const prev = () => {
  currentIndex.value = (currentIndex.value - 1 + banners.length) % banners.length
}

const goTo = (i) => {
  currentIndex.value = i
}

const startAutoplay = () => {
  autoplayInterval = setInterval(next, 4000)
}

const pauseAutoplay = () => {
  clearInterval(autoplayInterval)
}

const resumeAutoplay = () => {
  startAutoplay()
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  clearInterval(autoplayInterval)
})
</script>
```

---

## Struktur folder public-nya:
```
public/
└── banners/
    ├── banner1.jpg   ← gambar kuning ML
    ├── banner2.jpg   ← gambar biru ML
    └── banner3.jpg   ← gambar hijau Top Up