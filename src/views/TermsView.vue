<template>
  <div class="page-wrapper">
    <!-- Header -->
    <div class="page-header">
      <button @click="$router.back()" class="back-btn">
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="page-title">Syarat & Ketentuan</h1>
    </div>

    <!-- Content -->
    <div class="page-content">
      
      <div class="update-date">Berlaku sejak: 1 Januari 2025</div>

      <section class="content-section">
        <p class="intro-text">
          Dengan menggunakan layanan FeePay, Anda setuju untuk terikat dengan Syarat dan Ketentuan berikut. 
          Mohon baca dengan seksama sebelum melakukan transaksi.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">1. Definisi</h2>
        <ul class="bullet-list">
          <li><strong>"Platform"</strong> adalah website dan aplikasi mobile FeePay</li>
          <li><strong>"Pengguna"</strong> adalah setiap orang yang mengakses dan menggunakan layanan kami</li>
          <li><strong>"Produk"</strong> adalah layanan digital yang tersedia di platform (top up game, pulsa, token PLN, dll)</li>
          <li><strong>"Transaksi"</strong> adalah proses pembelian produk melalui platform</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">2. Registrasi dan Akun</h2>
        <p class="section-text">2.1. Untuk menggunakan beberapa layanan, Anda mungkin perlu membuat akun dengan informasi yang akurat dan lengkap.</p>
        <p class="section-text">2.2. Anda bertanggung jawab menjaga kerahasiaan password dan semua aktivitas yang terjadi di akun Anda.</p>
        <p class="section-text">2.3. Anda harus berusia minimal 17 tahun atau memiliki izin dari orang tua/wali untuk menggunakan layanan kami.</p>
        <p class="section-text">2.4. Satu nomor telepon hanya dapat digunakan untuk satu akun.</p>
      </section>

      <section class="content-section">
        <h2 class="section-title">3. Transaksi dan Pembayaran</h2>
        
        <h3 class="sub-title">3.1. Proses Pemesanan</h3>
        <ul class="bullet-list">
          <li>Pilih produk yang diinginkan dan masukkan data yang diperlukan dengan benar</li>
          <li>Pilih metode pembayaran dan selesaikan pembayaran sesuai instruksi</li>
          <li>Transaksi akan diproses otomatis setelah pembayaran dikonfirmasi</li>
        </ul>

        <h3 class="sub-title">3.2. Metode Pembayaran</h3>
        <p class="section-text">Kami menerima pembayaran melalui:</p>
        <ul class="bullet-list">
          <li>Transfer Bank (BCA, Mandiri, BNI, BRI, Permata, CIMB)</li>
          <li>E-Wallet (GoPay, OVO, Dana, ShopeePay, LinkAja)</li>
          <li>QRIS (scan dengan aplikasi mobile banking atau e-wallet)</li>
          <li>Virtual Account</li>
          <li>Minimarket (Alfamart, Indomaret)</li>
        </ul>

        <h3 class="sub-title">3.3. Harga</h3>
        <ul class="bullet-list">
          <li>Semua harga dalam Rupiah (IDR) dan sudah termasuk pajak jika ada</li>
          <li>Harga dapat berubah sewaktu-waktu tanpa pemberitahuan sebelumnya</li>
          <li>Harga yang berlaku adalah harga pada saat transaksi diselesaikan</li>
        </ul>

        <h3 class="sub-title">3.4. Waktu Pemrosesan</h3>
        <ul class="bullet-list">
          <li>Transaksi otomatis: 1-5 menit setelah pembayaran dikonfirmasi</li>
          <li>Transaksi manual: maksimal 1x24 jam (jam kerja)</li>
          <li>Delay dapat terjadi pada peak hours atau gangguan sistem provider</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">4. Kebijakan Refund dan Pembatalan</h2>
        
        <h3 class="sub-title">4.1. Tidak Dapat Di-refund</h3>
        <p class="section-text">Produk digital tidak dapat di-refund atau dibatalkan setelah:</p>
        <ul class="bullet-list">
          <li>Pembayaran telah dikonfirmasi dan sedang diproses</li>
          <li>Produk telah berhasil dikirim ke akun/nomor tujuan</li>
        </ul>

        <h3 class="sub-title">4.2. Refund Dapat Diproses Jika:</h3>
        <ul class="bullet-list">
          <li>Kesalahan sistem yang menyebabkan double payment</li>
          <li>Produk tidak diterima dalam 1x24 jam dan bukan kesalahan input data</li>
          <li>Server provider down dalam jangka waktu lama</li>
        </ul>

        <h3 class="sub-title">4.3. Proses Refund</h3>
        <ul class="bullet-list">
          <li>Hubungi customer service dengan menyertakan bukti transaksi</li>
          <li>Refund akan diproses dalam 3-7 hari kerja setelah disetujui</li>
          <li>Dana akan dikembalikan ke metode pembayaran yang sama</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">5. Tanggung Jawab Pengguna</h2>
        <p class="section-text">Pengguna bertanggung jawab untuk:</p>
        <ul class="bullet-list">
          <li>Memastikan data yang diinput (ID game, nomor HP, nomor meter PLN) <strong>100% benar</strong></li>
          <li>Tidak melakukan transaksi ilegal atau melanggar hukum</li>
          <li>Tidak menggunakan platform untuk fraud, spam, atau aktivitas yang merugikan</li>
          <li>Tidak melakukan chargeback atau dispute tanpa alasan yang jelas</li>
          <li>Menyimpan bukti transaksi hingga produk diterima</li>
        </ul>
        <p class="section-text important-note">
          ⚠️ <strong>PENTING:</strong> Kami tidak bertanggung jawab atas kesalahan input data oleh pengguna. 
          Periksa kembali data sebelum melakukan pembayaran.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">6. Larangan Penggunaan</h2>
        <p class="section-text">Pengguna dilarang:</p>
        <ul class="bullet-list">
          <li>Menggunakan platform untuk tujuan ilegal atau melanggar hukum</li>
          <li>Melakukan transaksi fraud atau menggunakan metode pembayaran curian</li>
          <li>Menyalahgunakan promo atau voucher dengan cara yang tidak sah</li>
          <li>Melakukan scraping, hacking, atau mengakses sistem tanpa izin</li>
          <li>Menggunakan bot atau automated tools untuk transaksi</li>
          <li>Menjual kembali produk kami tanpa izin resmi sebagai reseller</li>
        </ul>
        <p class="section-text">
          Pelanggaran akan mengakibatkan <strong>penutupan akun permanen</strong> tanpa refund.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">7. Batasan Tanggung Jawab</h2>
        <ul class="bullet-list">
          <li>FeePay adalah platform perantara antara pengguna dan provider produk digital</li>
          <li>Kami tidak bertanggung jawab atas kebijakan, perubahan, atau penghentian layanan dari provider</li>
          <li>Kami tidak bertanggung jawab atas kerugian akibat kelalaian pengguna (salah input data, dll)</li>
          <li>Kami tidak bertanggung jawab atas force majeure (bencana alam, perang, gangguan internet, dll)</li>
          <li>Liability kami terbatas pada nilai transaksi yang gagal</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">8. Perubahan Layanan</h2>
        <p class="section-text">
          Kami berhak untuk mengubah, menangguhkan, atau menghentikan layanan (sebagian atau seluruh) kapan saja 
          dengan atau tanpa pemberitahuan sebelumnya. Perubahan signifikan akan diinformasikan melalui platform atau email.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">9. Hukum yang Berlaku</h2>
        <p class="section-text">
          Syarat dan Ketentuan ini diatur dan ditafsirkan sesuai dengan hukum Republik Indonesia. 
          Setiap perselisihan yang timbul akan diselesaikan melalui musyawarah atau jalur hukum di Pengadilan Jakarta Selatan.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">10. Perubahan Syarat & Ketentuan</h2>
        <p class="section-text">
          Kami dapat memperbarui Syarat dan Ketentuan ini kapan saja. Perubahan akan efektif setelah dipublikasikan di platform. 
          Dengan terus menggunakan layanan setelah perubahan, Anda dianggap menyetujui Syarat dan Ketentuan yang baru.
        </p>
      </section>

      <section class="content-section contact-section">
        <h2 class="section-title">11. Kontak</h2>
        <p class="section-text">
          Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, hubungi kami:
        </p>
        <div class="contact-box">
          <div class="contact-item">
            <strong>Customer Service:</strong> +62 812-3456-7890 (WhatsApp)
          </div>
          <div class="contact-item">
            <strong>Email:</strong> support@feepay.com
          </div>
          <div class="contact-item">
            <strong>Jam Operasional:</strong> 24/7 (Respon maksimal 1x24 jam)
          </div>
        </div>
      </section>

      <div class="agreement-box">
        <p>Dengan menggunakan layanan FeePay, Anda menyatakan telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan di atas.</p>
      </div>

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

.sub-title {
  font-size: 1rem;
  font-weight: 600;
  margin: 16px 0 8px;
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

.important-note {
  padding: 16px;
  background: #fef3c7;
  border-left: 4px solid #f59e0b;
  border-radius: 8px;
  margin-top: 16px;
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

.agreement-box {
  margin-top: 32px;
  padding: 20px;
  background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
  border-radius: 12px;
  text-align: center;
}

.agreement-box p {
  font-size: 0.9375rem;
  line-height: 1.7;
  color: #fff;
  margin: 0;
  font-weight: 500;
}
</style>
