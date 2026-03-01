<template>
  <div class="min-h-screen transition-colors duration-300 relative">

    <!-- Background blur decorations -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/[0.02] rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-500/5 dark:bg-accent-500/[0.02] rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <!-- Top Navbar — HANYA DESKTOP -->
    <nav class="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-background/95 border-b border-border">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-14">

          <router-link to="/" class="flex items-center select-none">
            <span class="text-xl font-black tracking-tight text-foreground">FEE</span>
            <span class="text-xl font-black tracking-tight text-green-600">PAY</span>
          </router-link>

          <div class="flex items-center gap-1">
            <router-link to="/"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path === '/' ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'">
              Beranda
            </router-link>
            <router-link to="/transactions"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/transactions') ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'">
              Riwayat
            </router-link>
            <router-link to="/profile"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/profile') ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'">
              Profil
            </router-link>
            <router-link v-if="isAuthenticated" to="/admin/dashboard"
              class="px-4 py-2 text-sm font-semibold rounded-lg transition-all duration-200"
              :class="$route.path.startsWith('/admin') ? 'text-green-600 bg-green-50' : 'text-muted-foreground hover:text-green-600 hover:bg-green-50'">
              Dashboard
            </router-link>
          </div>

          <div class="flex items-center gap-2">
            <button @click="toggleTheme" class="p-2.5 rounded-xl bg-muted text-muted-foreground hover:bg-card-hover transition-all" aria-label="Toggle theme">
              <Sun v-if="isDark()" :size="18" />
              <Moon v-else :size="18" />
            </button>
            <button v-if="isAuthenticated" @click="handleLogout"
              class="px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="relative z-10" :class="{ 'pb-16': isMobile }">
      <router-view v-slot="{ Component, route }">
        <transition name="page" mode="out-in">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </main>

    <!-- Scroll to Top -->
    <transition name="fade">
      <button v-if="showScrollTop" @click="scrollToTop"
        class="fixed z-40 p-3 rounded-full bg-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
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
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'
import ChatWidget from './components/frontend_ChatWidget.vue'
import BottomNav from './components/BottomNav.vue'

const router = useRouter()
const { toggleTheme, initTheme, isDark } = useTheme()
const { isAuthenticated, logout } = useAuth()

const showScrollTop = ref(false)
const windowWidth   = ref(window.innerWidth)
const isMobile      = computed(() => windowWidth.value < 768)

const handleScroll = () => { showScrollTop.value = window.scrollY > 300 }
const handleResize = () => { windowWidth.value = window.innerWidth }
const scrollToTop  = () => { window.scrollTo({ top: 0, behavior: 'smooth' }) }

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
  router.push('/admin/login')
}
</script>

<style scoped>
/* Page transition — ringan, natural, kayak iOS */
.page-enter-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}
.page-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.page-enter-from {
  opacity: 0;
  transform: translate3d(0, 6px, 0);
}
.page-leave-to {
  opacity: 0;
  transform: translate3d(0, -4px, 0);
}

/* Scroll to top button */
.fade-enter-active { transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from   { opacity: 0; transform: translate3d(0, 8px, 0); }
.fade-leave-to     { opacity: 0; }
</style>