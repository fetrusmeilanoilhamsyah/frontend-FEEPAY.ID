<template>
  <div v-if="numbers.length > 0" class="recent-numbers">
    <h3 class="section-title">Nomor Terakhir</h3>
    
    <div class="numbers-scroll">
      <button
        v-for="(number, index) in numbers"
        :key="index"
        @click="handleSelect(number)"
        class="number-chip"
      >
        <User :size="14" class="text-muted-foreground" />
        <span class="number-text">0{{ number }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { User } from 'lucide-vue-next'

defineProps({
  numbers: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['select'])

const handleSelect = (number) => {
  emit('select', number)
}
</script>

<style scoped>
.recent-numbers {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 0.75rem;
}

.numbers-scroll {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  scrollbar-width: none;
}

.numbers-scroll::-webkit-scrollbar {
  display: none;
}

.number-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0.75rem;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 10px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--foreground);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s;
}

.number-chip:hover {
  border-color: var(--primary);
  background: var(--card-hover);
}

.number-chip:active {
  transform: scale(0.95);
}

.number-text {
  font-family: 'JetBrains Mono', monospace;
}
</style>