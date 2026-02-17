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
    <!-- Badge Container (Tengah) -->
    <div class="badge-container">
      <OperatorBadge 
        v-if="isPulsaOrData"
        :operator="extractOperator(product.name)" 
      />

      <div v-else-if="productLogo" class="product-logo-badge">
        <img
          :src="productLogo"
          :alt="product.name"
          class="w-4 h-4 object-contain"
          @error="(e) => e.target.style.display = 'none'"
        />
        <span>{{ productBrandName }}</span>
      </div>

      <div v-else class="fallback-badge">
        {{ product.category }}
      </div>
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

const OPERATORS = ['Telkomsel', 'Indosat', 'XL', 'Axis', 'Tri', 'Smartfren', 'by.U', 'Three']

const isPulsaOrData = computed(() => {
  const cat = props.product?.category?.toLowerCase() || ''
  return cat.includes('pulsa') || cat.includes('data')
})

const extractOperator = (name) => {
  return OPERATORS.find(op => name?.toLowerCase().includes(op.toLowerCase())) || null
}

const walletLogos = {
  'gopay': '/logos/wallets/gopay.png',
  'ovo': '/logos/wallets/ovo.png',
  'dana': '/logos/wallets/dana.png',
  'shopeepay': '/logos/wallets/shopeepay.png',
  'linkaja': '/logos/wallets/linkaja.png'
}

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
  min-height: 130px;
  padding: 14px 12px;
  background: white;
  border: 1.5px solid rgb(229 231 235);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.dark .product-card {
  background: rgb(15 20 25);
  border-color: rgb(42 49 66);
}

.product-card:hover {
  border-color: rgb(59 130 246);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.12);
}

.dark .product-card:hover {
  border-color: rgb(96 165 250);
  box-shadow: 0 8px 16px rgba(96, 165, 250, 0.15);
}

.product-card:active {
  transform: translateY(0);
}

.badge-container {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.product-logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  background: rgb(243 244 246);
  border-radius: 8px;
  font-size: 0.625rem;
  font-weight: 700;
  color: rgb(55 65 81);
}

.dark .product-logo-badge {
  background: rgb(31 41 55);
  color: rgb(209 213 219);
}

.fallback-badge {
  display: inline-block;
  padding: 4px 10px;
  background: rgb(243 244 246);
  border-radius: 8px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  color: rgb(107 114 128);
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
  text-align: center;
  margin: 0 0 auto 0;
  padding: 0 4px;
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
  color: rgb(59 130 246);
  letter-spacing: -0.025em;
  margin-top: 10px;
  text-align: center;
}

.dark .product-price {
  color: rgb(96 165 250);
}

@media (min-width: 640px) {
  .product-card {
    min-height: 140px;
    padding: 16px 14px;
  }

  .product-name {
    font-size: 0.9375rem;
  }

  .product-price {
    font-size: 1.25rem;
  }
}
</style>