<template>
  <v-dialog
    v-model="dialog"
    max-width="598"
    scrollable
    overlay-color="rgba(0,0,0,0.5)"
    overlay-opacity="1"
    class="elevation-0"
  >
    <LoginForm
      v-if="showLogin"
      :darkLogo="true"
      class="ma-4 mr-8"
      @on-forgot-pwd="openForgotPassword"
      @on-register="openRegister"
      @success="success"
    ></LoginForm>
    <GetStarted v-if="showRegister" :darkLogo="true" class="ma-4 mr-8" @on-login="openLogin" @next="next"></GetStarted>
    <ForgotPasswordForm
      v-if="showForgotPassword"
      :darkLogo="true"
      class="ma-4 mr-8"
      @on-login="openLogin"
    ></ForgotPasswordForm>
  </v-dialog>
</template>

<script>
  import LoginForm from './LoginForm.vue'
  import GetStarted from './Registration/GetStarted.vue'
  import ForgotPasswordForm from './ForgotPasswordForm.vue'

  export default {
    name: 'LoginDialog',
    components: {
      LoginForm,
      GetStarted,
      ForgotPasswordForm
    },
    props: {
      value: {
        type: Boolean,
        required: true
      }
    },
    data: function() {
      return {
        dialog: false,
        showLogin: false,
        showRegister: false,
        showForgotPassword: false
      }
    },
    watch: {
      value(val) {
        this.dialog = val
      },
      dialog(val) {
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
        this.$emit('input', val)
      }
    },
    created() {
      if (this.value) this.dialog = this.value
    },
    mounted() {},
    methods: {
      openLogin() {
        this.showLogin = true
        this.showRegister = false
        this.showForgotPassword = false
        this.dialog = true
      },
      openRegister() {
        this.showLogin = false
        this.showRegister = true
        this.showForgotPassword = false
        this.dialog = true
      },
      openForgotPassword() {
        this.showLogin = false
        this.showRegister = false
        this.showForgotPassword = true
        this.dialog = true
      },
      closeDialog() {
        this.$emit('input', false)
      },
      next() {
        this.closeDialog()
        this.$router.push({ name: 'Registration', params: { step: 1 } })
      },
      success() {
        this.closeDialog()
      }
    }
  }
</script>

<style lang="scss">
  .v-dialog {
    margin: 0 !important;
    overflow: visible !important;
    box-shadow: none !important;
  }
</style>
