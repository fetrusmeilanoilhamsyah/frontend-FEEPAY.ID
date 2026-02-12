import { ref, computed } from 'vue'
import api from '../services/api'

const TOKEN_KEY = 'feepay_token'
const user = ref(null)
const isAuthenticated = ref(false)

export function useAuth() {
  const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token)
    isAuthenticated.value = true
  }

  const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem('feepay_admin_pin')
    user.value = null
    isAuthenticated.value = false
  }

  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials)
      setToken(response.token)
      user.value = response.user
      return { success: true, user: response.user }
    } catch (error) {
      clearToken()
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearToken()
    }
  }

  const checkAuth = async () => {
    const token = localStorage.getItem(TOKEN_KEY)
    
    if (!token) {
      isAuthenticated.value = false
      return false
    }

    try {
      const userData = await api.auth.me()
      user.value = userData
      isAuthenticated.value = true
      return true
    } catch (error) {
      clearToken()
      return false
    }
  }

  const setAdminPin = (pin) => {
    sessionStorage.setItem('feepay_admin_pin', pin)
  }

  const clearAdminPin = () => {
    sessionStorage.removeItem('feepay_admin_pin')
  }

  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    logout,
    checkAuth,
    setAdminPin,
    clearAdminPin,
  }
}