<template>
  <div class="shipping-address">
    <h1 class="checkout-title font-weight-bold primary--text mb-3">Address Details</h1>
    <v-select
      label="Ship To"
      hide-details
      color="braap_orange"
      :items="addresses"
      :menu-props="menuProps"
      item-text="fullAddress"
      item-value="id"
      class="mb-7"
      v-model="selected"
      @change="addressChanged"
    ></v-select>

    <v-expand-transition>
      <div v-if="selected === 'NEW_ADDRESS'" class="message text-center rounded-10 mb-7 py-6">
        <v-form ref="form">
          <vue-google-autocomplete
            ref="autocomplete"
            label="Enter a location"
            placeholder=""
            id="new_address"
            color="braap_orange"
            classname="mb-5"
            hide-details
            types="establishment"
            :country="['us', 'ca']"
            :fields="['address_component', 'geometry', 'formatted_address']"
            @placechanged="placeChanged"
            :value="model.address1"
            required
            :rules="[(v) => !!v || 'Item is required']"
          >
          </vue-google-autocomplete>

          <v-text-field
            label="Suit.Apt#"
            color="braap_orange"
            hide-details
            class="mb-5"
            v-model="model.address2"
          ></v-text-field>

          <v-row class="my-0">
            <v-col cols="12" sm="6" class="py-0">
              <v-text-field
                readonly
                label="City"
                color="braap_orange"
                hide-details
                class="mb-5"
                v-model="model.city"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <v-text-field
                readonly
                label="State"
                hide-details
                color="braap_orange"
                class="mb-5"
                v-model="model.state"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row class="my-0">
            <v-col cols="12" sm="6" class="py-0">
              <v-text-field
                label="Zip / Postal code"
                hide-details
                color="braap_orange"
                class="mb-5"
                v-model="model.zipCode"
                :rules="[(v) => !!v || '']"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="6" class="py-0">
              <v-select
                v-model="model.countryCode"
                readonly
                label="Country"
                hide-details
                color="braap_orange"
                :items="countries"
                item-text="name"
                item-value="code"
                :menu-props="menuProps"
                class="mb-5"
              ></v-select>
            </v-col>
          </v-row>
        </v-form>
      </div>
    </v-expand-transition>

    <div class="message text-center rounded-10 mb-7">
      <template v-if="loading">
        <v-progress-circular indeterminate color="braap_orange" class="my-n1"></v-progress-circular>
      </template>
      <template v-else-if="shipping">
        Shipping: {{ shipping | currency }}

        <v-tooltip top color="primary" open-delay="100" max-width="300" content-class="top">
          <template v-slot:activator="{ on, attrs }">
            <span>
              (<a class="braap_grey--text text-decoration-underline" v-bind="attrs" v-on="on">Understand more</a>)
            </span>
          </template>

          Usually, Braap shipping is free. Sometimes we must charge to get fast delivery.
        </v-tooltip>
      </template>
      <template v-else>Free Shipping</template>
    </div>

    <div class="d-flex">
      <v-btn
        x-large
        color="braap_orange"
        :disabled="disabled"
        :dark="!disabled"
        class="rounded-10 ml-auto boyd-0 px-8"
        @click="next"
        :loading="processing"
        >Confirm Address</v-btn
      >
    </div>
  </div>
</template>

<script>
  import VueGoogleAutocomplete from '@/components/Common/VueGoogleAutocomplete.vue'

  export default {
    name: 'ShippingAddress',
    components: {
      VueGoogleAutocomplete
    },
    props: {
      shipping: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        menuProps: {
          offsetY: true,
          nudgeTop: '-4px',
          contentClass: 'rounded-0',
          maxHeight: '436'
        },
        addresses: [],
        countries: [
          { name: 'Afghanistan', code: 'AF' },
          { name: 'Åland Islands', code: 'AX' },
          { name: 'Albania', code: 'AL' },
          { name: 'Algeria', code: 'DZ' },
          { name: 'Andorra', code: 'AD' },
          { name: 'Angola', code: 'AO' },
          { name: 'Anguilla', code: 'AI' },
          { name: 'Antarctica', code: 'AQ' },
          { name: 'Antigua & Barbuda', code: 'AG' },
          { name: 'Argentina', code: 'AR' },
          { name: 'Armenia', code: 'AM' },
          { name: 'Aruba', code: 'AW' },
          { name: 'Ascension Island', code: 'AC' },
          { name: 'Australia', code: 'AU' },
          { name: 'Austria', code: 'AT' },
          { name: 'Azerbaijan', code: 'AZ' },
          { name: 'Bahamas', code: 'BS' },
          { name: 'Bahrain', code: 'BH' },
          { name: 'Bangladesh', code: 'BD' },
          { name: 'Barbados', code: 'BB' },
          { name: 'Belarus', code: 'BY' },
          { name: 'Belgium', code: 'BE' },
          { name: 'Belize', code: 'BZ' },
          { name: 'Benin', code: 'BJ' },
          { name: 'Bermuda', code: 'BM' },
          { name: 'Bhutan', code: 'BT' },
          { name: 'Bolivia', code: 'BO' },
          { name: 'Bosnia & Herzegovina', code: 'BA' },
          { name: 'Botswana', code: 'BW' },
          { name: 'Bouvet Island', code: 'BV' },
          { name: 'Brazil', code: 'BR' },
          { name: 'British Indian Ocean Territory', code: 'IO' },
          { name: 'British Virgin Islands', code: 'VG' },
          { name: 'Brunei', code: 'BN' },
          { name: 'Bulgaria', code: 'BG' },
          { name: 'Burkina Faso', code: 'BF' },
          { name: 'Burundi', code: 'BI' },
          { name: 'Cambodia', code: 'KH' },
          { name: 'Cameroon', code: 'CM' },
          { name: 'Canada', code: 'CA' },
          { name: 'Cape Verde', code: 'CV' },
          { name: 'Caribbean Netherlands', code: 'BQ' },
          { name: 'Cayman Islands', code: 'KY' },
          { name: 'Central African Republic', code: 'CF' },
          { name: 'Chad', code: 'TD' },
          { name: 'Chile', code: 'CL' },
          { name: 'China', code: 'CN' },
          { name: 'Colombia', code: 'CO' },
          { name: 'Comoros', code: 'KM' },
          { name: 'Congo - Brazzaville', code: 'CG' },
          { name: 'Congo - Kinshasa', code: 'CD' },
          { name: 'Cook Islands', code: 'CK' },
          { name: 'Costa Rica', code: 'CR' },
          { name: 'Côte d’Ivoire', code: 'CI' },
          { name: 'Croatia', code: 'HR' },
          { name: 'Curaçao', code: 'CW' },
          { name: 'Cyprus', code: 'CY' },
          { name: 'Czechia', code: 'CZ' },
          { name: 'Denmark', code: 'DK' },
          { name: 'Djibouti', code: 'DJ' },
          { name: 'Dominica', code: 'DM' },
          { name: 'Dominican Republic', code: 'DO' },
          { name: 'Ecuador', code: 'EC' },
          { name: 'Egypt', code: 'EG' },
          { name: 'El Salvador', code: 'SV' },
          { name: 'Equatorial Guinea', code: 'GQ' },
          { name: 'Eritrea', code: 'ER' },
          { name: 'Estonia', code: 'EE' },
          { name: 'Eswatini', code: 'SZ' },
          { name: 'Ethiopia', code: 'ET' },
          { name: 'Falkland Islands', code: 'FK' },
          { name: 'Faroe Islands', code: 'FO' },
          { name: 'Fiji', code: 'FJ' },
          { name: 'Finland', code: 'FI' },
          { name: 'France', code: 'FR' },
          { name: 'French Guiana', code: 'GF' },
          { name: 'French Polynesia', code: 'PF' },
          { name: 'French Southern Territories', code: 'TF' },
          { name: 'Gabon', code: 'GA' },
          { name: 'Gambia', code: 'GM' },
          { name: 'Georgia', code: 'GE' },
          { name: 'Germany', code: 'DE' },
          { name: 'Ghana', code: 'GH' },
          { name: 'Gibraltar', code: 'GI' },
          { name: 'Greece', code: 'GR' },
          { name: 'Greenland', code: 'GL' },
          { name: 'Grenada', code: 'GD' },
          { name: 'Guadeloupe', code: 'GP' },
          { name: 'Guam', code: 'GU' },
          { name: 'Guatemala', code: 'GT' },
          { name: 'Guernsey', code: 'GG' },
          { name: 'Guinea', code: 'GN' },
          { name: 'Guinea-Bissau', code: 'GW' },
          { name: 'Guyana', code: 'GY' },
          { name: 'Haiti', code: 'HT' },
          { name: 'Honduras', code: 'HN' },
          { name: 'Hong Kong SAR China', code: 'HK' },
          { name: 'Hungary', code: 'HU' },
          { name: 'Iceland', code: 'IS' },
          { name: 'India', code: 'IN' },
          { name: 'Indonesia', code: 'ID' },
          { name: 'Iraq', code: 'IQ' },
          { name: 'Ireland', code: 'IE' },
          { name: 'Isle of Man', code: 'IM' },
          { name: 'Israel', code: 'IL' },
          { name: 'Italy', code: 'IT' },
          { name: 'Jamaica', code: 'JM' },
          { name: 'Japan', code: 'JP' },
          { name: 'Jersey', code: 'JE' },
          { name: 'Jordan', code: 'JO' },
          { name: 'Kazakhstan', code: 'KZ' },
          { name: 'Kenya', code: 'KE' },
          { name: 'Kiribati', code: 'KI' },
          { name: 'Kosovo', code: 'XK' },
          { name: 'Kuwait', code: 'KW' },
          { name: 'Kyrgyzstan', code: 'KG' },
          { name: 'Laos', code: 'LA' },
          { name: 'Latvia', code: 'LV' },
          { name: 'Lebanon', code: 'LB' },
          { name: 'Lesotho', code: 'LS' },
          { name: 'Liberia', code: 'LR' },
          { name: 'Libya', code: 'LY' },
          { name: 'Liechtenstein', code: 'LI' },
          { name: 'Lithuania', code: 'LT' },
          { name: 'Luxembourg', code: 'LU' },
          { name: 'Macao SAR China', code: 'MO' },
          { name: 'Madagascar', code: 'MG' },
          { name: 'Malawi', code: 'MW' },
          { name: 'Malaysia', code: 'MY' },
          { name: 'Maldives', code: 'MV' },
          { name: 'Mali', code: 'ML' },
          { name: 'Malta', code: 'MT' },
          { name: 'Martinique', code: 'MQ' },
          { name: 'Mauritania', code: 'MR' },
          { name: 'Mauritius', code: 'MU' },
          { name: 'Mayotte', code: 'YT' },
          { name: 'Mexico', code: 'MX' },
          { name: 'Moldova', code: 'MD' },
          { name: 'Monaco', code: 'MC' },
          { name: 'Mongolia', code: 'MN' },
          { name: 'Montenegro', code: 'ME' },
          { name: 'Montserrat', code: 'MS' },
          { name: 'Morocco', code: 'MA' },
          { name: 'Mozambique', code: 'MZ' },
          { name: 'Myanmar (Burma)', code: 'MM' },
          { name: 'Namibia', code: 'NA' },
          { name: 'Nauru', code: 'NR' },
          { name: 'Nepal', code: 'NP' },
          { name: 'Netherlands', code: 'NL' },
          { name: 'New Caledonia', code: 'NC' },
          { name: 'New Zealand', code: 'NZ' },
          { name: 'Nicaragua', code: 'NI' },
          { name: 'Niger', code: 'NE' },
          { name: 'Nigeria', code: 'NG' },
          { name: 'Niue', code: 'NU' },
          { name: 'North Macedonia', code: 'MK' },
          { name: 'Norway', code: 'NO' },
          { name: 'Oman', code: 'OM' },
          { name: 'Pakistan', code: 'PK' },
          { name: 'Palestinian Territories', code: 'PS' },
          { name: 'Panama', code: 'PA' },
          { name: 'Papua New Guinea', code: 'PG' },
          { name: 'Paraguay', code: 'PY' },
          { name: 'Peru', code: 'PE' },
          { name: 'Philippines', code: 'PH' },
          { name: 'Pitcairn Islands', code: 'PN' },
          { name: 'Poland', code: 'PL' },
          { name: 'Portugal', code: 'PT' },
          { name: 'Puerto Rico', code: 'PR' },
          { name: 'Qatar', code: 'QA' },
          { name: 'Réunion', code: 'RE' },
          { name: 'Romania', code: 'RO' },
          { name: 'Russia', code: 'RU' },
          { name: 'Rwanda', code: 'RW' },
          { name: 'Samoa', code: 'WS' },
          { name: 'San Marino', code: 'SM' },
          { name: 'São Tomé & Príncipe', code: 'ST' },
          { name: 'Saudi Arabia', code: 'SA' },
          { name: 'Senegal', code: 'SN' },
          { name: 'Serbia', code: 'RS' },
          { name: 'Seychelles', code: 'SC' },
          { name: 'Sierra Leone', code: 'SL' },
          { name: 'Singapore', code: 'SG' },
          { name: 'Sint Maarten', code: 'SX' },
          { name: 'Slovakia', code: 'SK' },
          { name: 'Slovenia', code: 'SI' },
          { name: 'Solomon Islands', code: 'SB' },
          { name: 'Somalia', code: 'SO' },
          { name: 'South Africa', code: 'ZA' },
          { name: 'South Georgia & South Sandwich Islands', code: 'GS' },
          { name: 'South Korea', code: 'KR' },
          { name: 'South Sudan', code: 'SS' },
          { name: 'Spain', code: 'ES' },
          { name: 'Sri Lanka', code: 'LK' },
          { name: 'St. Barthélemy', code: 'BL' },
          { name: 'St. Helena', code: 'SH' },
          { name: 'St. Kitts & Nevis', code: 'KN' },
          { name: 'St. Lucia', code: 'LC' },
          { name: 'St. Martin', code: 'MF' },
          { name: 'St. Pierre & Miquelon', code: 'PM' },
          { name: 'St. Vincent & Grenadines', code: 'VC' },
          { name: 'Suriname', code: 'SR' },
          { name: 'Svalbard & Jan Mayen', code: 'SJ' },
          { name: 'Sweden', code: 'SE' },
          { name: 'Switzerland', code: 'CH' },
          { name: 'Taiwan', code: 'TW' },
          { name: 'Tajikistan', code: 'TJ' },
          { name: 'Tanzania', code: 'TZ' },
          { name: 'Thailand', code: 'TH' },
          { name: 'Timor-Leste', code: 'TL' },
          { name: 'Togo', code: 'TG' },
          { name: 'Tokelau', code: 'TK' },
          { name: 'Tonga', code: 'TO' },
          { name: 'Trinidad & Tobago', code: 'TT' },
          { name: 'Tristan da Cunha', code: 'TA' },
          { name: 'Tunisia', code: 'TN' },
          { name: 'Turkey', code: 'TR' },
          { name: 'Turkmenistan', code: 'TM' },
          { name: 'Turks & Caicos Islands', code: 'TC' },
          { name: 'Tuvalu', code: 'TV' },
          { name: 'Uganda', code: 'UG' },
          { name: 'Ukraine', code: 'UA' },
          { name: 'United Arab Emirates', code: 'AE' },
          { name: 'United Kingdom', code: 'GB' },
          { name: 'United States', code: 'US' },
          { name: 'Uruguay', code: 'UY' },
          { name: 'Uzbekistan', code: 'UZ' },
          { name: 'Vanuatu', code: 'VU' },
          { name: 'Vatican City', code: 'VA' },
          { name: 'Venezuela', code: 'VE' },
          { name: 'Vietnam', code: 'VN' },
          { name: 'Wallis & Futuna', code: 'WF' },
          { name: 'Western Sahara', code: 'EH' },
          { name: 'Yemen', code: 'YE' },
          { name: 'Zambia', code: 'ZM' },
          { name: 'Zimbabwe', code: 'ZW' }
        ],
        model: {
          fullAddress: null,
          address1: null,
          address2: null,
          city: null,
          state: null,
          zipCode: null,
          lat: null,
          lng: null,
          isPrimaryAddress: false,
          countryCode: null,
          stateCode: null
        },
        selected: null,
        loading: false,
        processing: false,
        disabled: false
      }
    },
    created() {
      this.getShippingAddress()
    },
    methods: {
      getShippingAddress() {
        this.$axios.post(`/api/secureCheckout/shippingAddress`).then(result => {
          if (result.success && result.data) {
            this.addresses = [...result.data, { id: 'NEW_ADDRESS', fullAddress: '+ Add Ship to Address' }]
            if (this.addresses.length > 0) {
              this.selected = this.addresses[0].id
            }
          }
        })
      },
      getCheckoutDetails(address) {
        this.loading = true
        this.disabled = true
        this.$axios.post(`/api/secureCheckout/getCheckoutDetail`, { ...address }).then(result => {
          if (result.success && result.data) {
            this.$emit('change', result.data)
            this.disabled = false
          }
          this.loading = false
        })
      },
      placeChanged(address) {
        if (!address.country_code || !address.state_code || !address.postal_code) {
          this.$msg.error('Please select a precise address.')
        }

        this.model = {
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

        this.getCheckoutDetails({ ...this.model })
      },
      addressChanged() {
        if (this.selected && this.selected !== 'NEW_ADDRESS') {
          this.getCheckoutDetails({ id: this.selected })
        }
      },
      saveShippingAddress(address) {
        this.processing = true
        this.$axios.post(`/api/secureCheckout/shippingAddress/save`, { ...address }).then(result => {
          if (result.success && result.data) {
            let card = null
            if (result.data.stripeSavedPaymentMethod) {
              card = {
                expiry: result.data.stripeSavedPaymentMethod.expire,
                last4: result.data.stripeSavedPaymentMethod.last4,
                id: result.data.stripeSavedPaymentMethod.stripePaymentMethodId
              }
            }
            this.$emit('next', {
              payment: {
                publishableKey: result.data.stripePublishableKey,
                returnUrl: result.data.stripePaymentReturnUrl,
                clientSecret: result.data.stripePaymentClientSecret,
                id: result.data.stripePaymentIntentId
              },
              card
            })
          }
          this.processing = false
        })
      },
      next() {
        if (this.selected === 'NEW_ADDRESS' && this.$refs.form.validate()) {
          this.saveShippingAddress({ ...this.model })
        } else {
          this.saveShippingAddress({ id: this.selected })
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .check-out {
    .shipping-address {
      .message {
        border: 1px solid $braap_light_grey;
        line-height: 24px;
        font-size: 14px;
        padding: 12px 15px;
      }
    }
  }
</style>