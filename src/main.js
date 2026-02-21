import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'

// TAMBAHKAN BARIS INI (Sesuaikan dengan nama file CSS kamu)
import './style.css' 

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.mount('#app')