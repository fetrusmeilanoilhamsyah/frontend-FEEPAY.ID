<template>
  <router-link
    :to="to"
    class="quick-card group"
    :class="cardClass"
  >
    <!-- Icon Container -->
    <div class="icon-container" :class="iconBgClass">
      <component :is="icon" :size="iconSize" :class="iconColorClass" />
    </div>

    <!-- Label -->
    <span class="card-label">{{ label }}</span>

    <!-- Hover Arrow -->
    <div class="hover-arrow">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  icon: {
    type: [Object, String],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  color: {
    type: String,
    default: 'primary' // primary, green, blue, orange, purple, pink
  },
  iconSize: {
    type: Number,
    default: 28
  }
})

const colorConfig = {
  primary: {
    card: 'hover:bg-blue-50 dark:hover:bg-blue-950/10',
    iconBg: 'bg-gradient-to-br from-blue-500 to-blue-600',
    iconColor: 'text-white',
    border: 'border-blue-100 dark:border-blue-900/30'
  },
  green: {
    card: 'hover:bg-green-50 dark:hover:bg-green-950/10',
    iconBg: 'bg-gradient-to-br from-green-500 to-green-600',
    iconColor: 'text-white',
    border: 'border-green-100 dark:border-green-900/30'
  },
  orange: {
    card: 'hover:bg-orange-50 dark:hover:bg-orange-950/10',
    iconBg: 'bg-gradient-to-br from-orange-500 to-orange-600',
    iconColor: 'text-white',
    border: 'border-orange-100 dark:border-orange-900/30'
  },
  purple: {
    card: 'hover:bg-purple-50 dark:hover:bg-purple-950/10',
    iconBg: 'bg-gradient-to-br from-purple-500 to-purple-600',
    iconColor: 'text-white',
    border: 'border-purple-100 dark:border-purple-900/30'
  },
  pink: {
    card: 'hover:bg-pink-50 dark:hover:bg-pink-950/10',
    iconBg: 'bg-gradient-to-br from-pink-500 to-pink-600',
    iconColor: 'text-white',
    border: 'border-pink-100 dark:border-pink-900/30'
  },
  cyan: {
    card: 'hover:bg-cyan-50 dark:hover:bg-cyan-950/10',
    iconBg: 'bg-gradient-to-br from-cyan-500 to-cyan-600',
    iconColor: 'text-white',
    border: 'border-cyan-100 dark:border-cyan-900/30'
  }
}

const config = computed(() => colorConfig[props.color] || colorConfig.primary)

const cardClass = computed(() => config.value.card)
const iconBgClass = computed(() => config.value.iconBg)
const iconColorClass = computed(() => config.value.iconColor)
</script>

<style scoped>
.quick-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1.25rem 1rem;
  min-height: 110px;
  
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 16px;
  
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.dark .quick-card {
  background: rgb(15 20 25);
  border-color: rgb(42 49 66);
}

.quick-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  border-color: transparent;
}

.dark .quick-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.quick-card:active {
  transform: translateY(-1px);
}

/* Icon Container */
.icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.quick-card:hover .icon-container {
  transform: scale(1.05);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.16);
}

/* Label */
.card-label {
  font-size: 0.8125rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.3;
  color: rgb(17 24 39);
  letter-spacing: -0.01em;
}

.dark .card-label {
  color: rgb(243 244 246);
}

/* Hover Arrow */
.hover-arrow {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  opacity: 0;
  transform: translateX(-4px);
  transition: all 0.3s ease;
  color: rgb(107 114 128);
}

.dark .hover-arrow {
  color: rgb(156 163 175);
}

.quick-card:hover .hover-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Responsive */
@media (min-width: 640px) {
  .quick-card {
    padding: 1.5rem 1rem;
    min-height: 120px;
  }

  .icon-container {
    width: 56px;
    height: 56px;
  }

  .card-label {
    font-size: 0.875rem;
  }
}
</style>