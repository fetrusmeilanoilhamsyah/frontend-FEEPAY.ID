<template>
  <div class="game-selector">
    <h3 class="text-sm font-semibold mb-3 text-foreground">
      Pilih Game
    </h3>
    
    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      <button
        v-for="game in games"
        :key="game"
        @click="selectGame(game)"
        class="game-card group"
        :class="{ 'active': modelValue === game }"
      >
        <!-- Game Logo -->
        <div class="game-logo">
          <img 
            v-if="getGameLogo(game)"
            :src="getGameLogo(game)" 
            :alt="game"
            class="w-10 h-10 object-contain transition-transform duration-300 group-hover:scale-110"
            @error="(e) => e.target.style.display = 'none'"
          />
          <Gamepad2
            v-else
            :size="32"
            class="transition-transform duration-300 group-hover:scale-110 text-muted-foreground"
          />
        </div>
        
        <!-- Game Name -->
        <span class="game-name">
          {{ formatGameName(game) }}
        </span>

        <!-- Selected Indicator -->
        <div 
          v-if="modelValue === game"
          class="absolute top-2 right-2 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
        >
          <Check :size="14" class="text-primary-foreground" />
        </div>
      </button>
    </div>
  </div>
</template>

<script setup>
import { Gamepad2, Check } from 'lucide-vue-next'

const props = defineProps({
  modelValue: {
    type: String,
    default: null
  },
  games: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['update:modelValue'])

const gameLogos = {
  'MOBILE LEGENDS': '/logos/games/ml.png',
  'FREE FIRE': '/logos/games/ff.png',
  'PUBG MOBILE': '/logos/games/pubg.png',
  'GENSHIN IMPACT': '/logos/games/genshin.png',
  'CALL OF DUTY MOBILE': '/logos/games/cod.png',
  'VALORANT': '/logos/games/valorant.png',
  'LEAGUE OF LEGENDS': '/logos/games/leagueoflegends.png',
  'ROBLOX': '/logos/games/roblox.png'
}

const getGameLogo = (game) => {
  return gameLogos[game?.toUpperCase()] || null
}

const selectGame = (game) => {
  emit('update:modelValue', game)
}

const formatGameName = (name) => {
  if (!name) return 'Unknown Game'
  
   return name
    .replace(/MOBILE LEGENDS/i, 'Mobile Legends')
    .replace(/FREE FIRE/i, 'Free Fire')
    .replace(/PUBG MOBILE/i, 'PUBG Mobile')
    .replace(/GENSHIN IMPACT/i, 'Genshin Impact')
    .replace(/CALL OF DUTY MOBILE/i, 'Call of Duty Mobile')
    .replace(/VALORANT/i, 'Valorant')
    .replace(/LEAGUE OF LEGENDS/i, 'League of Legends')
    .replace(/ROBLOX/i, 'Roblox')
}
</script>

<style scoped>
.game-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem;
  min-height: 120px;
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.game-card:hover {
  border-color: var(--primary);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.15);
}

.game-card.active {
  border-color: var(--primary);
  background: var(--primary-light);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.game-logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: white !important; /* ✅ Background putih solid */
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  padding: 8px;
}

.dark .game-logo {
  background: rgba(255, 255, 255, 0.95) !important; /* Dark mode tetap putih */
}

.game-card:hover .game-logo {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.game-card.active .game-logo {
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}

.game-name {
  font-size: 0.75rem;
  font-weight: 700;
  text-align: center;
  line-height: 1.2;
  color: var(--foreground);
  transition: color 0.3s ease;
}

.game-card.active .game-name {
  color: var(--primary);
}
</style>