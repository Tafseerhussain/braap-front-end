<template>
  <v-card class="registration-form rounded-10 px-12 py-9" :max-width="maxWidth">
    <v-card-title class="py-4 px-0">
      <div class="text-h3 braap_orange--text font-weight-bold">Register</div>
      <div class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6">
        <v-icon :color="darkLogo ? 'primary' : 'white'" class="back-icon">$svg-braap-logo</v-icon>
      </div>
    </v-card-title>

    <p class="subtitle-0 mt-2 mr-14">Braap is free to join! Let’s get you setup.</p>

    <v-card-text class="pa-0 py-3 overflow-hidden">
      <v-form ref="form" lazy-validation>
        <vue-tel-input-vuetify
          ref="telInput"
          label=""
          vertical
          color="braap_orange"
          v-model="phoneText"
          @validate="phoneInput"
          :error="invalid"
          required
          :rules="[(v) => !!v || 'Please Enter a Valid Phone Number']"
          validate-on-blur
          :error-messages="errorMessage"
          @enter="getStarted"
        ></vue-tel-input-vuetify>
      </v-form>
    </v-card-text>
    <div class="d-flex align-center py-1">
      <v-btn
        color="primary"
        class="rounded-10 px-10 body-0"
        :disabled="disabled"
        :dark="!disabled"
        x-large
        @click="getStarted"
        :loading="loading"
      >
        Get Started
      </v-btn>
    </div>

    <div class="d-flex align-center justify-center braap_grey--text pt-8">
      Already a User?<a class="text-decoration-underline primary--text ml-1" @click="$emit('on-login')">Login here?</a>
    </div>
  </v-card>
</template>

<script>
  import { mapMutations } from 'vuex'

  export default {
    name: 'GetStarted',
    components: {},
    props: {
      darkLogo: {
        type: Boolean
      },
      maxWidth: {
        type: [String, Number]
      },
      visible: {
        type: Boolean
      }
    },
    data: function() {
      return {
        loading: false,
        phoneText: null,
        phoneObj: null,
        errorMessage: null
      }
    },
    mounted() {
      this.phoneText = this.$store.state.register.phone
      this.$refs.telInput.$refs.input.focus()
    },
    watch: {
      visible(val) {
        if (val) {
          setTimeout(() => {
            this.$refs.telInput.$refs.input.focus()
          }, 400)
        }
      }
    },
    computed: {
      invalid() {
        return this.phoneText && (!this.phoneObj || !this.phoneObj.isValid)
      },
      disabled() {
        return !this.phoneText || !this.phoneObj || !this.phoneObj.isValid
      }
    },
    methods: {
      getStarted() {
        if (this.$refs.form.validate()) {
          this.isPhoneExist().then(valid => {
            if (valid) {
              this.loading = true
              this.$axios.post('/api/user/sendPhoneOtp', { phone: this.phoneObj.number.e164 }).then(result => {
                if (result.data) {
                  this.$emit('next')
                  this.setRegisterModel({
                    phone: this.phoneObj.number.e164,
                    phoneFormatted: this.phoneObj.number.international
                  })
                } else {
                  this.$msg.error('Something went wrong during sending code. Try again...')
                }
                this.loading = false
              })
            }
          })
        }
      },
      isPhoneExist() {
        return new Promise((resolve, reject) => {
          this.$axios.post('/api/user/isPhoneExist', { phone: this.phoneObj.number.e164 }).then(result => {
            if (result.data) {
              this.errorMessage = ['You are already a user. Either reset your password or click on the chat for help.']
              reject()
            } else {
              resolve(true)
            }
          })
        })
      },
      phoneInput(obj) {
        this.phoneObj = obj
      },
      reset() {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loading = false
      },
      ...mapMutations({ setRegisterModel: 'register/setModel' })
    }
  }
</script>

<style lang="scss">
  .registration-form {
    .v-card__title {
      word-break: normal;
      .text-h4 {
        font-size: 32px;
        line-height: 46px;
      }
    }

    .braap-logo {
      position: absolute;
      right: -30px;
      top: 40px;
      .back-icon {
        font-size: 78px;
        svg {
          width: 78px;
          height: 78px;
        }
      }
    }
  }
</style>
