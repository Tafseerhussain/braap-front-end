<template>
  <v-card class="reset-password section-wrapper rounded-10 pa-10 mb-5">
    <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
      <v-icon color="braap_orange" size="38" class="mr-1">mdi-lock-outline</v-icon>
      <span class="mt-1">Reset Password</span>
      <v-btn
        color="braap_orange"
        large
        style="height: 50px"
        class="rounded-10 ml-auto font-weight-regular"
        dark
        :loading="loading"
        @click="reset"
      >
        Send Password Reset Link
      </v-btn>
    </v-card-title>
  </v-card>
</template>

<script>
  export default {
    name: 'ResetPassword',
    components: {},
    data: function() {
      return {
        loading: false
      }
    },
    computed: {},
    created() {},
    methods: {
      reset() {
        this.loading = true
        this.$axios.post('/api/user/sendResetPasswordEmail').then(result => {
          if (result.success && result.data) {
            this.loading = false
            if (result.data.isEmailSent) {
              this.$msg.success('Password reset link has been emailed, check your inbox.')
            } else {
              this.$msg.error(
                'Sorry we don’t recognize that email, try again. Need help, select the chat bar on the bottom of the page'
              )
            }
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .reset-password {
  }
</style>
