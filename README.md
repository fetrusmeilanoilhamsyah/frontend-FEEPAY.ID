# 🎨 FEEPAY.ID — Frontend

> Antarmuka pengguna untuk platform PPOB & produk digital FEEPAY.ID. Dibangun dengan **Vue 3**, **Vite**, dan **Tailwind CSS**. Di-deploy di **Vercel** dan terhubung ke Laravel backend via REST API.

![Vue](https://img.shields.io/badge/Vue-3.x-4FC08D?style=for-the-badge&logo=vuedotjs&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-Build_Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## 📑 Daftar Isi

- [Gambaran Umum](#-gambaran-umum)
- [Tech Stack](#️-tech-stack)
- [Fitur Lengkap](#-fitur-lengkap)
- [Struktur Halaman](#-struktur-halaman)
- [Arsitektur Frontend](#-arsitektur-frontend)
- [Panduan Instalasi](#-panduan-instalasi)
- [Deployment ke Vercel](#-deployment-ke-vercel)
- [Environment & Konfigurasi](#-environment--konfigurasi)
- [Koneksi ke Backend](#-koneksi-ke-backend)

---

## 🎯 Gambaran Umum

Repository ini adalah bagian **frontend** dari sistem FEEPAY.ID. Frontend dan backend dipisah (decoupled architecture) — frontend di-deploy di **Vercel**, backend di **VPS** dengan Laravel.

| Repo | Tech | Deploy |
|---|---|---|
| **Frontend** (repo ini) | Vue 3 + Vite + Tailwind | Vercel |
| **Backend** | Laravel 11 + MySQL | VPS (Nginx) |

---

## 🛠️ Tech Stack

| Teknologi | Fungsi |
|---|---|
| **Vue 3** (Composition API) | Framework utama UI |
| **Vite** | Build tool & dev server (super cepat) |
| **Tailwind CSS** | Utility-first styling |
| **Vue Router** | Client-side routing |
| **Axios** | HTTP client untuk komunikasi API |
| **Lucide Icons** | Icon library ringan & konsisten |

---

## 🔥 Fitur Lengkap

### 1. 🌙 Theme Engine (Dark / Light Mode)
- Toggle manual Light ↔ Dark Mode
- **Auto-detect** preferensi sistem (prefers-color-scheme)
- Preferensi disimpan di localStorage — tetap konsisten setelah refresh
- Transisi halus antar mode (500ms smooth transition)

### 2. 🛒 Guest Checkout Flow
Member tidak perlu login untuk mulai belanja:
- Browse produk per kategori
- Pilih produk & isi nomor tujuan (HP / ID game)
- Lanjut ke pembayaran via Midtrans
- Upload bukti pembayaran (drag & drop support)
- Pantau status order secara real-time

### 3. 📋 Order Tracking
- Halaman **Riwayat Transaksi** dengan filter status
- Filter: Semua / Menunggu / Diproses / Berhasil / Gagal
- Pencarian berdasarkan Order ID, nama produk, atau nomor tujuan

### 4. 🖥️ Admin Dashboard
Panel admin yang diakses melalui path tersembunyi (dikontrol di backend):

**Statistik Real-time:**
- Total Pesanan
- Pesanan Pending
- Total Revenue

**Manajemen Produk:**
- Lihat semua produk beserta Harga Modal, Harga Jual, dan Margin
- Edit harga per produk secara individual
- Set margin global ke semua produk sekaligus
- Trigger Sync Products dari Digiflazz

**Manajemen Pesanan:**
- Lihat semua transaksi masuk
- Approve transaksi manual
- Verifikasi bukti pembayaran yang diupload member

### 5. 🔐 PIN Verification UI
Setiap aksi sensitif di dashboard admin (cek saldo, approve transaksi) memerlukan konfirmasi PIN sebelum dieksekusi. UI menampilkan dialog PIN yang clean dan responsif.

### 6. 📱 Responsive & Mobile-First
- Desain mobile-first menggunakan Tailwind CSS
- Kompatibel di semua ukuran layar
- Navigasi adaptif untuk mobile dan desktop

### 7. ♿ Accessibility
- ARIA labels pada semua elemen interaktif
- Keyboard navigation support
- Contrast ratio memenuhi standar WCAG

### 8. 🔄 API Layer (Axios)
- **Interceptors** untuk inject auth token otomatis di setiap request
- **Idempotency keys** untuk mencegah transaksi duplikat
- Structured error handling — error dari backend ditangani secara konsisten
- Auto-redirect ke login jika token expired (401 handling)

---

## 📁 Struktur Halaman

```
FEEPAY.ID Frontend
├── 🏠 Beranda          → Katalog produk, banner, cara transaksi
├── 📋 Riwayat          → Histori transaksi + filter status
├── 👤 Profil           → Data akun member
└── 🖥️ Dashboard        → Panel admin (path tersembunyi)
```

---

## 📂 Arsitektur Frontend

```
src/
├── components/          # Komponen UI yang dapat digunakan ulang
│   ├── Navbar.vue       # Navigasi utama + dark mode toggle
│   ├── ProductCard.vue  # Card produk di halaman beranda
│   ├── PinDialog.vue    # Dialog verifikasi PIN admin
│   └── ...
├── composables/         # Vue composables (reusable logic)
│   ├── useAuth.js       # Logic autentikasi & token management
│   ├── useTheme.js      # Logic dark/light mode
│   └── useTransaction.js
├── router/
│   └── index.js         # Konfigurasi Vue Router + route guards
├── services/
│   └── api.js           # Axios instance + interceptors
├── views/               # Halaman utama
│   ├── HomeView.vue     # Beranda & katalog produk
│   ├── HistoryView.vue  # Riwayat transaksi
│   ├── ProfileView.vue  # Profil member
│   └── DashboardView.vue # Admin dashboard
├── App.vue              # Root component
├── main.js              # Entry point aplikasi
└── style.css            # Global styles
```

---

## 🚀 Panduan Instalasi

### Prasyarat

| Kebutuhan | Versi |
|---|---|
| Node.js | 18+ |
| npm | 9+ |
| Backend FEEPAY.ID | Running di port 8000 |

### Langkah 1 — Clone & Install

```bash
git clone https://github.com/fetrusmeilanoilhamsyah/frontend-FEEPAY.ID.git
cd frontend-FEEPAY.ID
npm install
```

### Langkah 2 — Jalankan Development Server

```bash
npm run dev
```

Akses di: `http://localhost:5173`

> Pastikan backend Laravel sudah berjalan di `http://localhost:8000` sebelum menjalankan frontend.

### Langkah 3 — Build untuk Production

```bash
npm run build
```

Output di folder `dist/` — siap di-deploy ke Vercel atau hosting statis lainnya.

### Preview Production Build

```bash
npm run preview
```

---

## 🌐 Deployment ke Vercel

Frontend ini di-deploy menggunakan **Vercel** untuk performa CDN global dan auto-deploy dari GitHub.

### Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Deploy ke production
vercel --prod
```

### Deploy via GitHub (Recommended)

1. Push repo ke GitHub
2. Buka [vercel.com](https://vercel.com) → **New Project**
3. Import repo `frontend-FEEPAY.ID`
4. Set **Framework Preset**: Vite
5. Set **Environment Variables** (lihat bagian berikutnya)
6. Klik **Deploy**

Setiap push ke branch `main` akan otomatis trigger deploy ulang di Vercel.

### Konfigurasi `vercel.json` (untuk SPA routing)

Buat file `vercel.json` di root project agar Vue Router bekerja dengan benar:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Tanpa ini, refresh halaman selain `/` akan menghasilkan 404.

---

## ⚙️ Environment & Konfigurasi

### Konfigurasi API Base URL

Di file `vite.config.js`, proxy sudah dikonfigurasi untuk development:

```javascript
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true
      }
    }
  }
})
```

Untuk **production di Vercel**, set environment variable:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

Tambahkan di **Vercel Dashboard → Project Settings → Environment Variables**.

---

## 🔗 Koneksi ke Backend

Frontend berkomunikasi ke backend Laravel via REST API menggunakan Axios.

**Base URL:**
- Development: `http://localhost:8000/api`
- Production: `https://api.yourdomain.com/api`

**Autentikasi:**
Axios interceptor otomatis menyisipkan Bearer token di setiap request yang memerlukan autentikasi:

```javascript
// Contoh interceptor di services/api.js
axios.interceptors.request.use(config => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

**Error Handling:**
```javascript
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token expired → redirect ke login
      router.push('/login')
    }
    return Promise.reject(error)
  }
)
```

---

## 🔗 Repo Terkait

| Repo | Deskripsi |
|---|---|
| [backend-FEEPAY.ID](https://github.com/fetrusmeilanoilhamsyah/backend-FEEPAY.ID) | Laravel 11 API — payment gateway, PPOB, queue system |

---

<div align="center">

**FEEPAY.ID** — Solusi Digital Marketplace & PPOB Terpercaya

*Dibuat dengan ❤️ oleh Fetrus Meilano Ilhamsyah (Fee)*

</div>