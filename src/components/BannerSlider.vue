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
        :style="getCardStyle(index)"
        @click="onCardClick(index)"
      >
        <img :src="banner.image" :alt="banner.alt" class="card-img" draggable="false" />
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
  { image: '/banners/banner1.webp', alt: 'Banner 1' },
  { image: '/banners/banner2.webp', alt: 'Banner 2' },
  { image: '/banners/banner3.webp', alt: 'Banner 3' },
  { image: '/banners/banner4.webp', alt: 'Banner 4' },
  { image: '/banners/banner5.webp', alt: 'Banner 5' },
]

const currentIndex = ref(0)
let autoplayInterval = null
let touchStartX = 0
const total = banners.length

// Hitung posisi relatif — hasilnya integer: -2,-1,0,1,2,...
const getRelPos = (index) => {
  let diff = index - currentIndex.value
  if (diff > total / 2)  diff -= total
  if (diff < -total / 2) diff += total
  return diff
}

// Semua posisi pakai translateX saja — TIDAK ada transisi left
const getCardStyle = (index) => {
  const pos = getRelPos(index)
  const abs = Math.abs(pos)

  // Kartu terlalu jauh — sembunyikan
  if (abs > 2) return { opacity: 0, pointerEvents: 'none', transform: 'translateX(-50%) translateY(-50%) scale(0.5)', left: '50%', top: '50%' }

  // Scale & opacity berdasar jarak
  const scale   = pos === 0 ? 1 : abs === 1 ? 0.84 : 0.72
  const opacity = pos === 0 ? 1 : abs === 1 ? 0.65 : 0.25
  const zIndex  = pos === 0 ? 10 : abs === 1 ? 5 : 2

  // Offset horizontal: center=0%, side=±62%, far=±118%
  const offsetMap = { '-2': -118, '-1': -62, 0: 0, 1: 62, 2: 118 }
  const offset = offsetMap[pos] ?? 0

  // Semua kartu anchor di center (left:50%), geser pakai translateX
  return {
    left: '50%',
    transform: `translateX(calc(-50% + ${offset}%)) translateY(-50%) scale(${scale})`,
    opacity,
    zIndex,
    pointerEvents: abs > 1 ? 'none' : 'auto',
  }
}

const onCardClick = (index) => {
  if (index !== currentIndex.value) goTo(index)
}

const next  = () => { currentIndex.value = (currentIndex.value + 1) % total }
const prev  = () => { currentIndex.value = (currentIndex.value - 1 + total) % total }
const goTo  = (i) => { currentIndex.value = i }

const startAutoplay  = () => { autoplayInterval = setInterval(next, 4000) }
const pauseAutoplay  = () => { clearInterval(autoplayInterval) }
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
  height: 280px;
  overflow: hidden;
  user-select: none;
  border-radius: 18px;
}

@media (min-width: 768px)  { .banner-slider { height: 300px; } }
@media (min-width: 1024px) { .banner-slider { height: 300px; } }
@media (min-width: 1280px) { .banner-slider { height: 340px; } }

/* Dot grid pattern di atas background hijau */
.banner-slider::before {
  content: '';
  position: absolute; inset: 0;
  background-image: radial-gradient(circle, rgba(22,163,74,0.15) 1px, transparent 1px);
  background-size: 20px 20px;
  z-index: 0; pointer-events: none;
  border-radius: 18px;
}

/* Glow putih pojok kiri atas */
.banner-slider::after {
  content: '';
  position: absolute;
  top: -30px; left: -30px;
  width: 180px; height: 180px;
  background: radial-gradient(circle, rgba(22,163,74,0.2) 0%, transparent 70%);
  z-index: 0; pointer-events: none;
}

.cards-track {
  position: relative;
  z-index: 1;
  width: 100%; height: 100%;
}

/* Semua kartu: anchor kiri 50%, geser via transform */
.card {
  position: absolute;
  width: 84%;
  top: 50%;
  transform-origin: center center;
  border-radius: 14px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(0,0,0,0.3);
  transition:
    transform 0.42s cubic-bezier(0.25, 0.46, 0.45, 0.94),
    opacity   0.42s ease;
  will-change: transform, opacity;
  aspect-ratio: 16 / 9;
  /* Background hijau brand — keliatan kalau gambar belum load */
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
}

@media (min-width: 768px)  { .card { width: 55%; top: 14px; bottom: 14px; } }
@media (min-width: 1024px) { .card { width: 50%; } }
@media (min-width: 1280px) { .card { width: 45%; } }

.card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  object-position: center;
  display: block;
  pointer-events: none;
  border-radius: 14px;
}

/* Dots */
.dots {
  position: absolute;
  bottom: -16px; left: 50%;
  transform: translateX(-50%);
  display: flex; gap: 5px;
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
  width: 20px;
  background: #16a34a;
}

@media (min-width: 768px) {
  .dots { bottom: -24px; gap: 6px; }
  .dot { width: 8px; height: 8px; }
  .dot--active { width: 28px; }
}
</style>
