<template>
  <div class="user-layout">
    <v-container>
      <v-tabs-items v-model="step" style="background: transparent">
        <v-tab-item transition="scroll-x-reverse-transition" reverse-transition="scroll-x-transition">
          <GetStarted
            max-width="550"
            class="mx-auto"
            :visible="step === 0"
            @on-login="goLogin"
            @next="next"
          ></GetStarted>
        </v-tab-item>
        <v-tab-item transition="scroll-x-reverse-transition" reverse-transition="scroll-x-transition">
          <CodeConfirmation
            max-width="550"
            class="mx-auto"
            :visible="step === 1"
            style="margin-bottom: 100px"
            @next="next"
            @back="back"
          ></CodeConfirmation>
        </v-tab-item>
        <v-tab-item transition="scroll-x-reverse-transition" reverse-transition="scroll-x-transition">
          <MoreDetails max-width="550" class="mx-auto" @next="next" @back="back"></MoreDetails>
        </v-tab-item>
        <v-tab-item transition="scroll-x-reverse-transition" reverse-transition="scroll-x-transition">
          <EmailConfirmation
            max-width="550"
            @next="next"
            :visible="step === 3"
            @back="back"
            @complete="complete"
          ></EmailConfirmation>
        </v-tab-item>
        <v-tab-item transition="scroll-x-reverse-transition" reverse-transition="scroll-x-transition">
          <CompanyDetails
            v-if="step === 4"
            max-width="550"
            class="mx-auto"
            @next="next"
            @back="back"
            @complete="complete"
          ></CompanyDetails>
        </v-tab-item>
      </v-tabs-items>
    </v-container>
  </div>
</template>

<script>
  import GetStarted from '@/components/User/Registration/GetStarted'
  import CodeConfirmation from '@/components/User/Registration/CodeConfirmation'
  import MoreDetails from '@/components/User/Registration/MoreDetails'
  import EmailConfirmation from '@/components/User/Registration/EmailConfirmation'
  import CompanyDetails from '@/components/User/Registration/CompanyDetails'

  export default {
    name: 'Registration',
    props: {},
    components: {
      GetStarted,
      CodeConfirmation,
      MoreDetails,
      EmailConfirmation,
      CompanyDetails
    },
    data: function() {
      return {
        step: 0
      }
    },
    watch: {},
    mounted() {
      const {
        params: { step }
      } = this.$route
      if (step) this.step = step
      else {
        this.$store.commit('register/clearModel')
      }
    },
    methods: {
      goLogin() {
        this.$router.push({ name: 'Login' })
      },
      next() {
        this.step = this.step + 1
      },
      back() {
        this.step = this.step - 1
      },
      complete() {
        this.$msg.success('Your account at Braap has been successfully created !')
        this.$store.commit('register/clearModel')
        setTimeout(() => {
          this.$router.push({ name: 'Home' })
        }, 2000)
      }
    }
  }
</script>

<style lang="scss">
  .user-layout {
    min-height: 100vh;
    .registration-form {
      margin-top: 110px;
    }
  }
</style>
