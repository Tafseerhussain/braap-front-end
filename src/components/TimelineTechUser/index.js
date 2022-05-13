import '../../main.js'
import vuetify from '../../plugins/vuetify'
import Vue from 'vue'

// Timeline for tech user
import TimelineTechUser from './index.vue'
document.querySelectorAll('#braap-timeline-tech, braap-timeline-tech').forEach((el) => {
  new Vue({
    vuetify,
    render: h => h(TimelineTechUser)
  }).$mount(el)
})