import Vue from 'vue'
import vuetify from './vuetify'
import VueTelInputVuetify from './vue-tel-input-vuetify';
import MSnackBarPlugin from './notification'

Vue.use(VueTelInputVuetify, { vuetify, defaultCountry: 'us' });
Vue.use(MSnackBarPlugin, { vuetify })