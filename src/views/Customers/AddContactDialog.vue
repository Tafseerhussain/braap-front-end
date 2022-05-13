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
    <v-card class="rounded-10 overflow-hidden relative add-contact-form">
      <v-btn absolute small right icon class="mr-n3 mt-1" style="z-index: 1" @click="closeDialog">
        <v-icon size="28">mdi-close</v-icon>
      </v-btn>

      <div class="pt-9 px-9 text-h5 primary--text text-center">
        {{ model.id ? 'Update ' : 'Add ' }}<span class="braap_orange--text">Contact</span
        >{{ model.id ? ' details' : '' }}
      </div>

      <v-card-text class="pt-5 px-9 mb-4">
        <v-form ref="form" lazy-validation>
          <v-row class="my-0">
            <v-col cols="6" class="py-0">
              <v-text-field
                label="First name"
                color="braap_orange"
                hide-details
                class="mb-4"
                v-model="model.firstName"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-text-field
                label="Last name"
                color="braap_orange"
                hide-details
                class="mb-4"
                v-model="model.lastName"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="my-0">
            <v-col cols="12" class="py-0">
              <vue-tel-input-vuetify
                v-if="dialog"
                label="Phone"
                color="braap_orange"
                hide-details
                class="mb-4"
                v-model="model.phone"
                @input="phoneInput"
                :error="model.phone && (!phoneObj || !phoneObj.isValid)"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></vue-tel-input-vuetify>
            </v-col>
          </v-row>

          <v-row class="my-0">
            <v-col cols="12" class="py-0">
              <v-text-field
                label="Email"
                color="braap_orange"
                :hide-details="!emailExist"
                class="mb-4"
                v-model="model.email"
                required
                :rules="emailRules"
                :error-messages="emailExist"
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row class="my-0">
            <v-col cols="12" class="py-0">
              <vue-google-autocomplete
                ref="autocomplete"
                id="location"
                label="Location"
                color="braap_orange"
                :hide-details="true"
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
        </v-form>

        <div class="pt-8 d-flex flex-column align-center">
          <v-btn color="primary" dark x-large @click="addOrUpdateContact" :loading="loading" class="rounded-10">
            {{ model.id ? 'Update' : 'Add' }} Contact
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
    name: 'AddContactDialog',
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
          firstName: null,
          lastName: null,
          phone: null,
          email: null,
          gpsLatitude: null,
          gpsLongitude: null,
          fullAddress: null
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
      phoneInput(val, obj) {
        this.phoneObj = obj
        if (this.phoneObj.isValid) this.model.phone = this.phoneObj.number.national
      },
      addOrUpdateContact() {
        if (this.$refs.form.validate() && this.phoneObj && this.phoneObj.isValid) {
          this.validateEmail().then(valid => {
            if (valid) {
              this.loading = true
              this.$axios
                .post(`/api/userCustomer/${this.model.userCustomerId}/contacts/addOrUpdate`, {
                  ...this.model,
                  phone: this.phoneObj.number.e164
                })
                .then(result => {
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
      validateEmail() {
        return new Promise(resolve => {
          this.$axios
            .post(`/api/userCustomer/contacts/isContactEmailExist`, {
              email: this.model.email,
              id: this.model.id
            })
            .then(result => {
              if (result.success && result.data) {
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
        this.model.id = null
        this.model.phone = null
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
        this.emailExist = null
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
  .add-contact-form {
  }
</style>
