import App from './App.vue'
import router from './router'
import {createApp} from 'vue'
import BootstrapVue3 from 'bootstrap-vue-3'
import { createPinia } from 'pinia'

// Optional, since every component import their Bootstrap functionality
// the following line is not necessary
// import 'bootstrap'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue-3/dist/bootstrap-vue-3.css'

const pinia = createPinia()
const app = createApp(App)

app.use(BootstrapVue3)
app.use(pinia)
createApp(App).use(router).mount('#app')
