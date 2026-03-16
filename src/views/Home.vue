<template>
  <div class="home" ref="homeRef">

    <!-- TOP HEADER -->
    <div class="home-header">
      <div class="header-brand">
        <img src="/icons/game.webp" class="brand-icon" alt=""
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
      <!-- SEO H1: Hidden but readable by Search Engines -->
      <h1 class="sr-only">FEEPAY.ID: Platform Top Up Game & PPOB Termurah Proses Instan</h1>

      <!-- BANNER -->
      <div class="banner-wrap">
        <span class="p p1"></span>
<span class="p p2"></span>
<span class="p p3"></span>
<span class="p p4"></span>
<span class="p p5"></span>
<span class="p p6"></span>
<span class="p p7"></span>
<span class="p p8"></span>
        <SkeletonBanner v-if="productStore.loading" />
        <BannerSlider v-else @action="handleBannerAction" />
      </div>

      <!-- ANTIGRAVITY FLOATING HUB (Infinite Flow) -->
      <div class="antigravity-hub reveal reveal--up" v-reveal>
        <div class="anti-flow-track" style="transform: translate3d(calc(-50% + (var(--scrollY) * 0.05px)), 0, 0)">
          <!-- First Set -->
          <button
            v-for="(pill, idx) in trustPills"
            :key="'p1-' + idx"
            class="anti-pill"
            :class="'wave-' + ((idx % 4) + 1)"
            :style="{ '--delay': (idx * 0.4) + 's' }"
            @click="onPillTap($event, pill)"
          >
            <!-- Simplified Burst (4 Dots instead of 12) -->
            <span v-for="n in 4" :key="n" :class="'pdot pd' + n"></span>
            
            <div class="anti-pill-glass">
              <img :src="pill.icon" :alt="pill.label" class="anti-pill-img"
                @error="(e) => e.target.style.display='none'" />
            </div>
            <span class="anti-pill-label">{{ pill.label }}</span>
          </button>
          
          <!-- Duplicated Set for Seamless Loop -->
          <button
            v-for="(pill, idx) in trustPills"
            :key="'p2-' + idx"
            class="anti-pill"
            :class="'wave-' + ((idx % 4) + 1)"
            :style="{ '--delay': (idx * 0.4) + 's' }"
            @click="onPillTap($event, pill)"
          >
            <span v-for="n in 4" :key="n" :class="'pdot pd' + n"></span>
            <div class="anti-pill-glass">
              <img :src="pill.icon" :alt="pill.label" class="anti-pill-img"
                @error="(e) => e.target.style.display='none'" />
            </div>
            <span class="anti-pill-label">{{ pill.label }}</span>
          </button>
        </div>
      </div>

      <!-- PENDING ORDER NOTIF (Original Style) -->
      <div v-if="pendingOrders.length > 0" class="notif-bar" @click="router.push('/transactions')">
        <div class="pulse-ring-small"></div>
        <div class="notif-dot"></div>
        <div class="notif-text">
          <span class="notif-title">{{ pendingOrders.length }} Transaksi Sedang Diproses</span>
          <span class="notif-sub">{{ pendingOrders[0].product_name }} · Lihat detail</span>
        </div>
        <ChevronRight :size="16" class="notif-arrow" />
      </div>

      <!-- LAYANAN SECTION -->
      <div class="section section--premium reveal reveal--left" v-reveal>
        <!-- Section Background Particles -->
        <div class="section-bg-art" style="transform: translate3d(calc(var(--scrollY) * 0.1px), 0, 0)">
          <AntigravityParticles absolute :particle-count="15" class="opacity-20" />
        </div>

        <div class="section-header">
          <div class="section-title-wrap">
            <div class="section-icon-bg">
              <img src="/icons/section/layanan.webp" class="section-icon" alt=""
                @error="(e) => e.target.style.display='none'" />
            </div>
            <div>
              <h2 class="section-title">Layanan Digital</h2>
              <p class="section-sub">Solusi pembayaran instan 24/7</p>
            </div>
          </div>
        </div>
        
        <div class="service-grid-premium">
          <router-link v-for="(s, idx) in services" :key="s.to" :to="s.to" 
            class="service-card-premium reveal reveal--up" 
            v-reveal
            :style="{ 
              '--idx': idx,
              '--p-delay': (idx * 0.05) + 's'
            }"
          >
            <div class="service-icon-container">
              <div class="service-squircle squircle" :style="{ background: s.bg || 'var(--primary-muted)' }">
                <img :src="s.img" :alt="s.label" class="service-img-hd" />
              </div>
              <div v-if="s.badge" class="service-badge-hd">{{ s.badge }}</div>
            </div>
            <span class="service-label-hd">{{ s.label }}</span>
          </router-link>
        </div>
      </div>

      <!-- TOP GAME SECTION -->
      <div class="section section--brand reveal reveal--right" v-reveal>
        <div class="section-header">
          <div class="section-title-wrap">
            <img src="/icons/section/game.webp" class="section-icon" alt=""
              @error="(e) => e.target.style.display='none'" />
            <div>
              <h2 class="section-title">Top Up Game</h2>
              <p class="section-sub">Akses instan ke berbagai judul game populer dunia</p>
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
            v-for="(game, idx) in filteredGames"
            :key="game.brand"
            to="/checkout/top-up-game"
            class="game-card reveal"
            :class="'stagger-' + ((idx % 4) + 1)"
          >
            <!-- 3D Holographic Container -->
            <div class="game-card-perspective">
              <!-- Background Holographic Ring -->
              <div class="game-hologram-ring"></div>
              
              <div class="game-card-img-wrap">
                <img
                  :src="getGameBanner(game.brand)"
                  :alt="game.label"
                  class="game-card-img"
                  :loading="idx < 4 ? 'eager' : 'lazy'"
                  decoding="async"
                  :fetchpriority="idx < 4 ? 'high' : 'low'"
                  @error="(e) => e.target.src='/images/games/banner-default.jpg'"
                />
                <div class="game-card-overlay-glass"></div>
                
                <!-- Floating Price Tag -->
                <div class="game-price-tag">
                  <span class="price-prefix">Mulai</span>
                  <span class="price-value">Rp{{ formatPrice(game.minPrice) }}</span>
                </div>

                <!-- Game Logo Glass -->
                <div class="game-card-logo-glass">
                  <img :src="getGameLogo(game.brand)" :alt="game.label" class="game-card-logo"
                    loading="lazy" decoding="async"
                    @error="(e) => e.target.style.display='none'" />
                </div>
              </div>

              <div class="game-card-footer">
                <h3 class="game-card-name">{{ game.label }}</h3>
                <div class="game-card-stats">
                  <Activity :size="10" /> 
                  <span>Instan 24 Jam</span>
                </div>
              </div>
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
      <div class="section section--nexus reveal reveal--up" v-reveal>
        <div class="section-header">
          <div class="section-title-wrap">
            <div class="section-icon-wrap nexus-ring-wrap">
              <div class="nexus-hologram-ring"></div>
              <img src="/icons/section/cs.webp" class="section-icon" alt=""
                @error="(e) => e.target.style.display='none'" />
            </div>
            <div>
              <h2 class="section-title">Pusat Bantuan</h2>
              <p class="section-sub">Dukungan teknis responsif tersedia 24 jam setiap hari</p>
            </div>
          </div>
        </div>

        <div class="cs-card-nexus group" @click="openChat">
          <!-- Internal Holographic Particles -->
          <div class="cs-nexus-bg">
            <AntigravityParticles :particle-count="15" absolute class="opacity-30" />
          </div>

          <div class="cs-nexus-content">
            <div class="cs-nexus-info">
              <span class="cs-nexus-label">Chat langsung dengan CS kami</span>
              <div class="cs-status-indicator">
                <span class="status-pulse"></span>
                <span class="status-text">Sekarang Aktif</span>
              </div>
            </div>
            
            <button class="cs-nexus-btn">
              <span>Chat CS</span>
              <div class="cs-btn-icon">
                <ChevronRight :size="16" />
              </div>
            </button>
          </div>
          
          <!-- Bottom Glow Effect -->
          <div class="cs-nexus-glow"></div>
        </div>
      </div>

      <!-- HOW IT WORKS -->
      <HowItWorks />

      <!-- SEO FAQ SECTION -->
      <section class="section section--faq reveal reveal--up" v-reveal id="faq">
        <div class="section-header">
          <div class="section-title-wrap">
            <div class="section-icon-bg">
              <img src="/icons/section/layanan.webp" class="section-icon" alt="FAQ"
                @error="(e) => e.target.style.display='none'" />
            </div>
            <div>
              <h2 class="section-title">Pertanyaan Umum (FAQ)</h2>
              <p class="section-sub">Segala hal yang sering ditanyakan pelanggan kami</p>
            </div>
          </div>
        </div>

        <div class="faq-accordion">
          <div 
            v-for="(f, i) in faqs" 
            :key="i" 
            class="faq-card"
            :class="{ 'faq-card--active': activeFaqIndex === i }"
          >
            <button class="faq-trigger" @click="toggleFaq(i)">
              <span class="faq-question-text">{{ f.q }}</span>
              <div class="faq-chevron-wrap">
                <ChevronDown :size="18" class="faq-chevron" />
              </div>
            </button>
            <div class="faq-content-wrap" :style="{ maxHeight: activeFaqIndex === i ? '500px' : '0' }">
              <div class="faq-answer-inner">
                <p class="faq-answer-text">{{ f.a }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ Schema JSON-LD -->
        <component :is="'script'" type="application/ld+json" v-html="JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          'mainEntity': faqs.map(f => ({
            '@type': 'Question',
            'name': f.q,
            'acceptedAnswer': {
              '@type': 'Answer',
              'text': f.a
            }
          }))
        })"></component>
      </section>

    </div>

    <!-- FOOTER -->
    <HomeFooter />

    <!-- CHAT WIDGET -->
    <ChatWidget ref="chatWidgetRef" />

    <!-- TOAST -->
    <Transition name="toast">
      <div v-if="showToast" class="toast">
        <Check :size="14" />
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { Activity, Check, ChevronRight, Gamepad2, Clock, ChevronDown } from 'lucide-vue-next'
import BannerSlider from '@/components/BannerSlider.vue'
import SkeletonBanner from '@/components/SkeletonBanner.vue'
import HowItWorks from '@/components/home/HowItWorks.vue'
import HomeFooter from '@/components/home/HomeFooter.vue'
import ChatWidget from '@/components/frontend_ChatWidget.vue'
import { useProductStore } from '@/stores/productStore'
import { useOrderStore } from '@/stores/orderStore'
import { useTheme } from '@/composables/useTheme'
import AntigravityParticles from '@/components/AntigravityParticles.vue'
import { formatPrice as utilsFormatPrice } from '@/utils/format'

const router = useRouter()
const productStore = useProductStore()
const orderStore = useOrderStore()
const { toggleTheme, isDark } = useTheme()

// Animation Loop Reference
let animationRequestId = null

const showToast = ref(false)
const toastMessage = ref('')
const activeCategory = ref('all')
const chatWidgetRef = ref(null)
const homeRef = ref(null)
const targetScrollY = ref(0)
const smoothScrollY = ref(0)
const scrollVelocity = ref(0)
let lastSmoothY = 0

const updatePhysics = () => {
  const delta = (targetScrollY.value - smoothScrollY.value) * 0.12
  
  // Only update if there's meaningful movement
  if (Math.abs(delta) > 0.05 || Math.abs(scrollVelocity.value) > 0.05) {
    smoothScrollY.value += delta
    scrollVelocity.value = smoothScrollY.value - lastSmoothY
    lastSmoothY = smoothScrollY.value

    if (homeRef.value) {
      homeRef.value.style.setProperty('--scrollY', smoothScrollY.value.toFixed(1))
      homeRef.value.style.setProperty('--velocity', scrollVelocity.value.toFixed(1))
    }
  }
  
  animationRequestId = requestAnimationFrame(updatePhysics)
}

const trustPills = [
  { icon: '/icons/nav/history.webp',    label: 'Riwayat'        , to: '/transactions' },
  { icon: '/icons/trust/support.webp',  label: 'CS 24 Jam'      },
  { icon: '/icons/trust/flash.webp',    label: 'Proses Instan'  },
  { icon: '/icons/trust/shield.webp',   label: '100% Aman'      },
  { icon: '/icons/trust/verified.webp', label: 'Terpercaya'     },
]

const onPillTap = (e, pill) => {
  const btn = e.currentTarget
  btn.classList.remove('burst')
  void btn.offsetWidth
  btn.classList.add('burst')
  setTimeout(() => btn.classList.remove('burst'), 700)
  
  if (pill && pill.to) {
    setTimeout(() => router.push(pill.to), 400)
  }
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

const getGameBanner = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.banner || '/images/games/banner-default.jpg'
const getGameLogo   = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.logo   || null
const getGameLabel  = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.label  || (brand||'').split(' ').map(w=>w[0]+w.slice(1).toLowerCase()).join(' ')

const allGames = computed(() => {
  const map = {}
  productStore.products
    .filter(p => (p.category||'').toLowerCase() === 'games' && p.brand)
    .forEach(p => {
      const brandKey = p.brand.toUpperCase().trim()
      if (!map[brandKey]) {
        map[brandKey] = { 
          brand: brandKey, 
          label: getGameLabel(p.brand), 
          minPrice: Infinity 
        }
      }
      const price = parseFloat(p.selling_price || 0)
      if (price > 0 && price < map[brandKey].minPrice) map[brandKey].minPrice = price
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

const formatPrice = (price) => utilsFormatPrice(price, { useShorthand: true, withPrefix: false })

const handleBannerAction = () => {}

const openChat = () => {
  if (chatWidgetRef.value) chatWidgetRef.value.toggleChat()
}

const handleScroll = () => {
  targetScrollY.value = window.scrollY
}

const activeFaqIndex = ref(null)

const toggleFaq = (index) => {
  activeFaqIndex.value = activeFaqIndex.value === index ? null : index
}

const faqs = [
  { q: 'Apa itu FEEPAY.ID?', a: 'FEEPAY.ID adalah platform penyedia layanan top up game, pulsa, dan layanan digital (PPOB) termurah dan tercepat di Indonesia.' },
  { q: 'Apakah top up di FEEPAY aman?', a: 'Sangat aman! Kami menggunakan sistem otomatis yang terhubung langsung dengan provider resmi. Pembayaran juga menggunakan payment gateway terenkripsi.' },
  { q: 'Berapa lama proses transaksi?', a: 'Proses transaksi di FEEPAY sangat cepat, rata-rata hanya memakan waktu 1-5 menit setelah pembayaran terverifikasi.' },
  { q: 'Metode pembayaran apa saja yang tersedia?', a: 'Kami menyediakan berbagai metode pembayaran mulai dari QRIS, Transfer Bank (VA), hingga E-Wallet (OVO, DANA, GoPay, LinkAja).' },
  { q: 'Bagaimana jika saya mengalami kendala?', a: 'Tim Customer Service kami siap membantu Anda 24/7 melalui fitur Live Chat di website atau WhatsApp resmi kami.' }
]

onMounted(async () => {
  window.addEventListener('scroll', handleScroll, { passive: true })
  updatePhysics()
  await productStore.fetchProducts()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  if (animationRequestId) cancelAnimationFrame(animationRequestId)
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  background: var(--background, #f8fafc);
}

/* Accessibility: Visually Hidden but readable by SEO */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* HEADER */
.home-header {
  position: sticky; top: 0; z-index: 40;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border, #e5e7eb);
  padding: 12px 16px;
  display: flex; align-items: center; justify-content: space-between;
}
.dark .home-header {
  background: rgba(22, 28, 45, 0.85);
  border-color: rgba(255, 255, 255, 0.05);
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
  border-radius: 12px; border: none; background: transparent;
  color: var(--muted-foreground, #6b7280); cursor: pointer;
  transition: all 0.3s var(--ease-out-expo);
  -webkit-tap-highlight-color: transparent;
}
.header-btn:hover { 
  background: var(--primary-muted, #f0fdf4); 
  color: var(--primary, #16a34a);
  transform: translateY(-2px);
}
.dark .header-btn:hover { background: rgba(22, 163, 74, 0.1); }

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
  transition: all 0.4s var(--ease-spring);
}
.hbtn:hover .hbtn-icon {
  opacity: 1;
  transform: scale(1.15) rotate(5deg);
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

/* Transition Scale */
.scale-enter-active, .scale-leave-active { transition: all 0.3s var(--ease-spring); }
.scale-enter-from, .scale-leave-to { transform: scale(0.6); opacity: 0; }

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
  padding: 16px 16px 90px;
  display: flex; flex-direction: column; gap: 20px;
  overflow: visible;
}

@media (min-width: 768px) {
  .home-content {
    max-width: 100%;
    margin: 0 auto;
    padding: 20px 16px 80px;
  }
  .home-header {
    display: flex !important; /* Always show in 480px frame */
  }
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
  inset: -10px -12px;
  background: radial-gradient(circle at 50% 50%,
    rgba(22, 163, 74, 0.05) 0%,
    transparent 80%
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
/* Simplifikasi Partikel - Cukup 4 agar ringan */
.p1 { width:4px;  height:4px;  left:10%;  top:20%; opacity:0.2;  animation-duration:8s;  }
.p2 { width:3px;  height:3px;  left:85%;  top:60%; opacity:0.15; animation-duration:12s; }
.p3 { width:5px;  height:5px;  left:20%;  top:80%; opacity:0.1;  animation-duration:10s; }
.p4 { width:3px;  height:3px;  left:70%;  top:15%; opacity:0.15; animation-duration:9s;  }
/* p5-p8 dihilangkan demi performa */

@keyframes float {
  0%   { transform: translateY(0px)   scale(1);   }
  33%  { transform: translateY(-10px) scale(1.1); }
  66%  { transform: translateY(-4px)  scale(0.95);}
  100% { transform: translateY(0px)   scale(1);   }
}

/* ANTIGRAVITY FLOATING HUB */
.antigravity-hub {
  position: relative;
  overflow: hidden;
  padding: 20px 0;
  margin-bottom: 12px;
  min-height: 100px;
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
  -webkit-mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.anti-flow-track {
  display: flex;
  width: fit-content;
  gap: 20px;
  animation: anti-drift 30s linear infinite;
  padding-left: 20px;
}

.antigravity-hub:hover .anti-flow-track {
  animation-play-state: paused;
}

@keyframes anti-drift {
  0%   { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.anti-pill {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  cursor: pointer;
  animation: anti-float 4s ease-in-out infinite;
  animation-delay: var(--delay);
  transition: transform 0.3s var(--ease-spring);
  flex-shrink: 0;
}

.anti-pill-glass {
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1.5px solid rgba(22, 163, 74, 0.12);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 20px rgba(0, 0, 0, 0.03),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
  transition: all 0.4s var(--ease-spring);
}

.anti-pill:hover .anti-pill-glass {
  background: #fff;
  transform: scale(1.1) translateY(-4px);
  border-color: var(--primary, #16a34a);
  box-shadow: 0 12px 30px rgba(22, 163, 74, 0.12);
}

.anti-pill-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.anti-pill-label {
  font-size: 0.625rem;
  font-weight: 800;
  color: var(--foreground, #111827);
  white-space: nowrap;
  opacity: 0.6;
  transition: opacity 0.3s;
}

.anti-pill:hover .anti-pill-label {
  opacity: 1;
}

/* WAVY OFFSET & ANIMATION */
.wave-1 { --y: -8px; }
.wave-2 { --y: 8px;  }
.wave-3 { --y: -4px; }
.wave-4 { --y: 4px;  }

.anti-pill.wave-1, .anti-pill.wave-2, .anti-pill.wave-3, .anti-pill.wave-4 {
  transform: translateY(var(--y));
}

@keyframes anti-float {
  0%, 100% { transform: translateY(var(--y)); }
  50% { transform: translateY(calc(var(--y) - 12px)); }
}

/* APPLE-STYLE BLACK BURST (12 DOTS) */
.pdot {
  position: absolute;
  width: 3.5px; height: 3.5px;
  border-radius: 50%;
  background: #111827; /* Apple Style Black */
  top: 40%; left: 50%;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}

.anti-pill.burst .pd1  { animation: apple-burst 0.5s ease-out forwards 0.00s; --a: 0deg;   }
.anti-pill.burst .pd2  { animation: apple-burst 0.5s ease-out forwards 0.05s; --a: 90deg;  }
.anti-pill.burst .pd3  { animation: apple-burst 0.5s ease-out forwards 0.10s; --a: 180deg; }
.anti-pill.burst .pd4  { animation: apple-burst 0.5s ease-out forwards 0.15s; --a: 270deg; }

@keyframes apple-burst {
  0%   { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0)    scale(1);  opacity: 0.8; }
  100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(-22px) scale(0); opacity: 0;   }
}

/* NOTIF BAR (Restore Original) */
.notif-bar {
  display: flex; align-items: center; gap: 12px;
  padding: 12px 16px;
  background: rgba(22, 163, 74, 0.08);
  border: 1px solid rgba(22, 163, 74, 0.15);
  border-left: 4px solid var(--primary, #16a34a);
  border-radius: 16px;
  cursor: pointer; transition: all 0.3s;
  margin-bottom: 20px;
  position: relative; overflow: hidden;
}
.notif-bar:hover { background: rgba(22, 163, 74, 0.12); transform: translateX(4px); }
.notif-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--primary, #16a34a); flex-shrink: 0; position: relative; z-index: 10; }

.pulse-ring-small {
  position: absolute; left: 16px; top: 18px;
  width: 10px; height: 10px; border-radius: 50%;
  border: 3px solid var(--primary, #16a34a);
  animation: pulse-ring 2s infinite;
  pointer-events: none;
}

.notif-text { flex: 1; display: flex; flex-direction: column; gap: 2px; }
.notif-title { font-size: 0.875rem; font-weight: 800; color: var(--foreground); }
.notif-sub   { font-size: 0.75rem; color: var(--muted-foreground); }
.notif-arrow { color: var(--muted-foreground); flex-shrink: 0; opacity: 0.5; }

/* SECTION PREMIUM (Dominant Section) */
.section--premium {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 24px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.03);
  margin-bottom: 24px;
}

.section-bg-art {
  position: absolute; inset: 0; 
  pointer-events: none; opacity: 0.4;
  background: radial-gradient(circle at top left, var(--primary-muted, #f0fdf4) 0%, transparent 40%);
}

.section-icon-bg {
  width: 44px; height: 44px;
  background: var(--muted, #f3f4f6);
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}

/* SERVICE GRID HD (Gopay Style) */
.service-grid-premium {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px 12px;
  margin-top: 24px;
}

.service-card-premium {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  transition: transform 0.4s var(--ease-spring), opacity 0.4s ease;
}

.service-icon-container {
  position: relative;
  width: 62px;
  height: 62px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.service-squircle {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--primary-muted);
  box-shadow: var(--shadow-md);
  transition: all 0.4s var(--ease-spring);
}

.service-card-premium:hover .service-squircle {
  transform: translateY(-4px) scale(1.05);
  box-shadow: var(--shadow-lg);
}

.service-img-hd {
  width: 32px;
  height: 32px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0,0,0,0.08));
  transition: transform 0.4s var(--ease-spring);
}

.service-card-premium:hover .service-img-hd {
  transform: scale(1.1);
}

.service-label-hd {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--foreground);
  text-align: center;
  letter-spacing: -0.01em;
  transition: color 0.3s;
}

.service-card-premium:hover .service-label-hd {
  color: var(--primary);
}

.service-badge-hd {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #EF4444; /* Standard Red for focus */
  color: #fff;
  font-size: 0.55rem;
  font-weight: 900;
  padding: 2px 6px;
  border-radius: 6px;
  border: 2px solid #fff;
  box-shadow: 0 4px 8px rgba(239, 68, 68, 0.2);
  z-index: 2;
  transform: rotate(4deg);
}

.dark .service-badge-hd {
  border-color: var(--card);
}

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
  color: var(--muted-foreground); background: var(--card);
  border: 1.5px solid var(--border);
  cursor: pointer; white-space: nowrap;
  transition: all 0.2s;
  display: flex; align-items: center; gap: 6px;
}
.cat-pill:hover  { border-color: var(--accent); background: var(--accent-light); }
.cat-pill.active { background: var(--accent); color: var(--accent-foreground); border-color: var(--accent); }

/* HOLOGRAPHIC FLOATING GRID (Top Up Game) */
.game-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  margin-top: 16px;
  perspective: 1000px;
}

.game-card {
  text-decoration: none;
  background: transparent;
  border: none;
  cursor: pointer;
  border-radius: 20px;
  position: relative;
  transition: transform 0.1s ease-out;
}

.game-card-perspective {
  position: relative;
  width: 100%;
  border-radius: 18px;
  background: var(--card);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all 0.4s var(--ease-spring);
  transform-style: preserve-3d;
  box-shadow: var(--shadow-sm);
}

.game-card:hover .game-card-perspective {
  transform: translateY(-6px);
  border-color: var(--primary-light);
  box-shadow: var(--shadow-lg);
}

/* Holographic Rotating Ring Decoration */
.game-hologram-ring {
  position: absolute;
  top: -20px; right: -20px;
  width: 120px; height: 120px;
  border: 2px dashed rgba(22, 163, 74, 0.15);
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  opacity: 0;
  transition: all 0.6s var(--ease-spring);
  transform: scale(0.5) rotate(0deg);
}

.game-card:hover .game-hologram-ring {
  opacity: 1;
  transform: scale(1) rotate(180deg);
}

.game-card-img-wrap {
  position: relative;
  aspect-ratio: 4/5;
  overflow: hidden;
  z-index: 1;
}

.game-card-img {
  width: 100%; height: 100%;
  object-fit: cover;
  transition: transform 0.8s var(--ease-out-expo);
}

.game-card:hover .game-card-img {
  transform: scale(1.1);
}

/* Glassmorphic Overlay */
.game-card-overlay-glass {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, 
    transparent 40%, 
    rgba(0, 0, 0, 0.3) 70%,
    rgba(0, 0, 0, 0.9) 100%
  );
  z-index: 2;
  transition: opacity 0.4s;
}

/* Floating Price Tag (Premium Glass) */
.game-price-tag {
  position: absolute;
  top: 12px; right: 12px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  z-index: 10;
  transition: all 0.4s var(--ease-spring);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.game-card:hover .game-price-tag {
  transform: scale(1.1) translateX(-4px);
  background: var(--primary, #16a34a);
  border-color: rgba(255, 255, 255, 0.4);
}

.price-prefix {
  font-size: 0.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.7);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  line-height: 1;
}

.price-value {
  font-size: 0.75rem;
  font-weight: 900;
  color: #fff;
  line-height: 1.2;
}

/* Game Logo with Glass container */
.game-card-logo-glass {
  position: absolute;
  bottom: 10px; left: 10px;
  width: 30px; height: 30px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(8px);
  border-radius: 8px;
  padding: 4px;
  z-index: 10;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(255, 255, 255, 0.4);
  transition: all 0.4s var(--ease-spring);
}

.game-card:hover .game-card-logo-glass {
  transform: translateY(-4px) scale(1.1) rotate(-5deg);
}

.game-card-logo {
  width: 100%; height: 100%;
  object-fit: contain;
}

/* Footer Section */
.game-card-footer {
  padding: 12px;
  background: var(--card, #fff);
  position: relative;
  z-index: 1;
}

.game-card-name {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--foreground, #111827);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
  letter-spacing: -0.01em;
}

.game-card-stats {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.625rem;
  font-weight: 600;
  color: var(--muted-foreground, #6b7280);
}

.game-card-stats svg {
  color: var(--primary, #16a34a);
  opacity: 0.8;
}

/* Skeleton update */
.game-skeleton {
  border-radius: 20px; aspect-ratio: 4/5;
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

/* SUPPORT NEXUS REDESIGN */
.section--nexus {
  margin-top: 24px;
  position: relative;
}

.nexus-ring-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nexus-hologram-ring {
  position: absolute;
  inset: -6px;
  border: 1.5px dashed rgba(22, 163, 74, 0.4);
  border-radius: 50%;
  animation: nexus-rotate 8s linear infinite;
  opacity: 0.6;
}

@keyframes nexus-rotate {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.cs-card-nexus {
  position: relative;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(240, 253, 244, 0.9));
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(22, 163, 74, 0.15);
  border-radius: 20px;
  padding: 16px 20px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  transition: all 0.5s var(--ease-spring);
  box-shadow: 
    0 10px 30px rgba(0, 0, 0, 0.04),
    inset 0 1px 1px rgba(255, 255, 255, 0.8);
}

.cs-card-nexus:hover {
  transform: translateY(-4px) scale(1.01);
  border-color: var(--primary, #16a34a);
  box-shadow: 
    0 20px 40px rgba(22, 163, 74, 0.1),
    0 0 0 1px rgba(22, 163, 74, 0.1);
}

.cs-nexus-bg {
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
}

.cs-nexus-content {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.cs-nexus-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.cs-nexus-label {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--foreground, #111827);
  letter-spacing: -0.01em;
}

.cs-status-indicator {
  display: flex;
  align-items: center;
  gap: 6px;
}

.status-pulse {
  width: 6px; height: 6px;
  background: var(--primary, #16a34a);
  border-radius: 50%;
  position: relative;
}

.status-pulse::after {
  content: '';
  position: absolute;
  inset: -2px;
  border-radius: 50%;
  background: var(--primary, #16a34a);
  opacity: 0.4;
  animation: nexus-pulse 2s infinite;
}

@keyframes nexus-pulse {
  0%   { transform: scale(1); opacity: 0.4; }
  100% { transform: scale(3); opacity: 0;   }
}

.status-text {
  font-size: 0.625rem;
  font-weight: 800;
  color: var(--primary, #16a34a);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cs-nexus-btn {
  background: var(--primary, #16a34a);
  color: #fff;
  border: none;
  padding: 8px 16px;
  border-radius: 14px;
  font-size: 0.8125rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.25);
  transition: all 0.3s var(--ease-spring);
}

.cs-card-nexus:hover .cs-nexus-btn {
  transform: translateX(4px) scale(1.05);
  box-shadow: 0 12px 25px rgba(22, 163, 74, 0.35);
}

.cs-btn-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px; height: 20px;
}

.cs-nexus-glow {
  position: absolute;
  bottom: -40px; left: 50%;
  width: 120%; height: 60px;
  background: radial-gradient(circle, rgba(22, 163, 74, 0.15) 0%, transparent 70%);
  transform: translateX(-50%);
  filter: blur(20px);
  z-index: 0;
  opacity: 0;
  transition: opacity 0.5s;
}

.cs-card-nexus:hover .cs-nexus-glow {
  opacity: 1;
}

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

/* DIRECTIONAL REVEALS */
.reveal--left { transform: translateX(-30px); opacity: 0; }
.reveal--right { transform: translateX(30px); opacity: 0; }
.reveal--up { transform: translateY(40px); opacity: 0; }

.reveal.active.reveal--left,
.reveal.active.reveal--right,
.reveal.active.reveal--up {
  transform: translate(0, 0);
  opacity: 1;
}

/* PARALLAX & INERTIA HELPERS */
.parallax-layer, .section-bg-art, .anti-flow-track {
  will-change: transform;
}

.service-card-premium {
  will-change: transform, opacity;
}

.service-badge-premium {
  position: absolute;
  top: -8px; right: -8px;
  background: #16a34a;
  color: #fff;
  font-size: 0.6rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.2);
  z-index: 10;
  border: 1.5px solid #fff;
}

/* Section Refinement ( Sharp & Clean ) */
.section--premium, .section--brand, .section--nexus {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 20px;
  padding: 18px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
}

.dark .section--premium, .dark .section--brand, .dark .section--nexus {
  background: rgba(22, 28, 45, 0.6);
  border-color: rgba(255, 255, 255, 0.05);
}
/* FAQ ACCORDION (Antigravity Style) */
.faq-accordion {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.faq-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  overflow: hidden;
  transition: all 0.5s var(--ease-spring);
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
}

.faq-card:hover {
  border-color: rgba(22, 163, 74, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.04);
}

.faq-card--active {
  border-color: var(--primary, #16a34a);
  background: linear-gradient(135deg, var(--card, #fff) 0%, var(--primary-muted, #f0fdf4) 100%);
  box-shadow: 0 15px 35px rgba(22, 163, 74, 0.1);
}

.faq-trigger {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  text-align: left;
}

.faq-question-text {
  font-size: 0.875rem;
  font-weight: 800;
  color: var(--foreground, #111827);
  letter-spacing: -0.01em;
  line-height: 1.4;
}

.faq-chevron-wrap {
  width: 32px;
  height: 32px;
  background: var(--muted, #f3f4f6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.4s var(--ease-spring);
}

.faq-card--active .faq-chevron-wrap {
  background: var(--primary, #16a34a);
  color: #fff;
  transform: rotate(180deg);
}

.faq-chevron {
  transition: transform 0.4s var(--ease-spring);
}

.faq-content-wrap {
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.faq-answer-inner {
  padding: 0 20px 20px;
}

.faq-answer-text {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--muted-foreground, #6b7280);
  line-height: 1.6;
}

.dark .faq-card--active {
  background: linear-gradient(135deg, rgba(22, 28, 45, 0.8) 0%, rgba(22, 163, 74, 0.1) 100%);
}
</style>
