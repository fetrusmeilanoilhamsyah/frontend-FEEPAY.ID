<template>
  <div
    class="product-card"
    @click="handleSelect"
    @keypress.enter="handleSelect"
    @keypress.space.prevent="handleSelect"
    tabindex="0"
    role="button"
    :aria-label="`Order ${product.name}`"
  >
    <!-- Operator Badge (Pulsa/Data) -->
    <OperatorBadge 
      v-if="isPulsaOrData"
      :operator="extractOperator(product.name)" 
    />

    <!-- Wallet/Game Logo -->
    <div v-else-if="productLogo" class="product-logo-badge">
      <img
        :src="productLogo"
        :alt="product.name"
        class="w-4 h-4 object-contain"
        @error="(e) => e.target.style.display = 'none'"
      />
      <span>{{ productBrandName }}</span>
    </div>

    <!-- Fallback badge -->
    <div v-else class="fallback-badge">
      {{ product.category }}
    </div>

    <h3 class="product-name">
      {{ product.name }}
    </h3>

    <div class="product-price">
      Rp{{ formatPrice(product.selling_price) }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import OperatorBadge from '@/components/checkout/OperatorBadge.vue'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

// ─── Pulsa / Data ───────────────────────────────────────────
const OPERATORS = ['Telkomsel', 'Indosat', 'XL', 'Axis', 'Tri', 'Smartfren', 'by.U', 'Three']

const isPulsaOrData = computed(() => {
  const cat = props.product?.category?.toLowerCase() || ''
  return cat.includes('pulsa') || cat.includes('data')
})

const extractOperator = (name) => {
  return OPERATORS.find(op => name?.toLowerCase().includes(op.toLowerCase())) || null
}

// ─── E-Wallet ───────────────────────────────────────────────
const walletLogos = {
  'gopay': '/logos/wallets/gopay.png',
  'ovo': '/logos/wallets/ovo.png',
  'dana': '/logos/wallets/dana.png',
  'shopeepay': '/logos/wallets/shopeepay.png',
  'linkaja': '/logos/wallets/linkaja.png'
}

// ─── Game ────────────────────────────────────────────────────
const gameLogos = {
  'mobile legends': '/logos/games/ml.png',
  'mobilelegend': '/logos/games/ml.png',
  'free fire': '/logos/games/ff.png',
  'freefire': '/logos/games/ff.png',
  'pubg': '/logos/games/pubg.png',
  'genshin': '/logos/games/genshin.png',
  'call of duty': '/logos/games/cod.png',
  'valorant': '/logos/games/valorant.png',
  'league of legends': '/logos/games/leagueoflegends.png',
  'roblox': '/logos/games/roblox.png'
}

const productLogo = computed(() => {
  const name = props.product?.name?.toLowerCase() || ''
  const cat = props.product?.category?.toLowerCase() || ''

  for (const [key, logo] of Object.entries(walletLogos)) {
    if (name.includes(key) || cat.includes(key)) return logo
  }

  for (const [key, logo] of Object.entries(gameLogos)) {
    if (name.includes(key) || cat.includes(key)) return logo
  }

  return null
})

const productBrandName = computed(() => {
  const name = props.product?.name?.toLowerCase() || ''

  const walletNames = {
    'gopay': 'GoPay', 'ovo': 'OVO', 'dana': 'DANA',
    'shopeepay': 'ShopeePay', 'linkaja': 'LinkAja'
  }
  for (const [key, label] of Object.entries(walletNames)) {
    if (name.includes(key)) return label
  }

  const gameNames = {
    'mobile legends': 'Mobile Legends',
    'mobilelegend': 'Mobile Legends',
    'free fire': 'Free Fire',
    'freefire': 'Free Fire',
    'pubg': 'PUBG',
    'genshin': 'Genshin',
    'call of duty': 'COD',
    'valorant': 'Valorant',
    'league of legends': 'LoL',
    'roblox': 'Roblox'
  }
  for (const [key, label] of Object.entries(gameNames)) {
    if (name.includes(key)) return label
  }

  return props.product?.category || ''
})

// ─── Helpers ─────────────────────────────────────────────────
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const handleSelect = () => {
  emit('select', props.product)
}
</script>

<style scoped>
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  padding: 12px;
  background: white;
  border: 1.5px solid rgb(229 231 235);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.dark .product-card {
  background: rgb(15 20 25);
  border-color: rgb(42 49 66);
}

.product-card:hover {
  border-color: rgb(79 172 254);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.15);
}

.dark .product-card:hover {
  border-color: rgb(59 143 212);
  box-shadow: 0 8px 20px rgba(59, 143, 212, 0.2);
}

.product-card:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.1);
}

.product-logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  background: rgb(243 244 246);
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 700;
  color: rgb(55 65 81);
  width: fit-content;
}

.dark .product-logo-badge {
  background: rgb(31 41 55);
  color: rgb(209 213 219);
}

.fallback-badge {
  display: inline-block;
  padding: 3px 8px;
  background: rgb(243 244 246);
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  color: rgb(107 114 128);
  width: fit-content;
}

.dark .fallback-badge {
  background: rgb(31 41 55);
  color: rgb(156 163 175);
}

.product-name {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  color: rgb(17 24 39);
  margin-bottom: auto;
  margin-top: 8px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .product-name {
  color: rgb(243 244 246);
}

.product-price {
  font-size: 1.125rem;
  font-weight: 800;
  color: rgb(79 172 254);
  margin-top: 12px;
  letter-spacing: -0.025em;
}

.dark .product-price {
  color: rgb(59 143 212);
}

@media (min-width: 640px) {
  .product-card {
    min-height: 130px;
    padding: 16px;
  }

  .product-name {
    font-size: 0.9375rem;
  }

  .product-price {
    font-size: 1.25rem;
  }
}
</style>