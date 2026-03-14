/**
 * Formats a number as Indonesian Rupiah or with shorthands like "rb" and "jt"
 * @param {number|string} price 
 * @param {Object} options 
 * @returns {string}
 */
export const formatPrice = (price, options = {}) => {
  const n = parseFloat(price || 0)
  const { 
    useShorthand = false, 
    withPrefix = true,
    decimal = 0
  } = options

  const prefix = withPrefix ? 'Rp' : ''

  if (useShorthand) {
    if (n >= 1000000) {
      const jt = n / 1000000
      return prefix + (Number.isInteger(jt) ? jt : jt.toFixed(1).replace('.0', '')) + 'jt'
    }
    if (n >= 1000) {
      const rb = n / 1000
      return prefix + (Number.isInteger(rb) ? rb : rb.toFixed(1).replace('.0', '')) + 'rb'
    }
  }

  return prefix + new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: decimal,
    maximumFractionDigits: decimal
  }).format(n)
}

/**
 * Standard phone number formatter for display
 * @param {string} number 
 * @returns {string}
 */
export const formatPhoneNumber = (number) => {
  if (!number) return ''
  const d = String(number).replace(/\D/g, '').replace(/^0/, '')
  return '0' + d.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3')
}
