<template>
  <v-card class="registration-form rounded-10 px-12 py-9" :max-width="maxWidth">
    <v-card-title class="py-4 px-0">
      <div
        class="braap_orange--text font-weight-bold pr-14"
        style="font-size: 32px; line-height: 46px; word-break: normal"
      >
        Couple of Quick <br />Things.
      </div>
      <a class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6" @click.prevent="back">
        <v-icon :dark="!darkLogo" class="back-icon">mdi-arrow-left</v-icon>
      </a>
    </v-card-title>

    <p class="subtitle-0 mt-2 mr-14 mb-0"></p>

    <v-card-text class="pa-0 py-3 overflow-hidden">
      <v-form ref="form" lazy-validation>
        <v-row>
          <v-col>
            <v-text-field
              color="braap_orange"
              label="First Name"
              v-model="model.firstName"
              required
              :rules="[(v) => !!v || '']"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              color="braap_orange"
              label="Last Name"
              v-model="model.lastName"
              required
              :rules="[(v) => !!v || '']"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          color="braap_orange"
          label="Email Address"
          v-model="model.email"
          required
          :rules="emailRules"
          :error-messages="emailExist"
        ></v-text-field>

        <v-text-field
          color="braap_orange"
          label="Password"
          v-model="model.password"
          required
          :rules="passwordRules"
          :append-icon="showPwd ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPwd ? 'text' : 'password'"
          @click:append="showPwd = !showPwd"
        ></v-text-field>

        <v-text-field
          color="braap_orange"
          label="Confirm Password"
          v-model="model.confirmPassword"
          required
          :rules="confirmPasswordRules"
          :append-icon="showConfirmationPwd ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showConfirmationPwd ? 'text' : 'password'"
          @click:append="showConfirmationPwd = !showConfirmationPwd"
        ></v-text-field>

        <div class="d-flex align-center justify-end mt-n2">
          <v-checkbox :ripple="false" large color="braap_orange" :rules="[(v) => !!v || '']">
            <template #label>
              <span class="body-1">Accept Terms and Agreements</span>
            </template>
          </v-checkbox>
        </div>
      </v-form>
    </v-card-text>
    <div class="d-flex align-center justify-center">
      <v-btn color="primary" class="rounded-10 px-10 body-0" dark x-large @click="setupDetails" :loading="loading">
        Setup Account
      </v-btn>
    </div>
  </v-card>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'MoreDetails',
    components: {},
    props: {
      darkLogo: {
        type: Boolean
      },
      maxWidth: {
        type: [String, Number]
      }
    },
    data: function() {
      let $this = this
      return {
        loading: false,
        showPwd: false,
        showConfirmationPwd: false,
        model: {
          Password: null,
          Email: null
        },
        emailExist: null,
        emailRules: [
          v => !!v || '',
          v =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || 'Email must be valid'
        ],
        passwordRules: [
          v => !!v || '',
          v => (v && v.length >= 6 && v.length <= 15) || 'Password should be min 6 and max 15 characters.'
        ],
        confirmPasswordRules: [
          v => !!v || '',
          v => (v && v === $this.model.password) || 'The passwords do not match, please update.'
        ]
      }
    },
    computed: {
      ...mapState({
        phone: state => state.register.phone,
        phoneFormatted: state => state.register.phoneFormatted
      })
    },
    created() {},
    mounted() {},
    methods: {
      setupDetails() {
        if (this.$refs.form.validate()) {
          this.isEmailExist().then(valid => {
            if (valid) {
              this.setRegisterModel({ ...this.model })
              this.loading = true
              this.$axios.post('/api/user/sendEmailOtp', { email: this.model.email }).then(result => {
                if (result.data) {
                  this.$emit('next')
                } else {
                  this.$msg.error('Something went wrong during sending code. Try again...')
                }
                this.loading = false
              })
            }
          })
        }
      },
      isEmailExist() {
        return new Promise((resolve, reject) => {
          this.$axios.post('/api/user/isEmailExist', { email: this.model.email }).then(result => {
            if (result.data) {
              this.emailExist = 'The email address already exists, try another one.'
              reject()
            } else {
              resolve(true)
            }
          })
        })
      },
      reset() {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loading = false
      },
      back() {
        this.reset()
        this.$emit('back')
      },
      ...mapMutations({ setRegisterModel: 'register/setModel' })
    }
  }
</script>

<style lang="scss">
</style>
