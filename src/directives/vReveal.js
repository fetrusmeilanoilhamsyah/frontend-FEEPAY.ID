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
            const delay = binding.value || 0;
            
            setTimeout(() => {
              // Activate the parent itself if it has the reveal class
              if (el.classList.contains('reveal')) {
                el.classList.add('active');
              }
              
              // Find and activate all children with .reveal class
              const children = el.querySelectorAll('.reveal');
              children.forEach((child) => {
                child.classList.add('active');
              });

              // If the element itself is NOT .reveal but has .reveal children
              // (which is common for containers), we just activated the children.
              // To handle cases where we want the container to "appear" too:
              el.classList.add('active');
            }, delay);
            
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Ensure the element or its intended reveal children start hidden
    if (el.classList.contains('reveal')) {
      // already has it
    } else if (el.querySelectorAll('.reveal').length === 0) {
      // If no reveal children and not reveal itself, assume the user wants the element revealable
      el.classList.add('reveal');
    }
    
    observer.observe(el);
  }
}
