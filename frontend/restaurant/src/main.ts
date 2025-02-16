import '@/assets/css/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import es from './locale/es.json'
import en from './locale/en.json'

import App from './App.vue'
import router from './router'

const i18n = createI18n({
  locale: 'es',
  messages: {
    es,
    en,
  },
})
const app = createApp(App)

app.use(i18n)
app.use(createPinia())
app.use(router)

app.mount('#app')
