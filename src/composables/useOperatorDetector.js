import { ref, watch } from 'vue'

export function useOperatorDetector() {
  const phoneNumber = ref('')
  const detectedOperator = ref(null)
  
  // Operator database dengan prefix
  const operators = {
    telkomsel: {
      name: 'Telkomsel',
      logo: '/logos/operators/telkomsel.png',
      color: '#E32119',
      prefixes: ['0811', '0812', '0813', '0821', '0822', '0823', '0851', '0852', '0853']
    },
    indosat: {
      name: 'Indosat Ooredoo',
      logo: '/logos/operators/indosat.png',
      color: '#FFD700',
      prefixes: ['0814', '0815', '0816', '0855', '0856', '0857', '0858']
    },
    xl: {
      name: 'XL Axiata',
      logo: '/logos/operators/xl.png',
      color: '#0071BC',
      prefixes: ['0817', '0818', '0819', '0859', '0877', '0878']
    },
    tri: {
      name: 'Tri (3)',
      logo: '/logos/operators/three.png',
      color: '#000000',
      prefixes: ['0895', '0896', '0897', '0898', '0899']
    },
    smartfren: {
      name: 'Smartfren',
      logo: '/logos/operators/smartfren.png',
      color: '#EC008C',
      prefixes: ['0881', '0882', '0883', '0884', '0885', '0886', '0887', '0888', '0889']
    },
    axis: {
      name: 'Axis',
      logo: '/logos/operators/axis.png',
      color: '#6B1E78',
      prefixes: ['0831', '0832', '0833', '0838']
    },
    byu: {
      name: 'by.U',
      logo: '/logos/operators/byu.png',
      color: '#00D856',
      prefixes: ['08515'] // Prefix utama by.U
    }
  }

  const detectOperator = (number) => {
    // Clean number
    const cleaned = number.replace(/\D/g, '')
    
    if (cleaned.length < 4) {
      detectedOperator.value = null
      return
    }

    // Check 5-digit prefix first (for by.U)
    const prefix5 = cleaned.substring(0, 5)
    for (const [key, op] of Object.entries(operators)) {
      if (op.prefixes.includes(prefix5)) {
        detectedOperator.value = { key, ...op }
        return
      }
    }

    // Check 4-digit prefix
    const prefix4 = cleaned.substring(0, 4)
    for (const [key, op] of Object.entries(operators)) {
      if (op.prefixes.includes(prefix4)) {
        detectedOperator.value = { key, ...op }
        return
      }
    }

    // Not detected
    detectedOperator.value = null
  }

  // Auto-detect when phone number changes
  watch(phoneNumber, (newValue) => {
    detectOperator(newValue)
  })

  const formatPhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, '')
    
    if (cleaned.length <= 4) return cleaned
    if (cleaned.length <= 8) return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4, 8)}-${cleaned.slice(8, 12)}`
  }

  return {
    phoneNumber,
    detectedOperator,
    detectOperator,
    formatPhoneNumber,
    operators
  }
}