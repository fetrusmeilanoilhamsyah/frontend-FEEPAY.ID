import { ref, computed } from 'vue'
import api from '../services/api'

const TOKEN_KEY = 'feepay_user_token'
const USER_DATA_KEY = 'feepay_user_data'

const user = ref(JSON.parse(localStorage.getItem(USER_DATA_KEY)) || null)
const isAuthenticated = ref(!!localStorage.getItem(TOKEN_KEY))

export function useCustomerAuth() {
  const setAuth = (token, userData) => {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData))
    user.value = userData
    isAuthenticated.value = true
  }

  const clearAuth = () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_DATA_KEY)
    user.value = null
    isAuthenticated.value = false
  }

  const loginWithEmail = async (email, password) => {
    try {
      const response = await api.customerAuth.login({ login: email, password })
      setAuth(response.data.token, response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  const loginWithGoogle = async (idToken) => {
    try {
      const response = await api.customerAuth.google({ id_token: idToken })
      setAuth(response.data.token, response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  const requestOtp = async (phone) => {
    try {
      const response = await api.customerAuth.otpRequest({ phone })
      return response
    } catch (error) {
      throw error
    }
  }

  const verifyOtp = async (phone, otp) => {
    try {
      const response = await await api.customerAuth.otpVerify({ phone, otp })
      setAuth(response.data.token, response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  const register = async (userData) => {
    try {
      const response = await api.customerAuth.register(userData)
      setAuth(response.data.token, response.data.user)
      return { success: true, user: response.data.user }
    } catch (error) {
      clearAuth()
      throw error
    }
  }

  const logout = async () => {
    try {
      await api.customerAuth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      clearAuth()
    }
  }

  return {
    user: computed(() => user.value),
    isAuthenticated: computed(() => isAuthenticated.value),
    loginWithEmail,
    loginWithGoogle,
    requestOtp,
    verifyOtp,
    register,
    logout,
  }
}
