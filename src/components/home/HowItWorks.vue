<template>
  <div class="how-it-works">
    <div class="hiw-header">
      <h2 class="section-title">Panduan Transaksi</h2>
      <p class="section-sub">Prosedur sederhana untuk layanan instan</p>
    </div>

    <div v-reveal class="steps reveal">
      <div v-for="(step, i) in steps" :key="i" 
           class="step reveal" 
           :class="'stagger-' + ((i % 4) + 1)">

        <div class="step-left">
          <div class="step-icon">
            <img :src="step.img" :alt="step.title" class="step-img"
              @error="(e) => e.target.style.opacity='0'" />
          </div>
          <div v-if="i < steps.length - 1" class="step-line" />
        </div>

        <div class="step-body">
          <div class="step-badge">{{ String(i + 1).padStart(2, '0') }}</div>
          <h3 class="step-title">{{ step.title }}</h3>
          <p class="step-desc">{{ step.desc }}</p>
          <div class="step-tags">
            <span v-for="tag in step.tags" :key="tag" class="tag">{{ tag }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
const steps = [
  {
    img: '/icons/step-cart.webp',
    title: 'Identifikasi Produk',
    desc: 'Telusuri katalog lengkap kami dan tentukan layanan digital yang sesuai dengan kebutuhan Anda.',
    tags: ['Pulsa', 'Token PLN', 'Top Up Game', 'Voucher'],
  },
  {
    img: '/icons/step-data.webp',
    title: 'Input Detail Akun',
    desc: 'Lengkapi informasi User ID atau nomor tujuan guna memastikan pengiriman produk yang presisi.',
    tags: ['Nomor HP', 'ID Game', 'Nomor Meter'],
  },
  {
    img: '/icons/step-pay.webp',
    title: 'Konfirmasi Pembayaran',
    desc: 'Gunakan kanal pembayaran pilihan Anda untuk penyelesaian transaksi yang aman dan cepat.',
    tags: ['QRIS', 'Virtual Account', 'E-Wallet'],
  },
  {
    img: '/icons/step-done.webp',
    title: 'Distribusi Otomatis',
    desc: 'Sistem mengalokasikan produk secara seketika segera setelah verifikasi pembayaran berhasil.',
    tags: ['Proses Instan', 'Automatisasi', 'Terverifikasi'],
  },
]
</script>

<style scoped>
.how-it-works { margin: 8px 0 16px; }

.hiw-header { margin-bottom: 16px; }
.section-title { font-size: 1rem; font-weight: 800; color: var(--foreground,#111827); letter-spacing:-0.02em; margin-bottom: 4px; }
.section-sub { font-size: 0.8125rem; color: var(--muted-foreground,#6b7280); }

.steps {
  background: var(--card,#fff);
  border: 1px solid var(--border,#e5e7eb);
  border-radius: 20px;
  padding: 8px 16px;
  margin-bottom: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.step { display: flex; gap: 16px; padding: 16px 0; }
.step-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }

.step-icon {
  width: 48px; height: 48px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; background: var(--muted,#f3f4f6);
  border: 1px solid var(--border,#e5e7eb);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.step:hover .step-icon { 
  transform: translateY(-4px); 
  background: var(--primary-muted, #f0fdf4);
  border-color: var(--primary, #16a34a);
  box-shadow: 0 4px 12px rgba(22, 163, 74, 0.1);
}

.step-img { width: 30px; height: 30px; object-fit: contain; }

.step-line {
  width: 2px; flex: 1; min-height: 16px;
  background: linear-gradient(to bottom, var(--border,#e5e7eb), transparent);
  margin: 8px 0 0; border-radius: 2px;
}

.step-body { flex: 1; padding-bottom: 16px; border-bottom: 1px solid var(--border,#f3f4f6); }
.step:last-child .step-body { border-bottom: none; padding-bottom: 0; }

.step-badge {
  display: inline-block;
  font-size: 0.625rem; font-weight: 800; letter-spacing: 0.05em;
  padding: 2px 8px; border-radius: 999px; margin-bottom: 6px;
  background: var(--primary-muted, #f0fdf4);
  color: var(--primary, #16a34a);
  border: 1px solid rgba(22, 163, 74, 0.1);
}

.step-title { font-size: 0.9375rem; font-weight: 700; color: var(--foreground,#111827); margin-bottom: 4px; }
.step-desc { font-size: 0.8125rem; color: var(--muted-foreground,#6b7280); line-height: 1.6; margin-bottom: 10px; }

.step-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.tag {
  font-size: 0.625rem; font-weight: 600;
  padding: 2px 10px; border-radius: 999px;
  background: var(--background,#f8fafc);
  border: 1px solid var(--border,#e5e7eb);
  color: var(--muted-foreground,#6b7280);
  transition: all 0.2s;
}

.step:hover .tag {
  border-color: rgba(22, 163, 74, 0.2);
  color: var(--primary, #16a34a);
}
</style>
