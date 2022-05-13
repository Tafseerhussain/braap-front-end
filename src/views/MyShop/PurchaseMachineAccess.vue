<template>
  <div class="purchase-machine">
    <v-container>
      <div class="d-flex flex-column align-center">
        <v-card class="form rounded-10 px-12 py-9 mb-5" max-width="550">
          <v-card-title class="py-4 px-0">
            <div class="text-h4 braap_orange--text font-weight-bold pr-14">Purchase Machines</div>
            <a class="braap-logo d-flex rounded-10 justify-center braap_orange px-6 py-6" @click.prevent="back">
              <v-icon dark class="back-icon">mdi-arrow-left</v-icon>
            </a>
          </v-card-title>

          <p v-if="!disabled" class="subtitle-0 mt-2 mr-14 mb-0">
            Currently, you have {{ machineCount }} machines. <br />How many more do you need to add?
          </p>
          <p v-else class="subtitle-0 mt-2 mr-14 mb-0 error--text">
            {{ errorMsg }}
          </p>

          <p class="body-1 mt-5 primary--text">Select Price / Month...</p>
          <v-slider
            color="braap_orange"
            track-color="braap_light_grey"
            :step="step"
            min="10"
            max="500"
            class="mt-n3"
            v-model="buyCount"
            thumb-label
            :error="buyCount < minBuyCount"
            :error-messages="errorMsg"
            hide-details
          >
            <template #thumb-label="{ value }"> Add {{ value }} more machines </template>
          </v-slider>
          <p class="body-1 mt-2 primary--text text-right">{{ (buyCount * vehiclePrice) | currency }}</p>

          <div class="d-flex align-center justify-center pt-3">
            <v-btn
              color="primary"
              class="rounded-10 px-10 body-0"
              :dark="!disabled"
              :disabled="disabled"
              x-large
              @click="confirm"
              :loading="loading"
            >
              Add Machines
            </v-btn>
          </div>

          <a class="d-block text-center primary--text pt-4 pb-2 caption" @click.prevent="$chat.start">
            Click to add more than 500 machines or assets at a time.
          </a>
        </v-card>

        <v-card class="rounded-10 px-6 pt-3 pb-2 mb-10" max-width="550">
          <v-card-text class="pa-0 py-3 overflow-hidden braap-content">
            <blockquote>
              We don’t charge for the first 4 machines in your account, they are always free. The monthly subscription
              can be canceled anytime.
            </blockquote>
          </v-card-text>
        </v-card>
      </div>
    </v-container>
  </div>
</template>

<script>
  export default {
    name: 'PurchaseMachineAccess',
    props: {},
    components: {},
    data: function() {
      return {
        userMachineLimit: 10,
        vehiclePrice: 1.25,
        machineCount: 0,
        buyCount: 20,
        step: 10,
        loading: false
      }
    },
    computed: {
      minBuyCount() {
        return Math.ceil((this.machineCount - this.userMachineLimit) / this.step) * 10
      },
      errorMsg() {
        return this.disabled
          ? `To have full access to the interactive workspace add at least ${this.minBuyCount} machines.`
          : ''
      },
      disabled() {
        return this.buyCount < this.minBuyCount
      }
    },
    mounted() {
      this.$axios.post('/api/myShop/PurchaseMachineAccess').then(result => {
        if (result.success && result.data) {
          this.userMachineLimit = result.data.userMachineLimit
          this.vehiclePrice = result.data.vehiclePrice
          this.machineCount = result.data.machineCount
          this.buyCount = this.minBuyCount
        }
      })
    },
    methods: {
      goLogin() {
        this.$router.push({ name: 'Login' })
      },
      confirm() {
        this.loading = true
        this.$axios.post(`/api/secureCheckout/PurchaseMachines/${this.buyCount}`).then(result => {
          if (result.success) {
            if (result.data) {
              // redirect to payment
              let card = null
              if (result.data.stripeSavedPaymentMethod) {
                card = {
                  expiry: result.data.stripeSavedPaymentMethod.expire,
                  last4: result.data.stripeSavedPaymentMethod.last4,
                  id: result.data.stripeSavedPaymentMethod.stripePaymentMethodId
                }
              }
              this.$router.push({
                name: 'Checkout',
                params: {
                  payment: {
                    publishableKey: result.data.stripePublishableKey,
                    returnUrl: result.data.stripePaymentReturnUrl,
                    clientSecret: result.data.stripePaymentClientSecret,
                    id: result.data.stripePaymentIntentId
                  },
                  card,
                  totalAmount: result.data.totalAmount,
                  totalTax: result.data.totalTax,
                  buyCount: this.buyCount,
                  type: 'SUBSCRIPTION'
                }
              })
            } else if (result.url) {
              this.$router.push({ name: 'CheckoutComplete', query: { url: result.url } })
            }
          }
          this.loading = false
        })
      },
      back() {
        this.$router.push({ name: 'MyShop' })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .purchase-machine {
    min-height: 100vh;
    .form {
      margin-top: 110px;
      width: 100%;

      .v-card__title {
        word-break: normal;
        .text-h4 {
          font-size: 32px !important;
          line-height: 46px;
        }
      }

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

      .v-slider--horizontal {
        margin: 0;

        .v-slider__thumb {
          height: 20px;
          width: 20px;
          left: -10px;
          &:before {
            left: -8px;
            top: -8px;
          }
        }

        .v-slider__thumb-label {
          width: 180px !important;
          height: 37px !important;
          white-space: nowrap;
          padding: 5px 10px;
          border-radius: 6px;
          bottom: 25px;
          left: 50%;
          font-size: 14px;
          transform: translateX(-50%) !important;
          & > * {
            transform: none;
          }
          &::before {
            content: ' ';
            position: absolute;
            border-width: 8px;
            border-style: solid;
            border-color: transparent;
            height: 0;
            width: 0;
            transform: translateX(-50%);
            top: 100%;
            left: 50%;
            border-top: solid 8px $braap_orange;
          }
          &.error {
            &::before {
              border-top: solid 8px #ff5252;
            }
          }
        }

        .v-slider__track-container {
          height: 3px;
          border-radius: 2px;
          overflow: hidden;
        }
      }

      .v-messages {
        margin-right: 40px !important;
      }
    }
  }
</style>
