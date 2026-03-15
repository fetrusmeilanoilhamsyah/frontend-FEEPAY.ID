<template>
  <div class="how-it-works relative overflow-hidden">
    <!-- Antigravity Background (Internal to HIW) -->
    <div class="absolute inset-0 pointer-events-none z-0">
      <transition name="fade">
        <AntigravityParticles v-if="hasInteracted" absolute :particle-count="30" class="hiw-particles" />
      </transition>
    </div>

    <div class="hiw-header reveal relative z-10">
      <h2 class="section-title">Panduan Transaksi</h2>
      <p class="section-sub">Empat langkah sederhana untuk layanan instan</p>
    </div>

    <div v-reveal class="steps reveal relative z-10">
      <div v-for="(step, i) in steps" :key="i" 
           class="step group cursor-pointer"
           :class="[
             { 'active-step': activeStep === i }, 
             { 'locked-step': i >= unlockedCount },
             'stagger-' + ((i % 4) + 1)
           ]"
           @click="handleStepClick($event, i)">

        <div class="step-left">
          <div class="step-icon-wrap relative">
            <!-- 8-Dot Burst (Antigravity Style) -->
            <span class="dot d1"></span>
            <span class="dot d2"></span>
            <span class="dot d3"></span>
            <span class="dot d4"></span>
            <span class="dot d5"></span>
            <span class="dot d6"></span>
            <span class="dot d7"></span>
            <span class="dot d8"></span>

            <!-- Antigravity Dotted Circle -->
            <transition name="scale">
              <div v-if="activeStep === i" class="dotted-circle dotted-circle--sm -inset-4 border-primary/30"></div>
            </transition>
            
            <div class="step-icon">
              <div v-if="i >= unlockedCount" class="step-lock">
                <Lock :size="14" class="opacity-40" />
              </div>
              <img v-else :src="step.img" :alt="step.title" class="step-img"
                @error="(e) => e.target.style.opacity='0'" />
            </div>
          </div>
          <div v-if="i < steps.length - 1" class="step-line" :class="{ 'line-active': i < unlockedCount - 1 }" />
        </div>

        <transition name="reveal-content">
          <div v-if="i < unlockedCount" class="step-body">
            <div class="step-badge">{{ String(i + 1).padStart(2, '0') }}</div>
            <h3 class="step-title">{{ step.title }}</h3>
            <p class="step-desc">{{ step.desc }}</p>
            <div class="step-tags">
              <span v-for="tag in step.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
        </transition>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Lock } from 'lucide-vue-next'

const activeStep = ref(0)
const unlockedCount = ref(1)
const hasInteracted = ref(false)

const steps = [
  {
    img: '/icons/step-cart.webp',
    title: 'Identifikasi Produk',
    desc: 'Telusuri katalog lengkap kami dan tentukan layanan digital yang sesuai dengan kebutuhan Anda.',
    tags: ['Pulsa', 'Token PLN', 'Top Up Game'],
  },
  {
    img: '/icons/step-data.webp',
    title: 'Input Detail Akun',
    desc: 'Lengkapi informasi User ID atau nomor tujuan guna memastikan pengiriman produk yang presisi.',
    tags: ['Nomor HP', 'ID Game', 'ID Pelanggan'],
  },
  {
    img: '/icons/step-pay.webp',
    title: 'Konfirmasi Pembayaran',
    desc: 'Gunakan kanal pembayaran pilihan Anda untuk penyelesaian transaksi yang aman dan cepat.',
    tags: ['QRIS', 'E-Wallet', 'VA'],
  },
  {
    img: '/icons/step-done.webp',
    title: 'Distribusi Otomatis',
    desc: 'Sistem mengalokasikan produk secara seketika segera setelah verifikasi pembayaran berhasil.',
    tags: ['Proses Instan', 'Automatisasi'],
  },
]

const handleStepClick = (e, index) => {
  // Trigger Burst Animation
  const wrap = e.currentTarget.querySelector('.step-icon-wrap')
  if (wrap) {
    wrap.classList.remove('burst')
    void wrap.offsetWidth
    wrap.classList.add('burst')
    setTimeout(() => wrap.classList.remove('burst'), 600)
  }

  activeStep.value = index
  hasInteracted.value = true

  // Progressive Unlock Logic
  if (index === unlockedCount.value - 1 && unlockedCount.value < steps.length) {
    setTimeout(() => {
      unlockedCount.value++
      activeStep.value = unlockedCount.value - 1
    }, 400)
  }
}
</script>

<style scoped>
.how-it-works { 
  margin: 16px 0 24px; 
  padding: 20px 16px;
  border-radius: 24px;
  background: var(--background, #fff);
  position: relative;
}

.hiw-particles {
  opacity: 0.4;
}

.hiw-header { margin-bottom: 20px; }
.section-title { font-size: 1.125rem; font-weight: 800; color: var(--foreground,#111827); letter-spacing:-0.02em; margin-bottom: 4px; }
.section-sub { font-size: 0.8125rem; color: var(--muted-foreground,#6b7280); }

.steps {
  background: var(--card,#fff);
  border: 1px solid var(--border,#e5e7eb);
  border-radius: 24px;
  padding: 12px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  position: relative;
  z-index: 10;
}

.step { 
  display: flex; gap: 20px; 
  padding: 12px 0; 
  transition: all 0.4s var(--ease-out-expo);
  min-height: 60px;
}
.locked-step {
  opacity: 0.5;
  pointer-events: none;
}
.locked-step:first-child { opacity: 1; pointer-events: auto; } /* Step 1 clickable at start */
.active-step:not(.locked-step) { pointer-events: auto; }

.step-left { display: flex; flex-direction: column; align-items: center; flex-shrink: 0; }

.step-icon-wrap {
  width: 52px; height: 52px;
  display: flex; align-items: center; justify-content: center;
  position: relative;
}

/* BURST DOTS (Copy of BottomNav Style) */
.dot {
  position: absolute;
  width: 3px; height: 3px;
  border-radius: 50%;
  background: var(--foreground, #111827);
  top: 50%; left: 50%;
  opacity: 0;
  pointer-events: none;
  z-index: 10;
}
.step-icon-wrap.burst .d1 { animation: burst-dot 0.45s ease-out forwards 0.00s; --a: 0deg;   }
.step-icon-wrap.burst .d2 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 45deg;  }
.step-icon-wrap.burst .d3 { animation: burst-dot 0.45s ease-out forwards 0.04s; --a: 90deg;  }
.step-icon-wrap.burst .d4 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 135deg; }
.step-icon-wrap.burst .d5 { animation: burst-dot 0.45s ease-out forwards 0.00s; --a: 180deg; }
.step-icon-wrap.burst .d6 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 225deg; }
.step-icon-wrap.burst .d7 { animation: burst-dot 0.45s ease-out forwards 0.04s; --a: 270deg; }
.step-icon-wrap.burst .d8 { animation: burst-dot 0.45s ease-out forwards 0.02s; --a: 315deg; }

@keyframes burst-dot {
  0%   { transform: translate(-50%,-50%) rotate(var(--a)) translateY(0)    scale(1);  opacity: 0.6; }
  100% { transform: translate(-50%,-50%) rotate(var(--a)) translateY(-16px) scale(0); opacity: 0;   }
}

.step-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; background: var(--muted,#f3f4f6);
  border: 1px solid var(--border,#e5e7eb);
  transition: all 0.4s var(--ease-spring);
  position: relative;
  z-index: 2;
}

.step:hover:not(.locked-step) .step-icon,
.active-step .step-icon { 
  background: var(--primary-muted, #f0fdf4);
  border-color: var(--primary, #16a34a);
  transform: translateY(-2px) scale(1.05);
}

.active-step .step-icon {
  box-shadow: 0 8px 20px rgba(22, 163, 74, 0.15);
}

.step-img { width: 24px; height: 24px; object-fit: contain; }

.step-line {
  width: 2px; flex: 1; min-height: 12px;
  background: var(--border, #e5e7eb);
  margin: 6px 0; border-radius: 2px;
  transition: all 0.8s var(--ease-out-expo);
}
.line-active {
  background: var(--primary, #16a34a);
  box-shadow: 0 0 8px rgba(22, 163, 74, 0.3);
}

.step-body { 
  flex: 1; 
  padding-bottom: 12px; 
  border-bottom: 1px solid var(--border,#f3f4f6); 
  transition: all 0.3s;
  overflow: hidden;
}
.active-step .step-body { border-bottom-color: rgba(22, 163, 74, 0.2); }
.step:last-child .step-body { border-bottom: none; padding-bottom: 0; }

.step-badge {
  display: inline-block;
  font-size: 0.6rem; font-weight: 800; letter-spacing: 0.05em;
  padding: 1px 7px; border-radius: 999px; margin-bottom: 6px;
  background: var(--muted, #f3f4f6);
  color: var(--muted-foreground, #6b7280);
  border: 1px solid var(--border, #e5e7eb);
  transition: all 0.3s;
}

.active-step .step-badge {
  background: var(--primary, #16a34a);
  color: #fff;
  border-color: var(--primary, #16a34a);
}

.step-title { font-size: 0.9375rem; font-weight: 800; color: var(--foreground,#111827); margin-bottom: 4px; transition: color 0.3s; }
.active-step .step-title { color: var(--primary, #16a34a); }

.step-desc { font-size: 0.75rem; color: var(--muted-foreground,#6b7280); line-height: 1.5; margin-bottom: 10px; }

.step-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag {
  font-size: 0.5625rem; font-weight: 600;
  padding: 1px 8px; border-radius: 999px;
  background: var(--background,#f8fafc);
  border: 1px solid var(--border,#e5e7eb);
  color: var(--muted-foreground,#6b7280);
  transition: all 0.3s;
}

.active-step .tag {
  border-color: rgba(22, 163, 74, 0.2);
  color: var(--primary, #16a34a);
  background: var(--primary-muted, #f0fdf4);
}

/* Transitions */
.reveal-content-enter-active {
  transition: all 0.6s var(--ease-out-expo);
}
.reveal-content-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.scale-enter-active, .scale-leave-active { transition: all 0.6s var(--ease-spring); }
.scale-enter-from, .scale-leave-to { opacity: 0; transform: scale(0.4) rotate(-90deg); }

.fade-enter-active { transition: opacity 1s ease; }
.fade-enter-from { opacity: 0; }
</style>
