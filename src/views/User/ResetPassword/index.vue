<template>
  <div class="user-layout">
    <v-container>
      <ResetPasswordForm max-width="550" class="mx-auto"></ResetPasswordForm>
    </v-container>
  </div>
</template>

<script>
  import ResetPasswordForm from '@/components/User/ResetPasswordForm'

  export default {
    name: 'ResetPassword',
    props: {},
    components: {
      ResetPasswordForm
    },
    data: function() {
      return {}
    },
    watch: {},
    mounted() {},
    methods: {}
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
