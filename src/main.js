import { createApp } from 'vue'
import './style.css'
import App from './App.vue';
import router from './router/index';

import vue3GoogleLogin from 'vue3-google-login';

import { createPinia } from 'pinia';
import piniaPersistedstate from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(piniaPersistedstate);

const app = createApp(App);

app.use(pinia);
app.use(router);
app.use(vue3GoogleLogin, {
    clientId: '1035980481337-oesabu7d8c5tbidalch23jnculhkmisd.apps.googleusercontent.com'
})
app.mount('#app')
