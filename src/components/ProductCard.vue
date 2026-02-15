<template>
  <div
    class="product-card"
    @click="handleSelect"
    @keypress.enter="handleSelect"
    @keypress.space.prevent="handleSelect"
    tabindex="0"
    role="button"
    :aria-label="`Order ${product.name}`"
  >
    <!-- Category Badge -->
    <div class="category-badge">
      {{ product.category }}
    </div>

    <!-- Product Name -->
    <h3 class="product-name">
      {{ product.name }}
    </h3>

    <!-- Price -->
    <div class="product-price">
      Rp{{ formatPrice(product.selling_price) }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['select'])

const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID').format(price)
}

const handleSelect = () => {
  emit('select', props.product)
}
</script>

<style scoped>
.product-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 120px;
  padding: 12px;
  background: white;
  border: 1.5px solid rgb(229 231 235);
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.dark .product-card {
  background: rgb(15 20 25);
  border-color: rgb(42 49 66);
}

.product-card:hover {
  border-color: rgb(79 172 254);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(79, 172, 254, 0.15);
}

.dark .product-card:hover {
  border-color: rgb(59 143 212);
  box-shadow: 0 8px 20px rgba(59, 143, 212, 0.2);
}

.product-card:active {
  transform: translateY(0);
  box-shadow: 0 4px 12px rgba(79, 172, 254, 0.1);
}

/* Category Badge */
.category-badge {
  display: inline-block;
  padding: 3px 8px;
  background: rgb(243 244 246);
  border-radius: 6px;
  font-size: 0.625rem;
  font-weight: 600;
  text-transform: uppercase;
  color: rgb(107 114 128);
  letter-spacing: 0.025em;
  margin-bottom: 8px;
  width: fit-content;
}

.dark .category-badge {
  background: rgb(31 41 55);
  color: rgb(156 163 175);
}

/* Product Name */
.product-name {
  font-size: 0.875rem;
  font-weight: 700;
  line-height: 1.3;
  color: rgb(17 24 39);
  margin-bottom: auto;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.dark .product-name {
  color: rgb(243 244 246);
}

/* Price */
.product-price {
  font-size: 1.125rem;
  font-weight: 800;
  color: rgb(79 172 254);
  margin-top: 12px;
  letter-spacing: -0.025em;
}

.dark .product-price {
  color: rgb(59 143 212);
}

/* Responsive */
@media (min-width: 640px) {
  .product-card {
    min-height: 130px;
    padding: 16px;
  }

  .product-name {
    font-size: 0.9375rem;
  }

  .product-price {
    font-size: 1.25rem;
  }
}
</style>