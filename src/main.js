import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import { MyPreset } from "./prime-vue-preset.js";


const pinia = createPinia()


createApp(App)
    .use(router)
    .use(pinia)
    .use(PrimeVue, {
        theme: {
            preset: MyPreset,
            options: {
                darkModeSelector: '.p-app-dark',
                cssLayer: {
                    name: 'primevue',
                    order: 'theme, base, primevue'
                }
            }
        }
    })

    .mount('#app')