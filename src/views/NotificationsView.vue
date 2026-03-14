<template>
  <div class="page">

    <!-- Header -->
    <div class="page-header">
      <div class="header-inner">
        <button @click="$router.back()" class="back-btn">
          <ArrowLeft :size="20" />
        </button>
        <div>
          <h1 class="header-title">Notifikasi</h1>
          <p class="header-sub">Riwayat pemberitahuan akun Anda</p>
        </div>
        <button v-if="notifications.length" @click="markAllRead" class="mark-all-btn">
          Tandai Dibaca
        </button>
      </div>
    </div>

    <div class="page-content">

      <!-- Filter -->
      <div class="filter-wrap">
        <button
          v-for="f in filterTabs" :key="f.value"
          class="filter-tab" :class="{ active: activeFilter === f.value }"
          @click="activeFilter = f.value"
        >
          {{ f.label }}
          <span v-if="f.count > 0" class="filter-badge" :class="{ active: activeFilter === f.value }">{{ f.count }}</span>
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="filtered.length === 0" class="empty-state">
        <Bell :size="52" class="empty-icon" />
        <p class="empty-title">Tidak ada notifikasi</p>
        <p class="empty-sub">Pemberitahuan terbaru Anda akan muncul di sini</p>
      </div>

      <!-- Notification List -->
      <div v-else class="notif-list">
        <div
          v-for="n in filtered" :key="n.id"
          class="notif-card" :class="{ unread: !n.read }"
          @click="markRead(n)"
        >
          <div class="notif-icon-wrap" :style="{ background: n.bg }">
            <component :is="n.icon" :size="18" :style="{ color: n.color }" />
          </div>
          <div class="notif-body">
            <div class="notif-top">
              <span class="notif-title">{{ n.title }}</span>
              <span class="notif-time">{{ n.time }}</span>
            </div>
            <p class="notif-desc">{{ n.desc }}</p>
          </div>
          <div v-if="!n.read" class="unread-dot" />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { ArrowLeft, Bell, CheckCircle, Shield, CreditCard, Tag, Info } from 'lucide-vue-next'

const activeFilter = ref('all')

const notifications = ref([
  {
    id: 1, read: false, type: 'success',
    icon: CheckCircle, bg: '#D1FAE5', color: '#16a34a',
    title: 'Transaksi Berhasil',
    desc: 'Pembelian Pulsa 50.000 untuk 085172384438 telah berhasil diproses.',
    time: 'Baru saja'
  },
  {
    id: 2, read: false, type: 'security',
    icon: Shield, bg: '#FEF3C7', color: '#d97706',
    title: 'Login Baru Terdeteksi',
    desc: 'Akun Anda berhasil masuk dari perangkat baru pada sesi ini.',
    time: '5 menit lalu'
  },
  {
    id: 3, read: true, type: 'promo',
    icon: Tag, bg: '#EDE9FE', color: '#7c3aed',
    title: 'Promo Spesial',
    desc: 'Dapatkan cashback 5% untuk setiap transaksi token listrik hari ini.',
    time: '1 jam lalu'
  },
  {
    id: 4, read: true, type: 'info',
    icon: Info, bg: '#DBEAFE', color: '#2563eb',
    title: 'Pembaruan Sistem',
    desc: 'Sistem kami telah diperbarui untuk pengalaman yang lebih baik.',
    time: '1 hari lalu'
  },
])

const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

const filterTabs = computed(() => [
  { value: 'all',    label: 'Semua',    count: notifications.value.length },
  { value: 'unread', label: 'Belum Dibaca', count: unreadCount.value },
])

const filtered = computed(() => {
  if (activeFilter.value === 'unread') return notifications.value.filter(n => !n.read)
  return notifications.value
})

const markRead = (n) => {
  n.read = true
}

const markAllRead = () => {
  notifications.value.forEach(n => n.read = true)
}
</script>

<style scoped>
.page { min-height: 100vh; background: var(--background, #f8fafc); padding-bottom: 80px; }

.page-header { position: sticky; top: 0; z-index: 40; background: var(--card, #fff); border-bottom: 1px solid var(--border, #e5e7eb); }
.header-inner { max-width: 600px; margin: 0 auto; padding: 12px 16px; display: flex; align-items: center; gap: 12px; }
.back-btn { width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; border-radius: 10px; border: none; background: transparent; color: var(--muted-foreground, #6b7280); cursor: pointer; transition: background 0.15s; flex-shrink: 0; }
.back-btn:hover { background: var(--muted, #f3f4f6); }
.header-title { font-size: 1.0625rem; font-weight: 700; color: var(--foreground, #111827); margin: 0; flex: 1; }
.header-sub   { font-size: 0.75rem; color: var(--muted-foreground, #6b7280); margin: 0; }
.mark-all-btn { background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #16a34a; cursor: pointer; white-space: nowrap; padding: 0; }

.page-content { max-width: 600px; margin: 0 auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 14px; }

.filter-wrap { display: flex; gap: 8px; overflow-x: auto; scrollbar-width: none; }
.filter-wrap::-webkit-scrollbar { display: none; }
.filter-tab { padding: 7px 14px; border-radius: 999px; font-size: 0.8125rem; font-weight: 600; color: var(--muted-foreground, #6b7280); background: var(--card, #fff); border: 1px solid var(--border, #e5e7eb); cursor: pointer; white-space: nowrap; transition: all 0.2s; display: flex; align-items: center; gap: 6px; }
.filter-tab.active { background: #16a34a; color: #fff; border-color: #16a34a; }
.filter-badge { font-size: 0.6875rem; padding: 1px 6px; border-radius: 999px; background: rgba(255,255,255,0.25); }
.filter-badge:not(.active) { background: var(--muted, #f3f4f6); color: var(--muted-foreground, #6b7280); }

.empty-state { text-align: center; padding: 52px 20px; }
.empty-icon { color: var(--muted-foreground, #d1d5db); margin: 0 auto 16px; display: block; }
.empty-title { font-size: 1rem; font-weight: 700; color: var(--foreground, #111827); margin-bottom: 6px; }
.empty-sub { font-size: 0.875rem; color: var(--muted-foreground, #6b7280); }

.notif-list { display: flex; flex-direction: column; gap: 8px; }
.notif-card { background: var(--card, #fff); border: 1px solid var(--border, #e5e7eb); border-radius: 16px; padding: 14px; display: flex; align-items: flex-start; gap: 12px; cursor: pointer; transition: border-color 0.2s, box-shadow 0.2s; position: relative; }
.notif-card.unread { border-color: #bbf7d0; background: linear-gradient(135deg, #f0fdf4 0%, #fff 60%); }
.notif-card:hover { box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
.notif-icon-wrap { width: 42px; height: 42px; border-radius: 13px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.notif-body { flex: 1; min-width: 0; }
.notif-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 4px; }
.notif-title { font-size: 0.875rem; font-weight: 700; color: var(--foreground, #111827); }
.notif-time  { font-size: 0.6875rem; color: var(--muted-foreground, #9ca3af); white-space: nowrap; flex-shrink: 0; }
.notif-desc  { font-size: 0.8125rem; color: var(--muted-foreground, #6b7280); line-height: 1.5; margin: 0; }
.unread-dot  { width: 8px; height: 8px; border-radius: 50%; background: #16a34a; flex-shrink: 0; margin-top: 4px; }
</style>
