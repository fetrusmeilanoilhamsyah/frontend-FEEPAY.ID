<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 md:hidden">
    <!-- Blur background -->
    <div class="absolute inset-0 bg-white/90 dark:bg-dark-950/90 backdrop-blur-xl border-t border-border"></div>
    
    <!-- Nav items -->
    <div class="relative flex items-center justify-around h-16 px-4">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-1 flex-1 py-2 transition-all"
        :class="isActive(item.path) 
          ? 'text-primary-600 dark:text-primary-400' 
          : 'text-dark-500 dark:text-dark-400 hover:text-primary-600 dark:hover:text-primary-400'"
      >
        <component 
          :is="item.icon" 
          :size="22"
          :class="isActive(item.path) ? 'stroke-[2.5]' : 'stroke-[2]'"
        />
        <span class="text-xs font-semibold">{{ item.label }}</span>
        
        <!-- Active indicator -->
        <div 
          v-if="isActive(item.path)"
          class="absolute -top-0.5 left-1/2 -translate-x-1/2 w-12 h-1 bg-primary-600 dark:bg-primary-400 rounded-b-full"
        ></div>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, History, User } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  {
    name: 'home',
    label: 'Home',
    path: '/',
    icon: Home
  },
  {
    name: 'history',
    label: 'Riwayat',
    path: '/transactions',
    icon: History
  },
  {
    name: 'profile',
    label: 'Profil',
    path: '/profile',
    icon: User
  }
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>