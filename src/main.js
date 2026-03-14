import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// TAMBAHKAN BARIS INI (Sesuaikan dengan nama file CSS kamu)
import './style.css' 
import vReveal from './directives/vReveal'
import vue3GoogleLogin from 'vue3-google-login'

const app = createApp(App)
app.directive('reveal', vReveal)
app.use(createPinia())
app.use(router)
app.use(vue3GoogleLogin, {
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || 'dummy-client-id'
})
app.mount('#app')