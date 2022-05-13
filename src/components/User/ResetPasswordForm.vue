<template>
  <v-card class="forgot-pwd-form rounded-10 px-12 py-9 mb-5" :max-width="maxWidth">
    <v-card-title class="py-4 px-0">
      <div class="text-h4 braap_orange--text font-weight-bold pr-14">Reset Password</div>
      <a class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6">
        <v-icon :color="darkLogo ? 'primary' : 'white'" class="back-icon">$svg-braap-logo</v-icon>
      </a>
    </v-card-title>

    <v-responsive v-if="!valid" aspect-ratio="2" class="d-flex align-center">
      <div class="d-flex align-center justify-center">
        <v-progress-circular indeterminate color="braap_orange"></v-progress-circular>
      </div>
    </v-responsive>

    <template v-else-if="valid === 'success'">
      <template v-if="!reseted">
        <p class="subtitle-0 mt-2 mr-14 mb-0">Glad we found your account. Please enter new password.</p>

        <v-card-text class="pa-0 py-3 overflow-hidden">
          <v-form ref="form" lazy-validation>
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
          </v-form>
        </v-card-text>
        <div class="d-flex align-center py-1">
          <v-btn
            color="primary "
            class="rounded-10 px-10 body-0"
            dark
            x-large
            @click="resetPassword"
            :loading="loading"
          >
            Update
          </v-btn>
        </div>
      </template>
      <template v-else>
        <p class="subtitle-0 mt-2 mr-14 mb-0">Password reset successfully.</p>
        <div class="d-flex flex-column align-center pt-16">
          <v-btn :to="{ name: 'Home' }" color="primary " class="rounded-10 px-10 body-0 mb-2" dark x-large>
            Continue
          </v-btn>
          <div class="caption primary--text">
            Redirect to '{{ isAuth ? 'Home' : 'Login' }}' in {{ counter }} seconds
          </div>
        </div>
      </template>
    </template>
    <template v-else>
      <p class="subtitle-0 mt-2 mr-14 mb-0">The link provided is not valid. Reset the password again.</p>
      <div class="d-flex flex-column align-center pt-16">
        <v-btn
          :to="{ name: isAuth ? 'Home' : 'Login' }"
          color="primary "
          class="rounded-10 px-10 body-0 mb-2"
          dark
          x-large
        >
          Continue
        </v-btn>
        <div class="caption primary--text">Redirect to '{{ isAuth ? 'Home' : 'Login' }}' in {{ counter }} seconds</div>
      </div>
    </template>
  </v-card>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'ForgotPasswordForm',
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
        model: {
          password: null,
          confirmPassword: null,
          token: null
        },
        showPwd: false,
        showConfirmationPwd: false,
        counter: 5,
        valid: false,
        reseted: false,
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
        isAuth: state => state.userId > 0
      })
    },
    created() {},
    mounted() {
      const {
        params: { token }
      } = this.$route
      if (!token) {
        this.$router.push({ name: 'Login' })
      } else {
        this.model.token = token
        this.validateToken(token)
      }
    },
    methods: {
      validateToken(token) {
        this.$axios
          .post(`/api/user/validateResetPasswordToken/${token}`)
          .then(result => {
            if (result.success && result.data) {
              this.valid = 'success'
            } else {
              this.valid = 'failed'
              this.redirect()
            }
          })
          .catch(() => {
            this.valid = 'failed'
            this.redirect()
          })
      },
      redirect() {
        setInterval(() => {
          this.counter--
          if (this.counter === 0) {
            this.$router.push({ name: this.isAuth ? 'Home' : 'Login' })
          }
        }, 1000)
      },
      resetPassword() {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.$axios.post('/api/user/resetPassword', { ...this.model }).then(result => {
            if (result.success) {
              this.$msg.success('Password reset successfully.')
              this.reseted = true
              this.redirect()
            } else {
              this.$msg.error('System error, please try again.')
              this.reset()
            }
          })
        }
      },
      closeDialog() {
        this.$emit('closeDialog', false)
      },
      reset() {
        this.$refs.form.reset()
        this.$refs.form.resetValidation()
        this.loading = false
      }
    }
  }
</script>

<style lang="scss">
  .forgot-pwd-form {
    .braap-logo {
      position: absolute;
      right: -30px;
      top: 40px;

      .text-h4 {
        font-size: 40px;
        line-height: 66px;
      }
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
