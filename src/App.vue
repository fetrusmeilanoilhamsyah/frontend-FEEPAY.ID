<template>
  <div class="min-h-screen transition-colors duration-500 relative">

    <!-- Background blur decorations -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/3 rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

    <!-- Top Navbar -->
    <nav class="sticky top-0 z-50 backdrop-blur-xl bg-white/90 dark:bg-dark-950/90 border-b border-dark-200/50 dark:border-dark-700/50 shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <router-link
            to="/"
            class="group relative text-2xl font-bold tracking-tight text-dark-950 dark:text-white transition-all duration-300"
          >
            <span class="relative z-10">FEEPAY<span class="text-primary-600 dark:text-primary-400">.ID</span></span>
            <div class="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-primary-500/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300 rounded-lg"></div>
          </router-link>

          <!-- Desktop Nav -->
          <div class="hidden md:flex items-center gap-1">
            <router-link to="/"
              class="relative px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 group">
              <span class="relative z-10">Beranda</span>
              <div class="absolute inset-0 bg-primary-50 dark:bg-primary-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </router-link>
            <router-link to="/transactions"
              class="relative px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 group">
              <span class="relative z-10">Riwayat</span>
              <div class="absolute inset-0 bg-primary-50 dark:bg-primary-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </router-link>
            <router-link to="/profile"
              class="relative px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 group">
              <span class="relative z-10">Profil</span>
              <div class="absolute inset-0 bg-primary-50 dark:bg-primary-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </router-link>
            <router-link v-if="isAuthenticated" to="/admin/dashboard"
              class="relative px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 group">
              <span class="relative z-10">Dashboard</span>
              <div class="absolute inset-0 bg-primary-50 dark:bg-primary-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </router-link>
          </div>

          <div class="flex items-center gap-3">
            <!-- Theme Toggle -->
            <button @click="toggleTheme"
              class="relative p-2.5 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 group overflow-hidden"
              aria-label="Toggle theme">
              <div class="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Sun v-if="isDark()" :size="20" class="relative z-10 transform transition-all duration-500" :class="{ 'rotate-180 scale-110': isDark() }" />
              <Moon v-else :size="20" class="relative z-10 transform transition-all duration-500 group-hover:rotate-12" />
            </button>

            <!-- Logout (desktop) -->
            <button v-if="isAuthenticated" @click="handleLogout"
              class="relative px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group hidden md:block">
              <span class="relative z-10">Logout</span>
              <div class="absolute inset-0 bg-red-50 dark:bg-red-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            <!-- Hamburger (mobile) -->
            <button @click="mobileMenuOpen = !mobileMenuOpen"
              class="md:hidden relative p-2.5 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 transition-all">
              <Menu v-if="!mobileMenuOpen" :size="20" />
              <X v-else :size="20" />
            </button>
          </div>
        </div>

        <!-- Mobile Menu Dropdown -->
        <transition name="slide-down">
          <div v-if="mobileMenuOpen" class="md:hidden py-4 border-t border-border">
            <div class="flex flex-col gap-2">
              <router-link to="/" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-lg transition-colors">
                Beranda
              </router-link>
              <router-link to="/transactions" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-lg transition-colors">
                Riwayat Transaksi
              </router-link>
              <router-link to="/profile" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-lg transition-colors">
                Profil
              </router-link>
              <router-link v-if="isAuthenticated" to="/admin/dashboard" @click="mobileMenuOpen = false"
                class="px-4 py-3 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:bg-primary-50 dark:hover:bg-primary-950/20 rounded-lg transition-colors">
                Dashboard Admin
              </router-link>
              <button v-if="isAuthenticated" @click="handleLogout"
                class="px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors text-left">
                Logout
              </button>
            </div>
          </div>
        </transition>
      </div>
    </nav>

    <!-- Main Content — FIX: pb-20 di mobile supaya tidak ketutup BottomNav -->
    <main class="relative z-10 pb-0 md:pb-0" :class="{ 'pb-20': isMobile }">
      <router-view v-slot="{ Component }">
        <transition name="fade-slide" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Scroll to Top — FIX: bottom-24 di mobile (di atas BottomNav), bottom-8 di desktop -->
    <transition name="fade">
      <button v-if="showScrollTop" @click="scrollToTop"
        class="fixed z-40 p-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 group"
        :class="isMobile ? 'bottom-24 right-4' : 'bottom-8 right-8'"
        aria-label="Scroll to top">
        <svg class="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </transition>

    <!-- FIX: BottomNav ditambahkan -->
    <BottomNav />

    <!-- ChatWidget -->
    <ChatWidget />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Sun, Moon, Menu, X } from 'lucide-vue-next'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'
import ChatWidget from './components/frontend_ChatWidget.vue'
import BottomNav from './components/BottomNav.vue'

const router = useRouter()
const { toggleTheme, initTheme, isDark } = useTheme()
const { isAuthenticated, logout } = useAuth()

const showScrollTop = ref(false)
const mobileMenuOpen = ref(false)
const windowWidth = ref(window.innerWidth)

// FIX: deteksi mobile untuk BottomNav spacing
const isMobile = computed(() => windowWidth.value < 768)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', handleResize)
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
.fade-slide-enter-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
html {
  scroll-behavior: smooth;
}
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { @apply bg-dark-100 dark:bg-dark-900; }
::-webkit-scrollbar-thumb { @apply bg-dark-300 dark:bg-dark-700 rounded-full; }
::-webkit-scrollbar-thumb:hover { @apply bg-dark-400 dark:bg-dark-600; }
</style>