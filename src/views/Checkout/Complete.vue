<template>
  <div class="payment-complete">
    <v-container>
      <v-card class="form rounded-10 px-12 py-9 mx-auto" :max-width="550">
        <v-card-title class="py-4 px-0">
          <div class="text-h4 braap_orange--text font-weight-bold">Confirmation</div>
          <div
            v-if="!loading"
            class="braap-logo d-flex rounded-10 justify-center px-2 py-2"
            :class="!success ? 'error' : 'success'"
          >
            <v-icon color="white" class="back-icon">{{ !success ? 'mdi-exclamation-thick' : 'mdi-check' }}</v-icon>
          </div>
          <!-- <div v-else class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6">
            <v-icon color="white" class="back-icon">$svg-braap-logo</v-icon>
          </div> -->
        </v-card-title>

        <v-responsive v-if="loading" aspect-ratio="2" class="d-flex align-center">
          <div class="d-flex align-center justify-center">
            <v-progress-circular indeterminate color="braap_orange"></v-progress-circular>
          </div>
        </v-responsive>

        <template v-else>
          <template v-if="!success">
            <p class="subtitle-0 mt-2 mr-14 error--text">Something went wrong. Please try again.</p>

            <v-card-text class="pa-0 py-6 overflow-hidden">
              <p class="body-0">&nbsp;</p>
            </v-card-text>
          </template>
          <template v-else>
            <p class="subtitle-0 mt-2 mr-14">Order Details Sent!</p>

            <v-card-text class="pa-0 py-6 overflow-hidden">
              <p class="body-0">
                We’ve sent you an email or text message with all the details of your order. For questions chat with out
                customer service group by using the icon on the bottom of the screen.
              </p>
            </v-card-text>
          </template>
          <div class="d-flex flex-column align-center">
            <v-btn :to="{ name: 'MyShop' }" color="primary " class="rounded-10 px-10 body-0 mb-2" dark x-large>
              Continue
            </v-btn>
            <div class="caption primary--text">Redirect to 'Your Shop' in {{ counter }} seconds</div>
          </div>
        </template>
      </v-card>
    </v-container>
  </div>
</template>

<script>
  import { mapState } from 'vuex'

  export default {
    name: 'PaymentComplete',
    components: {},
    props: {},
    data() {
      return {
        loading: true,
        counter: 5,
        success: true,
        timer: null
      }
    },
    created() {
      const {
        query: { url }
      } = this.$route
      if (url) {
        // need to handle payment redirect
        this.$axios.get(url, { params: this.$route.query }).then(result => {
          this.success = result.success
          this.loading = false
          this.$nextTick(() => {
            this.redirectToRoute()
          })
        })
      } else {
        this.loading = false
        this.$nextTick(() => {
          this.redirectToRoute()
        })
      }
    },
    mounted() {},
    computed: {
      ...mapState({
        isAuth: state => state.userId > 0
      })
    },
    methods: {
      redirectToRoute() {
        this.timer = setInterval(() => {
          this.counter--
          if (this.counter === 0) {
            this.$router.push({ name: 'MyShop' })
          }
        }, 1000)
      }
    },
    beforeDestroy() {
      if (this.timer) clearInterval(this.timer)
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .payment-complete {
    min-height: 100vh;
    .form {
      margin-top: 110px;
      .braap-logo {
        position: absolute;
        right: -30px;
        top: 40px;
        .back-icon {
          font-size: 108px;
          svg {
            width: 78px;
            height: 78px;
          }
        }
      }
    }
  }
</style>