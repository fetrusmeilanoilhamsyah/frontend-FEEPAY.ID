<template>
  <div class="payment-redirect">
    <div class="redirect-inner">
      <div class="redirect-icon">
        <Loader class="spin" :size="36" />
      </div>
      <p class="redirect-text">Memproses pembayaran...</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Loader } from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()

onMounted(() => {
  const orderId = route.params.orderId
  router.replace(orderId ? `/payment/${orderId}/pending` : '/')
})
</script>

<style scoped>
.payment-redirect { min-height:100vh; background:var(--background,#f8fafc); display:flex; align-items:center; justify-content:center; }
.redirect-inner { text-align:center; display:flex; flex-direction:column; align-items:center; gap:16px; }
.redirect-icon { width:72px; height:72px; background:rgba(22,163,74,0.1); border-radius:50%; display:flex; align-items:center; justify-content:center; color:#16a34a; }
.redirect-text { font-size:0.9375rem; font-weight:600; color:var(--muted-foreground,#6b7280); }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { to{ transform:rotate(360deg); } }
</style>
