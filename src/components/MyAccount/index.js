import '../../main.js'
import vuetify from '../../plugins/vuetify'
import Vue from 'vue'

// My Account
import MyAccount from './index.vue'
document.querySelectorAll('my-account').forEach((el) => {
  new Vue({
    vuetify,
    render: h => h(MyAccount)
  }).$mount(el)
})