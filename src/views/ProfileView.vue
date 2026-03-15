<template>
  <div class="profile-page" ref="profilePageRef">

    <!-- HEADER — selaras HomeView -->
    <div class="profile-header">
      <div class="header-brand">
        <span class="brand-fee">FEE</span><span class="brand-pay">PAY</span>
      </div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="profile-content">
      <div class="avatar-wrap">
        <div class="skeleton avatar-skel" />
      </div>
      <div class="skeleton h-6 w-32 mx-auto mb-2" />
      <div class="skeleton h-4 w-48 mx-auto mb-8" />
      <div class="stats-grid">
        <div v-for="i in 3" :key="i" class="stat-card skeleton-card">
          <div class="skeleton w-6 h-6 mx-auto mb-2" />
          <div class="skeleton h-7 w-12 mx-auto mb-1" />
          <div class="skeleton h-3 w-16 mx-auto" />
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div v-else class="profile-content">
      <!-- Background Particles -->
      <div class="page-bg-art" style="transform: translate3d(0, calc(var(--scrollY) * 0.1px), 0)">
        <AntigravityParticles absolute :particle-count="15" class="opacity-20" />
      </div>

      <!-- Avatar + nama -->
      <div class="avatar-section reveal reveal--up" v-reveal style="transform: translate3d(0, calc(var(--velocity) * 3px), 0)">
        <div class="avatar-wrap">
          <div class="avatar-ring">
            <div class="avatar-inner">
              <img v-if="user?.avatar" :src="user.avatar" class="w-full h-full object-cover" alt="user" />
              <img v-else src="/icons/profile/user.webp" class="avatar-img" alt="user"
                @error="(e) => e.target.style.display='none'" />
              <span v-if="!user?.avatar" class="avatar-fallback">👤</span>
            </div>
          </div>
          <!-- Status dot -->
          <span class="online-dot" />
        </div>
        <h1 class="profile-name">{{ user?.name || 'Pengguna FeePay' }}</h1>
        <p class="profile-email">{{ user?.email || user?.phone || 'Belum login' }}</p>
        <button v-if="!isAuthenticated" @click="isLoginOpen = true" class="mt-2 px-6 py-2 bg-green-600 hover:bg-green-700 text-white text-xs font-bold rounded-full transition-colors">
          Login / Daftar
        </button>
      </div>

      <!-- Stats card — selaras HowItWorks -->
      <div class="stats-card reveal reveal--up" v-reveal :style="{ '--p-delay': '0.1s' }" style="transform: translate3d(0, calc(var(--velocity) * 2px), 0)">
        <div class="stat-item">
          <img src="/icons/profile/transaction.webp" class="stat-icon" alt=""
            @error="(e) => e.target.style.display='none'" />
          <span class="stat-num">0</span>
          <span class="stat-label">Transaksi</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <img src="/icons/profile/wallet.webp" class="stat-icon" alt=""
            @error="(e) => e.target.style.display='none'" />
          <span class="stat-num">Rp0</span>
          <span class="stat-label">Total Belanja</span>
        </div>
        <div class="stat-divider" />
        <div class="stat-item">
          <img src="/icons/profile/star.webp" class="stat-icon" alt=""
            @error="(e) => e.target.style.display='none'" />
          <span class="stat-num">0</span>
          <span class="stat-label">Poin</span>
        </div>
      </div>

      <!-- Menu section -->
      <div class="menu-section reveal reveal--up" v-reveal :style="{ '--p-delay': '0.2s' }">
        <div class="section-title-wrap">
          <img src="/icons/profile/settings.webp" class="section-icon" alt=""
            @error="(e) => e.target.style.display='none'" />
          <div>
            <h2 class="section-title">Akun</h2>
            <p class="section-sub">Kelola informasi akun kamu</p>
          </div>
        </div>

        <div class="menu-card">
          <div v-for="(item, i) in menuItems" :key="i"
            class="menu-item"
            :class="{ 'menu-item--last': i === menuItems.length - 1 }"
            @click="navigateTo(item)"
          >
            <div class="menu-icon-wrap" :style="{ background: item.bg }">
              <img :src="item.icon" :alt="item.label" class="menu-icon"
                @error="(e) => e.target.style.display='none'" />
            </div>
            <div class="menu-body">
              <span class="menu-label">{{ item.label }}</span>
              <span class="menu-badge" v-if="item.badge">{{ item.badge }}</span>
            </div>
            <span class="menu-arrow">›</span>
          </div>
        </div>
      </div>

      <!-- Coming soon banner / Logout Button -->
      <div v-if="!isAuthenticated" class="coming-card cursor-pointer hover:border-green-400 transition-colors" @click="isLoginOpen = true">
        <div class="coming-title-wrap">
          <img src="/icons/profile/google.webp" class="section-icon" alt=""
            @error="(e) => e.target.style.display='none'" />
          <div>
            <h2 class="section-title">Login Sekarang</h2>
            <p class="section-sub">Masuk lebih cepat dengan Google atau No WhatsApp</p>
          </div>
        </div>
      </div>

      <div v-else class="coming-card cursor-pointer hover:border-red-400 border-l-red-500 transition-colors" @click="doLogout">
        <div class="coming-title-wrap">
          <div class="w-9 h-9 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg class="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          </div>
          <div>
            <h2 class="section-title text-red-600" style="background: none; -webkit-text-fill-color: inherit;">Keluar Akun</h2>
            <p class="section-sub">Akhiri sesi Anda saat ini</p>
          </div>
        </div>
      </div>

      <!-- Back button -->
      <button class="back-btn mt-4 reveal reveal--up" v-reveal :style="{ '--p-delay': '0.3s' }" @click="$router.push('/')">
        ← Kembali ke Beranda
      </button>

    </div>

    <!-- Modal Login -->
    <LoginModal :isOpen="isLoginOpen" @close="isLoginOpen = false" @loginSuccess="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import LoginModal from '../components/LoginModal.vue'
import { useCustomerAuth } from '../composables/useCustomerAuth'
import AntigravityParticles from '@/components/AntigravityParticles.vue'

const router = useRouter()
const { user, isAuthenticated, logout } = useCustomerAuth()
const loading = ref(true)
const isLoginOpen = ref(false)

const profilePageRef = ref(null)
const targetScrollY = ref(0)
const smoothScrollY = ref(0)
const scrollVelocity = ref(0)
let lastSmoothY = 0
let rafId = null

const handleScroll = () => {
  targetScrollY.value = window.scrollY
}

const updatePhysics = () => {
  smoothScrollY.value += (targetScrollY.value - smoothScrollY.value) * 0.12
  scrollVelocity.value = smoothScrollY.value - lastSmoothY
  lastSmoothY = smoothScrollY.value

  if (profilePageRef.value) {
    profilePageRef.value.style.setProperty('--scrollY', smoothScrollY.value.toFixed(2))
    profilePageRef.value.style.setProperty('--velocity', scrollVelocity.value.toFixed(2))
  }
  rafId = requestAnimationFrame(updatePhysics)
}

const menuItems = [
  { icon: '/icons/profile/account.webp',      label: 'Informasi Akun',    bg: '#DBEAFE', route: 'account-info',  badge: null },
  { icon: '/icons/profile/history.webp',      label: 'Riwayat Transaksi', bg: '#D1FAE5', route: 'transactions',   badge: null },
  { icon: '/icons/profile/notification.webp', label: 'Notifikasi',        bg: '#FEF3C7', route: 'notifications',  badge: null },
  { icon: '/icons/profile/security.webp',     label: 'Keamanan',          bg: '#FEE2E2', route: 'security',       badge: null },
  { icon: '/icons/profile/help.webp',         label: 'Bantuan',           bg: '#EDE9FE', route: 'help',           badge: null },
]

const navigateTo = (item) => {
  if (item.route) {
    router.push({ name: item.route })
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  updatePhysics()
  setTimeout(() => { loading.value = false }, 400)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (rafId) cancelAnimationFrame(rafId)
})

const handleLoginSuccess = (userData) => {
  console.log('Login success:', userData)
}

const doLogout = async () => {
  await logout()
}
</script>

<style scoped>
.profile-page {
  min-height: 100vh;
  background: var(--background, #f8fafc);
}

/* HEADER — persis HomeView */
.profile-header {
  position: sticky; top: 0; z-index: 40;
  background: var(--card, #ffffff);
  border-bottom: 1px solid var(--border, #e5e7eb);
  padding: 10px 16px;
  display: flex; align-items: center;
}
.header-brand { font-size: 1.25rem; font-weight: 900; letter-spacing: -0.03em; }
.brand-fee { color: var(--foreground, #111827); }
.brand-pay { color: #16a34a; }

/* CONTENT */
.profile-content {
  max-width: 480px;
  margin: 0 auto;
  padding: 20px 16px 100px;
  display: flex; flex-direction: column; gap: 20px;
}

/* AVATAR */
.avatar-section {
  display: flex; flex-direction: column; align-items: center; gap: 6px;
  padding: 8px 0 4px;
}
.avatar-wrap { position: relative; margin-bottom: 4px; }
.avatar-ring {
  width: 80px; height: 80px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #16a34a, #4ade80);
}
.avatar-inner {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: var(--card, #fff);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.avatar-img { width: 48px; height: 48px; object-fit: contain; }
.avatar-fallback { font-size: 2rem; }
.online-dot {
  position: absolute; bottom: 4px; right: 4px;
  width: 14px; height: 14px;
  background: #16a34a;
  border: 2px solid var(--card, #fff);
  border-radius: 50%;
}
.profile-name {
  font-size: 1.125rem; font-weight: 800;
  color: var(--foreground, #111827);
  letter-spacing: -0.02em;
}
.profile-email {
  font-size: 0.75rem;
  color: var(--muted-foreground, #9ca3af);
}

/* STATS — selaras HowItWorks card */
.stats-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  padding: 16px;
  display: flex; align-items: center; justify-content: space-around;
}
.stat-item {
  display: flex; flex-direction: column; align-items: center; gap: 3px;
  flex: 1;
}
.stat-icon { width: 22px; height: 22px; object-fit: contain; margin-bottom: 2px; }
.stat-num { font-size: 1rem; font-weight: 800; color: var(--foreground, #111827); }
.stat-label { font-size: 0.625rem; color: var(--muted-foreground, #9ca3af); font-weight: 600; }
.stat-divider { width: 1px; height: 36px; background: var(--border, #e5e7eb); }

/* SECTION TITLE — sama persis HomeView */
.section-title-wrap {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 10px;
}
.section-icon { width: 36px; height: 36px; object-fit: contain; flex-shrink: 0; }
.section-title {
  font-size: 0.9375rem; font-weight: 800;
  letter-spacing: -0.02em; line-height: 1.2;
  background: linear-gradient(135deg, var(--foreground,#111827) 0%, #16a34a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.section-sub { font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); margin-top: 1px; }

/* MENU CARD — selaras HowItWorks steps */
.menu-section { display: flex; flex-direction: column; }
.menu-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  padding: 4px 16px;
}
.menu-item {
  display: flex; align-items: center; gap: 12px;
  padding: 13px 0;
  border-bottom: 1px solid var(--border, #f3f4f6);
  cursor: pointer;
  transition: opacity 0.15s;
}
.menu-item:active { opacity: 0.6; }
.menu-item--last { border-bottom: none; }

.menu-icon-wrap {
  width: 38px; height: 38px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.menu-icon { width: 22px; height: 22px; object-fit: contain; }
.menu-body { flex: 1; display: flex; align-items: center; gap: 8px; }
.menu-label { font-size: 0.875rem; font-weight: 600; color: var(--foreground, #111827); }
.menu-badge {
  font-size: 0.5625rem; font-weight: 800;
  padding: 2px 7px; border-radius: 999px;
  background: #f0fdf4; color: #16a34a;
  border: 1px solid #bbf7d0;
}
.menu-arrow { font-size: 1.25rem; color: var(--muted-foreground, #d1d5db); }

/* COMING SOON — selaras cs-card */
.coming-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-left: 3px solid #16a34a;
  border-radius: 18px;
  padding: 14px 16px;
  display: flex; flex-direction: column; gap: 10px;
}
.coming-body {
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
}
.coming-text { font-size: 0.8125rem; color: var(--muted-foreground, #6b7280); flex: 1; }
.coming-tag {
  font-size: 0.6rem; font-weight: 700;
  padding: 3px 10px; border-radius: 999px;
  background: #f0fdf4; color: #16a34a;
  border: 1px solid #bbf7d0;
  white-space: nowrap;
}

/* BACK BTN */
.back-btn {
  align-self: center;
  padding: 10px 24px;
  background: transparent;
  border: 1.5px solid var(--border, #e5e7eb);
  border-radius: 999px;
  font-size: 0.8125rem; font-weight: 600;
  color: var(--muted-foreground, #6b7280);
  cursor: pointer; transition: all 0.2s;
}
.back-btn:hover { border-color: #16a34a; color: #16a34a; }

/* SKELETON */
.skeleton {
  background: linear-gradient(90deg, var(--muted,#f3f4f6) 25%, #e9ebee 50%, var(--muted,#f3f4f6) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}
.avatar-skel { width: 80px; height: 80px; border-radius: 50%; }
.skeleton-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px; padding: 16px; text-align: center;
}
.stats-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; }
/* ANTIGRAVITY REVEALS */
.reveal {
  opacity: 0;
  transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), 
              transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform, opacity;
}
.reveal--up { transform: translateY(30px) scale(0.95); }
.reveal.active {
  opacity: 1;
  transform: translateY(0) scale(1) !important;
  transition-delay: var(--p-delay, 0s);
}

.page-bg-art {
  position: fixed; inset: 0; 
  pointer-events: none; z-index: 0;
  will-change: transform;
}

.avatar-section, .stats-card, .menu-section {
  position: relative;
  z-index: 1;
  will-change: transform;
}

.menu-item {
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.menu-item:hover {
  transform: translateX(8px);
  background: rgba(22, 163, 74, 0.02);
}
</style>
