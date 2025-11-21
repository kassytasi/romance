import { createApp } from 'vue'
import { Quasar } from 'quasar'
import App from './App.vue'


import 'quasar/dist/quasar.css'
import '@quasar/extras/material-icons/material-icons.css'

createApp(App)
  .use(Quasar, {})
  .mount('#app')
