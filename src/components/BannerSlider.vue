<template>
  <div
    class="banner-slider"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
  >
    <div class="cards-track">
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="card"
        :class="getCardClass(index)"
        :style="getCardStyle(index)"
        @click="goTo(index)"
      >
        <img
          :src="banner.image"
          :alt="banner.alt"
          class="card-img"
          draggable="false"
        />
      </div>
    </div>

    <!-- Dots -->
    <div class="dots">
      <button
        v-for="(_, i) in banners"
        :key="i"
        @click="goTo(i)"
        class="dot"
        :class="{ 'dot--active': i === currentIndex }"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

defineEmits(['action'])

const banners = [
  { image: '/banners/banner1.jpg', alt: 'Banner 1' },
  { image: '/banners/banner2.jpg', alt: 'Banner 2' },
  { image: '/banners/banner3.jpg', alt: 'Banner 3' },
]

const currentIndex = ref(0)
let autoplayInterval = null
let touchStartX = 0

const total = banners.length

// Hitung posisi relatif index terhadap current (-1, 0, 1, dll)
const getRelPos = (index) => {
  let diff = index - currentIndex.value
  // wrap around
  if (diff > total / 2)  diff -= total
  if (diff < -total / 2) diff += total
  return diff
}

const getCardClass = (index) => {
  const pos = getRelPos(index)
  if (pos === 0)  return 'card--active'
  if (pos === 1 || pos === -1) return 'card--side'
  return 'card--hidden'
}

const getCardStyle = (index) => {
  const pos = getRelPos(index)
  if (pos === 0) return {
    transform: 'translateX(-50%) scale(1)',
    zIndex: 10,
    opacity: 1,
    left: '50%',
  }
  if (pos === 1) return {
    transform: 'translateX(-10%) scale(0.82)',
    zIndex: 5,
    opacity: 0.7,
    left: '72%',
  }
  if (pos === -1) return {
    transform: 'translateX(-90%) scale(0.82)',
    zIndex: 5,
    opacity: 0.7,
    left: '28%',
  }
  if (pos === 2) return {
    transform: 'translateX(20%) scale(0.7)',
    zIndex: 2,
    opacity: 0.3,
    left: '80%',
  }
  if (pos === -2) return {
    transform: 'translateX(-120%) scale(0.7)',
    zIndex: 2,
    opacity: 0.3,
    left: '20%',
  }
  return { opacity: 0, zIndex: 0, left: '50%', transform: 'translateX(-50%) scale(0.6)' }
}

const next = () => { currentIndex.value = (currentIndex.value + 1) % total }
const prev = () => { currentIndex.value = (currentIndex.value - 1 + total) % total }
const goTo = (i) => { currentIndex.value = i }
const startAutoplay = () => { autoplayInterval = setInterval(next, 4000) }
const pauseAutoplay = () => { clearInterval(autoplayInterval) }
const resumeAutoplay = () => { startAutoplay() }

const onTouchStart = (e) => { touchStartX = e.changedTouches[0].clientX }
const onTouchEnd   = (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 40) diff > 0 ? next() : prev()
}

onMounted(() => startAutoplay())
onUnmounted(() => clearInterval(autoplayInterval))
</script>

<style scoped>
.banner-slider {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  user-select: none;
}

/* Dot grid pattern samar */
.banner-slider::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, rgba(22,163,74,0.15) 1px, transparent 1px);
  background-size: 18px 18px;
  z-index: 0;
  pointer-events: none;
}

/* Glow pojok kiri atas */
.banner-slider::after {
  content: '';
  position: absolute;
  top: -20px; left: -20px;
  width: 130px; height: 130px;
  background: radial-gradient(circle, rgba(22,163,74,0.18) 0%, transparent 70%);
  z-index: 0;
  pointer-events: none;
}

/* Track — jadi stage untuk kartu */
.cards-track {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
}

/* Tiap kartu absolute, transisi smooth */
.card {
  position: absolute;
  width: 78%;
  top: 0; bottom: 0;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform  0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity    0.45s ease,
    left       0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    box-shadow 0.45s ease;
  will-change: transform, opacity;
}

.card--active {
  box-shadow: 0 8px 32px rgba(0,0,0,0.22);
}

.card--side {
  cursor: pointer;
}
.card--side:hover {
  opacity: 0.85 !important;
}

.card--hidden {
  pointer-events: none;
}

.card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  pointer-events: none;
  border-radius: 14px;
}

/* Dots */
.dots {
  position: absolute;
  bottom: -18px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
  z-index: 20;
}
.dot {
  width: 6px; height: 6px;
  border-radius: 999px;
  background: #d1d5db;
  border: none; padding: 0;
  cursor: pointer;
  transition: all 0.3s ease;
}
.dot--active {
  width: 18px;
  background: #111827;
}
</style>