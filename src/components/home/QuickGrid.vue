<template>
  <div class="quick-grid-wrapper">
    <!-- Header -->
    <div class="grid-header">
      <h2 class="grid-title">Pilih Layanan</h2>
      <p class="grid-subtitle">Pilih jenis layanan yang ingin Anda gunakan</p>
    </div>

    <!-- Grid -->
    <div class="quick-grid">
      <QuickCard
        :icon="Smartphone"
        label="Pulsa"
        to="/checkout/pulsa"
        color="primary"
      />
      
      <QuickCard
        :icon="Wifi"
        label="Kuota Data"
        to="/checkout/data"
        color="green"
      />
      
      <QuickCard
        :icon="Ticket"
        label="Voucher Game"
        to="/checkout/game-voucher"
        color="purple"
      />
      
      <QuickCard
        :icon="Zap"
        label="Token PLN"
        to="/checkout/pln"
        color="orange"
      />
      
      <QuickCard
        :icon="Gamepad2"
        label="Top Up Game"
        to="/checkout/top-up-game"
        color="pink"
      />
      
      <QuickCard
        :icon="Wallet"
        label="E-Wallet"
        to="/checkout/e-wallet"
        color="cyan"
      />
    </div>
  </div>
</template>

<script setup>
import { Smartphone, Wifi, Ticket, Zap, Gamepad2, Wallet } from 'lucide-vue-next'
import QuickCard from './QuickCard.vue'

defineEmits(['select'])
</script>

<style scoped>
.quick-grid-wrapper {
  margin-bottom: 2rem;
}

.grid-header {
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .grid-header {
    margin-bottom: 1.5rem;
  }
}

.grid-title {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: rgb(17 24 39);
  margin-bottom: 0.375rem;
}

.dark .grid-title {
  color: rgb(243 244 246);
}

@media (min-width: 640px) {
  .grid-title {
    font-size: 1.5rem;
  }
}

.grid-subtitle {
  font-size: 0.875rem;
  font-weight: 500;
  color: rgb(107 114 128);
}

.dark .grid-subtitle {
  color: rgb(156 163 175);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .quick-grid {
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .quick-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>