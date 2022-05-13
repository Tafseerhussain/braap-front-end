<template>
  <v-dialog v-model="dialog" max-width="500" persistent scrollable overlay-opacity="0.8">
    <v-card class="add-contact-form">
      <v-card-title class="primary white--text py-2 pl-3 pl-sm-6">
        {{ model.Id ? 'Update contact details' : 'Add contact' }}
        <v-btn icon small dark class="ml-auto mr-n4" @click="closeDialog">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text class="pt-6 px-3 px-sm-6">
        <v-form ref="form" lazy-validation>
          <v-row dense>
            <v-col cols="6">
              <v-text-field
                label="First name"
                outlined
                hide-details
                class="mb-4"
                dense
                v-model="model.FirstName"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                label="Last name"
                outlined
                hide-details
                class="mb-4"
                dense
                v-model="model.LastName"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-text-field>
            </v-col>
          </v-row>

          <vue-tel-input-vuetify
            v-if="dialog"
            label="Phone"
            outlined
            dense
            hide-details
            class="mb-4"
            v-model="model.Phone"
            @validate="phoneInput"
            :error="model.Phone && (!phoneObj || !phoneObj.isValid)"
            required
            :rules="[(v) => !!v || 'Item is required']"
          ></vue-tel-input-vuetify>
          <v-text-field
            label="Email"
            outlined
            :hide-details="!emailExist"
            class="mb-4"
            dense
            v-model="model.Email"
            required
            :rules="emailRules"
            :error-messages="emailExist"
          ></v-text-field>

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
        <v-btn color="braap_green" dark large @click="addOrUpdateContact" :loading="loading" elevation="0">
          {{ model.Id ? 'Update' : 'Add' }} Contact
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script>
  import VueGoogleAutocomplete from '@/components/Common/VueGoogleAutocomplete.vue'

  export default {
    name: 'AddContactForm',
    components: { VueGoogleAutocomplete },
    props: {
      value: {
        type: Boolean,
        required: true
      },
      data: {
        type: Object,
        required: true
      },
      openInDialog: {
        type: Boolean
      }
    },
    data: function() {
      return {
        dialog: false,
        loading: false,
        addAnother: false,
        model: {
          FirstName: null,
          LastName: null,
          Phone: null,
          Email: null,
          GPSLatitude: null,
          GPSLongitude: null,
          FullAddress: null
        },
        phoneObj: null,
        emailExist: null,
        emailRules: [
          v => !!v || 'Item is required',
          v =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || 'Email must be valid'
        ]
      }
    },
    watch: {
      value(val) {
        this.dialog = val
      },
      data(val) {
        if (val) this.model = { ...this.model, ...val }
      },
      dialog(val) {
        if (this.openInDialog) return
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
      }
    },
    created() {
      // if (this.value) this.model = this.value
    },
    mounted() {},
    methods: {
      phoneInput(obj) {
        this.phoneObj = obj
        if (this.phoneObj.isValid) this.model.Phone = this.phoneObj.number.e164
      },
      addOrUpdateContact() {
        if (this.$refs.form.validate() && this.phoneObj && this.phoneObj.isValid) {
          this.validateEmail().then(valid => {
            if (valid) {
              this.loading = true
              this.$axios.post('/UserCustomer/AddOrUpdateUserCustomerContact', { ...this.model }).then(result => {
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
      validateEmail() {
        return new Promise(resolve => {
          this.$axios
            .post('/UserCustomer/IsContactEmailExist', {
              email: this.model.Email,
              customerId: this.model.UserCustomerId,
              id: this.model.Id
            })
            .then(result => {
              if (result && result.status === 200 && result.data) {
                this.emailExist = 'A contact exists with this email.'
                return resolve(false)
              } else {
                this.emailExist = ''
                return resolve(true)
              }
            })
        })
      },
      closeDialog() {
        this.reset()
        this.addAnother = false
        this.$emit('input', false)
      },
      reset() {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.model.Id = null
        this.model.Phone = null
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
        this.emailExist = null
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
  .add-contact-form {
  }
</style>
