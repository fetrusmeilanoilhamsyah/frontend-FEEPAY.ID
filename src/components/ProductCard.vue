<template>
  <div
    class="card cursor-pointer transform transition-all duration-200 hover:-translate-y-1 hover:scale-102 hover:shadow-md"
    @click="handleSelect"
    @keypress.enter="handleSelect"
    @keypress.space.prevent="handleSelect"
    tabindex="0"
    role="button"
    :aria-label="`Order ${product.name}`"
  >
    <!-- Product Info -->
    <div class="mb-4">
      <h3 class="text-lg font-bold text-dark-950 dark:text-white mb-1">
        {{ product.name }}
      </h3>
      <p class="text-sm text-dark-600 dark:text-dark-400">
        {{ product.category }}
      </p>
    </div>

    <!-- Price -->
    <div class="mb-6">
      <div class="text-2xl font-black text-primary-600 dark:text-primary-400">
        Rp {{ formatPrice(product.selling_price) }}
      </div>
    </div>

    <!-- Action Button -->
    <button
      class="btn btn-primary w-full"
      @click.stop="handleSelect"
      :aria-label="`Order ${product.name} for ${formatPrice(product.selling_price)} rupiah`"
    >
      Order Now
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const router = useRouter()

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const handleSelect = () => {
  router.push(`/checkout/${props.product.sku}`)
}
</script>