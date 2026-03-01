<template>
  <div class="phone-input-wrapper">
    <label class="input-label">
      Nomor HP <span class="text-error">*</span>
    </label>

    <div class="input-row">
      <div class="input-container" :class="{ 'has-operator': detectedOperator }">
        <span class="prefix">+62</span>
        <input
          :value="modelValue"
          @input="handleInput"
          type="tel"
          class="phone-input"
          placeholder="81234567890"
          maxlength="13"
        />
        <transition name="fade">
          <OperatorBadge
            v-if="detectedOperator"
            :operator="detectedOperator"
            class="operator-badge"
          />
        </transition>
      </div>

      <button
        v-if="hasContactAPI"
        class="contact-btn"
        type="button"
        @click="pickContact"
        title="Pilih dari kontak"
      >
        <BookUser :size="18" />
      </button>
    </div>

    <p v-if="modelValue && modelValue.length >= 10" class="input-hint">
      Nomor: 0{{ modelValue }}
    </p>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { BookUser } from 'lucide-vue-next'
import OperatorBadge from './OperatorBadge.vue'
import { useOperatorDetector } from '@/composables/useOperatorDetector'

const props = defineProps({
  modelValue: { type: String, default: '' }
})

const emit = defineEmits(['update:modelValue'])

const hasContactAPI = ref(false)
const { detectedOperator, detectOperator } = useOperatorDetector()

onMounted(() => {
  hasContactAPI.value = 'contacts' in navigator && 'ContactsManager' in window
})

// Menggunakan watcher untuk mendeteksi nomor setiap kali input berubah
watch(
  () => props.modelValue, 
  (newValue) => {
    // Tambahkan '0' di depan karena input user hanya dimulai setelah '+62'
    const fullNumber = '0' + newValue 
    detectOperator(fullNumber)
  }, 
  { immediate: true }
)

const handleInput = (e) => {
  emit('update:modelValue', e.target.value.replace(/\D/g, ''))
}

const pickContact = async () => {
  try {
    const contacts = await navigator.contacts.select(['tel'], { multiple: false })
    if (contacts?.length && contacts[0].tel?.length) {
      const raw = contacts[0].tel[0].replace(/\D/g, '').replace(/^(62|0)/, '')
      emit('update:modelValue', raw)
    }
  } catch {}
}
</script>

<style scoped>
.phone-input-wrapper { margin-bottom: 1rem; }

.input-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 6px;
}

.text-error { color: #ef4444; margin-left: 2px; }

.input-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.input-container {
  flex: 1;
  display: flex;
  align-items: center;
  background: var(--input-background, var(--card));
  border: 1.5px solid var(--border);
  border-radius: 12px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-container:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 12%, transparent);
}

.prefix {
  padding: 0 0 0 14px;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--muted-foreground);
  font-family: 'JetBrains Mono', monospace;
  flex-shrink: 0;
}

.phone-input {
  flex: 1;
  min-width: 0;
  height: 46px;
  padding: 0 8px 0 10px;
  font-size: 0.95rem;
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
  opacity: 0.6;
}

.operator-badge {
  margin-right: 10px;
  flex-shrink: 0;
}

/* Tombol kontak */
.contact-btn {
  width: 46px;
  height: 46px;
  border-radius: 12px;
  border: 1.5px solid var(--border);
  background: var(--card);
  color: var(--muted-foreground);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.15s;
}

.contact-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
  background: color-mix(in srgb, var(--primary) 6%, var(--card));
}

.input-hint {
  margin-top: 6px;
  font-size: 0.72rem;
  font-family: 'JetBrains Mono', monospace;
  color: var(--muted-foreground);
}

.fade-enter-active, .fade-leave-active { transition: opacity 0.15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>