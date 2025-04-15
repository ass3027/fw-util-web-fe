import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from "pinia";
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Button from "primevue/button"
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Card from "primevue/card";
import Panel from "primevue/panel";
import Divider from "primevue/divider";
import Dialog from "primevue/dialog";

const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .use(PrimeVue, {
        theme: {
            preset: Aura
        }
    })
    .component('Dialog', Dialog)
    .component('Divider', Divider)
    .component('Panel', Panel)
    .component('Card', Card)
    .component('Button', Button)
    .component('DataTable', DataTable)
    .component('Column', Column)
    .mount('#app')