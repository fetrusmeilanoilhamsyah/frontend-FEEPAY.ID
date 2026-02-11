// stores/productStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useProductStore = defineStore('product', () => {
  // ============================================
  // STATE
  // ============================================
  const products = ref([])
  const categories = ref(['Semua', 'Pulsa', 'Data', 'E-Wallet', 'Game'])
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)
  
  // Cache duration: 5 minutes
  const CACHE_DURATION = 5 * 60 * 1000

  // ============================================
  // GETTERS
  // ============================================
  const isCacheValid = computed(() => {
    if (!lastFetch.value) return false
    return Date.now() - lastFetch.value < CACHE_DURATION
  })

  const productsByCategory = computed(() => {
    return (category) => {
      if (category === 'Semua') return products.value
      
      const cat = category.toLowerCase()
      return products.value.filter(p => {
        const pCat = p.category.toLowerCase()
        const pName = p.name.toLowerCase()
        
        if (cat === 'e-wallet') {
          return pCat.includes('wallet') || 
                 pCat.includes('dana') || 
                 pCat.includes('ovo') || 
                 pCat.includes('gopay') || 
                 pCat.includes('shopeepay') ||
                 pCat.includes('linkaja') ||
                 pCat.includes('e-money') ||
                 pName.includes('dana') || 
                 pName.includes('ovo') || 
                 pName.includes('gopay') ||
                 pName.includes('shopeepay') ||
                 pName.includes('linkaja')
        }
        return pCat.includes(cat)
      }).sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
    }
  })

  const searchProducts = computed(() => {
    return (query) => {
      if (!query) return products.value
      
      const q = query.toLowerCase()
      return products.value.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.category.toLowerCase().includes(q)
      )
    }
  })

  // ============================================
  // ACTIONS
  // ============================================
  
  /**
   * Fetch products with 5-minute cache
   */
  async function fetchProducts(forceRefresh = false) {
    // Use cache if valid and not forcing refresh
    if (!forceRefresh && isCacheValid.value && products.value.length > 0) {
      console.log('📦 Using cached products')
      return products.value
    }

    loading.value = true
    error.value = null
    
    try {
      console.log('🌐 Fetching products from API...')
      const data = await api.products.getAll()
      products.value = data
      lastFetch.value = Date.now()
      
      console.log(`✅ Fetched ${data.length} products`)
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch products'
      console.error('❌ Fetch products error:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  /**
   * Get product by SKU
   */
  function getProductBySku(sku) {
    return products.value.find(p => p.sku === sku)
  }

  /**
   * Clear cache (force refresh next fetch)
   */
  function clearCache() {
    lastFetch.value = null
    console.log('🗑️ Product cache cleared')
  }

  /**
   * Refresh products (force fetch)
   */
  async function refreshProducts() {
    return await fetchProducts(true)
  }

  // ============================================
  // RETURN
  // ============================================
  return {
    // State
    products,
    categories,
    loading,
    error,
    lastFetch,
    
    // Getters
    isCacheValid,
    productsByCategory,
    searchProducts,
    
    // Actions
    fetchProducts,
    getProductBySku,
    clearCache,
    refreshProducts
  }
})