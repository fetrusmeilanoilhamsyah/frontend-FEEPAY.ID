<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50 md:hidden">
    <div class="max-w-lg mx-auto px-4">
      <div class="flex items-center justify-around h-16">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="flex flex-col items-center justify-center gap-1 flex-1 h-full relative transition-colors"
        >
          <!-- Active indicator (top border) -->
          <div 
            v-if="isActive(item.path)"
            class="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-primary rounded-full"
          />
          
          <!-- Icon -->
          <component 
            :is="item.icon" 
            :size="20"
            class="transition-colors"
            :class="isActive(item.path) ? 'text-primary' : 'text-muted-foreground'"
          />
          
          <!-- Label -->
          <span 
            class="text-xs font-medium transition-colors"
            :class="isActive(item.path) ? 'text-primary' : 'text-muted-foreground'"
          >
            {{ item.label }}
          </span>
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Home, Clock, User } from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { path: '/', icon: Home, label: 'Beranda' },
  { path: '/transactions', icon: Clock, label: 'Riwayat' },
  { path: '/profile', icon: User, label: 'Profil' },
]

const isActive = (path) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}
</script>