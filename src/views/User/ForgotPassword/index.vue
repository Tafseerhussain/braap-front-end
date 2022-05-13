<template>
  <div class="user-layout">
    <v-container>
      <ForgotPasswordForm max-width="550" class="mx-auto" @on-login="goLogin"></ForgotPasswordForm>
    </v-container>
  </div>
</template>

<script>
  import ForgotPasswordForm from '@/components/User/ForgotPasswordForm'

  export default {
    name: 'ForgotPassword',
    props: {},
    components: {
      ForgotPasswordForm
    },
    data: function() {
      return {}
    },
    watch: {},
    mounted() {},
    methods: {
      goLogin() {
        this.$router.push({ name: 'Login' })
      }
    }
  }
</script>

<style lang="scss">
  .user-layout {
    min-height: 100vh;
    .forgot-pwd-form {
      margin-top: 110px;
    }
  }
</style>
