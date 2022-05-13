<template>
  <div class="d-flex flex-column align-center">
    <v-card class="registration-form rounded-10 px-12 py-9 mb-5" :max-width="maxWidth">
      <v-card-title class="py-4 px-0">
        <div class="text-h4 braap_orange--text font-weight-bold pr-14">What's your confirmation code</div>
        <a class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6" @click.prevent="back">
          <v-icon :dark="!darkLogo" class="back-icon">mdi-arrow-left</v-icon>
        </a>
      </v-card-title>

      <p class="subtitle-0 mt-2 mr-14 mb-0">
        Code sent to <br /><span class="font-weight-bold">{{ email }}</span>
      </p>

      <v-card-text class="pa-0 py-3 overflow-hidden">
        <v-form ref="form" lazy-validation>
          <v-text-field
            ref="input"
            label="Enter Confirmation Code"
            v-model="code"
            required
            :rules="[(v) => !!v || '']"
            :error-messages="errorMessage"
            @keypress.enter="confirm"
            maxlength="5"
          ></v-text-field>
        </v-form>
      </v-card-text>
      <div class="d-flex align-center py-1">
        <v-btn
          color="primary"
          class="rounded-10 px-10 body-0"
          :dark="!disabled"
          :disabled="disabled"
          x-large
          @click="confirm"
          :loading="loading"
        >
          Confirm
        </v-btn>
      </div>

      <div class="d-flex align-center primary--text pt-8">
        Didn’t get a code?<a v-if="counter === 0" class="text-decoration-underline ml-1" @click.prevent="sendAgain"
          >Send Again</a
        ><span v-else class="grey--text ml-1">Send Again ({{ this.counter }}s)</span>
      </div>
    </v-card>

    <v-card class="rounded-10 px-6 pt-3 pb-2" :max-width="maxWidth">
      <v-card-text class="pa-0 py-3 overflow-hidden braap-content">
        <blockquote>
          Security is a big deal at Braap. Our platform meets and, in some cases, exceeds industry standard protocols.
          This step is another way we keep you safe.
        </blockquote>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'EmailConfirmation',
    components: {},
    props: {
      darkLogo: {
        type: Boolean
      },
      maxWidth: {
        type: [String, Number]
      },
      visible: {
        type: Boolean
      }
    },
    data: function() {
      return {
        loading: false,
        code: null,
        errorMessage: null,
        counter: 0,
        timer: null
      }
    },
    computed: {
      ...mapState({
        email: state => state.register.email
      }),
      disabled() {
        return !this.code || this.code.length < 5
      }
    },
    watch: {
      visible(val) {
        if (val) {
          setTimeout(() => {
            this.$refs.input.focus()
          }, 400)
        }
      }
    },
    methods: {
      confirm() {
        if (this.$refs.form.validate()) {
          this.loading = true
          this.$axios
            .post('/api/user/verfiyEmailOtp', { mailOtp: this.code, email: this.email })
            .then(result => {
              if (result.data.isMailCodeMatched) {
                this.setRegisterModel({ mailOtp: this.code })
                if (result.data.isCorporateEmail) {
                  this.reset()
                  this.$emit('next')
                } else {
                  this.setupAccount()
                }
              } else {
                this.errorMessage = ['The code was not correct, try again.']
                this.code = ''
                this.loading = false
              }
            })
            .catch(() => {
              this.loading = false
            })
        }
      },
      sendAgain() {
        this.counter = 60
        this.timer = setInterval(() => {
          this.counter = this.counter - 1
          if (this.counter === 0 && this.timer) clearInterval(this.timer)
        }, 1000)

        this.$axios.post('/api/user/sendEmailOtp', { email: this.email }).then(result => {
          if (result.data) {
            this.$msg.success('Code has been emailed, check your inbox.')
          } else {
            this.$msg.error('Something went wrong during sending code. Try again...')
            this.counter = 0
            if (this.counter === 0 && this.timer) clearInterval(this.timer)
          }
        })
      },
      setupAccount() {
        this.loading = true
        this.$axios
          .post('/api/user/setupAccount', { ...this.$store.state.register })
          .then(result => {
            if (result.success) {
              this.$store.dispatch('setLoginResult', result.data)
              this.$emit('complete')
            }
          })
          .catch(() => {
            this.loading = false
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
