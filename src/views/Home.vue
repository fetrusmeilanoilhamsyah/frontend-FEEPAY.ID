<template>
  <div class="home">

    <!-- TOP HEADER -->
    <div class="home-header">
      <div class="header-brand">
        <img src="/icons/top-up-game.webp" class="brand-icon" alt=""
          @error="(e) => e.target.style.display='none'" />
        <span class="brand-fee">FEE</span><span class="brand-pay">PAY</span>
      </div>
      <div class="header-actions">
        <!-- Dark mode toggle — icon dari /public/icons/ -->
        <!-- Theme toggle -->
        <button class="header-btn hbtn" @click="onBtnTap($event, toggleTheme)" aria-label="Toggle theme">
          <span class="ripple-ring tr1"></span><span class="ripple-ring tr2"></span>
          <span class="dot td1"></span><span class="dot td2"></span>
          <span class="dot td3"></span><span class="dot td4"></span>
          <img :src="isDark() ? '/icons/theme-light.webp' : '/icons/theme-dark.webp'"
            class="hbtn-icon" alt="theme" @error="(e) => e.target.style.display='none'" />
        </button>
        <!-- Transaksi -->
        <button class="header-btn hbtn" @click="onBtnTap($event, () => router.push('/transactions'))" aria-label="Transaksi">
          <span class="ripple-ring tr1"></span><span class="ripple-ring tr2"></span>
          <span class="dot td1"></span><span class="dot td2"></span>
          <span class="dot td3"></span><span class="dot td4"></span>
          <img src="/icons/nav/history.webp" class="hbtn-icon" alt="transaksi"
            @error="(e) => e.target.style.display='none'" />
        </button>
        <!-- Profil -->
        <button class="header-btn hbtn" @click="onBtnTap($event, () => router.push('/profile'))" aria-label="Profil">
          <span class="ripple-ring tr1"></span><span class="ripple-ring tr2"></span>
          <span class="dot td1"></span><span class="dot td2"></span>
          <span class="dot td3"></span><span class="dot td4"></span>
          <img src="/icons/nav/profile.webp" class="hbtn-icon" alt="profil"
            @error="(e) => e.target.style.display='none'" />
        </button>
      </div>
    </div>

    <div class="home-content">

      <!-- BANNER -->
      <div class="banner-wrap">
        <span class="p p1"/><span class="p p2"/><span class="p p3"/>
        <span class="p p4"/><span class="p p5"/><span class="p p6"/>
        <span class="p p7"/><span class="p p8"/>
        <SkeletonBanner v-if="productStore.loading" />
        <BannerSlider v-else @action="handleBannerAction" />
      </div>

      <!-- TRUST PILLS -->
      <div class="trust-pills">
        <button
          v-for="pill in trustPills"
          :key="pill.label"
          class="pill pbtn"
          @click="onPillTap($event)"
        >
          <span class="ripple-ring pr1"></span>
          <span class="ripple-ring pr2"></span>
          <span class="pdot pd1"></span>
          <span class="pdot pd2"></span>
          <span class="pdot pd3"></span>
          <span class="pdot pd4"></span>
          <img :src="pill.icon" :alt="pill.label" class="pill-img"
            @error="(e) => e.target.style.display='none'" />
          <span>{{ pill.label }}</span>
        </button>
      </div>

      <!-- PENDING ORDER NOTIF -->
      <div v-if="pendingOrders.length > 0" class="notif-bar" @click="router.push('/transactions')">
        <div class="notif-dot"></div>
        <div class="notif-text">
          <span class="notif-title">{{ pendingOrders.length }} Transaksi Diproses</span>
          <span class="notif-sub">{{ pendingOrders[0].product_name }} · Lihat detail</span>
        </div>
        <ChevronRight :size="16" class="notif-arrow" />
      </div>

      <!-- LAYANAN SECTION -->
      <div class="section section--brand">
        <div class="section-header">
          <div class="section-title-wrap">
            <img src="/icons/section/layanan.webp" class="section-icon" alt=""
              @error="(e) => e.target.style.display='none'" />
            <div>
              <h2 class="section-title">Layanan Kami</h2>
              <p class="section-sub">Semua kebutuhan digital kamu</p>
            </div>
          </div>
        </div>
        <div class="service-grid">
          <router-link v-for="s in services" :key="s.to" :to="s.to" class="service-card">
            <div class="service-icon-wrap" :style="{ background: s.bg }">
              <img :src="s.img" :alt="s.label" class="service-icon" />
            </div>
            <span class="service-label">{{ s.label }}</span>
            <span v-if="s.badge" class="service-badge">{{ s.badge }}</span>
          </router-link>
        </div>
      </div>

      <!-- TOP GAME SECTION -->
      <div class="section section--brand">
        <div class="section-header">
          <div class="section-title-wrap">
            <img src="/icons/section/game.webp" class="section-icon" alt=""
              @error="(e) => e.target.style.display='none'" />
            <div>
              <h2 class="section-title">Top Up Game</h2>
              <p class="section-sub">Harga terbaik, proses instan</p>
            </div>
          </div>
        </div>

        <div class="cat-pills">
          <button
            v-for="cat in categories"
            :key="cat.value"
            class="cat-pill"
            :class="{ active: activeCategory === cat.value }"
            @click="activeCategory = cat.value"
          >
            <span>{{ cat.label }}</span>
          </button>
        </div>

        <div v-if="productStore.loading" class="game-grid">
          <div v-for="i in 6" :key="i" class="game-skeleton" />
        </div>

        <div v-else-if="filteredGames.length > 0" class="game-grid">
          <router-link
            v-for="game in filteredGames"
            :key="game.brand"
            to="/checkout/top-up-game"
            class="game-card"
          >
            <div class="game-card-img-wrap">
              <img
                :src="getGameBanner(game.brand)"
                :alt="game.label"
                class="game-card-img"
                @error="(e) => e.target.src='/images/games/banner-default.webp'"
              />
              <div class="game-card-overlay" />
              <div class="game-card-logo-wrap">
                <img :src="getGameLogo(game.brand)" :alt="game.label" class="game-card-logo"
                  @error="(e) => e.target.style.display='none'" />
              </div>
            </div>
            <div class="game-card-body">
              <p class="game-card-name">{{ game.label }}</p>
              <p class="game-card-price">Mulai Rp{{ formatPrice(game.minPrice) }}</p>
            </div>
          </router-link>
        </div>

        <div v-else class="game-empty">
          <router-link to="/checkout/top-up-game" class="game-empty-btn">
            <Gamepad2 :size="18" />
            Lihat Semua Game
          </router-link>
        </div>
      </div>

      <!-- CS HELP BUTTON -->
      <!-- CS SECTION -->
      <div class="section">
        <div class="section-header">
          <div class="section-title-wrap">
            <img src="/icons/section/cs.webp" class="section-icon" alt=""
              @error="(e) => e.target.style.display='none'" />
            <div>
              <h2 class="section-title">Butuh Bantuan?</h2>
              <p class="section-sub">Tim CS kami siap 24/7 untuk kamu</p>
            </div>
          </div>
        </div>
        <div class="cs-card" @click="openChat">
          <span class="cs-card-label">Chat langsung dengan CS kami</span>
          <button class="cs-card-btn">
            Chat CS
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>

      <!-- HOW IT WORKS -->
      <HowItWorks />

    </div>

    <!-- FOOTER -->
    <HomeFooter />

    <!-- CHAT WIDGET -->
    <ChatWidget ref="chatWidgetRef" />

    <!-- TOAST -->
    <transition name="toast">
      <div v-if="showToast" class="toast">
        <Check :size="14" />
        <span>{{ toastMessage }}</span>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Check, ChevronRight, Gamepad2 } from 'lucide-vue-next'
import BannerSlider from '@/components/BannerSlider.vue'
import SkeletonBanner from '@/components/SkeletonBanner.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import ChatWidget from '@/components/frontend_ChatWidget.vue'
import { useProductStore } from '@/stores/productStore'
import { useOrderStore } from '@/stores/orderStore'
import { useTheme } from '@/composables/useTheme'

const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()
const { toggleTheme, isDark } = useTheme()

const showToast = ref(false)
const toastMessage = ref('')
const activeCategory = ref('all')
const chatWidgetRef = ref(null)

const trustPills = [
  { icon: '/icons/trust/support.webp',  label: 'CS 24 Jam'      },
  { icon: '/icons/trust/flash.webp',    label: 'Proses Instan'  },
  { icon: '/icons/trust/shield.webp',   label: '100% Aman'      },
  { icon: '/icons/trust/verified.webp', label: 'Terpercaya'     },
  { icon: '/icons/trust/cheap.webp',    label: 'Harga Terbaik'  },
]

const onPillTap = (e) => {
  const btn = e.currentTarget
  btn.classList.remove('burst')
  void btn.offsetWidth
  btn.classList.add('burst')
  setTimeout(() => btn.classList.remove('burst'), 700)
}

const pendingOrders = computed(() => orderStore.pendingOrders || [])

// Tap handler dengan animasi burst sama kayak BottomNav
const onBtnTap = (e, action) => {
  const btn = e.currentTarget
  btn.classList.remove('burst')
  void btn.offsetWidth
  btn.classList.add('burst')
  setTimeout(() => btn.classList.remove('burst'), 800)
  action()
}

const categories = [
  { value: 'all',     label: 'Semua'        },
  { value: 'mobile',  label: 'Mobile'       },
  { value: 'pc',      label: 'PC / Console' },
  { value: 'voucher', label: 'Voucher'      },
]

const MOBILE_GAMES  = ['MOBILE LEGENDS', 'FREE FIRE', 'PUBG MOBILE', 'CALL OF DUTY MOBILE', 'HONOR OF KINGS', 'GENSHIN IMPACT', 'WILD RIFT']
const PC_GAMES      = ['VALORANT', 'LEAGUE OF LEGENDS', 'STEAM', 'POINT BLANK', 'RAGNAROK', 'LOST ARK']
const VOUCHER_GAMES = ['ROBLOX', 'MINECRAFT', 'XBOX', 'PLAYSTATION', 'GOOGLE PLAY', 'NINTENDO']

const services = [
  { img: '/icons/pulsa.webp',        label: 'Pulsa',        to: '/checkout/pulsa',        bg: '#f0fdf4', badge: 'MURAH' },
  { img: '/icons/kuota.webp',        label: 'Kuota Data',   to: '/checkout/data',         bg: '#f0fdf4', badge: 'MURAH' },
  { img: '/icons/pln.webp',          label: 'Token PLN',    to: '/checkout/pln',          bg: '#f0fdf4', badge: null   },
  { img: '/icons/top-up-game.webp',  label: 'Top Up Game',  to: '/checkout/top-up-game',  bg: '#f0fdf4', badge: null   },
  { img: '/icons/voucher-game.webp', label: 'Voucher Game', to: '/checkout/game-voucher', bg: '#f0fdf4', badge: null   },
]

const GAME_ASSETS = {
  'MOBILE LEGENDS':      { banner: '/images/games/ml.webp',      logo: '/logos/games/ml.webp',              label: 'Mobile Legends'   },
  'FREE FIRE':           { banner: '/images/games/ff.webp',       logo: '/logos/games/ff.webp',              label: 'Free Fire'        },
  'PUBG MOBILE':         { banner: '/images/games/pubg.webp',     logo: '/logos/games/pubg.webp',            label: 'PUBG Mobile'      },
  'GENSHIN IMPACT':      { banner: '/images/games/genshin.webp',  logo: '/logos/games/genshin.webp',         label: 'Genshin Impact'   },
  'CALL OF DUTY MOBILE': { banner: '/images/games/cod.webp',      logo: '/logos/games/cod.webp',             label: 'Call of Duty'     },
  'VALORANT':            { banner: '/images/games/valorant.webp', logo: '/logos/games/valorant.webp',        label: 'Valorant'         },
  'LEAGUE OF LEGENDS':   { banner: '/images/games/lol.webp',      logo: '/logos/games/leagueoflegends.webp', label: 'League of Legends'},
  'ROBLOX':              { banner: '/images/games/roblox.webp',   logo: '/logos/games/roblox.webp',          label: 'Roblox'           },
}

const getGameBanner = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.banner || '/images/games/banner-default.webp'
const getGameLogo   = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.logo   || null
const getGameLabel  = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.label  || (brand||'').split(' ').map(w=>w[0]+w.slice(1).toLowerCase()).join(' ')

const allGames = computed(() => {
  const map = {}
  productStore.products
    .filter(p => (p.category||'').toLowerCase() === 'games' && p.brand)
    .forEach(p => {
      if (!map[p.brand]) map[p.brand] = { brand: p.brand, label: getGameLabel(p.brand), minPrice: Infinity }
      const price = parseFloat(p.selling_price || 0)
      if (price > 0 && price < map[p.brand].minPrice) map[p.brand].minPrice = price
    })
  return Object.values(map)
})

const filteredGames = computed(() => {
  if (activeCategory.value === 'all')     return allGames.value
  if (activeCategory.value === 'mobile')  return allGames.value.filter(g => MOBILE_GAMES.some(k => g.brand.toUpperCase().includes(k)))
  if (activeCategory.value === 'pc')      return allGames.value.filter(g => PC_GAMES.some(k => g.brand.toUpperCase().includes(k)))
  if (activeCategory.value === 'voucher') return allGames.value.filter(g => VOUCHER_GAMES.some(k => g.brand.toUpperCase().includes(k)))
  return allGames.value
})

const formatPrice = (price) => {
  const n = parseFloat(price || 0)
  if (n >= 1000000) return (n/1000000).toFixed(1)+'jt'
  if (n >= 1000)    return Math.round(n/1000)+'rb'
  return new Intl.NumberFormat('id-ID').format(n)
}

const handleBannerAction = () => {}

const openChat = () => {
  if (chatWidgetRef.value) chatWidgetRef.value.toggleChat()
}

onMounted(async () => {
  await productStore.fetchProducts()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--background, #f8fafc);
}

/* HEADER */
.home-header {
  position: sticky; top: 0; z-index: 40;
  background: var(--card, #ffffff);
  border-bottom: 1px solid var(--border, #e5e7eb);
  padding: 10px 16px;
  display: flex; align-items: center; justify-content: space-between;
}
.header-brand {
  font-size: 1.25rem; font-weight: 900; letter-spacing: -0.03em;
  display: flex; align-items: center; gap: 7px;
}
.brand-icon {
  width: 28px; height: 28px;
  object-fit: contain;
  flex-shrink: 0;
}
.brand-fee { color: var(--foreground, #111827); }
.brand-pay { color: #16a34a; }
.header-actions { display: flex; gap: 10px; }

.header-btn {
  width: 40px; height: 40px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 10px; border: none; background: transparent;
  color: var(--muted-foreground, #6b7280); cursor: pointer;
  transition: background 0.15s;
  -webkit-tap-highlight-color: transparent;
}
.header-btn:hover { background: var(--muted, #f3f4f6); color: var(--foreground, #111827); }

/* HEADER BUTTONS — semua 3 tombol pakai sistem ini */
.hbtn {
  position: relative;
  overflow: visible;
}

.hbtn-icon {
  width: 26px; height: 26px;
  object-fit: contain;
  position: relative; z-index: 2;
  opacity: 0.7;

  transition:
    opacity   0.25s ease,
    filter    0.25s ease,
    transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.hbtn:hover .hbtn-icon {
  opacity: 1;

}

/* Ripple rings */
.ripple-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(17,24,39,0.2);
  width: 20px; height: 20px;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}
.hbtn.burst .tr1 { animation: wave 0.6s cubic-bezier(0.15, 0.5, 0.3, 1) forwards; }
.hbtn.burst .tr2 { animation: wave 0.6s cubic-bezier(0.15, 0.5, 0.3, 1) 0.12s forwards; }
@keyframes wave {
  0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0.5; }
  100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0; }
}

/* Partikel titik */
.dot {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: #111827;
  top: 50%; left: 50%;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}
.hbtn.burst .td1 { animation: burst-dot 0.5s ease-out forwards 0.00s; --a: 0deg;   }
.hbtn.burst .td2 { animation: burst-dot 0.5s ease-out forwards 0.03s; --a: 90deg;  }
.hbtn.burst .td3 { animation: burst-dot 0.5s ease-out forwards 0.05s; --a: 180deg; }
.hbtn.burst .td4 { animation: burst-dot 0.5s ease-out forwards 0.03s; --a: 270deg; }
@keyframes burst-dot {
  0%   { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0)    scale(1.2); opacity: 0.7; }
  50%  { opacity: 0.5; }
  100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(-14px) scale(0);  opacity: 0; }
}

/* Icon pop saat diklik */
.hbtn.burst .hbtn-icon {
  animation: icon-pop 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes icon-pop {
  0%   { transform: scale(1);    }
  45%  { transform: scale(1.35); }
  72%  { transform: scale(1.12); }
  100% { transform: scale(1);    }
}

/* CONTENT */
.home-content {
  max-width: 480px;
  margin: 0 auto;
  padding: 16px 16px 90px;
  display: flex; flex-direction: column; gap: 20px;
  overflow: visible;
}

.banner-wrap {
  border-radius: 18px;
  overflow: visible;
  padding-bottom: 30px;
  position: relative;
  margin: 0 -2px;
}

/* Gradien mewah samar — sama kayak background page */
.banner-wrap::before {
  content: '';
  position: absolute;
  inset: -20px -24px;
  background: radial-gradient(ellipse 80% 60% at 50% 50%,
    rgba(22, 163, 74, 0.08) 0%,
    rgba(22, 163, 74, 0.03) 50%,
    transparent 75%
  );
  border-radius: 24px;
  z-index: 0;
  pointer-events: none;
}


.banner-wrap > * {
  position: relative;
  z-index: 1;
}

/* FLOATING PARTICLES */
.p {
  position: absolute;
  border-radius: 50%;
  background: #16a34a;
  pointer-events: none;
  z-index: 0;
  animation: float linear infinite;
}

/* Ukuran & posisi tiap partikel */
.p1 { width:5px;  height:5px;  left:8%;   top:20%; opacity:0.35; animation-duration:6s;  animation-delay:0s;   }
.p2 { width:3px;  height:3px;  left:18%;  top:70%; opacity:0.25; animation-duration:8s;  animation-delay:-2s;  }
.p3 { width:6px;  height:6px;  left:85%;  top:15%; opacity:0.3;  animation-duration:7s;  animation-delay:-1s;  }
.p4 { width:4px;  height:4px;  left:90%;  top:65%; opacity:0.2;  animation-duration:9s;  animation-delay:-3s;  }
.p5 { width:3px;  height:3px;  left:50%;  top:10%; opacity:0.3;  animation-duration:5s;  animation-delay:-4s;  }
.p6 { width:5px;  height:5px;  left:5%;   top:50%; opacity:0.2;  animation-duration:10s; animation-delay:-1.5s;}
.p7 { width:4px;  height:4px;  left:75%;  top:80%; opacity:0.25; animation-duration:7s;  animation-delay:-2.5s;}
.p8 { width:3px;  height:3px;  left:35%;  top:85%; opacity:0.2;  animation-duration:8s;  animation-delay:-5s;  }

@keyframes float {
  0%   { transform: translateY(0px)   scale(1);   }
  33%  { transform: translateY(-10px) scale(1.1); }
  66%  { transform: translateY(-4px)  scale(0.95);}
  100% { transform: translateY(0px)   scale(1);   }
}

/* TRUST PILLS */
.trust-pills { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; padding: 2px 0; }
.trust-pills::-webkit-scrollbar { display: none; }

.pill {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 7px 14px;
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 999px;
  font-size: 0.6875rem; font-weight: 700;
  color: var(--foreground, #374151);
  white-space: nowrap; flex-shrink: 0;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  transition: border-color 0.2s, background 0.2s;
}
.pill:hover { border-color: #16a34a; background: #f0fdf4; }

.pill-img {
  width: 14px; height: 14px;
  object-fit: contain;
  position: relative; z-index: 2;
  flex-shrink: 0;
}

/* Pill burst — ripple + partikel */
.pbtn { position: relative; overflow: visible; }

.ripple-ring {
  position: absolute;
  border-radius: 50%;
  border: 1.5px solid rgba(22,163,74,0.3);
  width: 16px; height: 16px;
  top: 50%; left: 18px;
  transform: translate(-50%, -50%) scale(0);
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}
.pbtn.burst .pr1 { animation: wave 0.5s ease-out forwards; }
.pbtn.burst .pr2 { animation: wave 0.5s ease-out 0.1s forwards; }
@keyframes wave {
  0%   { transform: translate(-50%,-50%) scale(0.2); opacity: 0.5; }
  100% { transform: translate(-50%,-50%) scale(3);   opacity: 0; }
}

.pdot {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: #16a34a;
  top: 50%; left: 18px;
  opacity: 0;
  pointer-events: none;
  z-index: 1;
}
.pbtn.burst .pd1 { animation: pill-dot 0.45s ease-out forwards 0.00s; --a: 0deg;   }
.pbtn.burst .pd2 { animation: pill-dot 0.45s ease-out forwards 0.02s; --a: 90deg;  }
.pbtn.burst .pd3 { animation: pill-dot 0.45s ease-out forwards 0.04s; --a: 180deg; }
.pbtn.burst .pd4 { animation: pill-dot 0.45s ease-out forwards 0.02s; --a: 270deg; }
@keyframes pill-dot {
  0%   { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0)    scale(1);  opacity: 0.7; }
  100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(-11px) scale(0); opacity: 0; }
}

.pbtn.burst .pill-img {
  animation: pill-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}
@keyframes pill-pop {
  0%  { transform: scale(1); }
  50% { transform: scale(1.3); }
  100%{ transform: scale(1); }
}

/* NOTIF BAR */
.notif-bar {
  display: flex; align-items: center; gap: 10px;
  padding: 12px 14px;
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-left: 3px solid #3b82f6;
  border-radius: 12px;
  cursor: pointer; transition: all 0.2s;
}
.notif-bar:hover { background: #dbeafe; }
.notif-dot { width: 8px; height: 8px; border-radius: 50%; background: #3b82f6; flex-shrink: 0; animation: pulse-blue 2s infinite; }
@keyframes pulse-blue {
  0%,100% { box-shadow: 0 0 0 0 rgba(59,130,246,0.4); }
  50%     { box-shadow: 0 0 0 4px rgba(59,130,246,0); }
}
.notif-text { flex: 1; display: flex; flex-direction: column; gap: 1px; }
.notif-title { font-size: 0.8125rem; font-weight: 700; color: #1e40af; }
.notif-sub   { font-size: 0.6875rem; color: #3b82f6; }
.notif-arrow { color: #93c5fd; flex-shrink: 0; }

/* SECTION */
.section { display: flex; flex-direction: column; gap: 12px; }

/* Brand background subtle di section utama */
.section--brand {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  padding: 14px 14px 16px;
  position: relative;
  overflow: hidden;
}

/* Green glow pojok kiri atas */
.section--brand::before {
  content: '';
  position: absolute;
  top: -30px; left: -30px;
  width: 120px; height: 120px;
  background: radial-gradient(circle, rgba(22,163,74,0.12) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Green glow pojok kanan bawah */
.section--brand::after {
  content: '';
  position: absolute;
  bottom: -20px; right: -20px;
  width: 100px; height: 100px;
  background: radial-gradient(circle, rgba(22,163,74,0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: 0;
}

/* Pastikan konten di atas glow */
.section--brand > * {
  position: relative;
  z-index: 1;
}
.section-header { display: flex; align-items: center; justify-content: space-between; }

.section-title-wrap {
  display: flex; align-items: center; gap: 10px;
}

.section-icon {
  width: 36px; height: 36px;
  object-fit: contain;
  flex-shrink: 0;
}

.section-title {
  font-size: 0.9375rem; font-weight: 800;
  color: var(--foreground, #111827);
  letter-spacing: -0.02em;
  line-height: 1.2;
  background: linear-gradient(135deg, var(--foreground,#111827) 0%, #16a34a 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.section-sub {
  font-size: 0.6875rem;
  color: var(--muted-foreground, #9ca3af);
  margin-top: 1px;
}

/* SERVICE GRID */
.service-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
.service-card {
  display: flex; flex-direction: column; align-items: center; gap: 7px;
  text-decoration: none; position: relative;
  transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.service-card:active { transform: scale(0.88); }
.service-icon-wrap {
  width: 58px; height: 58px;
  border-radius: 18px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  border: 1.5px solid rgba(22,163,74,0.15);
  box-shadow:
    0 2px 0 rgba(22,163,74,0.08),
    0 4px 12px rgba(22,163,74,0.1),
    0 1px 3px rgba(0,0,0,0.06);
}
.service-card:hover .service-icon-wrap {
  transform: translateY(-4px) scale(1.05);
  border-color: rgba(22,163,74,0.3);
  box-shadow:
    0 4px 0 rgba(22,163,74,0.12),
    0 10px 24px rgba(22,163,74,0.18),
    0 2px 6px rgba(0,0,0,0.08);
}
.service-icon { width: 34px; height: 34px; object-fit: contain; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.12)); }
.service-label {
  font-size: 0.625rem; font-weight: 700;
  color: var(--foreground, #374151);
  text-align: center; line-height: 1.2;
  letter-spacing: -0.01em;
}
.service-badge {
  position: absolute; top: -5px; left: 50%; transform: translateX(-50%);
  background: #ef4444; color: #fff;
  font-size: 7px; font-weight: 800;
  padding: 2px 6px; border-radius: 5px;
  white-space: nowrap; border: 1.5px solid #fff;
  box-shadow: 0 2px 4px rgba(239,68,68,0.3);
}

/* CATEGORY PILLS */
.cat-pills { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
.cat-pills::-webkit-scrollbar { display: none; }
.cat-pill {
  padding: 8px 16px; border-radius: 999px;
  font-size: 0.875rem; font-weight: 600;
  color: #6b7280; background: #fff;
  border: 1.5px solid #e5e7eb;
  cursor: pointer; white-space: nowrap;
  transition: all 0.2s;
  display: flex; align-items: center; gap: 6px;
}
.cat-pill:hover  { border-color: #16a34a; background: #f0fdf4; }
.cat-pill.active { background: #16a34a; color: #fff; border-color: #16a34a; }

/* GAME GRID */
.game-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px; }
.game-card {
  text-decoration: none; border-radius: 16px; overflow: hidden;
  background: var(--card, #ffffff); border: 1px solid var(--border, #e5e7eb);
  transition: all 0.3s cubic-bezier(0.34,1.56,0.64,1); position: relative;
}
.game-card:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 16px 32px rgba(0,0,0,0.12); border-color: #16a34a; }
.game-card-img-wrap { position: relative; aspect-ratio: 3/4; overflow: hidden; }
.game-card-img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s; }
.game-card:hover .game-card-img { transform: scale(1.07); }
.game-card-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.8) 100%); }
.game-card-logo-wrap {
  position: absolute; bottom: 46px; left: 10px;
  width: 30px; height: 30px;
  background: rgba(255,255,255,0.95); backdrop-filter: blur(4px);
  border-radius: 8px; display: flex; align-items: center; justify-content: center; padding: 4px;
}
.game-card-logo { width: 100%; height: 100%; object-fit: contain; }
.game-card-body { position: absolute; bottom: 0; left: 0; right: 0; padding: 10px 12px 12px; }
.game-card-name  { font-size: 0.8125rem; font-weight: 700; color: #fff; margin-bottom: 2px; text-shadow: 0 1px 4px rgba(0,0,0,0.6); }
.game-card-price { font-size: 0.6875rem; font-weight: 600; color: #4ade80; }

.game-skeleton {
  border-radius: 14px; aspect-ratio: 4/3;
  background: linear-gradient(90deg, var(--muted,#f3f4f6) 25%, #e9ebee 50%, var(--muted,#f3f4f6) 75%);
  background-size: 200% 100%; animation: shimmer 1.5s infinite;
}
@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }

.game-empty { display: flex; justify-content: center; padding: 20px 0; }
.game-empty-btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; background: #16a34a; color: #fff;
  border-radius: 999px; font-size: 0.8125rem; font-weight: 600;
  text-decoration: none; transition: background 0.2s;
}
.game-empty-btn:hover { background: #15803d; }

/* CS CARD */
.cs-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-left: 3px solid #16a34a;
  border-radius: 18px;
  padding: 14px 16px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}
.cs-card:hover {
  border-color: #16a34a;
  box-shadow: 0 4px 16px rgba(22,163,74,0.1);
  transform: translateY(-1px);
}
.cs-card-label {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted-foreground, #6b7280);
  flex: 1;
}
.cs-card-btn {
  display: flex; align-items: center; gap: 4px;
  padding: 9px 16px;
  background: #16a34a; color: #fff;
  border: none; border-radius: 999px;
  font-size: 0.8125rem; font-weight: 700;
  cursor: pointer; transition: all 0.2s;
  white-space: nowrap; flex-shrink: 0;
}
.cs-card-btn:hover { background: #15803d; }

/* TOAST */
.toast {
  position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%);
  background: #111827; color: #fff;
  padding: 10px 20px; border-radius: 999px;
  font-size: 0.8125rem; font-weight: 600;
  display: flex; align-items: center; gap: 8px;
  z-index: 100; white-space: nowrap;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2);
}
.toast-enter-active, .toast-leave-active { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }
</style>
