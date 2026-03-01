<template>
  <footer class="home-footer">

    <!-- Card wrapper — sama kayak HowItWorks -->
    <div class="footer-card">

      <!-- Brand -->
      <div class="footer-brand">
        <router-link to="/" class="brand-logo">
          <span class="fee">FEE</span><span class="pay">PAY</span>
        </router-link>
        <p class="brand-desc">Platform top up game & pulsa terpercaya. Proses instan, harga terjangkau, layanan 24/7.</p>
      </div>

      <div class="footer-divider" />

      <!-- Payment Methods -->
      <div class="footer-payment">
        <p class="section-label">Metode Pembayaran</p>
        <div class="payment-icons">
          <div class="pay-icon">QRIS</div>
          <div class="pay-icon">BCA</div>
          <div class="pay-icon">Mandiri</div>
          <div class="pay-icon">BNI</div>
          <div class="pay-icon">GoPay</div>
          <div class="pay-icon">OVO</div>
          <div class="pay-icon">Dana</div>
        </div>
      </div>

      <div class="footer-divider" />

      <!-- Links -->
      <div class="footer-links">
        <router-link to="/about"        class="footer-link">Tentang Kami</router-link>
        <span class="footer-dot">·</span>
        <router-link to="/privacy"      class="footer-link">Kebijakan Privasi</router-link>
        <span class="footer-dot">·</span>
        <router-link to="/terms"        class="footer-link">Syarat & Ketentuan</router-link>
        <span class="footer-dot">·</span>
        <router-link to="/transactions" class="footer-link">Cek Transaksi</router-link>
      </div>

      <!-- Social -->
      <div class="footer-social">
        <a :href="socialLinks.instagram" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
        </a>
        <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="WhatsApp">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
        </a>
        <a :href="socialLinks.tiktok" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="TikTok">
          <svg width="15" height="15" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
          </svg>
        </a>
      </div>

      <div class="footer-divider" />

      <div class="footer-copy">© 2025 FeePay · All rights reserved</div>

    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const socialLinks = {
  instagram: 'https://instagram.com/meilanoilham',
  tiktok: 'https://tiktok.com/@fee0199'
}

const whatsappLink = computed(() => {
  const phone = '62895328700079'
  const message = encodeURIComponent('Halo FeePay, saya ingin bertanya tentang layanan...')
  return `https://wa.me/${phone}?text=${message}`
})
</script>

<style scoped>
.home-footer {
  margin: 4px 0 12px;
}

/* Card — persis sama kayak .steps di HowItWorks */
.footer-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  padding: 6px 16px 16px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

/* Brand */
.footer-brand { padding-top: 10px; }
.brand-logo {
  font-size: 1.25rem;
  font-weight: 900;
  letter-spacing: -0.04em;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 6px;
  transition: opacity 0.2s;
}
.brand-logo:hover { opacity: 0.8; }
.fee { color: var(--foreground, #111827); }
.pay { color: #16a34a; }
.brand-desc {
  font-size: 0.75rem;
  color: var(--muted-foreground, #6b7280);
  line-height: 1.6;
}

/* Divider — sama kayak step-body border */
.footer-divider {
  height: 1px;
  background: var(--border, #f3f4f6);
}

/* Section label — sama kayak step-badge style */
.section-label {
  font-size: 0.5625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground, #9ca3af);
  margin-bottom: 8px;
}

/* Payment */
.payment-icons {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}
.pay-icon {
  padding: 3px 10px;
  background: var(--background, #f8fafc);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 999px; /* pill — selaras tag di HowItWorks */
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--muted-foreground, #6b7280);
  transition: all 0.15s;
  cursor: default;
}
.pay-icon:hover {
  border-color: #16a34a;
  color: #16a34a;
  background: #f0fdf4;
}

/* Links */
.footer-links {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
}
.footer-link {
  font-size: 0.75rem;
  color: var(--muted-foreground, #6b7280);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}
.footer-link:hover { color: #16a34a; }
.footer-dot {
  color: var(--border, #d1d5db);
  font-size: 0.875rem;
}

/* Social */
.footer-social { display: flex; gap: 8px; }
.social-btn {
  width: 36px; height: 36px;
  border-radius: 10px; /* selaras step-icon border-radius 14px tapi lebih kecil */
  background: var(--background, #f8fafc);
  border: 1px solid var(--border, #e5e7eb);
  display: flex; align-items: center; justify-content: center;
  color: var(--muted-foreground, #6b7280);
  text-decoration: none;
  transition: all 0.2s;
}
.social-btn:hover {
  background: #16a34a;
  border-color: #16a34a;
  color: #fff;
  transform: translateY(-2px);
}

/* Copy */
.footer-copy {
  font-size: 0.6875rem;
  color: var(--muted-foreground, #9ca3af);
  text-align: center;
  font-weight: 500;
}
</style>