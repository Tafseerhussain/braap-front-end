<template>
  <v-card class="d-flex flex-column rounded-10 pa-5">
    <div class="d-flex flex-column justify-center">
      <v-icon size="60" class="mt-n2">mdi-account-box</v-icon>
      <span class="text-h6 font-weight-medium text-center mb-2">{{ contact.firstName + ' ' + contact.lastName }}</span>
    </div>
    <v-divider></v-divider>
    <div class="d-flex align-center py-3">
      <v-row class="my-0">
        <v-col cols="12" class="py-0">
          <span class="body-1 d-flex align-center mb-2">
            <v-icon class="mr-2">mdi-phone-in-talk-outline</v-icon> {{ contact.phone ? contact.phone : '-' }}
          </span>
        </v-col>
        <v-col cols="12" class="py-0">
          <span class="body-1 d-flex align-center mb-2">
            <v-icon class="mr-2">mdi-email-outline</v-icon>
            {{ contact.email }}
            <v-tooltip
              top
              color="primary"
              max-width="310"
              open-delay="100"
              v-if="contact.hasUserAccount"
              content-class="top"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn icon x-small v-bind="attrs" v-on="on" color="braap_green" class="ml-2">
                  <v-icon>$svg-tick</v-icon>
                </v-btn>
              </template>
              <p class="mb-0">Uses customer diagnostic.</p>
            </v-tooltip>
          </span>
        </v-col>
        <v-col cols="12" class="py-0">
          <span class="body-1 d-flex align-center">
            <v-icon class="mr-2">mdi-map-marker-outline</v-icon>
            {{ contact.fullAddress ? contact.fullAddress : '-' }}
          </span>
        </v-col>
      </v-row>
    </div>
    <v-divider></v-divider>

    <div class="d-flex align-center justify-space-around pt-3">
      <div class="d-flex flex-column align-center">
        <v-btn icon small @click="setFavourite">
          <svg xmlns="http://www.w3.org/2000/svg" width="24.486" height="24.223" viewBox="0 0 30.486 29.223">
            <g id="star" transform="translate(-598 -568)">
              <path
                id="fill-star"
                data-name="fill-star"
                d="M599.713,580.618l8.216-2.72,5.44-8.159,3.966,8.159,8.953,3-6.063,6.176.567,8.046-7.933-3.91-7.989,3.91.623-8.613Z"
                :fill="!contact.isFavourite ? '#E6E6E6' : '#FFD740'"
              />
              <path
                id="star-frame"
                data-name="star-frame"
                d="M21.575,12.062c-3.8-9.248-4.929-9.248-5.536-9.248-.558,0-1.708,0-5.849,9.12-8.645,1.514-8.99,2.537-9.152,3.034-.188.563-.534,1.6,6.278,7.106-1.783,8.6-.716,9.19-.2,9.478a1.374,1.374,0,0,0,.676.164c1.55,0,5.941-2.808,8.247-4.357,3.324,2.214,7.265,4.679,8.348,4.678a1.1,1.1,0,0,0,.7-.237c.441-.352.988-.789-.573-9.4,7.311-6.307,7.112-6.8,6.839-7.487C31.145,14.386,30.945,13.885,21.575,12.062Zm1.282,9.248a.955.955,0,0,0-.317.9c.51,2.771.995,5.987,1.1,7.575-1.5-.767-4.513-2.652-7.072-4.37a.955.955,0,0,0-1.072,0,49.365,49.365,0,0,1-7.274,4.277,42.791,42.791,0,0,1,1.08-7.8.956.956,0,0,0-.338-.945A47.637,47.637,0,0,1,3.111,15.6a50.612,50.612,0,0,1,7.9-1.864.959.959,0,0,0,.711-.55A58.121,58.121,0,0,1,16.023,5,56.746,56.746,0,0,1,20,13.263a.954.954,0,0,0,.7.577c3.167.611,6.657,1.373,8.292,1.844C27.83,16.907,25.2,19.3,22.857,21.31Z"
                transform="translate(597.036 565.186)"
                :fill="!contact.isFavourite ? '#E6E6E6' : '#FFD740'"
              />
            </g>
          </svg>
        </v-btn>
        <div class="text-caption" :class="{ 'braap_yellow--text': contact.isFavourite }" style="line-height: 24px">
          Favorite
        </div>
      </div>

      <div class="d-flex flex-column align-center">
        <v-btn icon small @click="remove">
          <v-icon color="error">mdi-close-circle-outline</v-icon>
        </v-btn>
        <div class="text-caption" style="line-height: 24px">Remove</div>
      </div>

      <div class="d-flex flex-column align-center">
        <v-btn icon small @click="click">
          <v-icon color="success">$svg-text-box-edit</v-icon>
        </v-btn>
        <div class="text-caption" style="line-height: 24px">Edit</div>
      </div>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'ContactItem',
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
        this.contact.isFavourite = !this.contact.isFavourite
        this.$axios
          .post(`/api/userCustomer/${this.contact.userCustomerId}/contacts/addOrUpdate`, { ...this.contact })
          .then(result => {
            if (result.success && result.data) {
              this.$emit('saved', result.data)
            } else {
              this.$msg.error('System error, please try again.')
            }
          })
      },
      remove() {
        this.$axios
          .post(`/api/userCustomer/${this.contact.userCustomerId}/contacts/delete/${this.contact.id}`)
          .then(result => {
            if (result.success && result.data) {
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
