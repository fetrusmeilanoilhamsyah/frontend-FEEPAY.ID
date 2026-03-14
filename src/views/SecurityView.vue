<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Keamanan</h1>
          <p class="header-sub">Kelola keamanan akun Anda</p>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- Change Password -->
      <div class="card">
        <div class="card-header-row">
          <div class="card-icon-wrap" style="background: #FEE2E2;">
            <KeyRound :size="18" style="color: #dc2626;" />
          </div>
          <div>
            <h2 class="card-title">Ubah Password</h2>
            <p class="card-sub">Gunakan password yang kuat dan unik</p>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Password Lama</label>
          <div class="input-wrap" :class="{ focused: focused === 'old' }">
            <Lock :size="16" class="input-icon" />
            <input
              v-model="form.old_password"
              :type="show.old ? 'text' : 'password'"
              placeholder="Masukkan password lama"
              class="field-input"
              @focus="focused = 'old'"
              @blur="focused = ''"
            />
            <button @click="show.old = !show.old" class="toggle-btn" tabindex="-1">
              <Eye v-if="!show.old" :size="15" />
              <EyeOff v-else :size="15" />
            </button>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Password Baru</label>
          <div class="input-wrap" :class="{ focused: focused === 'new' }">
            <Lock :size="16" class="input-icon" />
            <input
              v-model="form.new_password"
              :type="show.new ? 'text' : 'password'"
              placeholder="Min. 8 karakter"
              class="field-input"
              @focus="focused = 'new'"
              @blur="focused = ''"
            />
            <button @click="show.new = !show.new" class="toggle-btn" tabindex="-1">
              <Eye v-if="!show.new" :size="15" />
              <EyeOff v-else :size="15" />
            </button>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label">Konfirmasi Password Baru</label>
          <div class="input-wrap" :class="{ focused: focused === 'confirm', invalid: confirmInvalid }">
            <Lock :size="16" class="input-icon" />
            <input
              v-model="form.confirm_password"
              :type="show.confirm ? 'text' : 'password'"
              placeholder="Ulangi password baru"
              class="field-input"
              @focus="focused = 'confirm'"
              @blur="focused = ''"
            />
            <button @click="show.confirm = !show.confirm" class="toggle-btn" tabindex="-1">
              <Eye v-if="!show.confirm" :size="15" />
              <EyeOff v-else :size="15" />
            </button>
          </div>
          <p v-if="confirmInvalid" class="field-error">Password tidak cocok.</p>
        </div>

        <!-- Password Strength -->
        <div v-if="form.new_password" class="strength-wrap">
          <div class="strength-bars">
            <div v-for="i in 4" :key="i" class="strength-bar" :class="{ active: strength >= i, [strengthLevel]: strength >= i }" />
          </div>
          <span class="strength-label" :class="strengthLevel">{{ strengthText }}</span>
        </div>

        <div v-if="pwError" class="alert-error">{{ pwError }}</div>
        <div v-if="pwSuccess" class="alert-success">{{ pwSuccess }}</div>

        <button @click="changePassword" :disabled="savingPw || !canChangePw" class="btn-primary">
          <Loader v-if="savingPw" :size="17" class="spin" />
          <ShieldCheck v-else :size="17" />
          {{ savingPw ? 'Menyimpan...' : 'Ubah Password' }}
        </button>
      </div>

      <!-- Active Sessions -->
      <div class="card">
        <div class="card-header-row">
          <div class="card-icon-wrap" style="background: #FEF3C7;">
            <MonitorSmartphone :size="18" style="color: #d97706;" />
          </div>
          <div>
            <h2 class="card-title">Sesi Aktif</h2>
            <p class="card-sub">Kelola perangkat yang masuk ke akun Anda</p>
          </div>
        </div>

        <div class="session-item">
          <div class="session-icon">
            <Monitor :size="18" style="color: #6b7280;" />
          </div>
          <div class="session-info">
            <span class="session-device">Perangkat Ini</span>
            <span class="session-detail">{{ sessionInfo }}</span>
          </div>
          <span class="session-badge">Aktif</span>
        </div>

        <button @click="logoutAll" :disabled="loggingOut" class="btn-danger">
          <Loader v-if="loggingOut" :size="17" class="spin" />
          <LogOut v-else :size="17" />
          Keluar dari Semua Perangkat
        </button>
      </div>

      <!-- Danger Zone -->
      <div class="card danger-card">
        <div class="card-header-row">
          <div class="card-icon-wrap" style="background: #FEE2E2;">
            <AlertTriangle :size="18" style="color: #dc2626;" />
          </div>
          <div>
            <h2 class="card-title" style="color: #dc2626;">Zona Berbahaya</h2>
            <p class="card-sub">Tindakan ini tidak dapat dibatalkan</p>
          </div>
        </div>

        <div class="danger-desc">
          Menghapus akun akan menghapus semua data Anda secara permanen, termasuk riwayat transaksi. Pastikan Anda telah mencatat informasi penting sebelum melanjutkan.
        </div>

        <button class="btn-ghost-danger" @click="showDeleteConfirm = true">
          <Trash2 :size="17" />
          Hapus Akun Saya
        </button>
      </div>

    </div>

    <!-- Delete Confirm Modal -->
    <teleport to="body">
      <transition name="modal">
        <div v-if="showDeleteConfirm" class="modal-overlay" @click="showDeleteConfirm = false">
          <div class="modal-box" @click.stop>
            <div class="modal-header">
              <h2 class="modal-title">Konfirmasi Hapus Akun</h2>
              <button @click="showDeleteConfirm = false" class="modal-close">
                <X :size="18" />
              </button>
            </div>
            <div class="modal-body">
              <p class="modal-desc">Ketik <strong>HAPUS</strong> untuk mengonfirmasi penghapusan akun Anda secara permanen.</p>
              <input v-model="deleteConfirmText" type="text" placeholder="HAPUS" class="delete-input" />
            </div>
            <div class="modal-footer">
              <button @click="showDeleteConfirm = false" class="btn-ghost">Batal</button>
              <button @click="deleteAccount" :disabled="deleteConfirmText !== 'HAPUS'" class="btn-danger-solid">
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      </transition>
    </teleport>

  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowLeft, Lock, Eye, EyeOff, ShieldCheck, MonitorSmartphone, Monitor, LogOut, AlertTriangle, Trash2, X, KeyRound, Loader } from 'lucide-vue-next'
import { useCustomerAuth } from '../composables/useCustomerAuth'
import api from '../services/api'

const router = useRouter()
const { logout } = useCustomerAuth()

const focused          = ref('')
const savingPw         = ref(false)
const loggingOut       = ref(false)
const pwError          = ref('')
const pwSuccess        = ref('')
const showDeleteConfirm = ref(false)
const deleteConfirmText = ref('')

const show = reactive({ old: false, new: false, confirm: false })

const form = reactive({
  old_password:     '',
  new_password:     '',
  confirm_password: '',
})

const sessionInfo = computed(() => {
  const ua  = navigator.userAgent
  const dev = /Mobile/i.test(ua) ? 'Mobile' : 'Desktop'
  return `${dev} · ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`
})

const confirmInvalid = computed(() => form.confirm_password && form.new_password !== form.confirm_password)

const strength = computed(() => {
  const p = form.new_password
  let s = 0
  if (p.length >= 8)           s++
  if (/[A-Z]/.test(p))         s++
  if (/[0-9]/.test(p))         s++
  if (/[^A-Za-z0-9]/.test(p)) s++
  return s
})
const strengthLevel = computed(() => ['', 'weak', 'fair', 'good', 'strong'][strength.value])
const strengthText  = computed(() => ['', 'Lemah', 'Cukup', 'Baik', 'Sangat Kuat'][strength.value])

const canChangePw = computed(() =>
  form.old_password && form.new_password.length >= 8 && form.new_password === form.confirm_password
)

const changePassword = async () => {
  pwError.value   = ''
  pwSuccess.value = ''
  savingPw.value  = true
  try {
    await api.customerAuth.changePassword({
      old_password:              form.old_password,
      new_password:              form.new_password,
      new_password_confirmation: form.confirm_password,
    })
    pwSuccess.value         = 'Password berhasil diubah.'
    form.old_password       = ''
    form.new_password       = ''
    form.confirm_password   = ''
  } catch (err) {
    pwError.value = err?.message || 'Gagal mengubah password.'
  } finally {
    savingPw.value = false
  }
}

const logoutAll = async () => {
  loggingOut.value = true
  await logout()
  router.push('/profile')
}

const deleteAccount = async () => {
  try {
    await api.customerAuth.deleteAccount()
    await logout()
    router.push('/')
  } catch {
    showDeleteConfirm.value = false
  }
}
</script>

<style scoped>
.page { min-height: 100vh; background: var(--background, #f8fafc); padding-bottom: 80px; }

.page-header { position: sticky; top: 0; z-index: 40; background: var(--card, #fff); border-bottom: 1px solid var(--border, #e5e7eb); }
.header-inner { max-width: 600px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: none; background: transparent; color: var(--muted-foreground, #6b7280); cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
.back-btn:hover { background: var(--muted, #f3f4f6); }
.header-title { font-size: 1.0625rem; font-weight: 700; color: var(--foreground, #111827); margin: 0; }
.header-sub   { font-size: 0.75rem; color: var(--muted-foreground, #6b7280); margin: 0; }

.page-content { max-width: 600px; margin: 0 auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; }

.card { background: var(--card, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 18px; padding: 18px; display: flex; flex-direction: column; gap: 14px; }
.card-header-row { display: flex; align-items: flex-start; gap: 12px; }
.card-icon-wrap { width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.card-title { font-size: 0.9375rem; font-weight: 700; color: var(--foreground, #111827); margin: 0; }
.card-sub  { font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); margin: 2px 0 0; }

.field-group { display: flex; flex-direction: column; gap: 6px; }
.field-label { font-size: 0.75rem; font-weight: 600; color: var(--muted-foreground, #6b7280); }
.input-wrap { display: flex; align-items: center; gap: 10px; background: var(--muted, #f9fafb); border: 1.5px solid var(--border, #e5e7eb); border-radius: 12px; padding: 0 12px; height: 46px; transition: border-color 0.2s, box-shadow 0.2s; }
.input-wrap.focused { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.08); background: var(--card, #fff); }
.input-wrap.invalid { border-color: #ef4444; box-shadow: 0 0 0 3px rgba(239,68,68,0.08); }
.input-icon { color: var(--muted-foreground, #9ca3af); flex-shrink: 0; }
.field-input { flex: 1; background: transparent; border: none; outline: none; font-size: 0.875rem; color: var(--foreground, #111827); }
.field-error { font-size: 0.6875rem; color: #ef4444; }
.toggle-btn { background: none; border: none; cursor: pointer; color: var(--muted-foreground, #9ca3af); display: flex; padding: 0; }

/* Password Strength */
.strength-wrap { display: flex; align-items: center; gap: 8px; }
.strength-bars { display: flex; gap: 4px; }
.strength-bar { height: 4px; width: 40px; border-radius: 99px; background: var(--border, #e5e7eb); transition: background 0.2s; }
.strength-bar.active.weak   { background: #ef4444; }
.strength-bar.active.fair   { background: #f59e0b; }
.strength-bar.active.good   { background: #22c55e; }
.strength-bar.active.strong { background: #16a34a; }
.strength-label { font-size: 0.6875rem; font-weight: 600; }
.strength-label.weak   { color: #ef4444; }
.strength-label.fair   { color: #f59e0b; }
.strength-label.good   { color: #22c55e; }
.strength-label.strong { color: #16a34a; }

/* Session */
.session-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; background: var(--muted, #f9fafb); border-radius: 12px; }
.session-icon { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; background: var(--card, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 10px; flex-shrink: 0; }
.session-info { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.session-device { font-size: 0.8125rem; font-weight: 600; color: var(--foreground, #111827); }
.session-detail { font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); }
.session-badge  { font-size: 0.6rem; font-weight: 700; padding: 3px 9px; border-radius: 999px; background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; white-space: nowrap; }

/* Danger */
.danger-card { border-color: #fecaca; }
.danger-desc { font-size: 0.8125rem; color: var(--muted-foreground, #6b7280); line-height: 1.6; }

/* Alerts */
.alert-error   { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 10px 14px; font-size: 0.8125rem; color: #dc2626; }
.alert-success { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 10px 14px; font-size: 0.8125rem; color: #15803d; }

/* Buttons */
.btn-primary { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: #16a34a; color: #fff; border: none; border-radius: 12px; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.btn-primary:hover:not(:disabled) { background: #15803d; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-danger { display: flex; align-items: center; justify-content: center; gap: 8px; width: 100%; padding: 12px; background: #fef2f2; color: #dc2626; border: 1.5px solid #fecaca; border-radius: 12px; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.btn-danger:hover:not(:disabled) { background: #fee2e2; }
.btn-danger:disabled { opacity: 0.55; cursor: not-allowed; }
.btn-ghost-danger { display: flex; align-items: center; gap: 8px; background: none; border: 1.5px dashed #fca5a5; color: #dc2626; border-radius: 12px; padding: 11px 16px; font-size: 0.875rem; font-weight: 700; cursor: pointer; width: 100%; justify-content: center; transition: background 0.2s; }
.btn-ghost-danger:hover { background: #fef2f2; }

/* Modal */
.modal-overlay { position: fixed; inset: 0; z-index: 50; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px); display: flex; align-items: center; justify-content: center; padding: 16px; }
.modal-box { background: var(--card, #fff); border-radius: 20px; width: 100%; max-width: 400px; overflow: hidden; }
.modal-header { display: flex; align-items: center; justify-content: space-between; padding: 20px 20px 0; }
.modal-title { font-size: 1rem; font-weight: 800; color: #dc2626; margin: 0; }
.modal-close { width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; border-radius: 8px; border: none; background: var(--muted, #f3f4f6); color: var(--muted-foreground, #6b7280); cursor: pointer; }
.modal-body { padding: 16px 20px; display: flex; flex-direction: column; gap: 12px; }
.modal-desc { font-size: 0.875rem; color: var(--muted-foreground, #374151); line-height: 1.5; }
.delete-input { width: 100%; height: 44px; border: 1.5px solid #fecaca; border-radius: 10px; padding: 0 14px; font-size: 0.875rem; color: var(--foreground, #111827); background: var(--muted, #fef2f2); outline: none; font-weight: 700; letter-spacing: 2px; box-sizing: border-box; }
.modal-footer { padding: 12px 20px 20px; display: flex; gap: 10px; }
.btn-ghost { flex: 1; padding: 11px; background: var(--muted, #f3f4f6); color: var(--foreground, #374151); border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 600; cursor: pointer; }
.btn-danger-solid { flex: 1; padding: 11px; background: #dc2626; color: #fff; border: none; border-radius: 10px; font-size: 0.875rem; font-weight: 700; cursor: pointer; transition: background 0.2s; }
.btn-danger-solid:disabled { opacity: 0.4; cursor: not-allowed; }
.btn-danger-solid:hover:not(:disabled) { background: #b91c1c; }

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.modal-enter-active,.modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from,.modal-leave-to { opacity: 0; }
</style>
