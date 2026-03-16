<template>
  <div class="ticker-wrapper overflow-hidden bg-white/40 dark:bg-dark-900/40 backdrop-blur-md border-y border-border py-2 relative z-20">
    <div class="flex animate-ticker whitespace-nowrap">
      <div v-for="(tx, i) in doubleTransactions" :key="i" class="inline-flex items-center gap-6 px-4">
        <div class="flex items-center gap-2">
          <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{{ tx.time }}</span>
        </div>
        <p class="text-xs font-black tracking-tight text-foreground">
          {{ tx.user }} <span class="text-muted-foreground font-medium mx-1">membeli</span> 
          <span class="text-primary">{{ tx.product }}</span>
        </p>
        <div class="h-3 w-px bg-border mx-2"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const transactions = [
  { user: '0812***82', product: 'MLBB 706 Diamonds', time: '1m ago' },
  { user: '0857***11', product: 'Free Fire 355 Diamonds', time: '3m ago' },
  { user: '0821***90', product: 'PUBG 600 UC', time: '5m ago' },
  { user: '0899***23', product: 'Genshin 6480 Crystals', time: '7m ago' },
  { user: '0813***44', product: 'Valorant 2400 Points', time: '10m ago' },
  { user: '0852***67', product: 'PLN 500.000', time: '12m ago' },
]

const doubleTransactions = computed(() => [...transactions, ...transactions])
</script>

<style scoped>
.ticker-wrapper {
  mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
}

.animate-ticker {
  display: inline-flex;
  animation: ticker 30s linear infinite;
}

@keyframes ticker {
  0% { transform: translateX(0); }
  100% { transform: translateX(-50%); }
}

.animate-ticker:hover {
  animation-play-state: paused;
}
</style>
