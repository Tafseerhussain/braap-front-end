<template>
  <div class="my-addresses">
    <v-card class="section-wrapper rounded-10 pa-10 mb-5">
      <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
        <div class="d-flex align-center mb-3">
          <v-icon color="braap_orange" size="30" class="mr-2">$svg-address</v-icon>
          <span class="mt-1">Primary Shipping Address</span>
        </div>

        <v-scale-transition origin="center">
          <v-btn
            v-show="!showAutocomplete"
            fab
            color="primary"
            style="height: 48px; width: 48px"
            class="ml-auto"
            @click="showAutocompleteControl"
            transition="scale-transition"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-scale-transition>
      </v-card-title>
      <v-card-text class="pa-0" :class="{ 'pt-4': primary != null }">
        <div class="d-flex align-center" v-if="primary">
          <v-icon class="mr-1" color="braap_grey">mdi-map-marker-outline</v-icon>
          <span class="primary-addr" @click="updatePrimaryAddress">{{ primary.fullAddress }}</span>
        </div>

        <v-expand-transition>
          <vue-google-autocomplete
            ref="autocomplete"
            v-show="showAutocomplete"
            color="braap_orange"
            classname="mt-2"
            id="new_address"
            hide-details
            types="establishment"
            :country="['us', 'ca']"
            :fields="['address_component', 'geometry', 'formatted_address']"
            placeholder="Enter a location"
            @blur="handleBlur"
            @placechanged="placeChanged"
          >
          </vue-google-autocomplete>
        </v-expand-transition>
      </v-card-text>
    </v-card>

    <v-card v-if="addresses.length > 1" class="mt-5 section-wrapper rounded-10 pa-10 mb-5">
      <v-card-title class="text-h5 primary--text font-weight-medium pa-0 mb-3">
        <v-icon color="braap_orange" size="30" class="mr-2">$svg-address</v-icon>
        <span class="mt-1">Other Shipping Addresses</span>
      </v-card-title>

      <v-card-text class="pa-0 pt-4">
        <v-slide-y-transition group>
          <v-hover open-delay="100" v-slot="{ hover }" v-for="addr in filteredAddr" :key="addr.id">
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-1" color="braap_grey">mdi-map-marker-outline</v-icon>
              <span class="flex-grow-1 addr-text text-truncate">{{ addr.fullAddress }}</span>
              <v-slide-y-transition>
                <div v-show="hover">
                  <v-btn icon color="braap_grey" small title="Set as primary address" @click="setAsPrimary(addr.id)">
                    <v-icon color="braap_grey">mdi-chevron-up</v-icon>
                  </v-btn>
                  <v-btn icon color="braap_grey" small title="Remove the address" @click="removeAddress(addr.id)">
                    <v-icon color="error">mdi-trash-can</v-icon>
                  </v-btn>
                </div>
              </v-slide-y-transition>
            </div>
          </v-hover>
        </v-slide-y-transition>
        <v-btn v-if="addresses.length > min + 1" icon color="braap_grey" absolute bottom right @click="showAllAddress">
          <v-icon color="braap_grey" size="30" class="down-arrow" :class="{ 'up-arrow': showAll }"
            >mdi-arrow-down-drop-circle-outline
          </v-icon>
        </v-btn>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import VueGoogleAutocomplete from '@/components/Common/VueGoogleAutocomplete.vue'

  export default {
    name: 'Addresses',
    components: {
      VueGoogleAutocomplete
    },
    data: function() {
      return {
        showAll: false,
        showAutocomplete: false,
        updatePrimary: false,
        addresses: [],
        min: 5
      }
    },
    computed: {
      filteredAddr() {
        var data = this.addresses.filter(x => !x.isPrimaryAddress)
        return this.showAll ? data : data.filter((x, index) => index < this.min)
      },
      primary() {
        return this.addresses.find(x => x.isPrimaryAddress)
      }
    },
    created() {
      this.getUserAddress()
    },
    methods: {
      getUserAddress() {
        this.$axios.post('/api/account/userAddresses').then(result => {
          if (result.success && result.data) {
            this.addresses = result.data
          }
        })
      },
      showAllAddress() {
        this.showAll = !this.showAll
      },
      showAutocompleteControl() {
        this.showAutocomplete = true
        this.$refs.autocomplete.clear()
        this.updatePrimary = false
        this.$nextTick(() => {
          this.$refs.autocomplete.focus()
        })
      },
      updatePrimaryAddress() {
        this.showAutocomplete = true
        this.$refs.autocomplete.clear()
        this.updatePrimary = true
        this.$nextTick(() => {
          this.$refs.autocomplete.focus()
        })
      },
      handleBlur() {
        this.showAutocomplete = false
      },
      placeChanged(address) {
        if (!address.country_code || !address.state_code || !address.postal_code) {
          this.$msg.error('Please select a precise address.')
        }

        var data = {
          fullAddress: address.formatted_address,
          address1: address.street_number + ' ' + address.route,
          city: address.city,
          state: address.state,
          zipCode: address.postal_code,
          lat: address.latitude,
          lng: address.longitude,
          isPrimaryAddress: false,
          countryCode: address.country_code,
          stateCode: address.state_code
        }

        if (!this.updatePrimary) {
          this.$axios.post('/api/account/userAddresses/add', data).then(result => {
            if (result.success && result.data) {
              this.$msg.success('Address Added successfully.')
              this.getUserAddress()
            } else {
              this.$msg.error('Something went wrong during adding address. Try again...')
            }
          })
        } else {
          data.isPrimaryAddress = true
          this.$axios.post(`/api/account/userAddresses/update/${this.primary.id}`, data).then(result => {
            if (result.success && result.data) {
              this.$msg.success('Primary address updated successfully.')
              this.getUserAddress()
            } else {
              this.$msg.error('Something went wrong during adding address. Try again...')
            }
          })
        }
      },
      removeAddress(addressId) {
        this.$axios.post(`/api/account/userAddresses/delete/${addressId}`).then(result => {
          if (result.success && result.data) {
            this.$msg.success('Address deleted successfully.')
            this.getUserAddress()
          } else {
            this.$msg.error('Something went wrong during address delete. Try again...')
          }
        })
      },
      setAsPrimary(addressId) {
        this.$axios.post(`/api/account/userAddresses/primary/${addressId}`).then(result => {
          if (result.success && result.data) {
            this.$msg.success('Address marked as primary successfully.')
            this.getUserAddress()
          } else {
            this.$msg.error('Something went wrong during address delete. Try again...')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-addresses {
    display: inline-block;
    width: 100%;

    .addr-text {
      font-size: 14px;
      line-height: 28.8px;
      max-width: calc(100% - 82px);
      @media (max-width: 450px) {
        font-size: 12px;
      }
    }
    .primary-addr {
      font-size: 14px;
      line-height: 28.8px;
      cursor: pointer;
      @media (max-width: 450px) {
        font-size: 12px;
      }
    }
  }
</style>
