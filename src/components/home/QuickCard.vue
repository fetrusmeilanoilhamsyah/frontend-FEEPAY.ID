<template>
  <router-link :to="to" class="quick-card">
    <div class="icon-wrap">
      <img :src="img" :alt="label" class="icon-img" />
      <span v-if="badge" class="badge">{{ badge }}</span>
    </div>
    <span class="card-label">{{ label }}</span>
  </router-link>
</template>

<script setup>
defineProps({
  img:   { type: String, required: true },
  label: { type: String, required: true },
  to:    { type: String, required: true },
  badge: { type: String, default: null }
})
</script>

<style scoped>
.quick-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  text-decoration: none;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  /* Mencegah highlight biru saat di-tap di HP */
}

.icon-wrap {
  position: relative;
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: var(--muted, #f3f4f6);
  display: flex;
  align-items: center;
  justify-content: center;
  /* Transisi ala aplikasi native */
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid rgba(0, 0, 0, 0.03);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

/* Efek saat kursor berada di atas menu (Desktop) */
@media (hover: hover) {
  .quick-card:hover .icon-wrap {
    transform: translateY(-2px);
    box-shadow: 0 6px 14px rgba(0, 0, 0, 0.08);
    background: var(--muted-hover, #f9fafb);
  }
}

/* Efek saat diklik / di-tap (Mobile & Desktop) */
.quick-card:active .icon-wrap {
  transform: scale(0.92) translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.1s ease-out;
}

.icon-img {
  width: 32px;
  height: 32px;
  object-fit: contain;
  /* Opsional: memberi sedikit ketajaman pada icon */
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
}

.badge {
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  background: #ef4444; /* Warna merah promo yang tajam */
  color: #ffffff;
  font-size: 8px;
  font-weight: 800;
  letter-spacing: 0.04em;
  padding: 3px 6px;
  border-radius: 6px;
  white-space: nowrap;
  /* Tambahan shadow & border agar badge tidak menyatu dengan background */
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35);
  border: 1.5px solid #ffffff;
  z-index: 2;
}

.card-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--foreground, #1f2937);
  text-align: center;
  line-height: 1.2;
  letter-spacing: -0.01em;
  /* Anti-aliasing agar teks lebih mulus */
  -webkit-font-smoothing: antialiased;
}
</style>