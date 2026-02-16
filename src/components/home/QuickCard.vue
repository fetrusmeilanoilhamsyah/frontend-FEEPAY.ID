<template>
  <router-link :to="to" class="quick-card">
    <div class="relative">
      <div class="icon-wrap" :style="iconStyle">
        <component :is="icon" :size="22" class="text-white" />
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
  primary: 'linear-gradient(135deg, #60a5fa, #2563eb)',
  green:   'linear-gradient(135deg, #4ade80, #16a34a)',
  orange:  'linear-gradient(135deg, #fb923c, #ea580c)',
  purple:  'linear-gradient(135deg, #c084fc, #9333ea)',
  pink:    'linear-gradient(135deg, #f472b6, #db2777)',
  cyan:    'linear-gradient(135deg, #22d3ee, #3b82f6)',
}

const iconStyle = computed(() => ({
  background: colorMap[props.color] || colorMap.primary
}))
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
  transition: background 0.15s, transform 0.15s;
  -webkit-tap-highlight-color: transparent;
}

.quick-card:hover { background: rgb(243 244 246); }
.dark .quick-card:hover { background: rgb(31 41 55); }
.quick-card:active { transform: scale(0.93); }

.icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  transition: transform 0.15s;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
}

.quick-card:hover .icon-wrap { transform: scale(1.06); }

.badge {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(90deg, #00c853, #00e676);
  color: white;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.02em;
  padding: 1px 5px;
  border-radius: 4px;
  white-space: nowrap;
  font-family: 'Outfit', sans-serif;
  box-shadow: 0 1px 4px rgba(0, 200, 83, 0.4);
}

.card-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: rgb(31 41 55);
  line-height: 1.3;
  font-family: 'Outfit', sans-serif;
}

.dark .card-label { color: rgb(229 231 235); }

@media (min-width: 640px) {
  .icon-wrap { width: 56px; height: 56px; }
  .card-label { font-size: 0.8125rem; }
}
</style>