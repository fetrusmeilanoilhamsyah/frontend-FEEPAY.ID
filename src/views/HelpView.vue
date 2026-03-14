<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Bantuan</h1>
          <p class="header-sub">Pusat dukungan FeePay</p>
        </div>
      </div>
    </div>

    <div class="page-content">

      <!-- Search FAQ -->
      <div class="search-wrap">
        <Search :size="17" class="search-icon" />
        <input v-model="query" type="text" placeholder="Cari pertanyaan..." class="search-input" />
        <button v-if="query" @click="query = ''" class="search-clear"><X :size="15" /></button>
      </div>

      <!-- Contact Banner -->
      <div class="contact-card">
        <div class="contact-info">
          <MessageCircle :size="20" class="contact-icon" />
          <div>
            <p class="contact-title">Butuh bantuan lebih lanjut?</p>
            <p class="contact-sub">Tim kami siap membantu Anda</p>
          </div>
        </div>
        <a :href="`https://wa.me/${csPhone}`" target="_blank" class="btn-wa">
          <Phone :size="15" />
          WhatsApp CS
        </a>
      </div>

      <!-- FAQ Sections -->
      <div v-for="section in filteredSections" :key="section.title" class="faq-section">
        <div class="section-label">
          <component :is="section.icon" :size="15" class="section-label-icon" />
          {{ section.title }}
        </div>
        <div class="faq-card">
          <div
            v-for="(item, i) in section.items" :key="i"
            class="faq-item" :class="{ 'faq-item--last': i === section.items.length - 1 }"
            @click="toggle(section.title + i)"
          >
            <div class="faq-question-row">
              <span class="faq-question">{{ item.q }}</span>
              <ChevronDown :size="17" class="faq-chevron" :class="{ rotated: open === section.title + i }" />
            </div>
            <transition name="expand">
              <p v-if="open === section.title + i" class="faq-answer">{{ item.a }}</p>
            </transition>
          </div>
        </div>
      </div>

      <!-- Empty Search -->
      <div v-if="filteredSections.length === 0" class="empty-state">
        <HelpCircle :size="52" class="empty-icon" />
        <p class="empty-title">Tidak ada hasil</p>
        <p class="empty-sub">Coba kata kunci lain atau hubungi CS kami</p>
      </div>

      <!-- Version Info -->
      <div class="version-card">
        <span class="version-text">FeePay App v1.0.0</span>
        <span class="version-sep">·</span>
        <span class="version-text">Syarat &amp; Ketentuan</span>
        <span class="version-sep">·</span>
        <span class="version-text">Kebijakan Privasi</span>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, Search, X, MessageCircle, Phone, ChevronDown, HelpCircle, ShoppingCart, CreditCard, User, ShieldCheck } from 'lucide-vue-next'

const query = ref('')
const open  = ref('')
const csPhone = import.meta.env.VITE_CS_WHATSAPP || '6281234567890'

const toggle = (key) => {
  open.value = open.value === key ? '' : key
}

const sections = [
  {
    title: 'Transaksi',
    icon: ShoppingCart,
    items: [
      { q: 'Bagaimana cara melakukan pembelian?', a: 'Pilih kategori produk di halaman utama, masukkan nomor tujuan, lalu lanjutkan ke pembayaran. Sistem kami memproses transaksi secara otomatis.' },
      { q: 'Berapa lama transaksi diproses?', a: 'Sebagian besar transaksi diproses dalam 1-5 menit. Untuk token listrik, maksimal 30 menit.' },
      { q: 'Mengapa transaksi saya gagal?', a: 'Transaksi bisa gagal karena nomor tidak valid, saldo tidak cukup, atau gangguan dari provider. Hubungi CS jika masalah berlanjut.' },
      { q: 'Bagaimana cara mendapatkan refund?', a: 'Jika transaksi gagal dan saldo terpotong, refund akan diproses otomatis dalam 1x24 jam. Hubungi CS dengan nomor transaksi Anda.' },
    ]
  },
  {
    title: 'Pembayaran',
    icon: CreditCard,
    items: [
      { q: 'Metode pembayaran apa yang tersedia?', a: 'Kami menerima Virtual Account (BNI, BCA, BRI, Mandiri), dompet digital (GoPay, DANA, ShopeePay, QRIS), dan paylater (Akulaku, Kredivo).' },
      { q: 'Berapa lama batas waktu pembayaran?', a: 'Pembayaran Virtual Account memiliki batas waktu 24 jam. Dompet digital dan QRIS harus dibayar segera setelah dibuat.' },
      { q: 'Apakah ada biaya tambahan?', a: 'Tidak ada biaya tambahan dari FeePay. Biaya yang tertera adalah harga final sudah termasuk semua biaya.' },
    ]
  },
  {
    title: 'Akun',
    icon: User,
    items: [
      { q: 'Bagaimana cara mengubah data profil?', a: 'Buka halaman Profil, pilih Informasi Akun, lalu edit data yang ingin diubah dan klik Simpan.' },
      { q: 'Saya lupa password, bagaimana cara resetnya?', a: 'Buka halaman Login, klik Lupa Password, lalu ikuti instruksi yang dikirim ke email Anda.' },
      { q: 'Bagaimana cara login dengan WhatsApp?', a: 'Di halaman Login, pilih tab WhatsApp, masukkan nomor HP Anda, lalu masukkan kode OTP yang dikirim via WhatsApp.' },
    ]
  },
  {
    title: 'Keamanan',
    icon: ShieldCheck,
    items: [
      { q: 'Apakah data saya aman?', a: 'Ya. FeePay menggunakan enkripsi SSL dan tidak menyimpan data kartu kredit atau informasi pembayaran sensitif.' },
      { q: 'Apa yang harus dilakukan jika akun saya diretas?', a: 'Segera hubungi CS kami melalui WhatsApp. Kami akan membantu memulihkan akun dan mengamankan data Anda.' },
    ]
  },
]

const filteredSections = computed(() => {
  if (!query.value.trim()) return sections
  const q = query.value.toLowerCase()
  return sections.map(s => ({
    ...s,
    items: s.items.filter(i => i.q.toLowerCase().includes(q) || i.a.toLowerCase().includes(q))
  })).filter(s => s.items.length > 0)
})
</script>

<style scoped>
.page { min-height: 100vh; background: var(--background, #f8fafc); padding-bottom: 80px; }

.page-header { position: sticky; top: 0; z-index: 40; background: var(--card, #fff); border-bottom: 1px solid var(--border, #e5e7eb); }
.header-inner { max-width: 600px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: none; background: transparent; color: var(--muted-foreground, #6b7280); cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
.back-btn:hover { background: var(--muted, #f3f4f6); }
.header-title { font-size: 1.0625rem; font-weight: 700; color: var(--foreground, #111827); margin: 0; }
.header-sub   { font-size: 0.75rem; color: var(--muted-foreground, #6b7280); margin: 0; }

.page-content { max-width: 600px; margin: 0 auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 16px; }

.search-wrap { position: relative; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--muted-foreground, #6b7280); }
.search-input { width: 100%; height: 46px; background: var(--card, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 12px; padding: 0 40px 0 44px; font-size: 0.875rem; color: var(--foreground, #111827); outline: none; transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box; }
.search-input:focus { border-color: #16a34a; box-shadow: 0 0 0 3px rgba(22,163,74,0.08); }
.search-clear { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: var(--muted-foreground, #6b7280); display: flex; padding: 4px; }

.contact-card { background: linear-gradient(135deg, #f0fdf4, #dcfce7); border: 1.5px solid #86efac; border-radius: 16px; padding: 14px 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.contact-info { display: flex; align-items: center; gap: 10px; }
.contact-icon { color: #16a34a; flex-shrink: 0; }
.contact-title { font-size: 0.875rem; font-weight: 700; color: #15803d; margin: 0; }
.contact-sub { font-size: 0.6875rem; color: #16a34a; margin: 0; }
.btn-wa { display: flex; align-items: center; gap: 6px; padding: 9px 14px; background: #16a34a; color: #fff; border: none; border-radius: 10px; font-size: 0.75rem; font-weight: 700; cursor: pointer; text-decoration: none; white-space: nowrap; transition: background 0.2s; }
.btn-wa:hover { background: #15803d; }

.section-label { display: flex; align-items: center; gap: 6px; font-size: 0.75rem; font-weight: 700; color: var(--muted-foreground, #6b7280); text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 6px; }
.section-label-icon { flex-shrink: 0; }

.faq-card { background: var(--card, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 16px; overflow: hidden; }
.faq-item { padding: 14px 16px; border-bottom: 1px solid var(--border, #f3f4f6); cursor: pointer; transition: background 0.15s; }
.faq-item:hover { background: var(--muted, #f9fafb); }
.faq-item--last { border-bottom: none; }
.faq-question-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.faq-question { font-size: 0.875rem; font-weight: 600; color: var(--foreground, #111827); flex: 1; }
.faq-chevron { color: var(--muted-foreground, #9ca3af); flex-shrink: 0; transition: transform 0.25s; }
.faq-chevron.rotated { transform: rotate(180deg); }
.faq-answer { font-size: 0.8125rem; color: var(--muted-foreground, #6b7280); line-height: 1.6; margin: 10px 0 0; }

.empty-state { text-align: center; padding: 48px 20px; }
.empty-icon { color: var(--muted-foreground, #d1d5db); margin: 0 auto 16px; display: block; }
.empty-title { font-size: 1rem; font-weight: 700; color: var(--foreground, #111827); margin-bottom: 6px; }
.empty-sub { font-size: 0.875rem; color: var(--muted-foreground, #6b7280); }

.version-card { display: flex; align-items: center; justify-content: center; gap: 8px; flex-wrap: wrap; padding: 8px; }
.version-text { font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); cursor: pointer; }
.version-text:hover { color: #16a34a; }
.version-sep { font-size: 0.6875rem; color: var(--muted-foreground, #d1d5db); }

.expand-enter-active, .expand-leave-active { transition: opacity 0.2s, max-height 0.3s; max-height: 200px; overflow: hidden; }
.expand-enter-from, .expand-leave-to { opacity: 0; max-height: 0; }
</style>
