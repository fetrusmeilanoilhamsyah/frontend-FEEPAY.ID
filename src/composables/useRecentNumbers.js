import { ref } from 'vue'

const STORAGE_KEY = 'feepay_recent_numbers'
const MAX_RECENT = 3

export function useRecentNumbers() {
  const recentNumbers = ref([])

  // Load from localStorage
  const loadNumbers = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        recentNumbers.value = JSON.parse(stored)
      }
    } catch (e) {
      console.error('Failed to load recent numbers:', e)
    }
  }

  // Save to localStorage
  const saveNumbers = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recentNumbers.value))
    } catch (e) {
      console.error('Failed to save recent numbers:', e)
    }
  }

  // Add number (move to front if exists, limit to MAX_RECENT)
  const addNumber = (number) => {
    if (!number) return

    // Remove if already exists
    const filtered = recentNumbers.value.filter(n => n !== number)
    
    // Add to front
    recentNumbers.value = [number, ...filtered].slice(0, MAX_RECENT)
    
    // Save
    saveNumbers()
  }

  // Clear all
  const clearNumbers = () => {
    recentNumbers.value = []
    localStorage.removeItem(STORAGE_KEY)
  }

  // Load on init
  loadNumbers()

  return {
    recentNumbers,
    addNumber,
    clearNumbers
  }
}