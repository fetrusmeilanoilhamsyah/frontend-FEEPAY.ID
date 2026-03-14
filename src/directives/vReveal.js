/**
 * v-reveal directive
 * Antigravity-style staggered reveal on scroll
 */
export default {
  mounted(el, binding) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Add slight delay if specified in value (v-reveal="100")
            const delay = binding.value || 0;
            setTimeout(() => {
              el.classList.add('active');
            }, delay);
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    el.classList.add('reveal');
    observer.observe(el);
  }
}
