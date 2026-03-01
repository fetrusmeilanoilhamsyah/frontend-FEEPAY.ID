<template>
  <div class="game-page">

    <!-- Header -->
    <div class="game-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Top Up Game</h1>
          <p class="header-sub">Isi diamond, UC, CP langsung ke akun</p>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- Search Bar -->
      <div class="search-wrap">
        <Search :size="18" class="search-icon" />
        <input v-model="searchQuery" type="text" placeholder="Cari game..." class="search-input" />
        <button v-if="searchQuery" @click="searchQuery = ''" class="search-clear">
          <X :size="16" />
        </button>
      </div>

      <!-- Game Grid -->
      <div v-if="!selectedGame">
        <div class="cat-tabs">
          <button v-for="cat in categories" :key="cat.key" @click="activeCategory = cat.key"
            class="cat-tab" :class="{ active: activeCategory === cat.key }">
            {{ cat.label }}
          </button>
        </div>

        <div v-if="productStore.loading" class="game-grid">
          <div v-for="i in 8" :key="i" class="game-card-skeleton" />
        </div>

        <div v-else-if="filteredGames.length > 0" class="game-grid">
          <button v-for="game in filteredGames" :key="game.brand" @click="selectGame(game)" class="game-card">
            <div class="game-card-bg">
              <img :src="getGameBanner(game.brand)" :alt="game.label" class="game-card-img"
                @error="(e) => e.target.src='/images/games/banner-default.jpg'" />
              <div class="game-card-overlay" />
            </div>
            <div class="game-badge">{{ game.count }} Paket</div>
            <div class="game-card-footer">
              <div class="game-logo-wrap">
                <img :src="getGameLogo(game.brand)" :alt="game.label" class="game-logo-img"
                  @error="(e) => e.target.style.display='none'" />
              </div>
              <div>
                <p class="game-card-name">{{ game.label }}</p>
                <p class="game-card-hint">Mulai Rp{{ formatPrice(game.minPrice) }}</p>
              </div>
            </div>
            <div class="game-card-glow" />
          </button>
        </div>

        <div v-else class="empty-state">
          <Gamepad2 :size="64" class="empty-icon" />
          <p class="empty-title">Game tidak ditemukan</p>
          <p class="empty-sub">Coba kata kunci lain</p>
        </div>
      </div>

      <!-- Product List -->
      <div v-else>
        <div class="selected-game-header">
          <button @click="backToGames" class="back-game-btn">
            <ChevronLeft :size="20" /><span>Ganti Game</span>
          </button>
          <div class="selected-game-info">
            <img :src="getGameLogo(selectedGame.brand)" :alt="selectedGame.label"
              class="selected-game-logo" @error="(e) => e.target.style.display='none'" />
            <div>
              <p class="selected-game-name">{{ selectedGame.label }}</p>
              <p class="selected-game-sub">{{ gameProducts.length }} paket tersedia</p>
            </div>
          </div>
        </div>

        <div class="input-section">
          <label class="input-label">{{ userIdLabel }} <span class="input-required">*</span></label>
          <div class="input-wrap">
            <User :size="18" class="input-icon" />
            <input v-model="userId" type="text" :placeholder="userIdPlaceholder" class="game-input" />
          </div>
          <p class="input-hint">{{ userIdHint }}</p>
        </div>

        <div v-if="needsZoneId" class="input-section">
          <label class="input-label">Zone ID / Server ID <span class="input-required">*</span></label>
          <div class="input-wrap">
            <Hash :size="18" class="input-icon" />
            <input v-model="zoneId" type="text" placeholder="Contoh: 1234" class="game-input" />
          </div>
          <p class="input-hint"><span class="hint-tip">Tips:</span> Buka game → Profile → angka di bawah username</p>
        </div>

        <div v-if="productStore.loading" class="product-grid">
          <div v-for="i in 6" :key="i" class="product-skeleton" />
        </div>

        <div v-else-if="gameProducts.length > 0">
          <h2 class="section-title">Pilih Nominal</h2>
          <div class="product-grid">
            <button v-for="product in gameProducts" :key="product.id"
              @click="handleProductSelect(product)" class="product-card"
              :class="{ 'product-inactive': product.status !== 'active' }"
              :disabled="product.status !== 'active'">
              <div class="product-icon">
                <Diamond :size="20" class="diamond-icon" />
              </div>
              <p class="product-name">{{ product.name }}</p>
              <p class="product-price">Rp{{ formatPrice(product.selling_price) }}</p>
              <p v-if="product.status !== 'active'" class="product-unavail">Tidak tersedia</p>
            </button>
          </div>
        </div>

        <div v-else class="empty-state">
          <Package :size="48" class="empty-icon" />
          <p class="empty-title">Paket belum tersedia</p>
        </div>
      </div>
    </div>

    <PaymentModal v-if="selectedProduct" :product="selectedProduct" :customer-data="userId"
      :zone-id="needsZoneId ? zoneId : undefined" customer-label="User ID"
      @close="selectedProduct = null" @success="handleSuccess" @pending="handlePending" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ArrowLeft, ChevronLeft, Gamepad2, Package, User, Hash, Search, X, Diamond } from 'lucide-vue-next'
import PaymentModal from '@/components/checkout/PaymentModal.vue'
import { useProductStore } from '@/stores/productStore'

const productStore = useProductStore()
const selectedGame = ref(null)
const selectedProduct = ref(null)
const userId = ref('')
const zoneId = ref('')
const searchQuery = ref('')
const activeCategory = ref('all')

const categories = [
  { key: 'all', label: 'Semua Game' },
  { key: 'mobile', label: 'Mobile' },
  { key: 'pc', label: 'PC / Console' },
]

const isGameCategory = (cat) => {
  const c = (cat || '').toLowerCase()
  return c === 'games' || c === 'game'
}

const MOBILE_GAMES = ['MOBILE LEGENDS', 'FREE FIRE', 'PUBG MOBILE', 'CALL OF DUTY MOBILE', 'HOK', 'GENSHIN IMPACT']
const PC_GAMES = ['STEAM', 'LEAGUE OF LEGENDS', 'VALORANT', 'ROBLOX', 'HONKAI STAR RAIL']
const ZONE_ID_BRANDS = ['MOBILE LEGENDS', 'GENSHIN IMPACT', 'HOK']

const GAME_ASSETS = {
  'MOBILE LEGENDS':      { banner: '/images/games/ml.png',     logo: '/logos/games/ml.png',              label: 'Mobile Legends' },
  'FREE FIRE':           { banner: '/images/games/ff.png',      logo: '/logos/games/ff.png',              label: 'Free Fire' },
  'PUBG MOBILE':         { banner: '/images/games/pubg.png',    logo: '/logos/games/pubg.png',            label: 'PUBG Mobile' },
  'GENSHIN IMPACT':      { banner: '/images/games/genshin.png', logo: '/logos/games/genshin.png',         label: 'Genshin Impact' },
  'CALL OF DUTY MOBILE': { banner: '/images/games/cod.png',     logo: '/logos/games/cod.png',             label: 'Call of Duty' },
  'VALORANT':            { banner: '/images/games/valorant.png',logo: '/logos/games/valorant.png',        label: 'Valorant' },
  'LEAGUE OF LEGENDS':   { banner: '/images/games/lol.png',     logo: '/logos/games/leagueoflegends.png', label: 'League of Legends' },
  'ROBLOX':              { banner: '/images/games/roblox.png',  logo: '/logos/games/roblox.png',          label: 'Roblox' },
  'HOK':                 { banner: '/images/games/hok.png',     logo: '/logos/games/hok.png',             label: 'Honor of Kings' },
  'HONKAI STAR RAIL':    { banner: '/images/games/hsr.png',     logo: '/logos/games/hsr.png',             label: 'Honkai: Star Rail' },
  'STEAM':               { banner: '/images/games/steam.png',   logo: '/logos/games/steam.png',           label: 'Steam Wallet' },
  'GOOGLE PLAY':         { banner: '/images/games/gplay.png',   logo: '/logos/games/googleplay.png',      label: 'Google Play' },
}

const getGameBanner = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.banner || '/images/games/banner-default.jpg'
const getGameLogo   = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.logo   || null
const getGameLabel  = (brand) => GAME_ASSETS[brand?.toUpperCase()]?.label  || (brand || '').split(' ').map(w => w[0] + w.slice(1).toLowerCase()).join(' ')

const allGames = computed(() => {
  const map = {}
  productStore.products.filter(p => isGameCategory(p.category)).forEach(p => {
    if (!p.brand) return
    if (!map[p.brand]) map[p.brand] = { brand: p.brand, label: getGameLabel(p.brand), count: 0, minPrice: Infinity }
    map[p.brand].count++
    const price = parseFloat(p.selling_price || 0)
    if (price > 0 && price < map[p.brand].minPrice) map[p.brand].minPrice = price
  })
  return Object.values(map).sort((a, b) => a.label.localeCompare(b.label))
})

const filteredGames = computed(() => {
  let games = allGames.value
  if (activeCategory.value === 'mobile') games = games.filter(g => MOBILE_GAMES.includes(g.brand))
  if (activeCategory.value === 'pc')     games = games.filter(g => PC_GAMES.includes(g.brand))
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    games = games.filter(g => g.label.toLowerCase().includes(q) || g.brand.toLowerCase().includes(q))
  }
  return games
})

const gameProducts = computed(() => {
  if (!selectedGame.value) return []
  return productStore.products
    .filter(p => isGameCategory(p.category) && p.brand === selectedGame.value.brand)
    .sort((a, b) => parseFloat(a.selling_price) - parseFloat(b.selling_price))
})

const needsZoneId = computed(() => selectedGame.value && ZONE_ID_BRANDS.includes(selectedGame.value.brand))

const userIdLabel = computed(() => ({ 'MOBILE LEGENDS': 'User ID', 'FREE FIRE': 'User ID', 'PUBG MOBILE': 'Player ID', 'GENSHIN IMPACT': 'UID', 'CALL OF DUTY MOBILE': 'Player ID' }[selectedGame.value?.brand] || 'User ID'))
const userIdPlaceholder = computed(() => ({ 'MOBILE LEGENDS': 'Contoh: 12345678', 'FREE FIRE': 'Contoh: 123456789', 'PUBG MOBILE': 'Contoh: 5123456789', 'GENSHIN IMPACT': 'Contoh: 600123456' }[selectedGame.value?.brand] || 'Masukkan ID kamu'))
const userIdHint = computed(() => 'Cek di: ' + ({ 'MOBILE LEGENDS': 'Profile → Account → User ID', 'FREE FIRE': 'Profile → User ID', 'GENSHIN IMPACT': 'Settings → Account → UID', 'PUBG MOBILE': 'Settings → Basic → Character ID' }[selectedGame.value?.brand] || 'Profile game kamu'))

const formatPrice = (price) => {
  const n = parseFloat(price || 0)
  if (n >= 1000000) return (n/1000000).toFixed(n%1000000===0?0:1)+'jt'
  if (n >= 1000) return Math.round(n/1000)+'rb'
  return new Intl.NumberFormat('id-ID').format(n)
}

const selectGame = (game) => { selectedGame.value = game; userId.value = ''; zoneId.value = ''; window.scrollTo({top:0,behavior:'smooth'}) }
const backToGames = () => { selectedGame.value = null; selectedProduct.value = null }
const handleProductSelect = (product) => {
  if (!userId.value || userId.value.trim().length < 3) { alert(`Masukkan ${userIdLabel.value} yang valid`); return }
  if (needsZoneId.value && !zoneId.value.trim()) { alert('Masukkan Zone ID / Server ID'); return }
  selectedProduct.value = product
}
const handleSuccess = () => { selectedProduct.value = null }
const handlePending = () => { selectedProduct.value = null }

onMounted(async () => { await productStore.fetchProducts() })
</script>

<style scoped>
/* ══════════════════════════════
   BASE - SELARAS DENGAN HOME
══════════════════════════════ */
.game-page {
  min-height: 100vh;
  background: var(--background, #f8fafc);
  padding-bottom: 80px;
}

/* ══════════════════════════════
   HEADER - SELARAS DENGAN HOME
══════════════════════════════ */
.game-header {
  position: sticky;
  top: 0;
  z-index: 40;
  background: var(--card, #ffffff);
  border-bottom: 1px solid var(--border, #e5e7eb);
}

.header-inner {
  max-width: 1120px;
  margin: 0 auto;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: none;
  background: transparent;
  color: var(--muted-foreground, #6b7280);
  cursor: pointer;
  transition: all 0.15s;
}

.back-btn:hover {
  background: var(--muted, #f3f4f6);
  color: var(--foreground, #111827);
}

.header-title {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--foreground, #111827);
  margin: 0;
}

.header-sub {
  font-size: 0.75rem;
  color: var(--muted-foreground, #6b7280);
  margin: 0;
}

/* ══════════════════════════════
   CONTENT
══════════════════════════════ */
.page-content {
  max-width: 1120px;
  margin: 0 auto;
  padding: 20px 16px;
}

/* ══════════════════════════════
   SEARCH BAR
══════════════════════════════ */
.search-wrap {
  position: relative;
  margin-bottom: 20px;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground, #6b7280);
}

.search-input {
  width: 100%;
  height: 46px;
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  padding: 0 40px 0 44px;
  color: var(--foreground, #111827);
  font-size: 0.9rem;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.search-input::placeholder {
  color: var(--muted-foreground, #9ca3af);
}

.search-input:focus {
  border-color: #16a34a;
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground, #6b7280);
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  padding: 4px;
  border-radius: 6px;
  transition: background 0.2s;
}

.search-clear:hover {
  background: var(--muted, #f3f4f6);
}

/* ══════════════════════════════
   CATEGORY TABS
══════════════════════════════ */
.cat-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  overflow-x: auto;
  scrollbar-width: none;
}

.cat-tabs::-webkit-scrollbar {
  display: none;
}

.cat-tab {
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--muted-foreground, #6b7280);
  background: var(--card, #ffffff);
  border: 1px solid var(--border, #e5e7eb);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}

.cat-tab:hover {
  color: var(--foreground, #111827);
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.05);
}

.cat-tab.active {
  background: #16a34a;
  color: #ffffff;
  border-color: #16a34a;
  box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3);
}

/* ══════════════════════════════
   GAME GRID
══════════════════════════════ */
.game-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

@media (min-width: 480px) {
  .game-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .game-grid {
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
  }
}

@media (min-width: 1024px) {
  .game-grid {
    grid-template-columns: repeat(5, 1fr);
  }
}

.game-card {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  border: 1px solid var(--border, #e5e7eb);
  background: var(--card, #ffffff);
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.game-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12);
  border-color: #16a34a;
}

.game-card:hover .game-card-glow {
  opacity: 1;
}

.game-card-bg {
  position: absolute;
  inset: 0;
}

.game-card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.game-card:hover .game-card-img {
  transform: scale(1.08);
}

.game-card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.05) 0%,
    rgba(0, 0, 0, 0) 40%,
    rgba(0, 0, 0, 0.6) 70%,
    rgba(0, 0, 0, 0.85) 100%
  );
}

.game-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(22, 163, 74, 0.95);
  backdrop-filter: blur(8px);
  color: #ffffff;
  font-size: 0.625rem;
  font-weight: 700;
  padding: 4px 8px;
  border-radius: 999px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.game-card-footer {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.game-logo-wrap {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: 5px;
}

.game-logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.game-card-name {
  font-size: 0.8125rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.2;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);
}

.game-card-hint {
  font-size: 0.6875rem;
  color: #22c55e;
  margin-top: 2px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.game-card-glow {
  position: absolute;
  inset: 0;
  opacity: 0;
  background: radial-gradient(
    ellipse at center,
    rgba(22, 163, 74, 0.15) 0%,
    transparent 70%
  );
  transition: opacity 0.3s;
  pointer-events: none;
}

.game-card-skeleton {
  aspect-ratio: 3/4;
  border-radius: 16px;
  background: linear-gradient(
    90deg,
    var(--muted, #f3f4f6) 25%,
    #e9ebee 50%,
    var(--muted, #f3f4f6) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* ══════════════════════════════
   SELECTED GAME HEADER
══════════════════════════════ */
.selected-game-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 14px 16px;
  background: rgba(22, 163, 74, 0.05);
  border: 1px solid rgba(22, 163, 74, 0.2);
  border-radius: 14px;
}

.back-game-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.8125rem;
  font-weight: 600;
  color: #16a34a;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: color 0.2s;
}

.back-game-btn:hover {
  color: #15803d;
}

.selected-game-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.selected-game-logo {
  width: 40px;
  height: 40px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 6px;
  border: 1px solid var(--border, #e5e7eb);
}

.selected-game-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--foreground, #111827);
}

.selected-game-sub {
  font-size: 0.75rem;
  color: var(--muted-foreground, #6b7280);
}

/* ══════════════════════════════
   INPUT SECTION
══════════════════════════════ */
.input-section {
  margin-bottom: 16px;
}

.input-label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--foreground, #374151);
  margin-bottom: 8px;
}

.input-required {
  color: #ef4444;
  margin-left: 2px;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--muted-foreground, #6b7280);
}

.game-input {
  width: 100%;
  height: 48px;
  background: var(--card, #ffffff);
  border: 1.5px solid var(--border, #e5e7eb);
  border-radius: 12px;
  padding: 0 14px 0 44px;
  color: var(--foreground, #111827);
  font-size: 0.9rem;
  font-weight: 500;
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}

.game-input:focus {
  border-color: #16a34a;
  background: rgba(22, 163, 74, 0.02);
  box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.1);
}

.input-hint {
  font-size: 0.75rem;
  color: var(--muted-foreground, #6b7280);
  margin-top: 6px;
}

.hint-tip {
  color: #16a34a;
  font-weight: 600;
}

/* ══════════════════════════════
   PRODUCT SECTION
══════════════════════════════ */
.section-title {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--foreground, #111827);
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

@media (min-width: 480px) {
  .product-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 768px) {
  .product-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.product-card {
  position: relative;
  background: var(--card, #ffffff);
  border: 1.5px solid var(--border, #e5e7eb);
  border-radius: 14px;
  padding: 14px 12px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.product-card:hover:not(:disabled) {
  background: rgba(22, 163, 74, 0.05);
  border-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.1);
}

.product-card:disabled,
.product-inactive {
  opacity: 0.5;
  cursor: not-allowed;
}

.product-icon {
  width: 36px;
  height: 36px;
  background: rgba(22, 163, 74, 0.1);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 10px;
}

.diamond-icon {
  color: #16a34a;
}

.product-name {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--foreground, #374151);
  line-height: 1.3;
  margin-bottom: 8px;
}

.product-price {
  font-size: 0.9375rem;
  font-weight: 800;
  color: #16a34a;
}

.product-unavail {
  font-size: 0.6875rem;
  color: #ef4444;
  margin-top: 2px;
}

.product-skeleton {
  height: 120px;
  border-radius: 14px;
  background: linear-gradient(
    90deg,
    var(--muted, #f3f4f6) 25%,
    #e9ebee 50%,
    var(--muted, #f3f4f6) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

/* ══════════════════════════════
   EMPTY STATE
══════════════════════════════ */
.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  color: var(--muted-foreground, #9ca3af);
  margin: 0 auto 16px;
  display: block;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--muted-foreground, #6b7280);
  margin-bottom: 6px;
}

.empty-sub {
  font-size: 0.875rem;
  color: var(--muted-foreground, #9ca3af);
}
</style>