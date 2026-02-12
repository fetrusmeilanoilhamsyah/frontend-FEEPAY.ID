# FEEPAY.ID Frontend

Digital marketplace and USDT exchange platform built with Vue 3, Vite, and Tailwind CSS.

## Features

- Modern, minimal UI design
- Dark mode support with system preference detection
- Guest checkout flow with payment proof upload
- Admin dashboard with order management
- PIN verification for sensitive actions
- Responsive design (mobile-first)
- Accessibility compliant (ARIA labels, keyboard navigation)

## Tech Stack

- Vue 3 (Composition API)
- Vite (Build tool)
- Tailwind CSS (Styling)
- Vue Router (Routing)
- Axios (API client)
- Lucide Icons (Icons)

## Prerequisites

- Node.js 18+ and npm
- Laravel backend running on `http://localhost:8000`

## Installation
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment

The app connects to the Laravel backend at `http://localhost:8000/api`.

Configure proxy in `vite.config.js` if needed.

## Default Admin Credentials
```
Email:
Password: 
PIN: 123456
```

## Project Structure
```
src/
├── components/       # Reusable UI components
├── composables/      # Vue composables (hooks)
├── router/           # Vue Router configuration
├── services/         # API service layer
├── views/            # Page components
├── App.vue           # Root component
├── main.js           # App entry point
└── style.css         # Global styles
```

## Key Features

### Theme Engine
- Light/Dark mode toggle
- Persists preference in localStorage
- Auto-detects system preference
- Smooth transitions (500ms)

### API Layer
- Axios interceptors for auth and errors
- Automatic token injection
- Idempotency keys for mutations
- Structured error handling

### Admin Dashboard
- Real-time statistics
- Order management with PIN verification
- Payment verification workflow
- USDT conversion approval

### Guest Experience
- Product browsing
- One-click order creation
- Payment proof upload (drag & drop)
- Order tracking

## License

Proprietary - FEEPAY.ID