<template>
  <span 
    class="inline-flex items-center gap-1 px-2 py-1 rounded-md border font-medium text-xs"
    :class="badgeConfig.className"
  >
    <component :is="badgeConfig.icon" :size="size === 'sm' ? 12 : 14" />
    {{ badgeConfig.label }}
  </span>
</template>

<script setup>
import { computed } from 'vue'
import { CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-vue-next'

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
    icon: CheckCircle2,
    className: 'bg-success-light text-success border-success/20',
  },
  pending: {
    label: 'Menunggu',
    icon: Clock,
    className: 'bg-warning-light text-warning border-warning/20',
  },
  failed: {
    label: 'Gagal',
    icon: XCircle,
    className: 'bg-error-light text-error border-error/20',
  },
  processing: {
    label: 'Diproses',
    icon: AlertCircle,
    className: 'bg-info-light text-info border-info/20',
  },
}

const badgeConfig = computed(() => config[props.status])
</script>
