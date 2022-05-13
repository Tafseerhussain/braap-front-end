<template>
  <v-card flat class="machine-details" color="transparent">
    <v-card-text class="d-flex flex-column px-0 px-lg-2" v-if="model.id">
      <v-btn-toggle
        v-if="!model.category"
        class="braap-orange-toggle ml-auto mb-4 rounded-10"
        v-model="type"
        background-color="white"
      >
        <v-btn
          :color="type === 0 ? 'orange' : 'white'"
          class="px-6"
          :class="{ 'white--text': type === 0 }"
          :disabled="model.category"
        >
          Machine
        </v-btn>
        <v-btn
          :color="type === 1 ? 'orange' : 'white'"
          class="px-8"
          :class="{ 'white--text': type === 1 }"
          :disabled="model.category"
        >
          Asset
        </v-btn>
      </v-btn-toggle>
      <v-form ref="form">
        <template v-if="type === 0">
          <v-text-field label="VIN" color="braap_orange" hide-details class="mb-5" v-model="model.vin"></v-text-field>

          <v-row class="my-0">
            <v-col cols="12" sm="6" class="py-0">
              <v-date-picker-input
                v-model="model.purchaseDate"
                label="Purchase Date"
                color="braap_orange"
                :hide-details="true"
                class-names="mb-5"
              ></v-date-picker-input>
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <v-date-picker-input
                v-model="model.lastInspectionDate"
                label="Last Inspection Date"
                color="braap_orange"
                :hide-details="true"
                class-names="mb-5"
              ></v-date-picker-input>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col cols="12" sm="6" class="py-0">
              <v-text-field
                label="Registration Number"
                hide-details
                color="braap_orange"
                class="mb-5"
                v-model="model.registrationNumber"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <v-date-picker-input
                v-model="model.lastRegistrationDate"
                label="Last Registration Date"
                color="braap_orange"
                :hide-details="true"
                class-names="mb-5"
              ></v-date-picker-input>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col cols="12" sm="6" class="py-0">
              <v-text-field
                label="Hours"
                color="braap_orange"
                hide-details
                class="mb-5"
                v-model="model.hours"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <v-text-field
                :label="model.useKilometers ? 'Kilometers (km)' : 'Miles'"
                color="braap_orange"
                hide-details
                class="mb-2"
                v-model="model.milage"
              ></v-text-field>
              <div class="d-flex align-center">
                Miles
                <v-switch hide-details :ripple="false" dense inset v-model="model.useKilometers" class="ml-4 ma-0 pt-0">
                </v-switch>
                Kilometers
              </div>
            </v-col>
          </v-row>
        </template>
        <template v-else-if="type === 1">
          <v-text-field
            label="Asset ID"
            color="braap_orange"
            hide-details
            class="mb-6"
            v-model="model.vin"
          ></v-text-field>
          <v-combobox
            label="Asset Tag"
            color="braap_orange"
            hide-details
            class="mb-5"
            v-model="model.assetTag"
            chips
            multiple
            append-icon=""
          >
            <template v-slot:selection="data">
              <v-chip
                color="primary"
                close
                close-icon="mdi-close"
                dark
                small
                label
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :input-value="data.selected"
                :disabled="data.disabled"
                @click:close="data.parent.selectItem(data.item)"
              >
                {{ data.item }}
              </v-chip>
            </template>
          </v-combobox>
          <v-row class="my-0">
            <v-col cols="6" class="py-0">
              <v-date-picker-input
                v-model="model.installDate"
                label="Install Date"
                color="braap_orange"
                :hide-details="true"
                class-names="mb-5"
                @date-input="installDateInput"
              ></v-date-picker-input>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-date-picker-input
                v-model="model.commissionDate"
                label="Commission Date"
                color="braap_orange"
                :hide-details="true"
                class-names="mb-5"
                :allowedDates="allowedDates"
              ></v-date-picker-input>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col cols="6" class="py-0">
              <v-text-field
                label="Login"
                color="braap_orange"
                hide-details
                class="mb-5"
                v-model="model.assetLogin"
                :error="!loginValid"
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-text-field
                label="Password"
                color="braap_orange"
                :append-icon="showPwd ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPwd ? 'text' : 'password'"
                hide-details
                class="mb-5"
                v-model="model.assetPassword"
                @click:append="showPwd = !showPwd"
                :error="!pwdValid"
              ></v-text-field>
            </v-col>
          </v-row>
        </template>

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
          v-model="model.location"
        ></vue-google-autocomplete>
        <div class="d-flex align-center mb-4">
          <v-icon color="braap_orange" small class="mr-2">$svg-location</v-icon>
          <a href="#" class="braap_grey--text caption" @click.prevent="getCurrentLocation">
            Click to set current GPS address
          </a>
        </div>
        <v-expand-transition>
          <div v-show="model.gpsLatitude && model.gpsLongitude" class="mb-4">
            <v-row class="my-0">
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="GPS coordinates (Lat)"
                  color="braap_orange"
                  hide-details
                  class="mb-5"
                  readonly
                  v-model="model.gpsLatitude"
                ></v-text-field>
              </v-col>
              <v-col cols="6" class="py-0">
                <v-text-field
                  label="GPS coordinates (Lng)"
                  color="braap_orange"
                  hide-details
                  class="mb-5"
                  readonly
                  v-model="model.gpsLongitude"
                ></v-text-field>
              </v-col>
            </v-row>
            <GoogleMap ref="map" @position-updated="positionUpdated"></GoogleMap>
          </div>
        </v-expand-transition>
      </v-form>
      <v-btn class="ml-auto body-0 rounded-10 mt-4" color="primary" x-large dark @click="save" :loading="loading"
        >Update</v-btn
      >
    </v-card-text>
  </v-card>
</template>

<script>
  import VueGoogleAutocomplete from '@/components/Common/VueGoogleAutocomplete.vue'
  import GoogleMap from '@/components/Common/GoogleMap.vue'
  import moment from 'moment'
  import VDatePickerInput from '@/components/Common/VDatePickerInput.vue'

  export default {
    name: 'MachineDetails',
    components: {
      VueGoogleAutocomplete,
      GoogleMap,
      VDatePickerInput
    },
    props: {
      vehicleId: {
        type: String,
        required: true
      }
    },
    data: function() {
      return {
        loading: false,
        type: 0,
        showPwd: false,
        pwdValid: true,
        loginValid: true,
        model: {
          category: null,
          purchaseDate: null,
          hours: null,
          useKilometers: null,
          milage: null,
          vin: null,
          gpsLatitude: null,
          gpsLongitude: null,
          location: null,
          //asset
          installDate: null,
          commissionDate: null,
          assetTag: null
        }
      }
    },
    computed: {},
    created() {
      this.getMachineDetails()
      this.$watch('model.location', val => {
        if (!val) {
          this.model.gpsLatitude = null
          this.model.gpsLongitude = null
        }
      })
    },
    watch: {},
    methods: {
      allowedDates(val) {
        if (!this.model.installDate) return true
        let date = moment(val).add(1, 'h')
        let allowed = date.isAfter(this.model.installDate) // greater than InstallDate
        return allowed
      },
      getMachineDetails() {
        this.$axios.post(`/api/vehicle/${this.vehicleId}`).then(result => {
          if (result.success && result.data) {
            let data = result.data

            if (data.category) this.type = data.category === 'MACHINE' ? 0 : 1
            if (data.assetTag) data.assetTag = data.assetTag.filter(x => x)
            this.model = { ...this.model, ...data }

            if (this.model.gpsLatitude && this.model.gpsLongitude) {
              this.$nextTick(() => {
                this.$refs.map.createMaker({ lat: this.model.gpsLatitude, lng: this.model.gpsLongitude })
              })
            }
          }
        })
      },
      validateLoginAndPwd() {
        this.loginValid = true
        this.pwdValid = true
        if (this.model.assetLogin && !this.model.assetPassword) {
          this.pwdValid = false
        } else if (this.model.assetLogin && this.model.assetPassword) {
          if (this.model.assetPassword.length < 6) this.pwdValid = false
        } else if (!this.model.assetLogin && this.model.assetPassword) {
          this.loginValid = false
        }
        return this.loginValid && this.pwdValid
      },
      save() {
        if (this.$refs.form.validate() && this.validateLoginAndPwd()) {
          this.loading = true
          this.$axios
            .post('/api/vehicle/insert', {
              ...this.model,
              id: this.vehicleId,
              category: this.type === 0 ? 'MACHINE' : 'ASSET'
            })
            .then(result => {
              if (result.success && result.data) {
                this.model.category = this.type === 0 ? 'MACHINE' : 'ASSET'
                this.$msg.success('The address was updated.')
              } else {
                this.$msg.error('System error, please try again.')
              }
              this.loading = false
            })
        }
      },
      placeChanged(address) {
        if (!address.country_code || !address.state_code || !address.postal_code) {
          this.$msg.error('Please select a precise address.')
        }

        this.model.gpsLatitude = address.latitude
        this.model.gpsLongitude = address.longitude

        this.$nextTick(() => {
          this.$refs.map.createMaker({ lat: this.model.gpsLatitude, lng: this.model.gpsLongitude })
        })
      },
      getCurrentLocation() {
        this.$axios
          .post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB_6WPLfpYticYsqVt3tULxJZzRNCQTzR4')
          .then(result => {
            if (result && result.location) {
              this.model.gpsLatitude = Math.round(result.location.lat * 10000000) / 10000000
              this.model.gpsLongitude = Math.round(result.location.lng * 10000000) / 10000000
              this.$nextTick(() => {
                this.$refs.map.createMaker({ lat: this.model.gpsLatitude, lng: this.model.gpsLongitude })
              })
              new window.google.maps.Geocoder().geocode({ location: result.location }, (geos, status) => {
                if (status === 'OK' && geos && geos.length > 0) {
                  this.model.location = geos[0].formatted_address
                }
              })
            }
          })
      },
      positionUpdated({ lat, lng }) {
        this.model.gpsLatitude = Math.round(lat * 10000000) / 10000000
        this.model.gpsLongitude = Math.round(lng * 10000000) / 10000000
      },
      installDateInput(val) {
        this.model.commissionDate = val
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .machine-details {
    .inverse-switch {
      .v-input__slot {
        justify-content: flex-end;
      }
      .v-input--selection-controls__input {
        order: 1;
        margin-right: 0;
        margin-left: 8px;
        & + .v-label {
          left: auto !important;
          flex-grow: 0;
        }
      }
    }
  }
</style>
