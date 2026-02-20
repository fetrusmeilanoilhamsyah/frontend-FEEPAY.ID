<template>
  <div
    class="product-card group"
    @click="handleSelect"
    @keypress.enter="handleSelect"
    @keypress.space.prevent="handleSelect"
    tabindex="0"
    role="button"
    :aria-label="`Order ${product.name}`"
  >
    <!-- Badge Container -->
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

    <!-- Product Name -->
    <h3 class="product-name">
      {{ product.name }}
    </h3>

    <!-- Divider -->
    <div class="price-divider"></div>

    <!-- Product Price -->
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
  align-items: center;
  min-height: 120px;
  padding: 12px 10px 10px;
  background: var(--card);
  border: 1.5px solid var(--border);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  overflow: hidden;
}

.product-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(37, 99, 235, 0.1);
}

.product-card:active {
  transform: translateY(0);
}

.badge-container {
  display: flex;
  justify-content: center;
  margin-bottom: 8px;
}

.product-logo-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 3px 8px;
  background: var(--muted);
  border-radius: 8px;
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--foreground);
}

.fallback-badge {
  display: inline-block;
  padding: 3px 8px;
  background: var(--muted);
  border-radius: 8px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.product-name {
  font-size: 0.8rem;
  font-weight: 600;
  line-height: 1.3;
  color: var(--foreground);
  text-align: center;
  flex: 1;
  padding: 0 2px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* FIX: garis pemisah tipis antara nama dan harga */
.price-divider {
  width: 100%;
  height: 1px;
  background: var(--border);
  margin: 8px 0 6px;
}

.product-price {
  font-size: 0.9375rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: -0.02em;
  text-align: center;
  width: 100%;
}

@media (min-width: 640px) {
  .product-card {
    min-height: 130px;
    padding: 14px 12px 12px;
  }

  .product-name {
    font-size: 0.875rem;
  }

  .product-price {
    font-size: 1rem;
  }
}
</style>