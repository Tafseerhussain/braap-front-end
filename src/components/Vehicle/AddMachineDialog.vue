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
        {{ addMachineModel.id ? 'Update ' : 'Add ' }}<span class="braap_orange--text">Machine | Asset</span
        >{{ addMachineModel.id ? ' details' : ' to shop' }}
      </div>

      <v-card-text class="pt-5 px-9 mb-4">
        <v-form ref="form">
          <v-row class="my-0">
            <v-col cols="6" class="py-0">
              <v-select
                label="Type"
                color="braap_orange"
                hide-details
                class="mb-4"
                :menu-props="menuProps"
                :items="selectList.type"
                v-model="addMachineModel.type"
                @change="getSelectListData('make')"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-select>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-select
                label="Make"
                color="braap_orange"
                hide-details
                class="mb-4"
                :menu-props="menuProps"
                :items="selectList.make"
                v-model="addMachineModel.make"
                @change="getSelectListData('year')"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-select>
            </v-col>
          </v-row>

          <v-row class="my-0">
            <v-col cols="6" class="py-0">
              <v-select
                label="Year"
                color="braap_orange"
                hide-details
                class="mb-4"
                :menu-props="menuProps"
                :items="selectList.year"
                v-model="addMachineModel.year"
                @change="getSelectListData('model')"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-select>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-select
                label="Model"
                color="braap_orange"
                hide-details
                class="mb-4"
                :menu-props="menuProps"
                :items="selectList.model"
                v-model="addMachineModel.model"
                required
                :rules="[(v) => !!v || 'Item is required']"
              ></v-select>
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
                v-model="addMachineModel.location"
              ></vue-google-autocomplete>
              <div class="d-flex align-center mb-2">
                <v-icon color="braap_orange" small class="mr-2">$svg-location</v-icon>
                <a href="#" class="braap_grey--text body-2" @click.prevent="getCurrentLocation">
                  Click to set current GPS address
                </a>
              </div>
            </v-col>
          </v-row>

          <v-row class="my-0" v-if="userType === 'TECH'">
            <v-col cols="12" class="py-0">
              <v-autocomplete
                label="Customer"
                color="braap_orange"
                hide-no-data
                hide-details
                no-filter
                chips
                :items="customers"
                item-text="customerName"
                item-value="id"
                v-model="addMachineModel.userCustomerId"
                :search-input.sync="searchQuery"
              >
                <template v-slot:selection="data">
                  <v-chip
                    v-bind="data.attrs"
                    :input-value="data.selected"
                    close
                    @click="data.select"
                    @click:close="addMachineModel.userCustomerId = null"
                    small
                  >
                    {{ data.item.customerName }}
                  </v-chip>
                </template>
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title v-html="data.item.customerName"></v-list-item-title>
                    <v-list-item-subtitle>@{{ data.item.domain }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
              </v-autocomplete>
            </v-col>
          </v-row>
        </v-form>

        <div class="pt-8 d-flex flex-column align-center">
          <v-btn color="primary" dark x-large @click="addOrUpdateMachine" :loading="loading" class="rounded-10">
            {{ addMachineModel.id ? 'Update' : 'Add' }} Machine | Asset
          </v-btn>
          <v-checkbox
            v-if="!addMachineModel.id"
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
    name: 'AddMachineDialog',
    components: { VueGoogleAutocomplete },
    props: {
      value: {
        type: Boolean,
        required: true
      },
      vehicleId: {
        type: String
      },
      userType: {
        type: String
      }
    },
    data: function() {
      return {
        dialog: false,
        loading: false,
        menuProps: {
          offsetY: true,
          nudgeTop: '-4px',
          contentClass: 'rounded-0',
          maxHeight: '436'
        },
        addAnother: false,
        selectList: {
          make: [],
          type: [],
          model: [],
          year: []
        },
        addMachineModel: {
          type: null,
          make: null,
          year: null,
          model: null,
          vin: null,
          gpsLatitude: null,
          gpsLongitude: null,
          location: null
        },
        customers: [],
        searchQuery: null
      }
    },
    watch: {
      value(val) {
        this.dialog = val
        if (val) {
          this.getSelectListData('type')
          if (this.vehicleId) {
            this.getMachineDetails(this.vehicleId)
          }
        }
      },
      searchQuery(val) {
        this.searchCustomer(val)
      },
      dialog(val) {
        this.$emit('input', val)
        if (val) {
          this.$scrollbar_hide()
          this.$chat.hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
      }
    },
    created() {
      if (this.value) this.addMachineModel = this.value
    },
    mounted() {},
    methods: {
      getMachineDetails(vehicleId) {
        this.$axios.post('/api/vehicle/' + vehicleId).then(result => {
          if (result.success && result.data) {
            this.addMachineModel = result.data

            this.getSelectListData('make')
            this.getSelectListData('model')
            this.getSelectListData('year')
            if (this.userType === 'TECH') this.searchCustomer(this.addMachineModel.customerName)
          }
        })
      },
      searchCustomer(query) {
        this.$axios
          .post('/api/userCustomer/list', {
            pageIndex: 1,
            pageSize: 5,
            filterby: '',
            searchQuery: query
          })
          .then(result => {
            if (result.success && result.data) {
              this.customers = result.data.data
            }
          })
      },
      getSelectListData(name) {
        if (name === 'type') {
          this.selectList.make = []
          this.selectList.year = []
          this.selectList.model = []
        }
        if (name === 'make') {
          this.selectList.year = []
          this.selectList.model = []
        }
        if (name === 'year') {
          this.selectList.model = []
        }

        this.$axios
          .post('/api/search/getFilterSelectListData', {
            ...this.addMachineModel,
            machineType: this.addMachineModel.type,
            selectName: name
          })
          .then(result => {
            if (result.success && result.data) {
              this.selectList[name] = result.data.filter(x => x)
            }
          })
      },
      addOrUpdateMachine() {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.$axios.post('/api/vehicle/insert', { ...this.addMachineModel, isForcedInsert: true }).then(result => {
            if (result.success && result.data) {
              if (this.addAnother) {
                this.reset()
              } else {
                this.closeDialog()
              }
              this.$emit('saved')
            } else {
              this.$msg.error('System error, please try again.')
            }
          })
        }
      },
      closeDialog() {
        this.reset()
        this.addAnother = false
        this.dialog = false
      },
      reset() {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.addMachineModel.id = null
        this.addMachineModel.location = null
        this.loading = false
      },
      placeChanged(address) {
        if (!address.country_code || !address.state_code || !address.postal_code) {
          this.$msg.error('Please select a precise address.')
        }

        this.addMachineModel.gpsLatitude = address.latitude
        this.addMachineModel.gpsLongitude = address.longitude
      },
      getCurrentLocation() {
        this.$axios
          .post('https://www.googleapis.com/geolocation/v1/geolocate?key=AIzaSyB_6WPLfpYticYsqVt3tULxJZzRNCQTzR4')
          .then(result => {
            if (result && result.location) {
              // setGoogleMap(geo.location.lat, geo.location.lng);
              this.addMachineModel.gpsLatitude = Math.round(result.location.lat * 10000000) / 10000000
              this.addMachineModel.gpsLongitude = Math.round(result.location.lng * 10000000) / 10000000

              new window.google.maps.Geocoder().geocode({ location: result.location }, (geos, status) => {
                if (status === 'OK' && geos && geos.length > 0) {
                  this.addMachineModel.location = geos[0].formatted_address
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
