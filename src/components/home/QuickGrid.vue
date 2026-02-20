<template>
  <div>
    <h2 class="section-title">Pilih Layanan</h2>
    <div class="grid-wrapper">
      <div class="quick-grid">
        <QuickCard img="/icons/pulsa.png"       label="Pulsa"        to="/checkout/pulsa"        badge="MURAH" />
        <QuickCard img="/icons/kuota.png"        label="Kuota Data"   to="/checkout/data"         badge="MURAH" />
        <QuickCard img="/icons/pln.png"          label="Token PLN"    to="/checkout/pln"          badge="MURAH" />
        <QuickCard img="/icons/voucher-game.png" label="Voucher Game" to="/checkout/game-voucher" />
        <QuickCard img="/icons/top-up-game.png"  label="Top Up Game"  to="/checkout/top-up-game"  />
        <QuickCard img="/icons/ewallet.png"      label="E-Wallet"     to="/checkout/e-wallet"     />
      </div>
    </div>
  </div>
</template>

<script setup>
import QuickCard from './QuickCard.vue'
</script>

<style scoped>
.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0.75rem;
}

.grid-wrapper {
  padding: 1.25rem;
  border-radius: 20px;
  background: linear-gradient(145deg, rgba(37, 99, 235, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%);
  border: 1.5px solid var(--border);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
}

.dark .grid-wrapper {
  background: linear-gradient(145deg, rgba(37, 99, 235, 0.08) 0%, rgba(16, 185, 129, 0.05) 100%);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.08);
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* ✅ 3 kolom - 2 baris (3+3) SIMETRIS */
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .quick-grid {
    grid-template-columns: repeat(3, 1fr); /* ✅ Tablet tetap 3 kolom */
    gap: 1rem;
  }
}

@media (min-width: 1024px) {
  .quick-grid {
    grid-template-columns: repeat(6, 1fr); /* ✅ Desktop 6 kolom (1 baris semua) */
    gap: 1.25rem;
  }
}
</style>