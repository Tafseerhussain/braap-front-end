import '../../main.js'
import vuetify from '../../plugins/vuetify'
import Vue from 'vue'

// Timeline for customer
import Timeline from './index.vue'
document.querySelectorAll('#braap-timeline, braap-timeline').forEach((el) => {
  new Vue({
    vuetify,
    render: h => h(Timeline)
  }).$mount(el)
})

// Google map 
import GoogleMap from '../GoogleMap'
document.querySelectorAll('#google-map, google-map').forEach((el) => {
  new Vue({
    vuetify,
    render: h => h(GoogleMap)
  }).$mount(el)
})