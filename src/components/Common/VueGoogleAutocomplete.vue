<template>
  <v-text-field
    ref="autocomplete"
    :class="classname"
    :id="id"
    v-bind="$attrs"
    :placeholder="phInner"
    :disabled="disabled"
    v-model="autocompleteText"
    @focus="onFocus()"
    @blur="onBlur()"
    @change="onChange"
    @keypress="onKeyPress"
    @keyup="onKeyUp"
  />
</template>

<script>
  const ADDRESS_COMPONENTS = {
    subpremise: ['subpremise', 'short_name'],
    street_number: ['street_number', 'short_name'],
    route: ['route', 'long_name'],
    city: ['locality', 'long_name'],
    state: ['administrative_area_level_1', 'long_name'],
    state_code: ['administrative_area_level_1', 'short_name'],
    country: ['country', 'long_name'],
    country_code: ['country', 'short_name'],
    postal_code: ['postal_code', 'short_name']
  }

  const CITIES_TYPE = ['locality', 'administrative_area_level_3']
  const REGIONS_TYPE = [
    'locality',
    'sublocality',
    'postal_code',
    'country',
    'administrative_area_level_1',
    'administrative_area_level_2'
  ]

  /*
                                                                                                                          By default, we're only including basic place data because requesting these 
                                                                                                                          fields place data is not additionally charged by Google. Please refer to:

                                                                                                                          https://developers.google.com/maps/billing/understanding-cost-of-use#basic-data
                                                                                                                        */
  const BASIC_DATA_FIELDS = [
    'address_components',
    'adr_address',
    'alt_id',
    'formatted_address',
    'geometry',
    'icon',
    'id',
    'name',
    'business_status',
    'photo',
    'place_id',
    'scope',
    'type',
    'url',
    'vicinity'
  ]

  export default {
    name: 'VueGoogleAutocomplete',

    props: {
      id: {
        type: String,
        required: true
      },

      classname: String,

      placeholder: {
        type: String
      },

      disabled: {
        type: Boolean,
        default: false
      },

      types: {
        type: String,
        default: 'address'
      },

      fields: {
        type: Array,
        default: function() {
          return BASIC_DATA_FIELDS
        }
      },

      country: {
        type: [String, Array],
        default: null
      },

      enableGeolocation: {
        type: Boolean,
        default: false
      },

      geolocationOptions: {
        type: Object,
        default: null
      },

      value: {
        type: String
      }
    },

    data() {
      return {
        /**
         * The Autocomplete object.
         *
         * @type {Autocomplete}
         * @link https://developers.google.com/maps/documentation/javascript/reference#Autocomplete
         */
        autocomplete: null,

        /**
         * Autocomplete input text
         * @type {String}
         */
        autocompleteText: '',

        geolocation: {
          /**
           * Google Geocoder Objet
           * @type {Geocoder}
           * @link https://developers.google.com/maps/documentation/javascript/reference#Geocoder
           */
          geocoder: null,

          /**
           * Filled after geolocate result
           * @type {Coordinates}
           * @link https://developer.mozilla.org/en-US/docs/Web/API/Coordinates
           */
          loc: null,

          /**
           * Filled after geolocate result
           * @type {Position}
           * @link https://developer.mozilla.org/en-US/docs/Web/API/Position
           */
          position: null
        },
        ddlAttached: false,
        phInner: null
      }
    },

    watch: {
      value(val) {
        this.autocompleteText = val
      },
      country: function() {
        this.autocomplete.setComponentRestrictions({
          country: this.country === null ? [] : this.country
        })
      }
    },

    mounted: function() {
      if (this.value) this.autocompleteText = this.value
      const options = {}

      if (this.types) {
        options.types = [this.types]
      }

      if (this.country) {
        options.componentRestrictions = {
          country: this.country
        }
      }

      this.autocomplete = new window.google.maps.places.Autocomplete(document.getElementById(this.id), options)

      this.autocomplete.setFields(this.fields)

      this.autocomplete.addListener('place_changed', this.onPlaceChanged)

      setTimeout(() => {
        this.phInner = 'Enter a location'
        this.$nextTick(() => (this.phInner = this.placeholder))
      }, 500)

      // setTimeout(() => {
      //   this.$refs.autocomplete.$refs.input.placeholder = ''
      // }, 500)
    },

    methods: {
      /**
       * When a place changed
       */
      onPlaceChanged() {
        let place = this.autocomplete.getPlace()

        if (!place.geometry) {
          // User entered the name of a Place that was not suggested and
          // pressed the Enter key, or the Place Details request failed.
          this.$emit('no-results-found', place, this.id)
          return
        }

        if (place.address_components !== undefined) {
          // return returnData object and PlaceResult object
          this.$emit('placechanged', this.formatResult(place), place, this.id)

          // update autocompleteText then emit change event
          this.autocompleteText = document.getElementById(this.id).value
          this.onChange()
        }
      },

      /**
       * When the input gets focus
       */
      onFocus() {
        this.biasAutocompleteLocation()
        this.setDropdown()
        this.$emit('focus')
      },

      /**
       * When the input loses focus
       */
      onBlur() {
        this.$emit('blur')
      },

      /**
       * When the input got changed
       */
      onChange() {
        this.$emit('change', this.autocompleteText)
        this.$emit('input', this.autocompleteText)
      },

      /**
       * When a key gets pressed
       * @param  {Event} event A keypress event
       */
      onKeyPress(event) {
        this.$emit('keypress', event)
      },

      /**
       * When a keyup occurs
       * @param  {Event} event A keyup event
       */
      onKeyUp(event) {
        this.setDropdown()
        this.$emit('keyup', event)
      },

      /**
       * Clear the input
       */
      clear() {
        this.autocompleteText = ''
      },

      /**
       * Focus the input
       */
      focus() {
        this.$refs.autocomplete.focus()
      },

      /**
       * Blur the input
       */
      blur() {
        this.$refs.autocomplete.blur()
      },

      /**
       * Update the value of the input
       * @param  {String} value
       */
      update(value) {
        this.autocompleteText = value
      },

      /**
       * Update the coordinates of the input
       * @param  {Coordinates} value
       */
      updateCoordinates(value) {
        if (!value && !(value.lat || value.lng)) return
        if (!this.geolocation.geocoder) this.geolocation.geocoder = new window.google.maps.Geocoder()
        this.geolocation.geocoder.geocode({ location: value }, (results, status) => {
          if (status === 'OK') {
            results = this.filterGeocodeResultTypes(results)
            if (results[0]) {
              this.$emit('placechanged', this.formatResult(results[0]), results[0], this.id)
              this.update(results[0].formatted_address)
            } else {
              this.$emit('error', 'no result for provided coordinates')
            }
          } else {
            this.$emit('error', 'error getting address from coords')
          }
        })
      },

      /**
       * Update location based on navigator geolocation
       */
      geolocate() {
        this.updateGeolocation(geolocation => {
          this.updateCoordinates(geolocation)
        })
      },

      /**
       * Update internal location from navigator geolocation
       * @param  {Function} (geolocation, position)
       */
      updateGeolocation(callback = null) {
        if (navigator.geolocation) {
          let options = {}
          if (this.geolocationOptions) Object.assign(options, this.geolocationOptions)
          navigator.geolocation.getCurrentPosition(
            position => {
              let geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
              }
              this.geolocation.loc = geolocation
              this.geolocation.position = position

              if (callback) callback(geolocation, position)
            },
            err => {
              this.$emit('error', 'Cannot get Coordinates from navigator', err)
            },
            options
          )
        }
      },

      // Bias the autocomplete object to the user's geographical location,
      // as supplied by the browser's 'navigator.geolocation' object.
      biasAutocompleteLocation() {
        if (this.enableGeolocation) {
          this.updateGeolocation((geolocation, position) => {
            let circle = new window.google.maps.Circle({
              center: geolocation,
              radius: position.coords.accuracy
            })
            this.autocomplete.setBounds(circle.getBounds())
          })
        }
      },

      /**
       * Format result from Geo google APIs
       * @param place
       * @returns {{formatted output}}
       */
      formatResult(place) {
        let returnData = {}

        Object.keys(ADDRESS_COMPONENTS).forEach(key => {
          let addressType = ADDRESS_COMPONENTS[key][0]
          let name = ADDRESS_COMPONENTS[key][1]
          var field = place.address_components.find(x => x.types[0] == addressType)
          if (field) returnData[key] = field[name]
        })

        returnData['latitude'] = place.geometry.location.lat()
        returnData['longitude'] = place.geometry.location.lng()

        returnData['formatted_address'] = place.formatted_address
        return returnData
      },

      /**
       * Extract configured types out of raw result as
       * Geocode API does not allow to do it
       * @param results
       * @returns {GeocoderResult}
       * @link https://developers.google.com/maps/documentation/javascript/reference#GeocoderResult
       */
      filterGeocodeResultTypes(results) {
        if (!results || !this.types) return results
        let output = []
        let types = [this.types]
        if (types.includes('(cities)')) types = types.concat(CITIES_TYPE)
        if (types.includes('(regions)')) types = types.concat(REGIONS_TYPE)

        for (let r of results) {
          for (let t of r.types) {
            if (types.includes(t)) {
              output.push(r)
              break
            }
          }
        }
        return output
      },

      setDropdown() {
        if (!this.ddlAttached) {
          let count = 1
          var timer = setInterval(() => {
            var data = []
            var nodes = document.querySelectorAll('.pac-container')
            for (var i = 0; i < nodes.length; i++) {
              if (nodes[i].offsetParent) {
                data.push(nodes[i])
                break
              }
            }
            if (data.length > 0) {
              clearInterval(timer)
              this.ddlAttached = true
              data[0].classList.add('vue-google-autocomplete')
            }
            if (count > 10) {
              clearInterval(timer)
            }
            count++
          }, 100)
        }
      }
    }
  }
</script>
<style  lang="scss">
  .vue-google-autocomplete.pac-container {
    box-sizing: content-box;
    padding-top: 8px;
    padding-bottom: 8px;
    // margin-left: -5px;
    font-family: 'axiforma';
    font-size: 14px;
    margin-top: 4px;
    border-radius: 0px;
    box-shadow: 0px 5px 5px -3px rgb(0 0 0 / 20%), 0px 8px 10px 1px rgb(0 0 0 / 14%), 0px 3px 14px 2px rgb(0 0 0 / 12%);
    .pac-item {
      font-size: 14px;
      padding: 5px 16px;
      border-top: 0px;
    }

    &:after {
      height: 0px;
      padding: 0;
    }
  }
</style>