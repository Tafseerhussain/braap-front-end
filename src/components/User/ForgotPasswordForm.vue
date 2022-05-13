<template>
  <v-card class="forgot-pwd-form rounded-10 px-12 py-9 mb-5" :max-width="maxWidth">
    <v-card-title class="py-4 px-0">
      <div class="text-h4 braap_orange--text font-weight-bold pr-14">Forgot Password?</div>
      <a class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6">
        <v-icon :color="darkLogo ? 'primary' : 'white'" class="back-icon">$svg-braap-logo</v-icon>
      </a>
    </v-card-title>

    <p class="subtitle-0 mt-2 mr-14 mb-0">
      Please enter the email address you’d like your password reset info sent to.
    </p>

    <v-card-text class="pa-0 py-3 overflow-hidden">
      <v-form ref="form" lazy-validation>
        <v-text-field
          label="Emaill address"
          color="braap_orange"
          v-model="email"
          required
          :rules="emailRules"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <div class="d-flex align-center pb-2">
      <v-btn color="primary" class="rounded-10 px-10 body-0" dark x-large @click="confirm" :loading="loading">
        Reset Password
      </v-btn>
    </div>

    <div class="d-flex align-center justify-center primary--text pt-8">
      <a class="text-decoration-underline ml-1" @click.prevent="$emit('on-login')">Back to Login</a>
    </div>
  </v-card>
</template>

<script>
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
      return {
        loading: false,
        email: null,
        emailRules: [
          v => !!v || 'Email is required',
          v =>
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            ) || 'Email must be valid'
        ]
      }
    },
    watch: {},
    created() {},
    mounted() {},
    methods: {
      confirm() {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.$axios.post(`/api/user/sendResetPasswordEmail/${this.email}`).then(result => {
            if (result.success && result.data) {
              this.loading = false
              if (result.data.isEmailSent) {
                this.$msg.success('Password reset link has been emailed, check your inbox.')
                setTimeout(() => {
                  this.$router.push({ name: 'Home' })
                }, 2000)
              } else {
                this.$msg.error(
                  'Sorry we don’t recognize that email, try again. Need help, select the chat bar on the bottom of the page'
                )
              }
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
