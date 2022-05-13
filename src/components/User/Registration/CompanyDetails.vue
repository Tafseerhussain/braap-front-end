<template>
  <v-card class="registration-form rounded-10 px-12 py-9" :max-width="maxWidth">
    <v-card-title class="py-4 px-0">
      <div class="text-h4 braap_orange--text font-weight-bold pr-14">Last Step!</div>
      <a class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6" @click.prevent="back">
        <v-icon :dark="!darkLogo" class="back-icon">mdi-arrow-left</v-icon>
      </a>
    </v-card-title>

    <p class="subtitle-0 mt-2 mr-14 mb-0">Looks like you are a corporate user. Confirm you company name.</p>

    <v-card-text class="pa-0 py-3 overflow-hidden">
      <v-form ref="form" lazy-validation>
        <v-text-field
          ref="input"
          label="Your company name"
          v-model="companyName"
          required
          :rules="[(v) => !!v || '']"
          :readonly="readonly"
        ></v-text-field>
      </v-form>
    </v-card-text>
    <div class="d-flex align-center" v-if="!readonly">
      <v-btn
        color="primary"
        class="rounded-10 px-10 body-0"
        :dark="!disabled"
        :disabled="disabled"
        x-large
        @click="setupAccount"
        :loading="loading"
      >
        Setup Account
      </v-btn>
    </div>
    <div class="d-flex align-center" v-else>
      <v-btn
        color="primary"
        class="rounded-10 px-10 body-0"
        :dark="!disabled"
        :disabled="disabled"
        x-large
        @click="setupAccount"
        :loading="loading"
      >
        Confirm Company
      </v-btn>
      <a class="text-decoration-underline braap_grey--text ml-5" @click="notMyCompany">Not My Company</a>
    </div>
  </v-card>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'

  export default {
    name: 'CompanyDetails',
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
        companyName: null,
        readonly: false
      }
    },
    computed: {
      ...mapState({
        email: state => state.register.email
      }),
      disabled() {
        return !this.companyName
      }
    },
    created() {},
    mounted() {
      this.getCompany()
      this.$refs.input.focus()
    },
    methods: {
      setupAccount() {
        if (this.$refs.form.validate()) {
          if (!this.readonly) this.setRegisterModel({ companyInfo: { name: this.companyName } })
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
        }
      },
      getCompany() {
        this.$axios.post('/api/user/getCompanyInfo', { email: this.email }).then(result => {
          if (result.data) {
            this.readonly = true
            this.companyName = result.data.name
            this.setRegisterModel({ companyInfo: result.data })
          } else {
            this.readonly = false
          }
        })
      },
      notMyCompany() {
        this.readonly = false
        this.companyName = ''
        this.setRegisterModel({ companyInfo: {} })
        this.$chat.show()
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
