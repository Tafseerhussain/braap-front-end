<template>
  <v-card class="my-profile section-wrapper rounded-10 pa-10 mb-5">
    <v-card-title class="text-h5 primary--text font-weight-medium pa-0 mb-3">
      <v-icon color="braap_orange" size="36" class="mr-2">mdi-card-account-mail-outline</v-icon>
      <span class="mt-1">Contact Information</span>
    </v-card-title>
    <v-card-text class="pa-0 pt-4">
      <v-row class="my-0">
        <v-col class="py-0" cols="6">
          <v-text-field
            ref="firstName"
            v-model="firstName"
            label="First Name"
            color="braap_orange"
            :loading="loading.firstName"
            @change="(value) => updateProfile('firstName', value)"
            @keypress.enter="enter('firstName')"
          ></v-text-field>
        </v-col>
        <v-col class="py-0" cols="6">
          <v-text-field
            ref="lastName"
            v-model="lastName"
            label="Last Name"
            color="braap_orange"
            :loading="loading.lastName"
            @change="(value) => updateProfile('lastName', value)"
            @keypress.enter="enter('lastName')"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row class="my-0">
        <v-col class="py-0" cols="6">
          <v-text-field
            ref="email"
            v-model="email"
            label="Email Address"
            color="braap_orange"
            :loading="loading.email"
            :append-icon="mailIcon"
            @change="makeAsEditEmail"
            @keypress.enter="enter('email')"
          >
            <template #append>
              <v-tooltip v-if="email && !isMailVerified" left color="primary" open-delay="100" content-class="left">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-on="on" v-bind="attrs" @click="makeAsEditEmail">
                    <v-icon color="error">{{ mailIcon }}</v-icon>
                  </v-btn>
                </template>
                <span>Verfiy now</span>
              </v-tooltip>
              <v-icon v-else-if="email" color="success">{{ mailIcon }}</v-icon>
            </template>
          </v-text-field>
          <OtpDialog
            v-model="emailVerify"
            :resend-url="`/api/user/profile/updateEmail/${email}`"
            verify-url="/api/user/profile/verifyEmailOTP"
            @finish="finishEmailVerify"
          >
            <template #title>Verify Email</template>
            <template #msg>
              A verification email has been sent to you. <br />
              Check your inbox.
            </template>
          </OtpDialog>
        </v-col>
        <v-col class="py-0" cols="6">
          <vue-tel-input-vuetify
            ref="telInput"
            color="braap_orange"
            label="Mobile phone"
            :loading="loading.phone"
            @blur="updateMobile"
            :error="!phoneObj || !phoneObj.isValid"
            v-model="phone"
            @input="phoneInput"
            @enter="updateMobile"
          >
            <template #append>
              <v-tooltip v-if="phone && !isPhoneVerified" left color="primary" open-delay="100" content-class="left">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn small icon v-on="on" v-bind="attrs" @click="makeAsEditMobile">
                    <v-icon color="error">{{ phoneIcon }}</v-icon>
                  </v-btn>
                </template>
                <span>Verfiy now</span>
              </v-tooltip>
              <v-icon v-else-if="phone" color="success">{{ phoneIcon }}</v-icon>
            </template>
          </vue-tel-input-vuetify>
          <OtpDialog
            v-model="phoneVerify"
            @finish="finishPhoneVerify"
            :resend-url="`/api/user/profile/updateMobile/${e164PhoneNumber}`"
            verify-url="/api/user/profile/verifyMobileOTP"
          >
            <template #title>Verify Phone</template>
            <template #msg>
              A confirmation code has been sent to you. <br />
              Check your phone.
            </template>
          </OtpDialog>
        </v-col>
      </v-row>

      <!-- <v-text-field
        v-if="profile && profile.companyName"
        v-model="profile.companyName"
        light
        color="#000"
        placeholder="Company"
        outlined
        readonly
        prepend-inner-icon="$svg-company"
        @click="clickCompany"
      ></v-text-field> -->
    </v-card-text>
  </v-card>
</template>

<script>
  import OtpDialog from '@/components/User/OTPDialog'

  export default {
    name: 'Profile',
    components: {
      OtpDialog
    },
    props: {
      profile: {
        type: Object
      }
    },
    data: function() {
      return {
        loading: {
          firstName: false,
          lastName: false,
          email: false,
          phone: false
        },
        orignalValue: null,
        firstName: null,
        lastName: null,
        email: null,
        phone: null,
        isMailVerified: null,
        isPhoneVerified: null,
        emailVerify: false,
        phoneObj: {},
        phoneVerify: false
      }
    },
    watch: {
      profile(val) {
        if (val && val.id) {
          this.orignalValue = val
          this.id = val.id
          this.firstName = val.firstName
          this.lastName = val.lastName
          this.email = val.email
          this.phone = val.phone
          this.isPhoneVerified = val.isPhoneVerified
          this.isMailVerified = val.isMailVerified
        }
      }
    },
    computed: {
      mailIcon() {
        if (this.isMailVerified != null) return this.isMailVerified ? 'mdi-check-circle' : '$svg-exclamation'
        else return ''
      },
      phoneIcon() {
        if (this.isPhoneVerified != null) return this.isPhoneVerified ? 'mdi-check-circle' : '$svg-exclamation'
        else return ''
      },
      e164PhoneNumber() {
        return this.phoneObj && this.phoneObj.number && encodeURIComponent(this.phoneObj.number.e164)
      }
    },
    created() {
      // this.getProfile()
    },
    methods: {
      updateProfile(key, value) {
        if (!value) this.$set(this, key, this.orignalValue[key])
        if (value === this.orignalValue[key]) return

        var data = {}
        data[key] = value
        this.loading[key] = true
        this.$axios.post('/api/user/profile/update', data).then(result => {
          this.loading[key] = false
          if (result.success && result.data) {
            this.orignalValue[key] = value
          } else {
            this.$set(this, key, this.orignalValue[key])
          }
        })
      },
      enter(key) {
        this.$nextTick(() => this.$refs[key].blur())
      },
      // email and verify
      updateEmail() {
        if (!this.email) this.email = this.orignalValue.email
        if (this.email == this.orignalValue.email) return
        this.makeAsEditEmail()
      },
      makeAsEditEmail() {
        this.loading.email = true
        this.$axios.post(`/api/user/profile/updateEmail/${this.email}`).then(result => {
          this.loading.email = false
          if (result.success) {
            this.orignalValue.email = this.email

            // show enter otp code textbox
            this.emailVerify = true
            this.isMailVerified = false

            // this.$msg.success(result.data.message)
            this.$emit('change', this.orignalValue)
          } else {
            // failed, reset the value
            this.email = this.orignalValue.email
          }
        })
      },
      finishEmailVerify() {
        this.emailVerify = false
        this.isMailVerified = true
      },
      // phone and verify
      makeAsEditMobile() {
        this.loading.phone = true
        this.$axios.post(`/api/user/profile/updateMobile?mobile=${this.e164PhoneNumber}`).then(result => {
          this.loading.phone = false
          if (result.success) {
            this.orignalValue.phone = this.phoneObj.number.e164
            this.phone = this.phoneObj.number.national
            this.phoneVerify = true
            this.isPhoneVerified = false
            this.$refs.telInput.$refs.input.blur()
          } else {
            // failed, reset the value
            this.phone = this.orignalValue.phone
          }
        })
      },
      finishPhoneVerify() {
        this.phoneVerify = false
        this.isPhoneVerified = true
      },
      updateMobile() {
        if (this.phoneObj && this.phoneObj.isValid && this.phoneObj.number.e164 != this.orignalValue.phone) {
          this.makeAsEditMobile()
        } else {
          this.phone = this.orignalValue.phone
          // this.showTelEditor = false
        }
        this.$refs.telInput.$refs.input.blur()
      },
      includeElements() {
        return [...document.querySelectorAll('.v-menu__content')]
      },
      phoneInput(val, obj) {
        this.phoneObj = obj
        if (this.phoneObj.isValid) this.phone = this.phoneObj.number.national
      },
      clickCompany() {
        this.$msg.confirm({
          text: 'This can only be updated by Braap.',
          okText: 'Start chat',
          onOk: () => {
            window.$('#zsiq_maintitle').click()
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .my-profile {
  }
</style>
