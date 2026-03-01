<template>
  <div class="profile-page">

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

      <!-- Avatar + nama -->
      <div class="avatar-section">
        <div class="avatar-wrap">
          <div class="avatar-ring">
            <div class="avatar-inner">
              <img src="/icons/profile/user.webp" class="avatar-img" alt="user"
                @error="(e) => e.target.style.display='none'" />
              <span class="avatar-fallback">👤</span>
            </div>
          </div>
          <!-- Status dot -->
          <span class="online-dot" />
        </div>
        <h1 class="profile-name">Pengguna FeePay</h1>
        <p class="profile-email">Belum login</p>
      </div>

      <!-- Stats card — selaras HowItWorks -->
      <div class="stats-card">
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
      <div class="menu-section">
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

      <!-- Coming soon banner — selaras cs-card -->
      <div class="coming-card">
        <div class="coming-title-wrap">
          <img src="/icons/profile/google.webp" class="section-icon" alt=""
            @error="(e) => e.target.style.display='none'" />
          <div>
            <h2 class="section-title">Login Google</h2>
            <p class="section-sub">Masuk lebih cepat dengan akun Google</p>
          </div>
        </div>
        <div class="coming-body">
          <span class="coming-text">Fitur login & profil lengkap segera hadir</span>
          <span class="coming-tag">Segera Hadir</span>
        </div>
      </div>

      <!-- Back button -->
      <button class="back-btn" @click="$router.push('/')">
        ← Kembali ke Beranda
      </button>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const loading = ref(true)

const menuItems = [
  { icon: '/icons/profile/account.webp',     label: 'Informasi Akun',    bg: '#DBEAFE', badge: 'Segera'  },
  { icon: '/icons/profile/history.webp',     label: 'Riwayat Transaksi', bg: '#D1FAE5', badge: null      },
  { icon: '/icons/profile/notification.webp',label: 'Notifikasi',        bg: '#FEF3C7', badge: 'Segera'  },
  { icon: '/icons/profile/security.webp',    label: 'Keamanan',          bg: '#FEE2E2', badge: 'Segera'  },
  { icon: '/icons/profile/help.webp',        label: 'Bantuan',           bg: '#EDE9FE', badge: null      },
]

onMounted(() => {
  setTimeout(() => { loading.value = false }, 400)
})
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
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }
</style>
