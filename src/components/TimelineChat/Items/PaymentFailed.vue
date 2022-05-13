<template>
  <div class="align-self-end payment-status">
    <Bubble :timestamp="activity.timestamp" color="braap_red" align="right" :class="{ 'not-allowed': disabled }">
      <span class="body-1 d-block white--text">
        <b>ACTION REQUIRED:</b>
        <template v-if="autoPilot">
          <span v-if="!cardOnFile">
            No Payment method was found, please set one up now.
            <a v-if="!showPaymentForm" class="action white--text font-weight-medium" @click.prevent="useNewCard">
              CLICK HERE TO SETUP
            </a>
          </span>
          <span v-else>
            Payment failed, please provide another payment.
            <a v-if="!showPaymentForm" class="action white--text font-weight-medium" @click.prevent="useNewCard">
              CLICK HERE TO MAKE PAYMENT
            </a>
          </span>
        </template>
        <template v-else>
          <span v-if="!cardOnFile">
            Auto pilot is off, and a payment method is not on file.
            <a v-if="!showPaymentForm" class="action white--text font-weight-medium" @click.prevent="useNewCard">
              CLICK HERE TO SETUP
            </a>
          </span>
          <span v-else>
            Auto pilot is off, please confirm payment.
            <a v-if="!showPaymentForm" class="action white--text font-weight-medium" @click.prevent="openPaymentForm">
              CLICK HERE TO MAKE PAYMENT
            </a>
          </span>
        </template>
      </span>
    </Bubble>

    <div v-if="!disabled" v-show="showPaymentForm" class="relative">
      <v-btn
        v-if="!paymentForm.loading && showStripForm"
        absolute
        light
        class="close-bt"
        icon
        elevation="0"
        small
        @click="hidePaymentForm"
      >
        <v-icon light color="braap-grey">mdi-close-circle</v-icon>
      </v-btn>
      <div class="loading" v-show="paymentForm.loading">
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </div>
      <Bubble
        v-if="!autoPilot && cardOnFile && !showStripForm && !paymentForm.loading"
        color="braap_grey"
        align="right"
        :class="{ 'not-allowed': disabled }"
      >
        <span class="body-1 d-block white--text">
          Use card number ending in <b>{{ card.Last4 }}</b> expiration date <b>{{ card.Expire }}</b> or
          <a v-if="!showStripForm" class="white--text font-weight-medium" @click.prevent="useNewCard">
            use another card </a
          >.
        </span>
      </Bubble>
      <div ref="paymentElement" class="payment-element mt-6" v-show="showStripForm">
        <!--Stripe.js injects the Payment Element-->
      </div>
      <div class="payment-bt-wrapper" v-show="!paymentForm.loading">
        <v-btn
          color="braap_green"
          :loading="paymentForm.inprogress"
          large
          :dark="!paymentForm.disabled"
          @click="doPayment"
          :disabled="paymentForm.disabled"
        >
          PROCESS PAYMENT
        </v-btn>
        <small>Powered by Stripe</small>
      </div>
    </div>
  </div>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'PaymentFailed',
    props: {
      vehicleId: {
        type: String
      },
      autoPilot: {
        type: Boolean
      },
      card: {
        type: Object
      },
      jobId: {
        type: String
      },
      activity: {
        type: Object,
        default: () => {}
      },
      disabled: {
        type: Boolean
      }
    },
    components: {
      Bubble
    },
    data: function() {
      return {
        showPaymentForm: false,
        showStripForm: false,
        paymentForm: {
          loading: false,
          disabled: true,
          inprogress: false,
          elements: null,
          publishableKey: null,
          clientSecret: null,
          error: null
        }
      }
    },
    created() {},
    computed: {
      cardOnFile() {
        return this.card != null
      }
    },
    methods: {
      moment,
      openPaymentForm() {
        if (this.disabled) return

        this.showPaymentForm = true
        if (!this.paymentForm.clientSecret) {
          this.paymentForm.loading = true
          this.createOrUpdatePaymentIntent(false).then(() => {
            this.paymentForm.loading = false
            this.paymentForm.disabled = false
            this.showStripForm = false
            this.$root.scrollTimelineToBottom()
          })
        }
        this.$root.scrollTimelineToBottom()
      },
      useNewCard() {
        if (this.disabled) return

        this.showPaymentForm = true
        this.showStripForm = true
        if (!this.paymentForm.elements) {
          this.paymentForm.loading = true
          this.createOrUpdatePaymentIntent(true).then(this.loadStripPaymentForm)
        }
        this.$root.scrollTimelineToBottom()
      },
      createOrUpdatePaymentIntent(saveCard) {
        return this.$axios
          .post('/Timeline/CreateOrUpdatePaymentIntent', {
            jobId: this.jobId,
            saveCard
          })
          .then(result => {
            if (result && result.status === 200) {
              this.paymentForm.clientSecret = result.data.ClientSecret
              this.paymentForm.publishableKey = result.data.PublishableKey
              this.stripe = window.Stripe(this.paymentForm.publishableKey, { locale: 'en' })
            }
          })
      },
      loadStripPaymentForm() {
        const options = {
          clientSecret: this.paymentForm.clientSecret,
          fonts: [
            {
              cssSrc: 'https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap'
            }
          ],
          appearance: {
            theme: 'stripe',
            labels: 'floating',
            variables: {
              fontFamily: 'Roboto',
              fontSizeBase: '14px'
            },
            rules: {
              '.Input': {
                padding: '5px 10px'
              }
            }
          }
        }
        this.paymentForm.elements = this.stripe.elements(options)
        const paymentElement = this.paymentForm.elements.create('payment')
        paymentElement.on('ready', () => {
          this.paymentForm.loading = false
          this.$nextTick(() => {
            this.$root.scrollTimelineToBottom()
          })
        })
        paymentElement.on('change', event => {
          if (!this.paymentForm.inprogress) {
            if (!event.complete) {
              this.paymentForm.disabled = true
            } else {
              this.paymentForm.disabled = false
            }
          }
        })
        paymentElement.mount(this.$refs.paymentElement)
      },
      doPayment() {
        if (this.showStripForm) {
          this.paymentWithNewCard()
        } else {
          this.paymentWithSavedCard()
        }
      },
      paymentWithNewCard() {
        this.paymentForm.inprogress = true
        var options = {
          elements: this.paymentForm.elements,
          confirmParams: {
            return_url: window.location.protocol + '//' + window.location.host + '/checkout/paymentcomplete'
          },
          redirect: 'if_required'
        }
        this.stripe.confirmPayment(options).then(this.paymentCallback)
      },
      paymentWithSavedCard() {
        this.paymentForm.inprogress = true
        var data = {
          payment_method: this.card.Id
        }
        this.stripe.confirmCardPayment(this.paymentForm.clientSecret, data).then(this.paymentCallback)
      },
      paymentCallback({ error, paymentIntent }) {
        if (error) {
          this.paymentForm.disabled = true
          this.paymentForm.inprogress = false

          if (error.type === 'card_error' || error.type === 'validation_error') {
            this.paymentForm.error = error.message
          } else {
            this.paymentForm.error = error.message = 'An unexpected error occured.'
          }
        } else {
          // payment success, ajax to process the payment complete event
          this.$axios
            .post('/Timeline/MaintenanceOrderPaymentSuccess', {
              paymentIntentId: paymentIntent.id,
              vehicleId: this.vehicleId,
              activityId: this.activity.id
            })
            .then(result => {
              if (result && result.status === 200) {
                this.$emit('change', {
                  action: 'add',
                  activity: result.data
                })
              }
            })
        }
      },
      hidePaymentForm() {
        if (!this.autoPilot && this.cardOnFile) {
          this.showStripForm = false
          this.paymentForm.disabled = false
        } else this.showPaymentForm = false
        this.$root.scrollTimelineToBottom()
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .payment-status {
    max-width: 400px;

    .loading {
      display: flex;
      flex-direction: column;
      min-height: 100px;
      align-items: center;
      justify-content: center;
    }

    .saved-card {
      margin-bottom: 10px;
    }
    .payment-element {
      width: 100%;
    }
    .payment-bt-wrapper {
      margin-top: 10px;
      button {
        width: 100%;
        color: #fff;
      }
      small {
        width: 100%;
        display: block;
        margin-top: 5px;
        color: #a4a4a4;
        text-align: right;
      }
    }
    .close-bt {
      top: -10px;
      right: -13px;
      z-index: 1;
    }
  }
</style>
