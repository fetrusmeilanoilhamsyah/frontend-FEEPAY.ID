<template>
  <canvas ref="canvasRef" :class="['particle-canvas', { 'is-absolute': absolute }]" />
</template>

<script setup>
import { ref, onMounted, onUnmounted, defineProps } from 'vue'

const props = defineProps({
  particleCount: { type: Number, default: 60 },
  absolute: { type: Boolean, default: false }
})

const canvasRef = ref(null)
let ctx = null
let animationFrame = null
let particles = []

const MAX_SPEED = 0.2

class Particle {
  constructor(w, h) {
    this.resett(w, h)
  }

  resett(w, h) {
    this.x = Math.random() * w
    this.y = Math.random() * h
    this.size = Math.random() * 1.5 + 0.5
    this.speedX = (Math.random() - 0.5) * MAX_SPEED
    this.speedY = (Math.random() - 0.5) * MAX_SPEED
    this.opacity = Math.random() * 0.4 + 0.1
  }

  update(w, h) {
    this.x += this.speedX
    this.y += this.speedY
    if (this.x < 0 || this.x > w || this.y < 0 || this.y > h) {
      this.resett(w, h)
    }
  }

  draw() {
    ctx.fillStyle = `rgba(100, 116, 139, ${this.opacity})`
    ctx.beginPath()
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
    ctx.fill()
  }
}

const init = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  ctx = canvas.getContext('2d')
  resize()
  particles = Array.from({ length: props.particleCount }, () => new Particle(canvas.width, canvas.height))
  animate()
}

const resize = () => {
  const canvas = canvasRef.value
  if (!canvas) return
  if (props.absolute) {
    const parent = canvas.parentElement
    canvas.width = parent.offsetWidth
    canvas.height = parent.offsetHeight
  } else {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
}

const animate = () => {
  if (!ctx) return
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  particles.forEach(p => {
    p.update(ctx.canvas.width, ctx.canvas.height)
    p.draw()
  })
  animationFrame = requestAnimationFrame(animate)
}

onMounted(() => {
  init()
  window.addEventListener('resize', resize)
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrame)
  window.removeEventListener('resize', resize)
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  top: 0; left: 0;
  width: 100vw; height: 100vh;
  pointer-events: none;
  z-index: -1;
  opacity: 0.5;
}

.particle-canvas.is-absolute {
  position: absolute;
  width: 100%; height: 100%;
}
</style>
