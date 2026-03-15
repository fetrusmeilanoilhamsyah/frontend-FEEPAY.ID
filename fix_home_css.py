import os

path = r'd:\PROJEK PROJEK KODING\FEEPAY_PROJECT\frontend\src\views\Home.vue'
with open(path, 'r', encoding='utf-8') as f:
    text = f.read()

marker = '.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }'

new_css = """
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(10px); }

/* DIRECTIONAL REVEALS */
.reveal--left { transform: translateX(-30px); opacity: 0; }
.reveal--right { transform: translateX(30px); opacity: 0; }
.reveal--up { transform: translateY(40px); opacity: 0; }

.reveal.active.reveal--left,
.reveal.active.reveal--right,
.reveal.active.reveal--up {
  transform: translate(0, 0);
  opacity: 1;
}

/* PARALLAX & INERTIA HELPERS */
.parallax-layer, .section-bg-art, .anti-flow-track {
  will-change: transform;
}

.service-card-premium {
  will-change: transform, opacity;
  perspective: 1000px;
}

/* NEXT-GEN ANTIGRAVITY INTERACTION */
.antigravity-tilt {
  transition: transform 0.2s cubic-bezier(0.12, 0, 0.39, 0);
}

.antigravity-tilt.is-hovering {
  z-index: 50;
  transition: none;
}

/* Pulse Aura for Labels */
.aura-pulse {
  position: relative;
}

.aura-pulse::before {
  content: '';
  position: absolute;
  inset: -4px;
  background: inherit;
  filter: blur(8px);
  opacity: 0.6;
  border-radius: inherit;
  z-index: -1;
  animation: aura-breath 3s ease-in-out infinite;
}

@keyframes aura-breath {
  0%, 100% { opacity: 0.4; transform: scale(1); }
  50% { opacity: 0.8; transform: scale(1.15); }
}

.service-badge-premium.aura-pulse {
  background: var(--primary, #16a34a);
  color: #fff;
  font-size: 0.5rem;
  padding: 2px 6px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(22, 163, 74, 0.3);
}

/* Dynamic Backdrop Material */
.section--premium, .section--brand, .section--nexus {
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 24px;
  padding: 16px;
}

.dark .section--premium, .dark .section--brand, .dark .section--nexus {
  background: rgba(22, 28, 45, 0.7);
  border-color: rgba(255, 255, 255, 0.05);
}
</style>
"""

if marker in text:
    parts = text.split(marker)
    # text before marker + new_css
    with open(path, 'w', encoding='utf-8') as f:
        f.write(parts[0] + new_css)
    print("CSS updated successfully")
else:
    print("Marker not found")
