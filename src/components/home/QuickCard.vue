<template>
  <router-link :to="to" class="quick-card">
    <div class="relative">
      <div class="icon-wrap" :style="iconStyle">
        <div class="icon-glow"></div>
        <component :is="icon" :size="22" class="icon" />
      </div>
      <div v-if="badge" class="badge">{{ badge }}</div>
    </div>
    <span class="card-label">{{ label }}</span>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: { type: [Object, String], required: true },
  label: { type: String, required: true },
  to: { type: String, required: true },
  color: { type: String, default: 'primary' },
  badge: { type: String, default: null }
})

const colorMap = {
  primary: { 
    gradient: 'linear-gradient(135deg, #60a5fa 0%, #3b82f6 50%, #2563eb 100%)',
    shadow: 'rgba(59, 130, 246, 0.25)'
  },
  green: { 
    gradient: 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)',
    shadow: 'rgba(34, 197, 94, 0.25)'
  },
  orange: { 
    gradient: 'linear-gradient(135deg, #fb923c 0%, #f97316 50%, #ea580c 100%)',
    shadow: 'rgba(249, 115, 22, 0.25)'
  },
  purple: { 
    gradient: 'linear-gradient(135deg, #c084fc 0%, #a855f7 50%, #9333ea 100%)',
    shadow: 'rgba(168, 85, 247, 0.25)'
  },
  pink: { 
    gradient: 'linear-gradient(135deg, #f472b6 0%, #ec4899 50%, #db2777 100%)',
    shadow: 'rgba(236, 72, 153, 0.25)'
  },
  cyan: { 
    gradient: 'linear-gradient(135deg, #22d3ee 0%, #06b6d4 50%, #0891b2 100%)',
    shadow: 'rgba(6, 182, 212, 0.25)'
  },
}

const iconStyle = computed(() => {
  const config = colorMap[props.color] || colorMap.primary
  return {
    background: config.gradient,
    '--shadow-color': config.shadow
  }
})
</script>

<style scoped>
.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  position: relative;
}

.quick-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 12px;
  background: transparent;
  transition: background 0.2s;
}

.quick-card:hover::before {
  background: rgba(0, 0, 0, 0.03);
}

.dark .quick-card:hover::before {
  background: rgba(255, 255, 255, 0.05);
}

.quick-card:active {
  transform: scale(0.95);
}

.icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 16px;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 4px 12px var(--shadow-color),
    0 2px 4px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
  overflow: hidden;
}

.icon-wrap::before {
  content: '';
  position: absolute;
  inset: 0;
  background: 
    radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.25) 0%, transparent 60%),
    radial-gradient(circle at 70% 70%, rgba(0, 0, 0, 0.1) 0%, transparent 60%);
  pointer-events: none;
}

.icon-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.3s;
}

.quick-card:hover .icon-glow {
  opacity: 1;
}

.icon {
  position: relative;
  z-index: 1;
  color: white;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
}

.quick-card:hover .icon-wrap {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 8px 20px var(--shadow-color),
    0 4px 8px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.badge {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, #00c853 0%, #00e676 100%);
  color: white;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.03em;
  padding: 2px 6px;
  border-radius: 5px;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
  box-shadow: 
    0 2px 6px rgba(0, 200, 83, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 2;
}

.card-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: rgb(31 41 55);
  line-height: 1.3;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.01em;
  position: relative;
  z-index: 1;
}

.dark .card-label {
  color: rgb(229 231 235);
}

@media (min-width: 640px) {
  .icon-wrap {
    width: 56px;
    height: 56px;
    border-radius: 18px;
  }
  
  .card-label {
    font-size: 0.8125rem;
  }
}
</style>