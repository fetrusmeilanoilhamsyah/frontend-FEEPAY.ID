import { ref, onMounted } from 'vue'

export function useRecentGameIds() {
  const recentGameIds = ref({})
  const STORAGE_KEY = 'feepay_recent_game_ids'

  const loadRecentIds = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) recentGameIds.value = JSON.parse(saved)
    } catch (e) {
      console.error('Failed to load recent IDs', e)
    }
  }

  const saveRecentId = (brand, id) => {
    if (!brand || !id) return
    
    const brandKey = brand.toUpperCase()
    const current = recentGameIds.value[brandKey] || []
    
    // Remove if exists and add to top
    const filtered = current.filter(item => item !== id)
    filtered.unshift(id)
    
    // Limit to 5
    recentGameIds.value[brandKey] = filtered.slice(0, 5)
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentGameIds.value))
  }

  const getRecentIds = (brand) => {
    if (!brand) return []
    return recentGameIds.value[brand.toUpperCase()] || []
  }

  onMounted(loadRecentIds)

  return {
    recentGameIds,
    saveRecentId,
    getRecentIds
  }
}
