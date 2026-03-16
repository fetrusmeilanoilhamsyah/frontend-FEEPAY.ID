<template>
  <span 
    class="status-badge"
    :class="[badgeConfig.className, size]"
  >
    <component :is="badgeConfig.icon" :size="size === 'sm' ? 10 : 12" stroke-width="3" />
    {{ badgeConfig.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { Check, Clock, X, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  status: {
    type: String,
    required: true,
    validator: (val) => ['success', 'pending', 'failed', 'processing'].includes(val)
  },
  size: {
    type: String,
    default: 'md',
    validator: (val) => ['sm', 'md'].includes(val)
  }
})

const config = {
  success: {
    label: 'Berhasil',
    icon: Check,
    className: 'status-success',
  },
  pending: {
    label: 'Menunggu',
    icon: Clock,
    className: 'status-pending',
  },
  failed: {
    label: 'Gagal',
    icon: X,
    className: 'status-failed',
  },
  processing: {
    label: 'Diproses',
    icon: AlertCircle,
    className: 'status-processing',
  },
}

const badgeConfig = computed(() => config[props.status])
</script>

<style scoped>
.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-radius: 6px;
  transition: all 0.3s var(--ease-out-expo);
}

.status-badge.md {
  font-size: 0.625rem;
  padding: 3px 8px;
}

.status-badge.sm {
  font-size: 0.55rem;
  padding: 2px 6px;
}

.status-success {
  background: var(--primary-muted, #F0FDF4);
  color: var(--primary, #00880D);
  border: 1px solid rgba(0, 136, 13, 0.1);
}

.status-pending {
  background: #FFFBEB;
  color: #D97706;
  border: 1px solid rgba(217, 119, 6, 0.1);
}

.status-failed {
  background: #FEF2F2;
  color: #EF4444;
  border: 1px solid rgba(239, 68, 68, 0.1);
}

.status-processing {
  background: #F0F9FF;
  color: #00AED6;
  border: 1px solid rgba(0, 174, 214, 0.1);
}

.dark .status-badge {
  background: rgba(255, 255, 255, 0.03);
}

.dark .status-success { color: #00C21A; border-color: rgba(0, 194, 26, 0.2); }
.dark .status-pending { color: #FBBF24; border-color: rgba(251, 191, 36, 0.2); }
.dark .status-failed  { color: #F87171; border-color: rgba(248, 113, 113, 0.2); }
.dark .status-processing { color: #38BDF8; border-color: rgba(56, 189, 248, 0.2); }
</style>
