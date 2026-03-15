<template>
  <div
    class="banner-slider"
    @mouseenter="pauseAutoplay"
    @mouseleave="resumeAutoplay"
    @mousemove="handleMouseMove"
    @mouseleave.augment="resetTilt"
    @touchstart.passive="onTouchStart"
    @touchend.passive="onTouchEnd"
    ref="sliderRef"
  >
    <!-- Background Decor (Antigravity Style) -->
    <div class="slider-bg-decor">
      <div class="decor-ring ring-1"></div>
      <div class="decor-ring ring-2"></div>
    </div>

    <div class="cards-track">
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="card-wrapper"
        :style="getCardStyle(index)"
        @click="onCardClick(index)"
      >
        <div class="card" :class="{ 'card--active': index === currentIndex }">
          <img :src="banner.image" :alt="banner.alt" class="card-img" draggable="false" />
          <div class="card-overlay"></div>
          <div class="card-glass-shine"></div>
        </div>
      </div>
    </div>

    <!-- Navigation Dots (Premium Style) -->
    <div class="dots">
      <div class="dots-container">
        <button
          v-for="(_, i) in banners"
          :key="i"
          @click="goTo(i)"
          class="dot-pill"
          :class="{ 'dot-pill--active': i === currentIndex }"
        >
          <span class="dot-inner"></span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const banners = [
  { image: '/banners/banner1.webp', alt: 'Promo 1' },
  { image: '/banners/banner2.webp', alt: 'Promo 2' },
  { image: '/banners/banner3.webp', alt: 'Promo 3' },
  { image: '/banners/banner4.webp', alt: 'Promo 4' },
  { image: '/banners/banner5.webp', alt: 'Promo 5' },
]

const sliderRef = ref(null)
const currentIndex = ref(0)
const total = banners.length
let autoplayInterval = null
let touchStartX = 0

// Physics State
const mouseX = ref(0)
const mouseY = ref(0)
const tiltX = ref(0)
const tiltY = ref(0)
const floatY = ref(0)
let rafId = null

// Animation Loop
const updatePhysics = (time) => {
  // Floating cycle (Antigravity Sine Wave)
  floatY.value = Math.sin(time / 1500) * 8

  // Smooth Lerp for Tilt
  tiltX.value += (mouseX.value - tiltX.value) * 0.1
  tiltY.value += (mouseY.value - tiltY.value) * 0.1

  rafId = requestAnimationFrame(updatePhysics)
}

const handleMouseMove = (e) => {
  if (!sliderRef.value) return
  const rect = sliderRef.value.getBoundingClientRect()
  const x = (e.clientX - rect.left) / rect.width - 0.5
  const y = (e.clientY - rect.top) / rect.height - 0.5
  mouseX.value = x * 15 // Max tilt 15deg
  mouseY.value = y * -15
}

const resetTilt = () => {
  mouseX.value = 0
  mouseY.value = 0
}

const getRelPos = (index) => {
  let diff = index - currentIndex.value
  if (diff > total / 2)  diff -= total
  if (diff < -total / 2) diff += total
  return diff
}

const getCardStyle = (index) => {
  const pos = getRelPos(index)
  const abs = Math.abs(pos)
  
  // Hide distant cards
  if (abs > 2) return { opacity: 0, pointerEvents: 'none', transform: 'translateX(-50%) translateZ(-500px)' }

  const scale = pos === 0 ? 1 : abs === 1 ? 0.85 : 0.7
  const opacity = pos === 0 ? 1 : abs === 1 ? 0.6 : 0.2
  const zIndex = 10 - abs
  
  // Calculate horizontal position with perspective
  const xOffset = pos * 65 // Spacing percentage
  const zOffset = abs * -150 // Depth push
  const rotation = pos * -15 // Fan effect

  // Apply Float + Tilt only to active card
  const activeTiltX = pos === 0 ? tiltY.value : 0
  const activeTiltY = pos === 0 ? tiltX.value : 0
  const activeFloat = floatY.value

  return {
    zIndex,
    opacity,
    transform: `
      translateX(calc(-50% + ${xOffset}%)) 
      translateY(calc(-50% + ${activeFloat}px)) 
      translateZ(${zOffset}px) 
      rotateY(${rotation + activeTiltY}deg) 
      rotateX(${activeTiltX}deg) 
      scale(${scale})
    `
  }
}

const next = () => { currentIndex.value = (currentIndex.value + 1) % total }
const prev = () => { currentIndex.value = (currentIndex.value - 1 + total) % total }
const goTo = (i) => { currentIndex.value = i }

const startAutoplay = () => { autoplayInterval = setInterval(next, 5000) }
const pauseAutoplay = () => { clearInterval(autoplayInterval) }
const resumeAutoplay = () => startAutoplay()

const onTouchStart = (e) => { touchStartX = e.changedTouches[0].clientX }
const onTouchEnd = (e) => {
  const diff = touchStartX - e.changedTouches[0].clientX
  if (Math.abs(diff) > 50) diff > 0 ? next() : prev()
}

const onCardClick = (index) => {
  if (index !== currentIndex.value) goTo(index)
}

onMounted(() => {
  startAutoplay()
  rafId = requestAnimationFrame(updatePhysics)
})

onUnmounted(() => {
  clearInterval(autoplayInterval)
  if (rafId) cancelAnimationFrame(rafId)
})
</script>

<style scoped>
.banner-slider {
  position: relative;
  width: 100%;
  height: 220px;
  overflow: visible;
  user-select: none;
  perspective: 1200px;
  margin: 10px 0 25px;
}

@media (min-width: 480px)  { .banner-slider { height: 240px; } }
@media (min-width: 1024px) { .banner-slider { height: 260px; } }

/* Background Decoration */
.slider-bg-decor {
  position: absolute;
  inset: -20px;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
  opacity: 0.5;
}

.decor-ring {
  position: absolute;
  border-radius: 50%;
  border: 1px solid rgba(22, 163, 74, 0.1);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
}

.ring-1 { width: 300px; height: 300px; animation: pulse-slow 8s ease-in-out infinite; }
.ring-2 { width: 500px; height: 500px; animation: pulse-slow 12s ease-in-out infinite reverse; }

@keyframes pulse-slow {
  0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.3; }
  50% { transform: translate(-50%, -50%) scale(1.1); opacity: 0.6; }
}

.cards-track {
  position: relative;
  z-index: 2;
  width: 100%; height: 100%;
  transform-style: preserve-3d;
}

.card-wrapper {
  position: absolute;
  width: 80%;
  top: 50%; left: 50%;
  transform-origin: center center;
  transition: 
    transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
    opacity 0.6s ease;
  will-change: transform, opacity;
  aspect-ratio: 16 / 7;
}

@media (min-width: 480px) { .card-wrapper { width: 72%; } }

.card {
  width: 100%; height: 100%;
  border-radius: 20px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  background: #111;
  transition: box-shadow 0.4s ease;
}

.card--active {
  box-shadow: 0 25px 60px rgba(22, 163, 74, 0.25);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  display: block;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%);
  pointer-events: none;
}

.card-glass-shine {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 40%);
  pointer-events: none;
}

/* Dots Styling */
.dots {
  position: absolute;
  bottom: -20px; left: 0; right: 0;
  display: flex; justify-content: center;
  z-index: 10;
}

.dots-container {
  display: flex;
  gap: 8px;
  background: rgba(0, 0, 0, 0.05);
  padding: 6px 12px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
}

.dark .dots-container { background: rgba(255, 255, 255, 0.05); }

.dot-pill {
  width: 6px; height: 6px;
  border-radius: 10px;
  background: rgba(22, 163, 74, 0.1);
  border: none; padding: 0;
  cursor: pointer;
  transition: all 0.4s var(--ease-spring);
  display: flex; align-items: center; justify-content: center;
}

.dot-pill--active {
  width: 20px;
  background: #16a34a;
}

.dot-inner {
  width: 100%; height: 100%;
  border-radius: inherit;
  background: inherit;
}
</style>