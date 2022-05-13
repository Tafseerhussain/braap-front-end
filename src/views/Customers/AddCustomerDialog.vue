<template>
  <v-dialog
    v-model="dialog"
    max-width="695"
    scrollable
    overlay-color="rgba(0,0,0,0.5)"
    overlay-opacity="1"
    class="elevation-0"
    persistent
    content-class="border-dialog rounded-10"
  >
    <v-card class="rounded-10 overflow-hidden relative">
      <v-btn absolute small right icon class="mr-n3 mt-1" style="z-index: 1" @click="closeDialog">
        <v-icon size="28">mdi-close</v-icon>
      </v-btn>

      <div class="pt-9 px-9 text-h5 primary--text text-center">
        {{ model.id ? 'Update ' : 'Add ' }}<span class="braap_orange--text">Customer</span
        >{{ model.id ? ' details' : '' }}
      </div>

      <v-card-text class="pt-5 px-9 mb-4">
        <v-form ref="form" lazy-validation>
          <v-row class="my-0">
            <v-col class="py-0">
              <v-text-field
                label="Customer name"
                color="braap_orange"
                hide-details
                class="mb-4"
                v-model="model.customerName"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col class="py-0">
              <v-text-field
                v-show="!model.isNotCompany"
                label="Company email domain"
                color="braap_orange"
                :hide-details="!domainExist"
                class="mb-4"
                v-model="model.domain"
                :error-messages="domainExist"
                required
                :rules="[(v) => !!v || 'Item is required']"
              >
                <template #prepend-inner>
                  <v-icon small class="mt-1">mdi-at</v-icon>
                </template>
                <template #append>
                  <v-tooltip top color="primary" max-width="500" open-delay="100" content-class="top">
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                    </template>
                    <p class="mb-1">Example, the customer is Trade Logic.</p>
                    <p class="mb-1">Email addresses for staff that work there ends with @tradelogic.com</p>
                    <p class="mb-0">So, we would enter tradelogic.com in this field.</p>
                  </v-tooltip>
                </template>
              </v-text-field>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col class="py-0">
              <vue-google-autocomplete
                ref="autocomplete"
                id="location"
                label="Location"
                :hide-details="true"
                color="braap_orange"
                class="mb-2"
                types="establishment"
                :country="['us', 'ca']"
                :fields="['address_component', 'geometry', 'formatted_address']"
                @placechanged="placeChanged"
                v-model="model.fullAddress"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></vue-google-autocomplete>
              <div class="d-flex align-center mb-2">
                <v-icon color="braap_orange" small class="mr-2">$svg-location</v-icon>
                <a href="#" class="braap_grey--text body-2" @click.prevent="getCurrentLocation">
                  Click to set current GPS address
                </a>
              </div>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col class="py-0">
              <v-switch
                hide-details
                :ripple="false"
                inset
                v-model="model.isNotCompany"
                label="Not a company"
                class="mt-6"
                dense
              ></v-switch>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col class="py-0">
              <v-switch
                hide-details
                :ripple="false"
                inset
                v-model="model.isPriority"
                label="Priority Customer"
                class="mb-4"
                dense
              ></v-switch>
            </v-col>
          </v-row>
        </v-form>

        <div class="pt-8 d-flex flex-column align-center">
          <v-btn color="primary" dark x-large @click="addOrUpdateCustomer" :loading="loading" class="rounded-10">
            {{ model.id ? 'Update' : 'Add' }} Customer
          </v-btn>
          <v-checkbox
            v-if="!model.id"
            label="Add another"
            color="braap_orange"
            class="ma-0 pa-0 mt-4"
            hide-details
            :ripple="false"
            v-model="addAnother"
          ></v-checkbox>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
  import VueGoogleAutocomplete from '@/components/Common/VueGoogleAutocomplete.vue'

  export default {
    name: 'AddCustomerDialog',
    components: { VueGoogleAutocomplete },
    props: {
      value: {
        type: Boolean,
        required: true
      },
      data: {
        type: Object,
        required: true
      }
    },
    data: function() {
      return {
        loading: false,
        addAnother: false,
        dialog: false,
        model: {
          customerName: null,
          domain: null,
          isNotCompany: false,
          isPriority: false,
          gpsLatitude: null,
          gpsLongitude: null,
          fullAddress: null
        },
        domainExist: ''
      }
    },
    watch: {
      value(val) {
        this.dialog = val
      },
      data(val) {
        this.model = val
      },
      dialog(val) {
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
      }
    },
    created() {},
    mounted() {},
    methods: {
      addOrUpdateCustomer() {
        if (this.$refs.form.validate()) {
          this.validateDomain().then(valid => {
            if (valid) {
              this.loading = true
              this.$axios.post('/api/userCustomer/AddOrUpdate', { ...this.model }).then(result => {
                if (result.success && result.data) {
                  if (this.addAnother) {
                    this.reset()
                  } else {
                    this.closeDialog()
                  }
                  this.$emit('saved', result.data)
                } else {
                  this.$msg.error('System error, please try again.')
                }
              })
            }
          })
        }
      },
      validateDomain() {
        return new Promise(resolve => {
          this.$axios
            .post('/api/userCustomer/isDomainExist', { domain: this.model.domain, id: this.model.id })
            .then(result => {
              if (result.success && result.data) {
                this.domainExist = 'This customer already exists.'
                return resolve(false)
              } else {
                this.domainExist = ''
                return resolve(true)
              }
            })
        })
      },
      closeDialog() {
        this.reset()
        this.addAnother = false
        this.dialog = false
        this.$emit('input', false)
      },
      reset() {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.model.id = null
        this.model.address1 = null
        this.model.city = null
        this.model.state = null
        this.model.stateCode = null
        this.model.zipCode = null
        this.model.countryCode = null
        this.model.fullAddress = null
        this.model.gpsLatitude = null
        this.model.gpsLongitude = null

        this.loading = false
      },
      placeChanged(address) {
        if (!address.country_code || !address.state_code || !address.postal_code) {
          this.$msg.error('Please select a precise address.')
          setTimeout(() => {
            this.model.fullAddress = ''
          }, 100)
          return
        }

        this.model.address1 = address.street_number + ' ' + address.route
        this.model.city = address.city
        this.model.state = address.state
        this.model.stateCode = address.state_code
        this.model.zipCode = address.postal_code
        this.model.countryCode = address.country_code
        this.model.gpsLatitude = address.latitude
        this.model.gpsLongitude = address.longitude
      },

      getCurrentLocation() {
        this.$axios
          .post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB_6WPLfpYticYsqVt3tULxJZzRNCQTzR4')
          .then(result => {
            if (result && result.location) {
              // setGoogleMap(geo.location.lat, geo.location.lng);
              this.model.gpsLatitude = Math.round(result.location.lat * 10000000) / 10000000
              this.model.gpsLongitude = Math.round(result.location.lng * 10000000) / 10000000

              new window.google.maps.Geocoder().geocode({ location: result.location }, (geos, status) => {
                if (status === 'OK' && geos && geos.length > 0) {
                  this.model.fullAddress = geos[0].formatted_address
                }
              })
            }
          })
      }
    }
  }
</script>

<style lang="scss">
</style>
