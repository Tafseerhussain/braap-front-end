<template>
  <v-card class="d-flex flex-column mb-4 mt-1 mx-2 rounded-br-0 rounded-bl-0" :width="width" @click="click">
    <div class="d-flex align-center px-4 py-2">
      <v-btn icon @click.stop="setFavourite">
        <svg xmlns="http://www.w3.org/2000/svg" width="24.486" height="24.223" viewBox="0 0 30.486 29.223">
          <g id="star" transform="translate(-598 -568)">
            <path
              id="fill-star"
              data-name="fill-star"
              d="M599.713,580.618l8.216-2.72,5.44-8.159,3.966,8.159,8.953,3-6.063,6.176.567,8.046-7.933-3.91-7.989,3.91.623-8.613Z"
              :fill="!contact.IsFavourite ? '#FFF' : '#FFF568'"
            />
            <path
              id="star-frame"
              data-name="star-frame"
              d="M21.575,12.062c-3.8-9.248-4.929-9.248-5.536-9.248-.558,0-1.708,0-5.849,9.12-8.645,1.514-8.99,2.537-9.152,3.034-.188.563-.534,1.6,6.278,7.106-1.783,8.6-.716,9.19-.2,9.478a1.374,1.374,0,0,0,.676.164c1.55,0,5.941-2.808,8.247-4.357,3.324,2.214,7.265,4.679,8.348,4.678a1.1,1.1,0,0,0,.7-.237c.441-.352.988-.789-.573-9.4,7.311-6.307,7.112-6.8,6.839-7.487C31.145,14.386,30.945,13.885,21.575,12.062Zm1.282,9.248a.955.955,0,0,0-.317.9c.51,2.771.995,5.987,1.1,7.575-1.5-.767-4.513-2.652-7.072-4.37a.955.955,0,0,0-1.072,0,49.365,49.365,0,0,1-7.274,4.277,42.791,42.791,0,0,1,1.08-7.8.956.956,0,0,0-.338-.945A47.637,47.637,0,0,1,3.111,15.6a50.612,50.612,0,0,1,7.9-1.864.959.959,0,0,0,.711-.55A58.121,58.121,0,0,1,16.023,5,56.746,56.746,0,0,1,20,13.263a.954.954,0,0,0,.7.577c3.167.611,6.657,1.373,8.292,1.844C27.83,16.907,25.2,19.3,22.857,21.31Z"
              transform="translate(597.036 565.186)"
              :fill="!contact.IsFavourite ? '#A7ABB3' : '#FFF568'"
            />
          </g>
        </svg>
      </v-btn>
      <v-spacer></v-spacer>
      <v-tooltip left color="primary" max-width="310" open-delay="100">
        <template v-slot:activator="{ on, attrs }">
          <v-hover v-slot="{ hover }">
            <v-btn icon :color="hover ? 'braap_red' : 'primary'" @click.stop="remove" v-bind="attrs" v-on="on">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-hover>
        </template>
        Delete the contact
      </v-tooltip>
    </div>
    <div class="d-flex align-center px-4 py-2">
      <v-row dense>
        <v-col cols="12">
          <span class="body-1 d-flex align-center">
            <v-icon class="mr-2">mdi-account-supervisor-outline</v-icon>
            {{ contact.FirstName + ' ' + contact.LastName }}
          </span>
        </v-col>
        <v-col cols="12">
          <span class="body-1 d-flex align-center">
            <v-icon class="mr-2">$svg-phone</v-icon> {{ contact.Phone ? contact.Phone : '-' }}
          </span>
        </v-col>
        <v-col cols="12">
          <span class="body-1 d-flex align-center">
            <v-icon class="mr-2">$svg-email</v-icon>
            {{ contact.Email }}
            <v-tooltip bottom color="primary" max-width="310" open-delay="100" v-if="contact.HasUserAccount">
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon x-small v-bind="attrs" v-on="on" color="braap_green" class="ml-2">
                  <v-icon>$svg-tick</v-icon>
                </v-btn>
              </template>
              <p class="mb-0">Uses customer diagnostic.</p>
            </v-tooltip>
          </span>
        </v-col>
        <v-col cols="12">
          <span class="body-1 d-flex align-center">
            <v-icon class="mr-2">mdi-map-marker-outline</v-icon>
            {{ contact.FullAddress ? contact.FullAddress : '-' }}
          </span>
        </v-col>
      </v-row>
    </div>
    <v-spacer></v-spacer>
    <div class="d-flex align-center px-4 py-2">
      <v-spacer></v-spacer>
      <v-icon large>mdi-account-circle</v-icon>
    </div>
    <v-progress-linear value="100" height="4" class="elevation-1"></v-progress-linear>
  </v-card>
</template>

<script>
  export default {
    name: 'Contact',
    props: {
      value: {
        type: Object,
        required: true
      },
      width: {
        type: Number
      }
    },
    components: {},
    data: function() {
      return {
        contact: {}
      }
    },
    created() {
      if (this.value) {
        this.contact = this.value
      }
    },
    watch: {
      value(val) {
        if (val) {
          this.contact = val
        }
      }
    },
    mounted() {},
    methods: {
      click() {
        this.$emit('click', this.contact)
      },
      setFavourite() {
        this.contact.IsFavourite = !this.contact.IsFavourite
        this.$axios.post('/UserCustomer/AddOrUpdateUserCustomerContact', { ...this.contact }).then(result => {
          if (result && result.status === 200 && result.data) {
            this.$emit('saved', result.data)
          } else {
            this.$msg.error('System error, please try again.')
          }
        })
      },
      remove() {
        this.$axios.post('/UserCustomer/DeleteUserCustomerContact', { Id: this.contact.Id }).then(result => {
          if (result && result.status === 200 && result.data) {
            this.$emit('removed', this.contact.Id)
          } else {
            this.$msg.error('System error, please try again.')
          }
        })
      }
    }
  }
</script>

<style lang="scss">
</style>
