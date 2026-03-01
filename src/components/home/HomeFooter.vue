<template>
  <footer class="home-footer">
    <div class="footer-card">
      <div class="footer-brand">
        <router-link to="/" class="brand-logo">
          <span class="fee">FEE</span><span class="pay">PAY</span>
        </router-link>
        <p class="brand-desc">Platform top up game & pulsa terpercaya. Proses instan, harga terjangkau, layanan 24/7.</p>
      </div>

      <div class="footer-divider" />

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

      <div class="footer-links">
        <router-link to="/about" class="footer-link">Tentang Kami</router-link>
        <span class="footer-dot">·</span>
        <router-link to="/privacy" class="footer-link">Kebijakan Privasi</router-link>
        <span class="footer-dot">·</span>
        <router-link to="/terms" class="footer-link">Syarat & Ketentuan</router-link>
        <span class="footer-dot">·</span>
        <router-link to="/transactions" class="footer-link">Cek Transaksi</router-link>
      </div>

      <div class="footer-social">
        <a :href="socialLinks.instagram" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="Instagram">
          <img src="/icons/social/instagram.webp" class="social-icon" alt="Instagram"
            @error="(e) => e.target.style.display='none'" />
        </a>
        <a :href="whatsappLink" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="WhatsApp">
          <img src="/icons/social/whatsapp.webp" class="social-icon" alt="WhatsApp"
            @error="(e) => e.target.style.display='none'" />
        </a>
        <a :href="socialLinks.tiktok" target="_blank" rel="noopener noreferrer" class="social-btn" aria-label="TikTok">
          <img src="/icons/social/tiktok.webp" class="social-icon" alt="TikTok"
            @error="(e) => e.target.style.display='none'" />
        </a>
      </div>

      <div class="footer-divider" />

      <div class="footer-copy">© 2026 FeePay · All rights reserved</div>
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const socialLinks = {
  instagram: 'https://instagram.com/meilanoilham',
  tiktok: 'https://tiktok.com/@fee010599'
}

const whatsappLink = computed(() => {
  const phone = '62895328700079'
  const message = encodeURIComponent('Halo FeePay, saya ingin bertanya tentang layanan...')
  return `https://wa.me/${phone}?text=${message}`
})
</script>

<style scoped>
.home-footer { margin: 20px 0 0 0; }

.footer-card {
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 18px;
  padding: 20px 18px 18px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.footer-brand { padding-top: 0; }

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

.footer-divider {
  height: 1px;
  background: var(--border, #f3f4f6);
}

.section-label {
  font-size: 0.5625rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--muted-foreground, #9ca3af);
  margin-bottom: 8px;
}

.payment-icons { display: flex; flex-wrap: wrap; gap: 5px; }

.pay-icon {
  padding: 3px 10px;
  background: var(--background, #f8fafc);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 999px;
  font-size: 0.6rem;
  font-weight: 700;
  color: var(--muted-foreground, #6b7280);
  transition: all 0.15s;
  cursor: default;
}
.pay-icon:hover { border-color: #16a34a; color: #16a34a; background: #f0fdf4; }

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

.footer-dot { color: var(--border, #d1d5db); font-size: 0.875rem; }

.footer-social { display: flex; gap: 8px; }

.social-btn {
  width: 36px; height: 36px;
  border-radius: 10px;
  background: var(--background, #f8fafc);
  border: 1px solid var(--border, #e5e7eb);
  display: flex; align-items: center; justify-content: center;
  text-decoration: none;
  transition: all 0.2s;
  overflow: hidden;
}
.social-btn:hover {
  border-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22,163,74,0.15);
}

.social-icon {
  width: 22px; height: 22px;
  object-fit: contain;
}

.footer-copy {
  font-size: 0.6875rem;
  color: var(--muted-foreground, #9ca3af);
  text-align: center;
  font-weight: 500;
}

@media (min-width: 768px) {
  .home-footer { margin: 32px 0 0 0; }
  .footer-card { padding: 28px 32px 24px; gap: 18px; }
  .footer-brand { text-align: center; }
  .brand-logo { font-size: 1.5rem; }
  .brand-desc { font-size: 0.875rem; max-width: 600px; margin: 0 auto; }
  .footer-payment { text-align: center; }
  .section-label { text-align: center; }
  .payment-icons { gap: 8px; justify-content: center; }
  .pay-icon { padding: 6px 16px; font-size: 0.6875rem; }
  .footer-links { justify-content: center; }
  .footer-link { font-size: 0.8125rem; }
  .footer-social { justify-content: center; gap: 12px; }
  .social-btn { width: 42px; height: 42px; }
  .footer-copy { font-size: 0.75rem; }
}
</style>