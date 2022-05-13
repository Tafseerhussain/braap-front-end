<template>
  <v-dialog v-model="dialog" max-width="500" persistent scrollable overlay-opacity="0.8">
    <v-card>
      <v-card-title class="primary white--text py-2 pl-3 pl-sm-6">
        {{ model.Id ? 'Update customer details' : 'Add customer' }}
        <v-btn icon small dark class="ml-auto mr-n4" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-6 px-3 px-sm-6">
        <v-form ref="form" lazy-validation>
          <v-text-field
            label="Customer name"
            outlined
            hide-details
            class="mb-4"
            dense
            v-model="model.CustomerName"
            required
            :rules="[(v) => !!v || 'Item is required']"
          ></v-text-field>
          <v-text-field
            v-show="!model.IsNotCompany"
            label="Company email domain"
            outlined
            :hide-details="!domainExist"
            class="mb-4"
            dense
            v-model="model.Domain"
            :error-messages="domainExist"
            required
            :rules="[(v) => !!v || 'Item is required']"
          >
            <template #prepend-inner>
              <v-icon small class="mt-1">mdi-at</v-icon>
            </template>
            <template #append>
              <v-tooltip bottom color="primary" max-width="500" open-delay="100">
                <template v-slot:activator="{ on, attrs }">
                  <v-icon v-bind="attrs" v-on="on" style="cursor: pointer">mdi-help-circle</v-icon>
                </template>
                <p class="mb-1">Example, the customer is Trade Logic.</p>
                <p class="mb-1">Email addresses for staff that work there ends with @tradelogic.com</p>
                <p class="mb-0">So, we would enter tradelogic.com in this field.</p>
              </v-tooltip>
            </template>
          </v-text-field>
          <vue-google-autocomplete
            ref="autocomplete"
            id="location"
            label="Location"
            :outlined="true"
            :hide-details="true"
            :dense="true"
            class="mb-1"
            types="establishment"
            :country="['us', 'ca']"
            :fields="['address_component', 'geometry', 'formatted_address']"
            @placechanged="placeChanged"
            v-model="model.FullAddress"
            required
            :rules="[(v) => !!v || 'Item is required']"
          ></vue-google-autocomplete>
          <div class="d-flex align-center mb-4">
            <v-icon color="braap_red" small class="mr-2">$svg-location</v-icon>
            <a href="#" class="braap_grey--text caption" @click.prevent="getCurrentLocation">
              Click to set current GPS address
            </a>
          </div>
          <v-switch
            hide-details
            :ripple="false"
            inset
            v-model="model.IsNotCompany"
            label="Not a company"
            class="mb-4"
            dense
          ></v-switch>
          <v-switch
            hide-details
            :ripple="false"
            inset
            v-model="model.IsPriority"
            label="Priority Customer"
            class="mb-4"
            dense
          ></v-switch>
        </v-form>
      </v-card-text>
      <div class="d-flex align-center justify-end pb-6 px-3 px-sm-6 pt-0">
        <v-checkbox
          v-if="!model.Id"
          label="Add another"
          class="ma-0 pa-0 mr-2 mr-sm-4"
          hide-details
          :ripple="false"
          v-model="addAnother"
        ></v-checkbox>
        <v-btn color="braap_green" dark large @click="addOrUpdateCustomer" :loading="loading" elevation="0">
          {{ model.Id ? 'Update' : 'Add' }} Customer
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import VueGoogleAutocomplete from '@/components/Common/VueGoogleAutocomplete.vue'

  export default {
    name: 'AddCustomerForm',
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
          CustomerName: null,
          Domain: null,
          IsNotCompany: false,
          IsPriority: false,
          GPSLatitude: null,
          GPSLongitude: null,
          FullAddress: null
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
              this.$axios.post('/UserCustomer/AddOrUpdateUserCustomer', { ...this.model }).then(result => {
                if (result && result.status === 200 && result.data) {
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
            .post('/UserCustomer/IsDomainExist', { domain: this.model.Domain, id: this.model.Id })
            .then(result => {
              if (result && result.status === 200 && result.data) {
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
        this.model.Id = null
        this.model.Address1 = null
        this.model.City = null
        this.model.State = null
        this.model.StateCode = null
        this.model.ZipCode = null
        this.model.CountryCode = null
        this.model.FullAddress = null
        this.model.GPSLatitude = null
        this.model.GPSLongitude = null

        this.loading = false
      },
      placeChanged(address) {
        if (!address.country_code || !address.state_code || !address.postal_code) {
          this.$msg.error('Please select a precise address.')
          setTimeout(() => {
            this.model.FullAddress = ''
          }, 100)
          return
        }

        this.model.Address1 = address.street_number + ' ' + address.route
        this.model.City = address.city
        this.model.State = address.state
        this.model.StateCode = address.state_code
        this.model.ZipCode = address.postal_code
        this.model.CountryCode = address.country_code
        this.model.GPSLatitude = address.latitude
        this.model.GPSLongitude = address.longitude
      },
      getCurrentLocation() {
        this.$axios
          .post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB_6WPLfpYticYsqVt3tULxJZzRNCQTzR4')
          .then(result => {
            if (result && result.status === 200 && result.data && result.data.location) {
              // setGoogleMap(geo.location.lat, geo.location.lng);
              this.model.GPSLatitude = Math.round(result.data.location.lat * 10000000) / 10000000
              this.model.GPSLongitude = Math.round(result.data.location.lng * 10000000) / 10000000

              new window.google.maps.Geocoder().geocode({ location: result.data.location }, (geos, status) => {
                if (status === 'OK' && geos && geos.length > 0) {
                  this.model.FullAddress = geos[0].formatted_address
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
