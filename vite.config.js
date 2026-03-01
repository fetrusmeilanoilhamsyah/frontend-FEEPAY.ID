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
    terser: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  }
})