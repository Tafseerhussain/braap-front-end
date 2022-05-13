import '../../main.js'
import vuetify from '../../plugins/vuetify'
import Vue from 'vue'

import CustomerList from './CustomerList.vue'
document.querySelectorAll('tech-customers').forEach((el) => {
  new Vue({
    vuetify,
    render: h => h(CustomerList)
  }).$mount(el)
})