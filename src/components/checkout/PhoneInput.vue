<template>
  <div class="phone-input-wrapper">
    <label class="input-label">
      Nomor HP
      <span class="text-error">*</span>
    </label>

    <div class="input-container">
      <div class="prefix">+62</div>
      
      <input
        :value="modelValue"
        @input="handleInput"
        type="tel"
        class="phone-input"
        placeholder="81234567890"
        maxlength="13"
      />

      <OperatorBadge 
        v-if="detectedOperator" 
        :operator="detectedOperator"
        class="operator-badge"
      />
    </div>

    <p v-if="modelValue && modelValue.length >= 10" class="input-hint">
      Nomor: 0{{ modelValue }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import OperatorBadge from './OperatorBadge.vue'
import { useOperatorDetector } from '@/composables/useOperatorDetector'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const { detectOperator } = useOperatorDetector()

const detectedOperator = computed(() => {
  if (!props.modelValue || props.modelValue.length < 3) return null
  return detectOperator(props.modelValue)
})

const handleInput = (e) => {
  const value = e.target.value.replace(/\D/g, '')
  emit('update:modelValue', value)
}
</script>

<style scoped>
.phone-input-wrapper {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 0.5rem;
}

.input-container {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--input-background);
  border: 2px solid var(--border);
  border-radius: 12px;
  transition: all 0.2s;
}

.input-container:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.prefix {
  padding: 0 0 0 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: var(--muted-foreground);
  font-family: 'JetBrains Mono', monospace;
}

.phone-input {
  flex: 1;
  height: 48px;
  padding: 0 0.75rem;
  font-size: 1rem;
  font-weight: 500;
  font-family: 'JetBrains Mono', monospace;
  color: var(--foreground);
  background: transparent;
  border: none;
  outline: none;
}

.phone-input::placeholder {
  color: var(--muted-foreground);
  font-weight: 400;
}

.operator-badge {
  margin-right: 0.75rem;
}

.input-hint {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--muted-foreground);
}
</style>