<template>
  <div class="how-it-works">
    <div class="hiw-header">
      <h2 class="section-title">Cara Transaksi</h2>
      <p class="section-sub">Mudah, cepat, dan aman</p>
    </div>

    <div class="steps">
      <div v-for="(step, i) in steps" :key="i" class="step">

        <div class="step-left">
          <div class="step-icon" :class="step.cls">
            <img :src="step.img" :alt="step.title" class="step-img"
              @error="(e) => e.target.style.opacity='0'" />
          </div>
          <div v-if="i < steps.length - 1" class="step-line" />
        </div>

        <div class="step-body">
          <div class="step-badge" :class="step.cls">{{ String(i + 1).padStart(2, '0') }}</div>
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
    title: 'Pilih Produk',
    desc: 'Pilih layanan yang kamu butuhkan dari berbagai kategori',
    tags: ['Pulsa', 'Token PLN', 'Top Up Game', 'Voucher'],
    cls: 'purple',
  },
  {
    img: '/icons/step-data.webp',
    title: 'Isi Data',
    desc: 'Masukkan nomor HP, ID game, atau nomor meter PLN kamu',
    tags: ['Nomor HP', 'ID Game', 'Nomor Meter'],
    cls: 'blue',
  },
  {
    img: '/icons/step-pay.webp',
    title: 'Bayar',
    desc: 'Pilih metode pembayaran yang paling nyaman buatmu',
    tags: ['QRIS', 'Transfer Bank', 'GoPay', 'OVO', 'Dana'],
    cls: 'yellow',
  },
  {
    img: '/icons/step-done.webp',
    title: 'Selesai!',
    desc: 'Produk langsung masuk ke akun kamu dalam hitungan detik',
    tags: ['Instan', 'Otomatis', 'Notifikasi Email'],
    cls: 'green',
  },
]
</script>

<style scoped>
.how-it-works { margin: 4px 0 12px; }

.hiw-header { margin-bottom: 14px; }
.section-title { font-size: 0.9375rem; font-weight: 800; color: var(--foreground,#111827); letter-spacing:-0.02em; margin-bottom: 2px; }
.section-sub { font-size: 0.75rem; color: var(--muted-foreground,#9ca3af); }

.steps {
  background: var(--card,#fff);
  border: 1px solid var(--border,#e5e7eb);
  border-radius: 18px;
  padding: 6px 16px;
  margin-bottom: 12px;
}

.step { display: flex; gap: 14px; padding: 14px 0; }
.step-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }

.step-icon {
  width: 46px; height: 46px; border-radius: 14px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; transition: transform 0.2s;
}
.step:hover .step-icon { transform: scale(1.08) rotate(-3deg); }
.step-img { width: 28px; height: 28px; object-fit: contain; }

/* Icon colors */
.purple { background: #ede9fe; }
.blue   { background: #dbeafe; }
.yellow { background: #fef3c7; }
.green  { background: #d1fae5; }

.step-line {
  width: 2px; flex: 1; min-height: 12px;
  background: linear-gradient(to bottom, var(--border,#e5e7eb), transparent);
  margin: 6px 0 0; border-radius: 2px;
}

.step-body { flex: 1; padding-bottom: 14px; border-bottom: 1px solid var(--border,#f3f4f6); }
.step:last-child .step-body { border-bottom: none; padding-bottom: 0; }

.step-badge {
  display: inline-block;
  font-size: 0.5625rem; font-weight: 900; letter-spacing: 0.08em;
  padding: 2px 7px; border-radius: 999px; margin-bottom: 5px;
}
.step-badge.purple { background: #ede9fe; color: #7c3aed; }
.step-badge.blue   { background: #dbeafe; color: #2563eb; }
.step-badge.yellow { background: #fef3c7; color: #d97706; }
.step-badge.green  { background: #d1fae5; color: #16a34a; }

.step-title { font-size: 0.9rem; font-weight: 700; color: var(--foreground,#111827); margin-bottom: 3px; }
.step-desc { font-size: 0.75rem; color: var(--muted-foreground,#6b7280); line-height: 1.5; margin-bottom: 8px; }

.step-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag {
  font-size: 0.6rem; font-weight: 600;
  padding: 2px 8px; border-radius: 999px;
  background: var(--background,#f8fafc);
  border: 1px solid var(--border,#e5e7eb);
  color: var(--muted-foreground,#6b7280);
}
</style>
