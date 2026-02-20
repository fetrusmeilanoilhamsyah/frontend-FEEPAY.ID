<template>
  <div class="how-it-works">
    <h2 class="section-title">Cara Transaksi</h2>
    
    <div class="steps-container">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-wrapper"
      >
        <!-- Connector line (kecuali step terakhir) -->
        <div v-if="index < steps.length - 1" class="connector">
          <div class="connector-line"></div>
          <div class="connector-arrow">›</div>
        </div>

        <div class="step-card">
          <div class="step-number">{{ index + 1 }}</div>
          <div class="step-icon">
            <img :src="step.img" alt="" class="step-img" />
          </div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const steps = [
  {
    img: '/icons/step-cart.png',
    title: 'Pilih Produk',
    desc: 'Pulsa, token PLN, atau voucher game'
  },
  {
    img: '/icons/step-data.png',
    title: 'Isi Data',
    desc: 'Nomor HP atau ID pelanggan'
  },
  {
    img: '/icons/step-pay.png',
    title: 'Bayar',
    desc: 'QRIS, transfer bank, atau e-wallet'
  },
  {
    img: '/icons/step-done.png',
    title: 'Selesai',
    desc: 'Masuk otomatis ke akun Anda'
  }
]
</script>

<style scoped>
.how-it-works {
  margin-top: 2rem;
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 1rem;
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  position: relative;
}

@media (min-width: 640px) {
  .steps-container {
    display: flex;
    flex-direction: row;
    align-items: stretch;
    gap: 0;
  }
}

/* Wrapper per step untuk posisi connector */
.step-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

@media (min-width: 640px) {
  .step-wrapper {
    flex: 1;
  }
}

/* Connector hanya tampil di desktop (row layout) */
.connector {
  display: none;
}

@media (min-width: 640px) {
  .connector {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 24px;
    gap: 2px;
    z-index: 1;
  }

  .connector-line {
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, var(--border), var(--primary), var(--border));
    background-size: 200% 100%;
    animation: flowLine 2s linear infinite;
    border-radius: 2px;
  }

  .connector-arrow {
    font-size: 0.75rem;
    color: var(--primary);
    line-height: 1;
    animation: bounce 1s ease-in-out infinite;
  }
}

@keyframes flowLine {
  0% { background-position: 100% 0; }
  100% { background-position: -100% 0; }
}

@keyframes bounce {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(2px); }
}

.step-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 0.75rem;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  transition: all 0.2s;
  width: 100%;
  animation: fadeUp 0.4s ease both;
}

.step-wrapper:nth-child(1) .step-card { animation-delay: 0s; }
.step-wrapper:nth-child(2) .step-card { animation-delay: 0.1s; }
.step-wrapper:nth-child(3) .step-card { animation-delay: 0.2s; }
.step-wrapper:nth-child(4) .step-card { animation-delay: 0.3s; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}

.step-card:hover {
  transform: translateY(-3px);
  border-color: var(--primary);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

.dark .step-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.step-number {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 800;
  color: var(--muted-foreground);
  background: var(--muted);
  border-radius: 50%;
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  background: white !important; /* ✅ Background putih solid */
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.dark .step-icon {
  background: rgba(255, 255, 255, 0.95) !important; /* Dark mode tetap putih */
}

.step-card:hover .step-icon {
  transform: scale(1.1) rotate(-3deg);
}

.step-img {
  width: 26px;
  height: 26px;
  object-fit: contain;
}

.step-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 0.375rem;
}

.step-desc {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--muted-foreground);
  line-height: 1.4;
}

@media (min-width: 640px) {
  .step-icon {
    width: 52px;
    height: 52px;
  }

  .step-img {
    width: 28px;
    height: 28px;
  }

  .step-title {
    font-size: 0.9375rem;
  }

  .step-desc {
    font-size: 0.8125rem;
  }
}
</style>