import { createApp } from 'vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import './assets/mtn-style.css'
import './assets/w3.css'
import './assets/utility.css'
const app = createApp(App)
/* import the fontawesome core */
import { library } from '@fortawesome/fontawesome-svg-core'
import { faXmark } from '@fortawesome/free-solid-svg-icons'
/* import font awesome icon component */
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
library.add(faXmark)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
