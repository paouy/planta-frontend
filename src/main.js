import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import 'vue-cf-ui/lib/style.css'
import './style.scss'

const app = createApp(App)

app.use(router)
app.mount('#app')