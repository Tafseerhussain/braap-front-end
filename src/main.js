import Vue from 'vue'
import vuetify from '@/plugins/vuetify'

// vue localstrage
import Storage from 'vue-ls';
Vue.use(Storage, {
  namespace: 'vuejs__', // key prefix
  name: 'ls', // name variable Vue.[ls] or this.[$ls],
  storage: 'local', // storage name session, local, memory
});

// perfect scrollbar
import PerfectScrollbar from 'vue2-perfect-scrollbar'
import 'vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css'
Vue.use(PerfectScrollbar)

// vue slick
import 'vue-slick-carousel/dist/vue-slick-carousel.css'
import 'vue-slick-carousel/dist/vue-slick-carousel-theme.css'

import './styles/main.scss'
import './styles/vuetify-override.scss'

import App from './App.vue'
import router from '@/router'
import store from '@/store'
import '@/utils/axios'
import '@/utils/permission'
import '@/utils/vue-extension'
import '@/utils/filters'
import '@/plugins/plugins'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
