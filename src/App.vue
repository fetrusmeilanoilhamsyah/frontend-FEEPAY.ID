<template>
  <div class="min-h-screen transition-colors duration-300 relative">

    <!-- Background blur decorations -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/[0.02] rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 dark:bg-accent-500/[0.02] rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <!-- Top Navbar -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-background/95 border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14">

          <!-- Logo -->
          <router-link to="/" class="flex items-center select-none">
            <span class="text-xl font-black tracking-tight text-foreground">FEE</span>
            <span class="text-xl font-black tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">PAY</span>
          </router-link>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-1">
            <router-link to="/"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path === '/'
                ? 'text-primary bg-primary-50 dark:bg-primary-950/20'
                : 'text-muted-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-950/20'">
              Beranda
            </router-link>
            <router-link to="/transactions"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/transactions')
                ? 'text-primary bg-primary-50 dark:bg-primary-950/20'
                : 'text-muted-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-950/20'">
              Riwayat
            </router-link>
            <router-link to="/profile"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/profile')
                ? 'text-primary bg-primary-50 dark:bg-primary-950/20'
                : 'text-muted-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-950/20'">
              Profil
            </router-link>
            <router-link v-if="isAuthenticated" to="/admin/dashboard"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/admin')
                ? 'text-primary bg-primary-50 dark:bg-primary-950/20'
                : 'text-muted-foreground hover:text-primary hover:bg-primary-50 dark:hover:bg-primary-950/20'">
              Dashboard
            </router-link>
          </div>

          <div class="flex items-center gap-2">
            <!-- Theme Toggle -->
            <button @click="toggleTheme"
              class="p-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-card-hover transition-all duration-200 focus:outline-none active:scale-95"
              aria-label="Toggle theme">
              <Sun v-if="isDark()" :size="18" />
              <Moon v-else :size="18" />
            </button>

            <!-- Logout (desktop) -->
            <button v-if="isAuthenticated" @click="handleLogout"
              class="hidden md:block px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-error hover:bg-error-light rounded-lg transition-all duration-200">
              Logout
            </button>

            <!-- Hamburger (mobile) -->
            <button @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden p-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-card-hover transition-all active:scale-95">
              <Menu v-if="!mobileMenuOpen" :size="18" />
              <X v-else :size="18" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <transition name="slide-down">
          <div v-if="mobileMenuOpen" class="md:hidden py-3 border-t border-border">
            <div class="flex flex-col gap-1">
              <router-link to="/" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                :class="$route.path === '/' ? 'text-primary bg-primary-50 dark:bg-primary-950/20' : 'text-foreground hover:bg-muted'">
                Beranda
              </router-link>
              <router-link to="/transactions" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                :class="$route.path.startsWith('/transactions') ? 'text-primary bg-primary-50 dark:bg-primary-950/20' : 'text-foreground hover:bg-muted'">
                Riwayat Transaksi
              </router-link>
              <router-link to="/profile" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                :class="$route.path.startsWith('/profile') ? 'text-primary bg-primary-50 dark:bg-primary-950/20' : 'text-foreground hover:bg-muted'">
                Profil
              </router-link>
              <router-link v-if="isAuthenticated" to="/admin/dashboard" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 active:scale-[0.98]"
                :class="$route.path.startsWith('/admin') ? 'text-primary bg-primary-50 dark:bg-primary-950/20' : 'text-foreground hover:bg-muted'">
                Dashboard Admin
              </router-link>
              <button v-if="isAuthenticated" @click="handleLogout"
                class="px-4 py-3 text-sm font-semibold text-error hover:bg-error-light rounded-lg transition-all duration-200 text-left active:scale-[0.98]">
                Logout
              </button>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="relative z-10" :class="{ 'pb-20': isMobile }">
      <router-view v-slot="{ Component, route }">
        <transition :name="transitionName" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Scroll to Top -->
    <transition name="fade">
      <button v-if="showScrollTop" @click="scrollToTop"
        class="fixed z-40 p-3 rounded-full bg-gradient-to-r from-primary to-accent text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none"
        :class="isMobile ? 'bottom-24 right-4' : 'bottom-8 right-8'"
        aria-label="Scroll to top">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </transition>

    <BottomNav />
    <ChatWidget />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Sun, Moon, Menu, X } from 'lucide-vue-next'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'
import ChatWidget from './components/frontend_ChatWidget.vue'
import BottomNav from './components/BottomNav.vue'

const router = useRouter()
const route = useRoute()
const { toggleTheme, initTheme, isDark } = useTheme()
const { isAuthenticated, logout } = useAuth()

const showScrollTop = ref(false)
const mobileMenuOpen = ref(false)
const windowWidth = ref(window.innerWidth)
const transitionName = ref('page')

const isMobile = computed(() => windowWidth.value < 768)

const routeDepth = {
  '/': 0,
  '/transactions': 1,
  '/profile': 1,
}

watch(() => route.path, (to, from) => {
  const toDepth = routeDepth[to] ?? 2
  const fromDepth = routeDepth[from] ?? 2
  transitionName.value = toDepth > fromDepth ? 'slide-left' : toDepth < fromDepth ? 'slide-right' : 'page'
})

const handleScroll = () => { showScrollTop.value = window.scrollY > 300 }
const handleResize = () => { windowWidth.value = window.innerWidth }
const scrollToTop = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleResize, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleResize)
})

const handleLogout = async () => {
  await logout()
  mobileMenuOpen.value = false
  router.push('/admin/login')
}

router.afterEach(() => {
  mobileMenuOpen.value = false
})
</script>

<style scoped>
/* GPU acceleration */
.page-enter-active,
.page-leave-active,
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  will-change: opacity, transform;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

/* Page fade */
.page-enter-active {
  transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease-in;
}
.page-enter-from { opacity: 0; transform: translate3d(0, 8px, 0) scale(0.99); }
.page-leave-to   { opacity: 0; transform: translate3d(0, -4px, 0) scale(0.99); }

/* Slide left */
.slide-left-enter-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.slide-left-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease-in;
}
.slide-left-enter-from { opacity: 0; transform: translate3d(20px, 0, 0); }
.slide-left-leave-to   { opacity: 0; transform: translate3d(-12px, 0, 0); }

/* Slide right */
.slide-right-enter-active {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.34, 1.2, 0.64, 1);
}
.slide-right-leave-active {
  transition: opacity 0.18s ease, transform 0.18s ease-in;
}
.slide-right-enter-from { opacity: 0; transform: translate3d(-20px, 0, 0); }
.slide-right-leave-to   { opacity: 0; transform: translate3d(12px, 0, 0); }

/* Mobile menu */
.slide-down-enter-active { transition: all 0.22s cubic-bezier(0.34, 1.3, 0.64, 1); }
.slide-down-leave-active { transition: all 0.15s ease-in; }
.slide-down-enter-from   { opacity: 0; transform: translate3d(0, -8px, 0); }
.slide-down-leave-to     { opacity: 0; transform: translate3d(0, -4px, 0); }

/* Scroll to top */
.fade-enter-active {
  transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from   { opacity: 0; transform: translate3d(0, 8px, 0); }
.fade-leave-to     { opacity: 0; }
</style>