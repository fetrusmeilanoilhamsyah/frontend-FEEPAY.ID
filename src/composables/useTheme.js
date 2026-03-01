import { ref, onMounted } from 'vue'

const STORAGE_KEY = 'feepay_theme'
const currentTheme = ref('light') // Default light mode

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
      // DEFAULT LIGHT MODE - gak peduli system preference
      setTheme('light')
    }
  }

  // HAPUS listener system preference - user baru selalu light mode
  onMounted(() => {
    initTheme()
  })

  return {
    currentTheme,
    setTheme,
    toggleTheme,
    initTheme,
    isDark: () => currentTheme.value === 'dark'
  }
}