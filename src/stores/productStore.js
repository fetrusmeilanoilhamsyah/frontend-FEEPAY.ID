import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import api from '../services/api'

export const useProductStore = defineStore('product', () => {
  const products = ref([])
  const categories = ref(['Semua', 'Pulsa', 'Data', 'E-Wallet', 'Game'])
  const loading = ref(false)
  const error = ref(null)
  const lastFetch = ref(null)

  const CACHE_DURATION = 5 * 60 * 1000
  const MIN_LOADING_MS = 800

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
          return pCat.includes('wallet') || pCat.includes('dana') || pCat.includes('ovo') ||
                 pCat.includes('gopay') || pCat.includes('shopeepay') || pCat.includes('linkaja') ||
                 pCat.includes('e-money') || pName.includes('dana') || pName.includes('ovo') ||
                 pName.includes('gopay') || pName.includes('shopeepay') || pName.includes('linkaja')
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
        p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      )
    }
  })

  async function fetchProducts(forceRefresh = false) {
    if (!forceRefresh && isCacheValid.value && products.value.length > 0) {
      return products.value
    }

    loading.value = true
    error.value = null
    const startTime = Date.now()

    try {
      const data = await api.products.getAll()
      products.value = data
      lastFetch.value = Date.now()
      return data
    } catch (err) {
      error.value = err.message || 'Failed to fetch products'
      throw err
    } finally {
      const elapsed = Date.now() - startTime
      const remaining = MIN_LOADING_MS - elapsed
      if (remaining > 0) {
        await new Promise(resolve => setTimeout(resolve, remaining))
      }
      loading.value = false
    }
  }

  function getProductBySku(sku) {
    return products.value.find(p => p.sku === sku)
  }

  function clearCache() {
    lastFetch.value = null
  }

  async function refreshProducts() {
    return await fetchProducts(true)
  }

  return {
    products, categories, loading, error, lastFetch,
    isCacheValid, productsByCategory, searchProducts,
    fetchProducts, getProductBySku, clearCache, refreshProducts
  }
})