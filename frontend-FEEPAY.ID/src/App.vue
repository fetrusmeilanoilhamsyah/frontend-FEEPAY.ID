<template>
  <div class="min-h-screen transition-colors duration-500 relative">
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary-500/5 dark:bg-primary-500/3 rounded-full blur-[120px] transform translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 dark:bg-blue-500/3 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2"></div>
    </div>

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

          <div class="flex items-center gap-3">
            <router-link
              v-if="isAuthenticated"
              to="/admin/dashboard"
              class="relative px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 group"
            >
              <span class="relative z-10">Dashboard</span>
              <div class="absolute inset-0 bg-primary-50 dark:bg-primary-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </router-link>

            <button
              @click="toggleTheme"
              class="relative p-2.5 rounded-xl bg-dark-100 dark:bg-dark-800 text-dark-700 dark:text-dark-300 hover:bg-dark-200 dark:hover:bg-dark-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 group overflow-hidden"
              aria-label="Toggle theme"
            >
              <div class="absolute inset-0 bg-gradient-to-br from-primary-500/0 to-primary-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Sun
                v-if="isDark()"
                :size="20"
                class="relative z-10 transform transition-all duration-500"
                :class="{ 'rotate-180 scale-110': isDark() }"
              />
              <Moon
                v-else
                :size="20"
                class="relative z-10 transform transition-all duration-500 group-hover:rotate-12"
              />
            </button>

            <button
              v-if="isAuthenticated"
              @click="handleLogout"
              class="relative px-4 py-2 text-sm font-semibold text-dark-700 dark:text-dark-300 hover:text-red-600 dark:hover:text-red-400 transition-all duration-300 group"
            >
              <span class="relative z-10">Logout</span>
              <div class="absolute inset-0 bg-red-50 dark:bg-red-950/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <main class="relative z-10">
      <router-view v-slot="{ Component }">
        <transition
          name="fade-slide"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <transition name="fade">
      <button
        v-if="showScrollTop"
        @click="scrollToTop"
        class="fixed bottom-24 right-8 z-40 p-3 rounded-full bg-primary-600 hover:bg-primary-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500/50 group"
        aria-label="Scroll to top"
      >
        <svg 
          class="w-5 h-5 transform group-hover:-translate-y-0.5 transition-transform duration-300" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </transition>

    <ChatWidget />
  </div>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Sun, Moon } from 'lucide-vue-next'
import { useTheme } from './composables/useTheme'
import { useAuth } from './composables/useAuth'

// Import ChatWidget dengan nama file yang sesuai
import ChatWidget from './components/frontend_ChatWidget.vue'

const router = useRouter()
const { toggleTheme, initTheme, isDark } = useTheme()
const { isAuthenticated, logout } = useAuth()

const showScrollTop = ref(false)

const handleScroll = () => {
  showScrollTop.value = window.scrollY > 300
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

onMounted(() => {
  initTheme()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const handleLogout = async () => {
  await logout()
  router.push('/admin/login')
}
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
html {
  scroll-behavior: smooth;
}
::-webkit-scrollbar {
  width: 10px;
}
::-webkit-scrollbar-track {
  @apply bg-dark-100 dark:bg-dark-900;
}
::-webkit-scrollbar-thumb {
  @apply bg-dark-300 dark:bg-dark-700 rounded-full;
}
::-webkit-scrollbar-thumb:hover {
  @apply bg-dark-400 dark:bg-dark-600;
}
</style>