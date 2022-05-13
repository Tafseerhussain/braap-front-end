<template>
  <div class="user-layout">
    <v-container>
      <LoginForm
        max-width="550"
        class="mx-auto"
        @on-register="goRegister"
        @on-forgot-pwd="goForgotPwd"
        @success="success"
      ></LoginForm>
    </v-container>
  </div>
</template>

<script>
  import LoginForm from '@/components/User/LoginForm'

  export default {
    name: 'Login',
    props: {},
    components: {
      LoginForm
    },
    data: function() {
      return {}
    },
    watch: {},
    mounted() {},
    methods: {
      goRegister() {
        this.$router.push({ name: 'Registration' })
      },
      goForgotPwd() {
        this.$router.push({ name: 'ForgotPassword' })
      },
      success() {
        this.$router.push({ name: 'Home' })
      }
    }
  }
</script>

<style lang="scss">
  .user-layout {
    min-height: 100vh;
    .login-form {
      margin-top: 110px;
    }
  }
</style>
