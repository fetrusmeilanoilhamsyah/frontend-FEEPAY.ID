<template>
  <div class="min-h-screen transition-colors duration-300 relative">

    <!-- Background Decorations (Subtle HD) -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden translate-z-0">
      <div class="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[140px]"></div>
      <div class="absolute bottom-[-5%] left-[-5%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px]"></div>
    </div>

    <div class="app-frame">
      <!-- Top Navbar — HANYA DESKTOP -->
      <nav class="hidden md:block sticky top-0 z-50 backdrop-blur-xl bg-background/95 border-b border-border">
        <div class="max-w-7xl mx-auto px-6">
          <div class="flex justify-between items-center h-14 md:h-14">
            <router-link v-if="!pageTitle" to="/" class="flex items-center select-none gap-2">
              <span class="text-base font-black tracking-tight text-foreground">FEE</span>
              <span class="text-base font-black tracking-tight text-green-600 -ml-1">PAY</span>
            </router-link>
            <div v-else class="flex items-center gap-4">
              <router-link to="/" class="flex items-center select-none gap-2 opacity-60 hover:opacity-100 transition-opacity">
                <span class="text-base font-black tracking-tight text-foreground">FEE</span>
                <span class="text-base font-black tracking-tight text-green-600 -ml-1">PAY</span>
              </router-link>
              <div class="h-6 w-px bg-border"></div>
              <span class="text-sm font-bold text-foreground">{{ pageTitle }}</span>
            </div>

            <!-- desktop nav links -->
            <div class="hidden lg:flex items-center gap-4 absolute left-1/2 -translate-x-1/2">
              <router-link to="/" class="text-sm font-bold transition-all hover:text-green-600" :class="route.path === '/' ? 'text-green-600' : 'text-foreground/60'">Beranda</router-link>
              <router-link to="/transactions" class="text-sm font-bold transition-all hover:text-green-600" :class="route.path.startsWith('/transactions') ? 'text-green-600' : 'text-foreground/60'">Riwayat</router-link>
              <router-link to="/profile" class="text-sm font-bold transition-all hover:text-green-600" :class="route.path.startsWith('/profile') ? 'text-green-600' : 'text-foreground/60'">Profil</router-link>
              <router-link v-if="isAuthenticated" to="/admin/dashboard" class="text-sm font-bold transition-all hover:text-green-600" :class="isAdminPage ? 'text-green-600' : 'text-foreground/60'">Admin</router-link>
            </div>

            <div class="flex items-center gap-2">
              <button @click="toggleTheme" class="p-2 rounded-lg bg-muted text-muted-foreground hover:bg-card-hover transition-all">
                <Sun v-if="isDark()" :size="16" />
                <Moon v-else :size="16" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <!-- Main Content -->
      <main class="relative z-10" :class="{ 'pb-16': !isAdminPage }">
        <router-view v-slot="{ Component, route }">
          <transition name="page" mode="out-in">
            <component :is="Component" :key="route.path" />
          </transition>
        </router-view>
      </main>

      <BottomNav v-if="!isAdminPage" class="md:hidden" />
    </div>

    <!-- Scroll to Top (Outside frame, fixed to viewport or frame) -->
    <transition name="fade">
      <button v-if="showScrollTop" @click="scrollToTop"
        class="fixed z-40 p-3 rounded-full bg-green-600 text-white shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all"
        :class="isMobile ? 'bottom-24 right-4' : 'bottom-8 right-[calc(50%-240px+16px)]'"
        aria-label="Scroll to top">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </transition>

    <ChatWidget />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'
import ChatWidget from './components/frontend_ChatWidget.vue'
import BottomNav from './components/BottomNav.vue'

const router = useRouter()
const route  = useRoute()

const isAdminPage = computed(() => route.path.startsWith('/admin'))
const pageTitle = computed(() => {
  if (route.path.startsWith('/transactions')) return 'Riwayat Transaksi'
  if (route.path.startsWith('/profile'))      return 'Akun Saya'
  if (isAdminPage.value)                      return 'Admin Dashboard'
  return ''
})
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
.page-enter-active { transition: opacity 0.2s ease, transform 0.2s ease; }
.page-leave-active { transition: opacity 0.15s ease, transform 0.15s ease; }
.page-enter-from   { opacity: 0; transform: translate3d(0, 6px, 0); }
.page-leave-to     { opacity: 0; transform: translate3d(0, -4px, 0); }

.fade-enter-active { transition: opacity 0.2s ease, transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
.fade-leave-active { transition: opacity 0.15s ease; }
.fade-enter-from   { opacity: 0; transform: translate3d(0, 8px, 0); }
.fade-leave-to     { opacity: 0; }
</style>