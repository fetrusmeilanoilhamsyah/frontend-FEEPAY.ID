<template>
  <div v-if="numbers.length > 0" class="recent-numbers">
    <p class="label">Terakhir dipakai</p>
    <div class="chips">
      <button
        v-for="(number, i) in numbers"
        :key="i"
        class="chip"
        @click="$emit('select', number)"
      >
        <User :size="12" />
        <span>{{ formatNumber(number) }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { User } from 'lucide-vue-next'

defineProps({ numbers: { type: Array, default: () => [] } })
defineEmits(['select'])

const formatNumber = (n) => {
  const d = String(n).replace(/\D/g, '').replace(/^0/, '')
  return '0' + d.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
}
</script>

<style scoped>
.recent-numbers { margin-bottom: 4px; }

.label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--muted-foreground);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 8px;
}

.chips {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  padding-bottom: 2px;
}

.chips::-webkit-scrollbar { display: none; }

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.15s;
  font-family: 'JetBrains Mono', monospace;
}

.chip:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.chip:active { transform: scale(0.96); }
</style>