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
      
      <div class="update-date">Versi 1.1 — Berlaku efektif sejak: 15 Maret 2026</div>

      <section class="content-section">
        <p class="intro-text">
          Dengan mengakses dan menggunakan layanan pada platform FeePay, Anda menyatakan telah membaca, memahami, dan menyetujui untuk terikat secara hukum dengan Syarat dan Ketentuan di bawah ini.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">1. Ketentuan Umum dan Definisi</h2>
        <ul class="bullet-list">
          <li><strong>Platform:</strong> Merujuk pada situs web resmi (feepay.com) dan seluruh ekosistem layanan digital milik FeePay.</li>
          <li><strong>Pengguna:</strong> Pihak yang menggunakan layanan Platform untuk melakukan transaksi produk digital.</li>
          <li><strong>Produk Digital:</strong> Seluruh item virtual yang tersedia, termasuk namun tidak terbatas pada top up game, pulsa, dan layanan berlangganan.</li>
          <li><strong>Transaksi:</strong> Keseluruhan proses pemesanan, pembayaran, hingga pengiriman konten digital kepada Pengguna.</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">2. Pendaftaran dan Keamanan Akun</h2>
        <p class="section-text">2.1. Pengguna wajib memberikan informasi yang akurat, terkini, dan lengkap selama proses pendaftaran atau penggunaan layanan.</p>
        <p class="section-text">2.2. Keamanan kredensial akun, termasuk kata sandi (password), sepenuhnya menjadi tanggung jawab Pengguna. FeePay tidak bertanggung jawab atas kerugian akibat kelalaian Pengguna dalam menjaga kerahasiaan akun.</p>
        <p class="section-text">2.3. Pengguna menyatakan telah berusia cakap menurut hukum atau menggunakan Platform di bawah pengawasan orang tua/wali yang sah.</p>
      </section>

      <section class="content-section">
        <h2 class="section-title">3. Tata Cara Transaksi dan Pembayaran</h2>
        
        <h3 class="sub-title">3.1. Mekanisme Pemesanan</h3>
        <ul class="bullet-list">
          <li>Pengguna wajib memastikan data tujuan (seperti User ID Game atau Nomor Pelanggan) telah diinput dengan benar sebelum melanjutkan ke tahap pembayaran.</li>
          <li>Pesanan akan diproses secara otomatis oleh sistem setelah verifikasi pembayaran berhasil diterima.</li>
        </ul>

        <h3 class="sub-title">3.2. Kanal Pembayaran Resmi</h3>
        <p class="section-text">FeePay menyediakan berbagai metode pembayaran yang sah meliputi transfer bank, dompet digital (e-wallet), serta sistem QRIS. Pengguna diimbau untuk hanya melakukan pembayaran melalui instruksi resmi yang tertera pada Platform.</p>

        <h3 class="sub-title">3.3. Kebijakan Harga</h3>
        <ul class="bullet-list">
          <li>Seluruh denominasi harga menggunakan mata uang Rupiah (IDR).</li>
          <li>Harga produk bersifat dinamis dan dapat berubah sesuai dengan kebijakan operasional serta fluktuasi biaya dari penyedia layanan asal (provider).</li>
        </ul>

        <h3 class="sub-title">3.4. Estimasi Waktu Layanan</h3>
        <ul class="bullet-list">
          <li>Proses automasi umumnya memerlukan waktu 1-5 menit di bawah kondisi sistem normal.</li>
          <li>Keterlambatan dapat terjadi apabila terdapat kendala teknis dari pihak ketiga atau periode pemeliharaan sistem.</li>
        </ul>
      </section>

      <section class="content-section">
        <h2 class="section-title">4. Kebijakan Pengembalian Dana (Refund)</h2>
        
        <h3 class="sub-title">4.1. Transaksi Final</h3>
        <p class="section-text">Seluruh transaksi Produk Digital pada Platform bersifat final. Pengembalian dana atau pembatalan transaksi tidak dapat dilakukan apabila produk telah berhasil dikirimkan ke data tujuan yang diberikan Pengguna.</p>

        <h3 class="sub-title">4.2. Ketentuan Khusus Refund</h3>
        <p class="section-text">Permohonan pengembalian dana hanya akan dipertimbangkan apabila terjadi kegagalan sistematis pada Platform yang menyebabkan transaksi tidak terkirim dalam waktu 1x24 jam, atau jika terdapat kesalahan teknis ganda pada proses pendebitan biaya.</p>

        <h3 class="sub-title">4.3. Prosedur Klaim</h3>
        <p class="section-text">Pengguna wajib melampirkan bukti transaksi yang sah kepada tim layanan bantuan untuk keperluan investigasi sebelum refund disetujui dan diproses ke metode pembayaran asal.</p>
      </section>

      <section class="content-section">
        <h2 class="section-title">5. Batasan Tanggung Jawab</h2>
        <p class="section-text">FeePay berperan sebagai platform perantara. Kami tidak bertanggung jawab atas:</p>
        <ul class="bullet-list">
          <li>Kesalahan pengiriman akibat ketidaktelitian Pengguna dalam memasukkan data tujuan.</li>
          <li>Perubahan kebijakan atau penangguhan akun oleh pengembang game atau penyedia layanan asal pihak ketiga.</li>
          <li>Kerugian yang timbul akibat gangguan jaringan telekomunikasi atau force majeure lainnya.</li>
        </ul>
        <p class="section-text important-note">
          <strong>Peringatan Penting:</strong> Mohon verifikasi kembali seluruh rincian pesanan Anda. Kami tidak memiliki kewajiban untuk memberikan ganti rugi atas transaksi yang gagal akibat kesalahan input data oleh Pengguna.
        </p>
      </section>

      <section class="content-section">
        <h2 class="section-title">6. Standar Prilaku Pengguna</h2>
        <p class="section-text">Pengguna dilarang keras untuk melakukan aktivitas manipulasi sistem, penggunaan akses ilegal, penyalahgunaan instrumen pembayaran milik pihak lain, serta tindakan lain yang dapat merugikan ekosistem FeePay. Pelanggaran berat akan ditindak melalui penangguhan akses permanen tanpa kewajiban pengembalian sisa saldo atau dana.</p>
      </section>

      <section class="content-section">
        <h2 class="section-title">7. Perubahan Syarat dan Ketentuan</h2>
        <p class="section-text">
          FeePay berhak memperbarui dokumen Syarat dan Ketentuan ini guna menyesuaikan dengan dinamika operasional dan peraturan hukum. Pengguna disarankan untuk meninjau halaman ini secara berkala.
        </p>
      </section>

      <section class="content-section contact-section">
        <h2 class="section-title">8. Informasi Bantuan</h2>
        <p class="section-text">
          Untuk pertanyaan lebih lanjut mengenai ketentuan ini, silakan hubungi layanan pelanggan kami:
        </p>
        <div class="contact-box">
          <div class="contact-item">
            <strong>Layanan WhatsApp:</strong> +62 895-3287-00079
          </div>
          <div class="contact-item">
            <strong>Surat Elektronik:</strong> fetrusmeilanoilham@gmail.com
          </div>
          <div class="contact-item">
            <strong>Waktu Operasional:</strong> 24 Jam (Setiap Hari)
          </div>
        </div>
      </section>

      <div class="agreement-box">
        <p>Dengan melanjutkan penggunaan layanan, Anda menyetujui seluruh butir Syarat dan Ketentuan yang berlaku pada ekosistem FeePay.</p>
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
