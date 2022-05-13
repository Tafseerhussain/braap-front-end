<template>
  <div class="billing">
    <v-card
      class="section-wrapper rounded-10 pa-10 mb-5"
      v-click-outside="{
        handler: () => (this.subscription.show = false),
        closeConditional: () => this.subscription.show,
        include: () => [this.$refs.updateBt.$el],
      }"
    >
      <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
        <div class="d-flex align-center mb-3">
          <v-icon color="braap_orange" size="36" class="mr-2">mdi-credit-card-check-outline</v-icon>
          <span class="mt-1">My Shop Subscription</span>
        </div>

        <v-scale-transition origin="center">
          <v-tooltip
            v-if="!billingInfo.isActiveSubscription"
            left
            color="primary"
            open-delay="100"
            content-class="left"
          >
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                fab
                v-on="on"
                v-bind="attrs"
                color="primary"
                style="height: 48px; width: 48px"
                class="ml-auto"
                @click="addMore"
                transition="scale-transition"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </template>
            Add More
          </v-tooltip>

          <v-tooltip v-else left color="primary" open-delay="100" content-class="left">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                v-on="on"
                v-bind="attrs"
                fab
                color="primary"
                style="height: 48px; width: 48px"
                class="ml-auto"
                @click="cancelSubscription"
                transition="scale-transition"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </template>
            Cancel Subscription
          </v-tooltip>
        </v-scale-transition>
      </v-card-title>

      <v-card-text class="pa-0 pt-4">
        <div v-if="!billingInfo.isActiveSubscription" class="d-flex align-center">
          <v-icon>$svg-up-arrow</v-icon>
          <span class="ml-1 flex-grow-1 body-2">The first 10 assets in the shop are free.</span>
        </div>
        <template v-else>
          <div class="d-flex align-center mb-3">
            <v-icon color="braap_grey">$svg-up-arrow</v-icon>
            <span class="ml-1 flex-grow-1 body-2">The shop has an asset limit of {{ billingInfo.machineNumber }}.</span>
          </div>
          <template v-if="pm_sub">
            <div class="d-flex align-center mb-3">
              <v-icon>mdi-id-card</v-icon>
              <span class="ml-1 flex-grow-1 body-2"
                >Card Number ending in {{ pm_sub.last4 }} expiration date {{ pm_sub.expire }}</span
              >
            </div>
            <div class="d-flex">
              <v-btn
                ref="updateBt"
                color="braap_orange"
                large
                dark
                class="ml-auto rounded-10"
                @click="setupSubscriptionCard"
              >
                Update billing information
              </v-btn>
            </div>

            <v-expand-transition>
              <StripePayment
                ref="stripeSuscription"
                v-if="subscription.show"
                class="pa-0"
                @on-submit="onSubscriptionCardSetup"
                :publishable-key="subscription.data.publishableKey"
                :client-secret="subscription.data.clientSecret"
                :callback-url="subscription.data.returnUrl"
              >
                <template v-slot="{ inprogress, disabled, handleClick }">
                  <v-btn
                    color="braap_orange"
                    :loading="inprogress"
                    large
                    :dark="!disabled"
                    @click="handleClick"
                    :disabled="disabled"
                    class="rounded-10 ml-auto px-7"
                    >Add Payment Method</v-btn
                  >
                </template>
              </StripePayment>
            </v-expand-transition>
            <!-- <div class="info-text">
              {{ pm_sub.UpdateBy }} updated billing information on
              {{ moment(pm_sub.UpdateWhen).format('MMMM D, YYYY [at] h:mm A') }}
            </div> -->
          </template>
        </template>
      </v-card-text>
    </v-card>

    <v-card
      class="section-wrapper rounded-10 pa-10 mb-5"
      v-click-outside="{
        handler: () => (this.checkout.show = false),
        closeConditional: () => this.checkout.show,
        include: () => [this.$refs.updateBt1.$el],
      }"
    >
      <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
        <div class="d-flex align-center mb-3">
          <v-icon color="braap_orange" size="32" class="ml-1 mr-2">$svg-cursor-click</v-icon>
          <span class="mt-1">1-Click Checkout</span>
        </div>

        <v-scale-transition origin="center">
          <v-btn
            v-show="!pm_one"
            fab
            color="primary"
            style="height: 48px; width: 48px"
            class="ml-auto"
            @click="addMore"
            transition="scale-transition"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-scale-transition>
      </v-card-title>

      <v-card-text class="pa-0 pt-4">
        <div class="d-flex align-center mb-3">
          <v-icon>$svg-up-arrow</v-icon>
          <span class="ml-1 flex-grow-1 body-2">Payment details for service and parts.</span>
        </div>
        <div class="d-flex align-center mb-3" v-if="pm_one">
          <v-icon>mdi-id-card</v-icon>
          <span class="ml-1 flex-grow-1 body-2"
            >Card Number ending in {{ pm_one.last4 }} expiration date {{ pm_one.expire }}</span
          >
        </div>
        <div class="d-flex">
          <v-btn ref="updateBt1" color="braap_orange" large dark class="ml-auto rounded-10" @click="setupCheckoutCard">
            {{ pm_one ? 'Update' : 'Setup' }} billing information
          </v-btn>
        </div>
        <v-expand-transition>
          <StripePayment
            ref="stripeCheckout"
            v-if="checkout.show"
            class="pa-0"
            @on-submit="onCheckoutCardSetup"
            :publishable-key="checkout.data.publishableKey"
            :client-secret="checkout.data.clientSecret"
            :callback-url="checkout.data.returnUrl"
          >
            <template v-slot="{ inprogress, disabled, handleClick }">
              <v-btn
                color="braap_orange"
                :loading="inprogress"
                large
                :dark="!disabled"
                @click="handleClick"
                :disabled="disabled"
                class="rounded-10 ml-auto px-7"
                >Add Payment Method</v-btn
              >
            </template>
          </StripePayment>
        </v-expand-transition>
        <!-- <div class="info-text" v-if="pm_one">
          {{ pm_one.UpdateBy }} updated billing information on
          {{ moment(pm_one.UpdateWhen).format('MMMM D, YYYY [at] h:mm A') }}
        </div> -->
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import StripePayment from '@/components/Common/StripePayment.vue'

  export default {
    name: 'Billing',
    components: {
      StripePayment
    },
    data: function() {
      return {
        subscription: {
          type: 'SUBSCRIPTION',
          show: false,
          data: {
            publishableKey: '',
            clientSecret: '',
            returnUrl: ''
          }
        },
        checkout: {
          type: 'ONECLICK',
          show: false,
          data: {
            publishableKey: '',
            clientSecret: '',
            returnUrl: ''
          }
        },
        billingInfo: {}
      }
    },
    watch: {},
    computed: {
      pm_one() {
        return this.billingInfo.pM_OneClick
      },
      pm_sub() {
        return this.billingInfo.pM_Subscription
      }
    },
    created() {
      this.getBillingDetails()
    },
    methods: {
      moment,
      getBillingDetails() {
        this.$axios.post('/api/account/billingDetails').then(result => {
          if (result.success && result.data) {
            this.billingInfo = result.data
          }
        })
      },
      addMore() {
        this.$router.push({ name: 'PurchaseMachineAccess' })
      },
      cancelSubscription() {
        this.$axios.post('/api/secureCheckout/cancelCurrentSubscription').then(result => {
          if (result.success) {
            this.billingInfo.isActiveSubscription = false
            this.$msg.success(result.message)
          }
        })
      },
      createSetupIntent(type) {
        return this.$axios.post(`/api/secureCheckout/setupIntent/${type}`)
      },
      setupSubscriptionCard() {
        if (this.subscription.show) return
        this.subscription.show = true
        this.createSetupIntent(this.subscription.type).then(result => {
          if (result.success && result.data) {
            this.subscription.data = {
              publishableKey: result.data.stripePublishableKey,
              returnUrl: result.data.stripePaymentReturnUrl,
              clientSecret: result.data.stripePaymentClientSecret
            }
            this.$nextTick(() => {
              this.$refs.stripeSuscription.loadStripPaymentForm()
            })
          } else {
            this.$msg.error('Something went wrong. Try again...')
          }
        })
      },
      onSubscriptionCardSetup({ confirmSetup }) {
        confirmSetup({
          success: () => {
            this.subscription.show = false
            this.getBillingDetails()
          },
          error: msg => {
            this.$msg.error(msg)
            console.log(msg)
          }
        })
      },
      setupCheckoutCard() {
        if (this.checkout.show) return
        this.checkout.show = true
        this.createSetupIntent(this.checkout.type).then(result => {
          if (result.success && result.data) {
            this.checkout.data = {
              publishableKey: result.data.stripePublishableKey,
              returnUrl: result.data.stripePaymentReturnUrl,
              clientSecret: result.data.stripePaymentClientSecret
            }
            this.$nextTick(() => {
              this.$refs.stripeCheckout.loadStripPaymentForm()
            })
          }
        })
      },
      onCheckoutCardSetup({ confirmSetup }) {
        confirmSetup({
          success: () => {
            this.checkout.show = false
            this.getBillingDetails()
          },
          error: msg => {
            this.$msg.error(msg)
            console.log(msg)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .billing {
    display: inline-block;
    width: 100%;

    .v-card__text {
      .info-text {
        font-size: 14px;
        transform: scale(0.8);
        transform-origin: left;
        white-space: nowrap;
        @media (max-width: 450px) {
          font-size: 12px;
        }
      }
      @media (max-width: 768px) {
        .info-text {
          transform: scale(0.6);
        }
      }
    }
  }
</style>
