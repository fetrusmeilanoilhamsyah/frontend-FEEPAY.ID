<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <button @click="$router.back()" class="back-btn">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="page-title">Tentang Kami</h1>
    </div>

    <!-- Content -->
    <div class="page-content">
      
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="brand-logo-large">
          <span class="fee">FEE</span><span class="pay">PAY</span>
        </div>
        <p class="hero-tagline">Solusi Terintegrasi untuk Kebutuhan Digital dan Hiburan Anda</p>
      </section>

      <!-- About -->
      <section class="content-section">
        <h2 class="section-title">Profil Perusahaan</h2>
        <p class="section-text">
          FeePay merupakan platform penyedia layanan transaksi digital yang berfokus pada kemudahan akses dan keamanan tingkat tinggi. Kami hadir sebagai solusi bagi jutaan pengguna dalam memenuhi kebutuhan top up game, produk virtual, hingga tagihan bulanan dengan standar layanan kelas dunia.
        </p>
        <p class="section-text">
          Beroperasi sejak awal tahun 2024, FeePay telah membangun ekosistem digital yang menghubungkan penyedia layanan dengan konsumen secara efisien. Komitmen kami adalah menghadirkan transparansi harga dan kecepatan proses di setiap transaksi yang Anda lakukan.
        </p>
      </section>

      <!-- Layanan -->
      <section class="content-section">
        <h2 class="section-title">Produk & Layanan</h2>
        <div class="service-list">
          <div class="service-item">
            <div class="service-info">
              <h3>Top Up Game & Voucher</h3>
              <p>Dukungan luas untuk berbagai judul populer mulai dari Mobile Legends, Free Fire, hingga platform besar seperti Steam dan PlayStation.</p>
            </div>
          </div>
          <div class="service-item">
            <div class="service-info">
              <h3>Produk Telekomunikasi</h3>
              <p>Layanan pulsa dan paket data untuk seluruh operator seluler di Indonesia dengan jaminan harga kompetitif.</p>
            </div>
          </div>
          <div class="service-item">
            <div class="service-info">
              <h3>Token Listrik PLN</h3>
              <p>Pembelian token listrik prabayar dengan proses otomatisasi yang berjalan 24 jam penuh.</p>
            </div>
          </div>
          <div class="service-item">
            <div class="service-info">
              <h3>Layanan Hiburan Digital</h3>
              <p>Akses ke berbagai voucher aplikasi streaming dan hiburan lainnya untuk melengkapi gaya hidup digital Anda.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Keunggulan -->
      <section class="content-section">
        <h2 class="section-title">Nilai Utama Kami</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <h3>Automasi Transaksi</h3>
            <p>Sistem kami terhubung langsung dengan provider untuk pemrosesan secara seketika.</p>
          </div>
          <div class="feature-card">
            <h3>Transparansi Biaya</h3>
            <p>Harga yang tertera adalah harga final tanpa ada biaya tersembunyi yang membingungkan.</p>
          </div>
          <div class="feature-card">
            <h3>Keamanan Data</h3>
            <p>Perlindungan data pribadi pengguna menjadi prioritas utama melalui enkripsi standar industri.</p>
          </div>
          <div class="feature-card">
            <h3>Efisiensi Layanan</h3>
            <p>Antarmuka yang dirancang untuk mempercepat proses pencarian hingga pembayaran produk.</p>
          </div>
          <div class="feature-card">
            <h3>Variasi Pembayaran</h3>
            <p>Mendukung berbagai kanal pembayaran mulai dari QRIS, E-Wallet, hingga Virtual Account.</p>
          </div>
          <div class="feature-card">
            <h3>Dukungan Teknis</h3>
            <p>Tim bantuan kami siaga untuk memberikan solusi atas setiap kendala yang Anda hadapi.</p>
          </div>
        </div>
      </section>

      <!-- Stats -->
      <section class="content-section stats-section">
        <div class="stat-card">
          <div class="stat-number">500K+</div>
          <div class="stat-label">Pengguna Terdaftar</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">2M+</div>
          <div class="stat-label">Transaksi Terproses</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">98%</div>
          <div class="stat-label">Indeks Kepuasan</div>
        </div>
      </section>

      <!-- Contact -->
      <section class="content-section contact-section">
        <h2 class="section-title">Layanan Bantuan</h2>
        <div class="contact-cards">
          <a href="https://wa.me/62895328700079" target="_blank" class="contact-card">
            <div class="contact-icon whatsapp">
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </div>
            <div class="contact-info">
              <h3>Helpdesk WhatsApp</h3>
              <p>Layanan konsultasi dan bantuan cepat</p>
            </div>
          </a>
          <a href="mailto:fetrusmeilanoilham@gmail.com" class="contact-card">
            <div class="contact-icon email">
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <div class="contact-info">
              <h3>Email Support</h3>
              <p>fetrusmeilanoilham@gmail.com</p>
            </div>
          </a>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
// No script needed for this static page
</script>

<style scoped>
/* Base */
.page-wrapper {
  min-height: 100vh;
  background: var(--background, #f8fafc);
  padding-bottom: 80px;
}

/* Header */
.page-header {
  position: sticky;
  top: 0;
  z-index: 10;
  background: var(--card, #fff);
  border-bottom: 1px solid var(--border, #e5e7eb);
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.back-btn {
  background: none;
  border: none;
  color: var(--foreground, #111827);
  cursor: pointer;
  display: flex;
  padding: 4px;
  border-radius: 8px;
  transition: background 0.2s;
}
.back-btn:hover {
  background: var(--muted, #f3f4f6);
}
.page-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin: 0;
  color: var(--foreground, #111827);
}

/* Content */
.page-content {
  max-width: 640px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* Hero */
.hero-section {
  text-align: center;
  padding: 32px 0;
  margin-bottom: 24px;
}
.brand-logo-large {
  font-size: 3rem;
  font-weight: 900;
  letter-spacing: -0.03em;
  margin-bottom: 16px;
}
.fee {
  color: var(--foreground, #111827);
}
.pay {
  color: #16a34a;
}
.hero-tagline {
  font-size: 1rem;
  color: var(--muted-foreground, #6b7280);
  line-height: 1.6;
}

/* Sections */
.content-section {
  margin-bottom: 40px;
}
.section-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 16px;
  color: var(--foreground, #111827);
}
.section-text {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--muted-foreground, #6b7280);
  margin-bottom: 16px;
}

/* Service List */
.service-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.service-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
}
.service-icon {
  font-size: 2rem;
  flex-shrink: 0;
}
.service-info h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 4px;
  color: var(--foreground, #111827);
}
.service-info p {
  font-size: 0.8125rem;
  line-height: 1.5;
  color: var(--muted-foreground, #6b7280);
}

/* Feature Grid */
.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}
.feature-card {
  padding: 20px 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  text-align: center;
}
.feature-icon {
  font-size: 2rem;
  margin-bottom: 12px;
}
.feature-card h3 {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--foreground, #111827);
}
.feature-card p {
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--muted-foreground, #6b7280);
}

/* Stats */
.stats-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
}
.stat-card {
  padding: 24px 16px;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border-radius: 12px;
  text-align: center;
}
.stat-number {
  font-size: 1.75rem;
  font-weight: 800;
  color: #fff;
  margin-bottom: 4px;
}
.stat-label {
  font-size: 0.75rem;
  color: rgba(255,255,255,0.9);
}

/* Contact */
.contact-cards {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.contact-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s;
}
.contact-card:hover {
  border-color: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
.contact-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.contact-icon.whatsapp {
  background: #25d366;
  color: #fff;
}
.contact-icon.email {
  background: #3b82f6;
  color: #fff;
}
.contact-info h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin-bottom: 2px;
  color: var(--foreground, #111827);
}
.contact-info p {
  font-size: 0.8125rem;
  color: var(--muted-foreground, #6b7280);
}
</style>
