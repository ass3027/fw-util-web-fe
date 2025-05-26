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
import MultiSelect from "primevue/multiselect";
import InputText from "primevue/inputtext";
import IconField from "primevue/iconfield";
import InputIcon from "primevue/inputicon";


const pinia = createPinia()

createApp(App)
    .use(router)
    .use(pinia)
    .use(PrimeVue, {
        theme: {
            preset: Aura,
            options: {
                darkModeSelector: '.my-app-dark'
            }
        }
    })
    .component('Card', Card)
    .component('Panel', Panel)
    .component('Divider', Divider)

    .component('InputIcon', InputIcon)
    .component('IconField', IconField)
    .component('InputText', InputText)
    .component('MultiSelect', MultiSelect)
    .component('Dialog', Dialog)
    .component('Button', Button)

    .component('DataTable', DataTable)
    .component('Column', Column)

    .mount('#app')