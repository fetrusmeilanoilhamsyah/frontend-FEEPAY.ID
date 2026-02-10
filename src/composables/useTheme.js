import { ref, onMounted, watch } from 'vue'

const STORAGE_KEY = 'feepay_theme'
const currentTheme = ref('light')

export function useTheme() {
  const setTheme = (theme) => {
    currentTheme.value = theme
    localStorage.setItem(STORAGE_KEY, theme)
    
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const initTheme = () => {
    // Check localStorage first
    const stored = localStorage.getItem(STORAGE_KEY)
    
    if (stored) {
      setTheme(stored)
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      setTheme(prefersDark ? 'dark' : 'light')
    }
  }

  // Watch for system preference changes
  onMounted(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    mediaQuery.addEventListener('change', (e) => {
      // Only auto-switch if user hasn't manually set preference
      if (!localStorage.getItem(STORAGE_KEY)) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    })
  })

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme,
    isDark: () => currentTheme.value === 'dark'
  }
}