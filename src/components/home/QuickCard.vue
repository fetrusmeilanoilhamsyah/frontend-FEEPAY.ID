<template>
  <router-link :to="to" class="quick-card">
    <div class="relative">
      <div class="icon-wrap">
        <img :src="img" class="icon-img" alt="" />
      </div>
      <div v-if="badge" class="badge">{{ badge }}</div>
    </div>
    <span class="card-label">{{ label }}</span>
  </router-link>
</template>

<script setup>
const props = defineProps({
  img: { type: String, required: true },
  label: { type: String, required: true },
  to: { type: String, required: true },
  color: { type: String, default: 'primary' },
  badge: { type: String, default: null }
})
</script>

<style scoped>
.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.625rem;
  padding: 1rem 0.5rem;
  border-radius: 16px;
  text-decoration: none;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  -webkit-tap-highlight-color: transparent;
  position: relative;
  background: var(--card);
  border: 1px solid var(--border);
}

.quick-card:hover {
  border-color: var(--primary);
  background: var(--card);
}

.quick-card:active {
  transform: scale(0.95);
}

.icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 18px;
  background: white !important; /* ✅ Background putih solid kayak Gojek */
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.08),
    0 1px 3px rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.dark .icon-wrap {
  background: rgba(255, 255, 255, 0.95) !important; /* Dark mode tetap putih */
}

.icon-img {
  width: 34px;
  height: 34px;
  object-fit: contain;
  position: relative;
  z-index: 1;
}

.quick-card:hover .icon-wrap {
  transform: translateY(-2px) scale(1.05);
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.12),
    0 2px 6px rgba(0, 0, 0, 0.08);
}

.badge {
  position: absolute;
  top: -6px;
  right: -6px;
  background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
  color: white;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.03em;
  padding: 3px 7px;
  border-radius: 6px;
  white-space: nowrap;
  box-shadow: 
    0 2px 8px rgba(16, 185, 129, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  z-index: 3;
  animation: badge-pulse 2s ease-in-out infinite;
}

@keyframes badge-pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.card-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-align: center;
  color: var(--foreground);
  line-height: 1.3;
  position: relative;
  z-index: 1;
}

@media (min-width: 640px) {
  .icon-wrap {
    width: 64px;
    height: 64px;
    border-radius: 20px;
  }

  .icon-img {
    width: 38px;
    height: 38px;
  }
  
  .card-label {
    font-size: 0.8125rem;
  }
}
</style>