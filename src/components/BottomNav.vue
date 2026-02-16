<template>
  <nav class="fixed bottom-0 left-0 right-0 z-40 md:hidden">
    <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-400"></div>
    
    <div class="relative flex items-center justify-around h-16 px-4">
      <router-link
        v-for="item in navItems"
        :key="item.name"
        :to="item.path"
        class="flex flex-col items-center justify-center gap-1 flex-1 py-2 relative active:scale-95 transition-transform duration-150"
      >
        <component 
          :is="item.icon" 
          :size="20"
          class="relative z-10 transition-all duration-200"
          :class="isActive(item.path) ? 'text-white' : 'text-white/50'"
          :stroke-width="isActive(item.path) ? 2.5 : 1.75"
        />
        <span 
          class="relative z-10 transition-all duration-200"
          :style="{
            fontSize: '10px',
            fontWeight: isActive(item.path) ? '800' : '500',
            letterSpacing: '-0.01em',
            fontFamily: 'Outfit, sans-serif'
          }"
          :class="isActive(item.path) ? 'text-white' : 'text-white/50'"
        >
          {{ item.label }}
        </span>

        <!-- Active dot -->
        <div
          v-if="isActive(item.path)"
          class="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-white"
        ></div>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { Home, History, User } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { name: 'home',    label: 'Home',    path: '/',             icon: Home    },
  { name: 'history', label: 'Riwayat', path: '/transactions', icon: History },
  { name: 'profile', label: 'Profil',  path: '/profile',      icon: User    }
]

const isActive = (path) => {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}
</script>