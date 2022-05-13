<template>
  <v-card class="login-form rounded-10 px-12 py-9" :max-width="maxWidth">
    <v-card-title class="py-4 px-0">
      <div class="text-h3 braap_orange--text font-weight-bold">Sign In</div>
      <div class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6">
        <v-icon :color="darkLogo ? 'primary' : 'white'" class="back-icon">$svg-braap-logo</v-icon>
      </div>
    </v-card-title>

    <p class="subtitle-0 mt-2 mr-14">Welcome Back to Braap!</p>

    <v-card-text class="pa-0 py-3 overflow-hidden">
      <v-form ref="form" lazy-validation>
        <v-text-field
          color="braap_orange"
          label="Email Address"
          v-model="model.username"
          required
          :rules="emailRules"
          @keypress.enter="login"
        ></v-text-field>

        <v-text-field
          color="braap_orange"
          label="Password"
          v-model="model.password"
          required
          :rules="[(v) => !!v || '']"
          :append-icon="showPwd ? 'mdi-eye-off' : 'mdi-eye'"
          :type="showPwd ? 'text' : 'password'"
          @click:append="showPwd = !showPwd"
          @keypress.enter="login"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <div class="d-flex align-center py-1">
      <v-btn color="primary" class="rounded-10 px-10 body-0" dark x-large @click="login" :loading="loading">
        Login
      </v-btn>
      <a class="text-decoration-underline braap_grey--text ml-5" @click="$emit('on-forgot-pwd')">Forgot Password?</a>
    </div>

    <div class="d-flex align-center justify-center braap_grey--text pt-16 mb-n2">
      Do not have an Account?<a class="text-decoration-underline primary--text ml-1" @click="$emit('on-register')"
        >Regiser here?</a
      >
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'LoginForm',
    components: {},
    props: {
      darkLogo: {
        type: Boolean
      },
      maxWidth: {
        type: [Number, String]
      }
    },
    data: function() {
      return {
        loading: false,
        showPwd: false,
        model: {
          password: null,
          username: null
        },
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
      login() {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.$axios.post('/api/user/authenticate', { ...this.model }).then(result => {
            if (result && result.success) {
              this.$store.dispatch('setLoginResult', result.data)
              this.$emit('success')
            } else this.loading = false
          })
        }
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
  .login-form {
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
