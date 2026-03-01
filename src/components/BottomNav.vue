<template>
  <nav class="bottom-nav" :class="{ hidden: !isVisible }">
    <div class="nav-inner">
      <router-link
        v-for="item in navItems"
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
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isVisible = ref(true)
let lastScrollY = 0

const navItems = [
  { path: '/',             icon: '/icons/nav/home.png',    iconActive: '/icons/nav/home-active.png',    label: 'Beranda' },
  { path: '/transactions', icon: '/icons/nav/history.png', iconActive: '/icons/nav/history-active.png', label: 'Riwayat' },
  { path: '/profile',      icon: '/icons/nav/profile.png', iconActive: '/icons/nav/profile-active.png', label: 'Profil'  },
]

const isActive = (path) => path === '/' ? route.path === '/' : route.path.startsWith(path)

const onTap = (e) => {
  const wrap = e.currentTarget.querySelector('.nav-icon-wrap')
  wrap.classList.remove('burst')
  void wrap.offsetWidth
  wrap.classList.add('burst')
  setTimeout(() => wrap.classList.remove('burst'), 700)
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
.bottom-nav {
  position: fixed; bottom: 0; left: 0; right: 0;
  background: #ffffff;
  border-top: 1px solid #e5e7eb;
  z-index: 50;
  padding-bottom: env(safe-area-inset-bottom);
  box-shadow: 0 -2px 16px rgba(0,0,0,0.06);
  transform: translateY(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.bottom-nav.hidden {
  transform: translateY(100%);
}

@media(min-width: 768px) { .bottom-nav { display: none; } }

.nav-inner {
  max-width: 480px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-around;
  height: 62px; padding: 0 8px;
}

.nav-item {
  flex: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  gap: 3px;
  text-decoration: none;
  -webkit-tap-highlight-color: transparent;
  position: relative;
  cursor: pointer;
}

/* Top indicator */
.nav-item::before {
  content: '';
  position: absolute;
  top: -1px; left: 50%;
  transform: translateX(-50%) scaleX(0);
  width: 22px; height: 2px;
  background: #111827;
  border-radius: 0 0 3px 3px;
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-item.active::before {
  transform: translateX(-50%) scaleX(1);
}

/* ICON WRAP */
.nav-icon-wrap {
  width: 46px; height: 34px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 12px;
  position: relative;
  overflow: visible;
  transition: background 0.2s ease;
}
.nav-item.active .nav-icon-wrap {
  background: rgba(17, 24, 39, 0.07);
}

/* RIPPLE */
.ripple-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(17,24,39,0.15);
  width: 24px; height: 24px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
}
.nav-icon-wrap.burst .r1 { animation: wave 0.5s ease-out forwards; }
.nav-icon-wrap.burst .r2 { animation: wave 0.5s ease-out 0.1s forwards; }

@keyframes wave {
  0%   { transform: translate(-50%,-50%) scale(0.3); opacity: 0.4; }
  100% { transform: translate(-50%,-50%) scale(2.6); opacity: 0; }
}

/* PARTIKEL 8 titik */
.dot {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: #111827;
  top: 50%; left: 50%;
  opacity: 0;
  pointer-events: none;
}
.nav-icon-wrap.burst .d1 { animation: burst-dot 0.45s ease-out forwards 0.00s; --a: 0deg;   }
.nav-icon-wrap.burst .d2 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 45deg;  }
.nav-icon-wrap.burst .d3 { animation: burst-dot 0.45s ease-out forwards 0.04s; --a: 90deg;  }
.nav-icon-wrap.burst .d4 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 135deg; }
.nav-icon-wrap.burst .d5 { animation: burst-dot 0.45s ease-out forwards 0.00s; --a: 180deg; }
.nav-icon-wrap.burst .d6 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 225deg; }
.nav-icon-wrap.burst .d7 { animation: burst-dot 0.45s ease-out forwards 0.04s; --a: 270deg; }
.nav-icon-wrap.burst .d8 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 315deg; }

@keyframes burst-dot {
  0%   { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0)    scale(1);  opacity: 0.6; }
  100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(-13px) scale(0); opacity: 0;   }
}

/* IMAGE */
.nav-img {
  width: 22px; height: 22px;
  object-fit: contain;
  position: relative; z-index: 2;
  filter: brightness(0) opacity(0.45);
  transition: filter 0.2s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.nav-item.active .nav-img {
  filter: brightness(0) opacity(1);
  animation: icon-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

/* Pop ringan — cuma scale, gak naik turun */
@keyframes icon-pop {
  0%   { transform: scale(1);    }
  50%  { transform: scale(1.18); }
  100% { transform: scale(1.1);  }
}

/* LABEL */
.nav-label {
  font-size: 0.6rem;
  font-weight: 600;
  letter-spacing: 0.01em;
  color: #9ca3af;
  transition: color 0.2s ease, font-weight 0.2s ease;
}
.nav-item.active .nav-label {
  color: #111827;
  font-weight: 800;
}
</style>