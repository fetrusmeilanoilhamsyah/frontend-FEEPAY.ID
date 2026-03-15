import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://api.feepay.web.id',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    // ✅ FIX: Pakai esbuild (bawaan Vite) bukan terser
    // drop_console benar-benar bekerja saat production build
    minify: 'esbuild',
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === 'UNRESOLVED_IMPORT') return
        warn(warning)
      }
    },
  },
  esbuild: {
    // ✅ Drop semua console.log dan debugger di production build
    drop: ['console', 'debugger'],
  }
})