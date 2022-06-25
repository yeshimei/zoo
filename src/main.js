import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import 'normalize.css'
import { send } from './socket'
let app = createApp(App)
app.config.globalProperties.$send = send

app.use(store).use(router).mount('#app')
