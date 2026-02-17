<template>
  <div class="how-it-works">
    <h2 class="section-title">Cara Transaksi</h2>
    
    <div class="steps-container">
      <div 
        v-for="(step, index) in steps" 
        :key="index"
        class="step-card"
      >
        <div class="step-number">{{ index + 1 }}</div>
        <div class="step-icon" :style="{ background: step.gradient }">
          <component :is="step.icon" :size="20" class="text-white" />
        </div>
        <h3 class="step-title">{{ step.title }}</h3>
        <p class="step-desc">{{ step.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ShoppingCart, FileText, CreditCard, CheckCircle } from 'lucide-vue-next'

const steps = [
  {
    icon: ShoppingCart,
    title: 'Pilih Produk',
    desc: 'Pulsa, token PLN, atau voucher game',
    gradient: 'linear-gradient(135deg, #60a5fa, #3b82f6)'
  },
  {
    icon: FileText,
    title: 'Isi Data',
    desc: 'Nomor HP atau ID pelanggan',
    gradient: 'linear-gradient(135deg, #4ade80, #22c55e)'
  },
  {
    icon: CreditCard,
    title: 'Bayar',
    desc: 'QRIS, transfer bank, atau e-wallet',
    gradient: 'linear-gradient(135deg, #fb923c, #f97316)'
  },
  {
    icon: CheckCircle,
    title: 'Selesai',
    desc: 'Masuk otomatis ke akun Anda',
    gradient: 'linear-gradient(135deg, #22d3ee, #06b6d4)'
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
  color: rgb(17 24 39);
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
  font-family: 'Outfit', sans-serif;
}

.dark .section-title {
  color: rgb(243 244 246);
}

.steps-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

@media (min-width: 640px) {
  .steps-container {
    grid-template-columns: repeat(4, 1fr);
  }
}

.step-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1.25rem 0.75rem;
  background: white;
  border: 1px solid rgb(229 231 235);
  border-radius: 16px;
  transition: all 0.2s;
}

.dark .step-card {
  background: rgb(10 10 10);
  border-color: rgb(42 49 66);
}

.step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.dark .step-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
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
  color: rgb(156 163 175);
  background: rgb(243 244 246);
  border-radius: 50%;
  font-family: 'Outfit', sans-serif;
}

.dark .step-number {
  background: rgb(31 41 55);
  color: rgb(107 114 128);
}

.step-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 14px;
  margin-bottom: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.step-title {
  font-size: 0.875rem;
  font-weight: 700;
  color: rgb(17 24 39);
  margin-bottom: 0.375rem;
  font-family: 'Outfit', sans-serif;
  letter-spacing: -0.01em;
}

.dark .step-title {
  color: rgb(243 244 246);
}

.step-desc {
  font-size: 0.75rem;
  font-weight: 500;
  color: rgb(107 114 128);
  line-height: 1.4;
  font-family: 'Outfit', sans-serif;
}

.dark .step-desc {
  color: rgb(156 163 175);
}

@media (min-width: 640px) {
  .step-icon {
    width: 52px;
    height: 52px;
  }

  .step-title {
    font-size: 0.9375rem;
  }

  .step-desc {
    font-size: 0.8125rem;
  }
}
</style>