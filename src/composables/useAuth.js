import { ref, computed } from 'vue'
import api from '../services/api'

const TOKEN_KEY = 'feepay_token'
const TOKEN_EXPIRY_KEY = 'feepay_token_expiry'
const REFRESH_INTERVAL = 10 * 60 * 1000 // Check every 10 minutes
const REFRESH_THRESHOLD = 30 * 60 * 1000 // Refresh if < 30 minutes left

const user = ref(null)
const isAuthenticated = ref(false)
let refreshTimer = null

export function useAuth() {
  const setToken = (token, expiresIn = 1440) => {
    // expiresIn in minutes (default 24 hours)
    const expiryTime = Date.now() + (expiresIn * 60 * 1000)
    
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
    isAuthenticated.value = true
    
    // Start auto-refresh timer
    startRefreshTimer()
  }

  const clearToken = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    sessionStorage.removeItem('feepay_admin_pin')
    user.value = null
    isAuthenticated.value = false
    
    // Stop auto-refresh timer
    stopRefreshTimer()
  }

  const getTokenExpiryTime = () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    return expiry ? parseInt(expiry) : null
  }

  const isTokenExpiringSoon = () => {
    const expiryTime = getTokenExpiryTime()
    if (!expiryTime) return true
    
    const timeLeft = expiryTime - Date.now()
    return timeLeft < REFRESH_THRESHOLD
  }

  const isTokenExpired = () => {
    const expiryTime = getTokenExpiryTime()
    if (!expiryTime) return true
    
    return Date.now() > expiryTime
  }

  const refreshToken = async () => {
    try {
      const token = localStorage.getItem(TOKEN_KEY)
      if (!token) return false

      console.log('🔄 Refreshing token...')
      
      // Call refresh endpoint (generate new token)
      const response = await api.auth.refresh()
      
      setToken(response.token, response.expires_in || 1440)
      
      console.log('✅ Token refreshed successfully')
      return true
      
    } catch (error) {
      console.error('❌ Token refresh failed:', error)
      
      // If refresh fails, clear everything and force re-login
      clearToken()
      return false
    }
  }

  const startRefreshTimer = () => {
    // Clear existing timer
    stopRefreshTimer()
    
    // Check token expiry every 10 minutes
    refreshTimer = setInterval(async () => {
      if (!isAuthenticated.value) {
        stopRefreshTimer()
        return
      }

      // If token expired, logout
      if (isTokenExpired()) {
        console.log('⏰ Token expired, logging out...')
        await logout()
        return
      }

      // If token expiring soon, refresh it
      if (isTokenExpiringSoon()) {
        console.log('⚠️ Token expiring soon, refreshing...')
        await refreshToken()
      }
    }, REFRESH_INTERVAL)
  }

  const stopRefreshTimer = () => {
    if (refreshTimer) {
      clearInterval(refreshTimer)
      refreshTimer = null
    }
  }

  const login = async (credentials) => {
    try {
      const response = await api.auth.login(credentials)
      
      // Set token with expiry (default 24 hours)
      setToken(response.token, response.expires_in || 1440)
      
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

    // Check if token expired
    if (isTokenExpired()) {
      console.log('⏰ Token expired')
      clearToken()
      return false
    }

    try {
      // Verify token with backend
      const userData = await api.auth.me()
      user.value = userData
      isAuthenticated.value = true
      
      // Start auto-refresh timer
      startRefreshTimer()
      
      // If token expiring soon, refresh immediately
      if (isTokenExpiringSoon()) {
        await refreshToken()
      }
      
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

  const getTimeUntilExpiry = () => {
    const expiryTime = getTokenExpiryTime()
    if (!expiryTime) return 0
    
    return Math.max(0, expiryTime - Date.now())
  }

  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    login,
    logout,
    checkAuth,
    refreshToken,
    setAdminPin,
    clearAdminPin,
    isTokenExpired,
    isTokenExpiringSoon,
    getTimeUntilExpiry,
  }
}