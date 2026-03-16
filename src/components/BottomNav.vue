<template>
  <nav class="bottom-nav" :class="{ hidden: !isVisible }">
    <div class="nav-inner">
      <router-link
        v-for="item in visibleNavItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        @click="(e) => onTap(e)"
      >
        <div class="nav-icon-wrap">
          <span class="ripple-ring r1"></span>
          <span class="ripple-ring r2"></span>
          <span class="dot d1"></span>
          <span class="dot d2"></span>
          <span class="dot d3"></span>
          <span class="dot d4"></span>
          <span class="dot d5"></span>
          <span class="dot d6"></span>
          <span class="dot d7"></span>
          <span class="dot d8"></span>
          <img
            :src="isActive(item.path) ? item.iconActive : item.icon"
            :alt="item.label"
            class="nav-img"
            @error="(e) => e.target.style.display='none'"
          />
        </div>
        <span class="nav-label">{{ item.label }}</span>
      </router-link>

      <!-- Admin Logout Button (Mobile Only) -->
      <button
        v-if="isAuthenticated"
        @click="handleLogoutClick"
        class="nav-item nav-logout"
      >
        <div class="nav-icon-wrap">
          <span class="ripple-ring r1"></span>
          <span class="ripple-ring r2"></span>
          <span class="dot d1"></span>
          <span class="dot d2"></span>
          <span class="dot d3"></span>
          <span class="dot d4"></span>
          <span class="dot d5"></span>
          <span class="dot d6"></span>
          <span class="dot d7"></span>
          <span class="dot d8"></span>
          <svg class="nav-img-logout" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </div>
        <span class="nav-label">Logout</span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

const route = useRoute()
const router = useRouter()
const { isAuthenticated, logout } = useAuth()
const isVisible = ref(true)
let lastScrollY = 0

const navItems = [
  { path: '/',             icon: '/icons/nav/home.webp',    iconActive: '/icons/nav/home-active.webp',    label: 'Beranda' },
  { path: '/transactions', icon: '/icons/nav/history.webp', iconActive: '/icons/nav/history-active.webp', label: 'Riwayat' },
  { path: '/profile',      icon: '/icons/nav/profile.webp', iconActive: '/icons/nav/profile-active.webp', label: 'Profil'  },
]

// Add admin dashboard to nav when authenticated
const visibleNavItems = computed(() => {
  if (isAuthenticated.value) {
    return [
      ...navItems,
      { path: '/admin/dashboard', icon: '/icons/nav/profile.webp', iconActive: '/icons/nav/profile-active.webp', label: 'Admin' }
    ]
  }
  return navItems
})

const isActive = (path) => path === '/' ? route.path === '/' : route.path.startsWith(path)

const onTap = (e) => {
  const wrap = e.currentTarget.querySelector('.nav-icon-wrap')
  if (!wrap) return
  wrap.classList.remove('burst')
  void wrap.offsetWidth
  wrap.classList.add('burst')
  setTimeout(() => wrap.classList.remove('burst'), 700)
}

const handleLogoutClick = async (e) => {
  onTap(e)
  
  // Confirm logout
  if (!confirm('Yakin ingin logout?')) return
  
  try {
    await logout()
    router.push('/admin/login')
  } catch (err) {
    // Force logout even if API fails
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_pin')
    router.push('/admin/login')
  }
}

const handleScroll = () => {
  const currentScrollY = window.scrollY
  
  if (currentScrollY < 10) {
    isVisible.value = true
  } else if (currentScrollY > lastScrollY && currentScrollY > 80) {
    isVisible.value = false
  } else if (currentScrollY < lastScrollY) {
    isVisible.value = true
  }
  
  lastScrollY = currentScrollY
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
/* HD Styles */
.bottom-nav {
  position: fixed; bottom: 0; left: 50%;
  transform: translate3d(-50%, 0, 0);
  width: 100%; max-width: 480px;
  background: var(--card);
  border-top: 1px solid var(--border);
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: var(--shadow-lg);
  transition: transform 0.4s var(--ease-out-expo);
  will-change: transform;
}

.bottom-nav.hidden {
  transform: translate3d(-50%, 100%, 0);
}

.nav-inner {
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 12px;
}

.nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  text-decoration: none;
  position: relative;
  transition: all 0.3s;
}

.nav-icon-wrap {
  width: 42px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: all 0.3s var(--ease-spring);
}

.nav-item.active .nav-icon-wrap {
  transform: translateY(-2px);
}

/* Slim Indicator */
.nav-item::after {
  content: '';
  position: absolute;
  top: 0;
  width: 24px;
  height: 3px;
  background: var(--primary);
  border-radius: 0 0 4px 4px;
  transform: scaleX(0);
  transition: transform 0.3s var(--ease-spring);
}

.nav-item.active::after {
  transform: scaleX(1);
}

.nav-img {
  width: 22px;
  height: 22px;
  object-fit: contain;
  filter: grayscale(1) opacity(0.4);
  transition: all 0.3s;
}

.nav-item.active .nav-img {
  filter: grayscale(0) opacity(1);
  transform: scale(1.1);
}

.nav-label {
  font-size: 0.65rem;
  font-weight: 700;
  color: var(--muted-foreground);
  transition: color 0.3s;
}

.nav-item.active .nav-label {
  color: var(--primary);
}

/* Logout */
.nav-logout .nav-label { color: #EF4444 !important; }
.nav-img-logout {
  width: 20px;
  height: 20px;
  color: #EF4444;
  opacity: 0.6;
}
.nav-logout:active .nav-img-logout { opacity: 1; }
</style>