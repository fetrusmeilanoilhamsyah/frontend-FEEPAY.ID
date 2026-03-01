<template>
  <div class="quick-section">
    <h2 class="section-title">Pilih Layanan</h2>
    <div class="quick-grid">
      <QuickCard img="/icons/pulsa.png"         label="Pulsa"        to="/checkout/pulsa"        badge="MURAH" />
      <QuickCard img="/icons/kuota.png"         label="Kuota Data"   to="/checkout/data"         badge="MURAH" />
      <QuickCard img="/icons/pln.png"           label="Token PLN"    to="/checkout/pln"          badge="MURAH" />
      <QuickCard img="/icons/voucher-game.png"  label="Voucher Game" to="/checkout/game-voucher" />
      <QuickCard img="/icons/top-up-game.png"   label="Top Up Game"  to="/checkout/top-up-game"  />
      
      </div>
  </div>
</template>

<script setup>
import QuickCard from './QuickCard.vue'
</script>

<style scoped>
.quick-section { 
  background: var(--background, #ffffff);
  padding: 20px 16px;
  border-radius: 24px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
  margin-bottom: 16px;
  border: 1px solid rgba(0, 0, 0, 0.02);
}

.section-title {
  font-size: 1rem;
  font-weight: 750;
  color: var(--foreground, #1f2937);
  margin-bottom: 20px;
  letter-spacing: -0.02em;
  position: relative;
  padding-left: 4px;
}

.section-title::before {
  content: '';
  position: absolute;
  left: -16px;
  top: 10%;
  height: 80%;
  width: 4px;
  background: #3b82f6; /* Aksen warna biru di kiri judul */
  border-radius: 0 4px 4px 0;
}

.quick-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  row-gap: 22px;
  column-gap: 12px;
  /* Memastikan konten di dalam grid sejajar ke atas */
  align-items: start; 
}
</style>