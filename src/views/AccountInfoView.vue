<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Informasi Akun</h1>
          <p class="header-sub">Kelola data profil Anda</p>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- Avatar Section -->
      <div class="avatar-section">
        <div class="avatar-ring">
          <div class="avatar-inner">
            <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full object-cover" alt="avatar" />
            <User v-else :size="34" class="avatar-icon" />
          </div>
        </div>
        <span class="avatar-name">{{ form.name || 'Pengguna FeePay' }}</span>
        <span class="avatar-sub">{{ user?.email || user?.phone || '-' }}</span>
      </div>

      <!-- Form -->
      <div class="card">
        <h2 class="card-title">Data Pribadi</h2>

        <div class="field-group">
          <label class="field-label">Nama Lengkap</label>
          <div class="input-wrap" :class="{ focused: focused === 'name' }">
            <User :size="16" class="input-icon" />
            <input
              v-model="form.name"
              type="text"
              placeholder="Masukkan nama lengkap"
              class="field-input"
              @focus="focused = 'name'"
              @blur="focused = ''"
            />
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Email</label>
          <div class="input-wrap" :class="{ focused: focused === 'email', disabled: !!user?.google_id }">
            <Mail :size="16" class="input-icon" />
            <input
              v-model="form.email"
              type="email"
              placeholder="email@contoh.com"
              class="field-input"
              :disabled="!!user?.google_id"
              @focus="focused = 'email'"
              @blur="focused = ''"
            />
            <Lock v-if="user?.google_id" :size="14" class="lock-icon" />
          </div>
          <p v-if="user?.google_id" class="field-hint">Email dikunci karena akun terhubung via Google.</p>
        </div>

        <div class="field-group">
          <label class="field-label">Nomor WhatsApp</label>
          <div class="input-wrap" :class="{ focused: focused === 'phone' }">
            <Phone :size="16" class="input-icon" />
            <input
              v-model="form.phone"
              type="tel"
              placeholder="08xxxxxxxxxx"
              class="field-input"
              @focus="focused = 'phone'"
              @blur="focused = ''"
            />
          </div>
        </div>
      </div>

      <!-- Provider Badge -->
      <div class="card provider-card">
        <h2 class="card-title">Metode Login</h2>
        <div class="provider-item">
          <div class="provider-icon" :style="{ background: providerBg }">
            <component :is="providerIcon" :size="18" :class="providerColor" />
          </div>
          <div class="provider-info">
            <span class="provider-name">{{ providerLabel }}</span>
            <span class="provider-sub">Akun terhubung</span>
          </div>
          <span class="provider-badge">Aktif</span>
        </div>
      </div>

      <!-- Error / Success -->
      <div v-if="error" class="alert-error">{{ error }}</div>
      <div v-if="success" class="alert-success">{{ success }}</div>

      <!-- Save Button -->
      <button @click="saveProfile" :disabled="saving" class="btn-primary">
        <Loader v-if="saving" :size="18" class="spin" />
        <Save v-else :size="18" />
        {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ArrowLeft, User, Mail, Phone, Lock, Save, Loader } from 'lucide-vue-next'
import { useCustomerAuth } from '../composables/useCustomerAuth'
import api from '../services/api'

const { user } = useCustomerAuth()

const focused = ref('')
const saving  = ref(false)
const error   = ref('')
const success = ref('')

const form = reactive({
  name:  '',
  email: '',
  phone: '',
})

onMounted(() => {
  form.name  = user.value?.name  || ''
  form.email = user.value?.email || ''
  form.phone = user.value?.phone || ''
})

const providerLabel = computed(() => {
  if (user.value?.google_id) return 'Google'
  if (user.value?.phone)     return 'WhatsApp OTP'
  return 'Email & Password'
})
const providerBg    = computed(() => user.value?.google_id ? '#FEE2E2' : user.value?.phone ? '#D1FAE5' : '#DBEAFE')
const providerColor = computed(() => user.value?.google_id ? 'text-red-500'  : user.value?.phone ? 'text-green-600' : 'text-blue-600')
const providerIcon  = computed(() => user.value?.phone ? Phone : Mail)

const saveProfile = async () => {
  error.value   = ''
  success.value = ''
  saving.value  = true
  try {
    await api.customerAuth.updateProfile({
      name:  form.name,
      phone: form.phone,
      ...(user.value?.google_id ? {} : { email: form.email }),
    })
    success.value = 'Profil berhasil diperbarui.'
  } catch (err) {
    error.value = err?.message || 'Gagal menyimpan perubahan.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.page { min-height: 100vh; background: var(--background, #f8fafc); padding-bottom: 80px; }

/* Header */
.page-header { position: sticky; top: 0; z-index: 40; background: var(--card, #fff); border-bottom: 1px solid var(--border, #e5e7eb); }
.header-inner { max-width: 600px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: none; background: transparent; color: var(--muted-foreground, #6b7280); cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
.back-btn:hover { background: var(--muted, #f3f4f6); }
.header-title { font-size: 1.0625rem; font-weight: 700; color: var(--foreground, #111827); margin: 0; }
.header-sub   { font-size: 0.75rem; color: var(--muted-foreground, #6b7280); margin: 0; }

/* Content */
.page-content { max-width: 600px; margin: 0 auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; }

/* Avatar */
.avatar-section { display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 8px 0; }
.avatar-ring { width: 80px; height: 80px; border-radius: 50%; padding: 3px; background: linear-gradient(135deg, #16a34a, #4ade80); }
.avatar-inner { width: 100%; height: 100%; border-radius: 50%; background: var(--card, #fff); display: flex; align-items: center; justify-content: center; overflow: hidden; }
.avatar-icon { color: var(--muted-foreground, #9ca3af); }
.avatar-name { font-size: 1rem; font-weight: 700; color: var(--foreground, #111827); }
.avatar-sub  { font-size: 0.75rem; color: var(--muted-foreground, #9ca3af); }

/* Card */
.card { background: var(--card, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 18px; padding: 18px; display: flex; flex-direction: column; gap: 16px; }
.card-title { font-size: 0.875rem; font-weight: 700; color: var(--foreground, #111827); margin: 0; }

/* Fields */
.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 0.75rem; font-weight: 600; color: var(--muted-foreground, #6b7280); }
.input-wrap { display: flex; align-items: center; gap: 10px; background: var(--muted, #f9fafb); border: 1.5px solid var(--border, #e5e7eb); border-radius: 12px; padding: 0 12px; height: 46px; transition: border-color 0.2s, box-shadow 0.2s; }
.input-wrap.focused { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.08); background: var(--card, #fff); }
.input-wrap.disabled { opacity: 0.7; cursor: not-allowed; }
.input-icon { color: var(--muted-foreground, #9ca3af); flex-shrink: 0; }
.lock-icon  { color: var(--muted-foreground, #9ca3af); margin-left: auto; flex-shrink: 0; }
.field-input { flex: 1; background: transparent; border: none; outline: none; font-size: 0.875rem; color: var(--foreground, #111827); }
.field-input:disabled { cursor: not-allowed; color: var(--muted-foreground, #9ca3af); }
.field-hint { font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); }

/* Provider */
.provider-card { }
.provider-item { display: flex; align-items: center; gap: 12px; }
.provider-icon { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.provider-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.provider-name { font-size: 0.875rem; font-weight: 600; color: var(--foreground, #111827); }
.provider-sub  { font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); }
.provider-badge { font-size: 0.6rem; font-weight: 700; padding: 3px 10px; border-radius: 999px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; white-space: nowrap; }

/* Alerts */
.alert-error   { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 12px 14px; font-size: 0.8125rem; color: #dc2626; }
.alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 12px 14px; font-size: 0.8125rem; color: #15803d; }

/* Button */
.btn-primary { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 13px; background: #16a34a; color: #fff; border: none; border-radius: 12px; font-size: 0.9375rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover:not(:disabled) { background: #15803d; }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Dark mode */
@media (prefers-color-scheme: dark) {
  .field-input { color-scheme: dark; }
}
</style>
