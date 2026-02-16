<template>
  <div class="wallet-selector">
    <h3 class="text-sm font-semibold mb-3 text-dark-700 dark:text-dark-300">
      Pilih E-Wallet
    </h3>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <button
        v-for="wallet in wallets"
        :key="wallet"
        @click="selectWallet(wallet)"
        class="wallet-card group"
        :class="{ 'active': modelValue === wallet }"
      >
        <!-- Wallet Logo -->
        <div class="wallet-logo">
          <img
            v-if="getWalletLogo(wallet)"
            :src="getWalletLogo(wallet)"
            :alt="wallet"
            class="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
            @error="(e) => e.target.style.display = 'none'"
          />
          <Wallet 
            v-else
            :size="32" 
            class="transition-transform duration-300 group-hover:scale-110"
            :class="modelValue === wallet ? 'text-primary-600 dark:text-primary-400' : 'text-dark-500 dark:text-dark-400'"
          />
        </div>
        
        <!-- Wallet Name -->
        <span class="wallet-name">
          {{ formatWalletName(wallet) }}
        </span>

        <!-- Selected Indicator -->
        <div 
          v-if="modelValue === wallet"
          class="absolute top-2 right-2 w-5 h-5 bg-primary-600 dark:bg-primary-500 rounded-full flex items-center justify-center"
        >
          <Check :size="14" class="text-white" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Wallet, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  wallets: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const walletLogos = {
  'GOPAY': '/logos/wallets/gopay.png',
  'OVO': '/logos/wallets/ovo.png',
  'DANA': '/logos/wallets/dana.png',
  'SHOPEEPAY': '/logos/wallets/shopeepay.png',
  'LINKAJA': '/logos/wallets/linkaja.png'
}

const getWalletLogo = (walletName) => {
  return walletLogos[walletName?.toUpperCase()] || null
}

const selectWallet = (wallet) => {
  emit('update:modelValue', wallet)
}

const formatWalletName = (name) => {
  if (!name) return 'Unknown'
  
  return name
    .replace(/GOPAY/i, 'GoPay')
    .replace(/OVO/i, 'OVO')
    .replace(/DANA/i, 'DANA')
    .replace(/SHOPEEPAY/i, 'ShopeePay')
    .replace(/LINKAJA/i, 'LinkAja')
    .replace(/SAKUKU/i, 'Sakuku')
}
</script>

<style scoped>
.wallet-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  min-height: 120px;
  background: white;
  border: 2px solid rgb(229 231 235);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.dark .wallet-card {
  background: rgb(15 20 25);
  border-color: rgb(42 49 66);
}

.wallet-card:hover {
  border-color: rgb(79 172 254);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(79, 172, 254, 0.15);
}

.dark .wallet-card:hover {
  border-color: rgb(59 143 212);
  box-shadow: 0 8px 16px rgba(59, 143, 212, 0.2);
}

.wallet-card.active {
  border-color: rgb(79 172 254);
  background: rgb(239 246 255);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
}

.dark .wallet-card.active {
  border-color: rgb(59 143 212);
  background: rgba(59, 143, 212, 0.1);
  box-shadow: 0 4px 12px rgba(59, 143, 212, 0.25);
}

.wallet-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgb(243 244 246);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.dark .wallet-logo {
  background: rgb(26 31 46);
}

.wallet-card:hover .wallet-logo {
  background: rgb(239 246 255);
}

.dark .wallet-card:hover .wallet-logo {
  background: rgba(59, 143, 212, 0.15);
}

.wallet-card.active .wallet-logo {
  background: rgb(219 234 254);
}

.dark .wallet-card.active .wallet-logo {
  background: rgba(59, 143, 212, 0.2);
}

.wallet-name {
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  color: rgb(31 41 55);
  transition: color 0.3s ease;
}

.dark .wallet-name {
  color: rgb(243 244 246);
}

.wallet-card.active .wallet-name {
  color: rgb(79 172 254);
}

.dark .wallet-card.active .wallet-name {
  color: rgb(59 143 212);
}
</style>