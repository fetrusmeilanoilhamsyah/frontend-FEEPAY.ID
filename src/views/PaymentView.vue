<template>
  <div class="min-h-screen bg-background flex items-center justify-center">
    <div class="text-center">
      <Loader class="animate-spin mx-auto mb-4 text-primary" :size="48" />
      <p class="text-sm text-muted-foreground">Memproses pembayaran...</p>
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
  if (orderId) {
    router.replace(`/payment/${orderId}/pending`)
  } else {
    router.replace('/')
  }
})
</script>