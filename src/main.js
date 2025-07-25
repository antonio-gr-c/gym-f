import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './style.css'
import './assets/colors.css'
import AOS from 'aos'
import 'aos/dist/aos.css'


const app = createApp(App)
  .use(router)
  .use(store) 
  .mount('#app')

AOS.init({ once: true, duration: 800 })
