<template>
  <div class="animate-pulse">
    <slot></slot>
  </div>
</template>

<style scoped>
@keyframes shimmer {
  0% {
    background-position: -1000px 0;
  }
  100% {
    background-position: 1000px 0;
  }
}

.animate-pulse {
  animation: shimmer 2s infinite linear;
  background: linear-gradient(
    90deg,
    #f0f0f0 0%,
    #f8f8f8 50%,
    #f0f0f0 100%
  );
  background-size: 1000px 100%;
}

:global(.dark) .animate-pulse {
  background: linear-gradient(
    90deg,
    #1a1a1a 0%,
    #2a2a2a 50%,
    #1a1a1a 100%
  );
  background-size: 1000px 100%;
}
</style>