<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <button @click="$router.back()" class="back-btn">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="page-title">Kebijakan Privasi</h1>
    </div>

    <!-- Content -->
    <div class="page-content">
      
      <div class="update-date">Terakhir diperbarui: 1 Januari 2025</div>

      <section class="content-section">
        <p class="intro-text">
          FeePay menghargai privasi Anda dan berkomitmen untuk melindungi data pribadi Anda. 
          Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">1. Informasi yang Kami Kumpulkan</h2>
        <p class="section-text">Kami mengumpulkan informasi berikut ketika Anda menggunakan layanan kami:</p>
        <ul class="bullet-list">
          <li><strong>Informasi Akun:</strong> Nama, email, nomor telepon yang Anda berikan saat registrasi</li>
          <li><strong>Informasi Transaksi:</strong> Detail pembelian, metode pembayaran, riwayat transaksi</li>
          <li><strong>Informasi Perangkat:</strong> IP address, jenis browser, sistem operasi</li>
          <li><strong>Data Penggunaan:</strong> Halaman yang dikunjungi, waktu akses, interaksi dengan platform</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">2. Penggunaan Informasi</h2>
        <p class="section-text">Informasi yang kami kumpulkan digunakan untuk:</p>
        <ul class="bullet-list">
          <li>Memproses transaksi dan mengirimkan produk digital yang Anda beli</li>
          <li>Memberikan layanan customer support</li>
          <li>Mengirimkan notifikasi terkait transaksi dan pembaruan layanan</li>
          <li>Mencegah fraud dan menjaga keamanan platform</li>
          <li>Meningkatkan pengalaman pengguna dan mengembangkan fitur baru</li>
          <li>Mematuhi kewajiban hukum dan regulasi yang berlaku</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">3. Keamanan Data</h2>
        <p class="section-text">
          Kami menerapkan langkah-langkah keamanan teknis dan organisasi yang sesuai untuk melindungi data pribadi Anda:
        </p>
        <ul class="bullet-list">
          <li>Enkripsi SSL/TLS untuk semua transmisi data</li>
          <li>Server aman dengan firewall dan sistem monitoring 24/7</li>
          <li>Akses terbatas ke data pribadi hanya untuk staf yang berwenang</li>
          <li>Audit keamanan berkala dan pembaruan sistem</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">4. Berbagi Informasi dengan Pihak Ketiga</h2>
        <p class="section-text">Kami tidak menjual data pribadi Anda. Kami hanya membagikan informasi kepada:</p>
        <ul class="bullet-list">
          <li><strong>Payment Gateway:</strong> Untuk memproses pembayaran (Midtrans, Xendit, dll)</li>
          <li><strong>Provider Game:</strong> Untuk mengirimkan top up sesuai pesanan</li>
          <li><strong>Pihak Berwenang:</strong> Jika diwajibkan oleh hukum atau untuk mencegah tindak kejahatan</li>
        </ul>
        <p class="section-text">
          Semua pihak ketiga yang kami gunakan wajib mematuhi standar keamanan dan privasi yang ketat.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">5. Cookies</h2>
        <p class="section-text">
          Kami menggunakan cookies untuk meningkatkan pengalaman Anda. Cookies membantu kami:
        </p>
        <ul class="bullet-list">
          <li>Mengingat preferensi dan pengaturan Anda</li>
          <li>Menganalisis traffic dan penggunaan platform</li>
          <li>Menyediakan iklan yang relevan (jika ada)</li>
        </ul>
        <p class="section-text">
          Anda dapat mengatur browser untuk menolak cookies, namun beberapa fitur mungkin tidak berfungsi optimal.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">6. Hak Pengguna</h2>
        <p class="section-text">Anda memiliki hak untuk:</p>
        <ul class="bullet-list">
          <li><strong>Akses:</strong> Meminta salinan data pribadi yang kami simpan</li>
          <li><strong>Perbaikan:</strong> Memperbarui atau memperbaiki data yang tidak akurat</li>
          <li><strong>Penghapusan:</strong> Meminta penghapusan data pribadi Anda</li>
          <li><strong>Pembatasan:</strong> Membatasi penggunaan data dalam kondisi tertentu</li>
          <li><strong>Portabilitas:</strong> Meminta data dalam format yang dapat dipindahkan</li>
        </ul>
        <p class="section-text">
          Untuk menggunakan hak-hak ini, hubungi kami di <strong>privacy@feepay.com</strong>
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">7. Retensi Data</h2>
        <p class="section-text">
          Kami menyimpan data pribadi Anda selama diperlukan untuk memberikan layanan dan mematuhi kewajiban hukum. 
          Data transaksi disimpan minimal 5 tahun sesuai regulasi perpajakan Indonesia.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">8. Perubahan Kebijakan</h2>
        <p class="section-text">
          Kami dapat memperbarui Kebijakan Privasi ini dari waktu ke waktu. Perubahan signifikan akan kami informasikan 
          melalui email atau notifikasi di platform. Tanggal "Terakhir diperbarui" di atas menunjukkan versi terkini.
        </p>
      </section>

      <section class="content-section contact-section">
        <h2 class="section-title">9. Hubungi Kami</h2>
        <p class="section-text">
          Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini atau ingin menggunakan hak Anda, hubungi kami:
        </p>
        <div class="contact-box">
          <div class="contact-item">
            <strong>Email:</strong> fetrusmeilanoilham@gmail.com
          </div>
          <div class="contact-item">
            <strong>WhatsApp:</strong> +62 895-3287-00079
          </div>
          <div class="contact-item">
            <strong>Alamat:</strong> Jl. desa sugih waras 
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup>
// No script needed
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
  max-width: 680px;
  margin: 0 auto;
  padding: 24px 16px;
}

.update-date {
  font-size: 0.8125rem;
  color: var(--muted-foreground, #6b7280);
  margin-bottom: 24px;
  padding: 12px 16px;
  background: var(--muted, #f3f4f6);
  border-radius: 8px;
  text-align: center;
}

.intro-text {
  font-size: 1rem;
  line-height: 1.7;
  color: var(--muted-foreground, #6b7280);
  margin-bottom: 8px;
}

.content-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 700;
  margin-bottom: 12px;
  color: var(--foreground, #111827);
}

.section-text {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--muted-foreground, #6b7280);
  margin-bottom: 12px;
}

.bullet-list {
  margin: 12px 0;
  padding-left: 20px;
}

.bullet-list li {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--muted-foreground, #6b7280);
  margin-bottom: 8px;
}

.bullet-list li strong {
  color: var(--foreground, #111827);
  font-weight: 600;
}

.contact-box {
  margin-top: 16px;
  padding: 20px;
  background: var(--card, #fff);
  border: 1px solid var(--border, #e5e7eb);
  border-radius: 12px;
}

.contact-item {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: var(--muted-foreground, #6b7280);
  margin-bottom: 8px;
}

.contact-item:last-child {
  margin-bottom: 0;
}

.contact-item strong {
  color: var(--foreground, #111827);
  font-weight: 600;
}
</style>