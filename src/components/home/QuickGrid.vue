<template>
  <div>
    <h2 class="section-title">Pilih Layanan</h2>

    <div class="grid-wrapper">
      <div class="quick-grid">
        <QuickCard :icon="Signal"        label="Pulsa"        to="/checkout/pulsa"       color="primary" badge="MURAH" />
        <QuickCard :icon="Radio"         label="Kuota Data"   to="/checkout/data"        color="green"   badge="MURAH" />
        <QuickCard :icon="Trophy"        label="Voucher Game" to="/checkout/game-voucher" color="purple"  />
        <QuickCard :icon="Sparkles"      label="Token PLN"    to="/checkout/pln"          color="orange"  badge="MURAH" />
        <QuickCard :icon="Joystick"      label="Top Up Game"  to="/checkout/top-up-game"  color="pink"    />
        <QuickCard :icon="CreditCard"    label="E-Wallet"     to="/checkout/e-wallet"     color="cyan"    />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Signal, Radio, Trophy, Sparkles, Joystick, CreditCard } from 'lucide-vue-next'
import QuickCard from './QuickCard.vue'
</script>

<style scoped>
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: rgb(17 24 39);
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
  font-family: 'Outfit', sans-serif;
}

.dark .section-title {
  color: rgb(243 244 246);
}

.grid-wrapper {
  padding: 1rem;
  border-radius: 18px;
  background: linear-gradient(145deg, #dbeafe 0%, #cffafe 100%);
  border: 1px solid rgba(56, 189, 248, 0.25);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
}

.dark .grid-wrapper {
  background: linear-gradient(145deg, rgba(59, 130, 246, 0.08) 0%, rgba(34, 211, 238, 0.05) 100%);
  border: 1px solid rgba(56, 189, 248, 0.08);
  box-shadow: none;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.25rem;
}

@media (min-width: 640px) {
  .quick-grid {
    grid-template-columns: repeat(6, 1fr);
  }
}
</style>