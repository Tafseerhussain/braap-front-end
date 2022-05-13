<template>
  <div>
    <v-radio-group v-model="select" v-if="savedCard" @change="change">
      <v-radio :ripple="false" value="saved">
        <template #label>
          <span class="body-0 mt-1"
            >Use card number ending in {{ savedCard.last4 }} expiration date {{ savedCard.expiry }}</span
          ></template
        >
      </v-radio>
      <v-radio :ripple="false" value="new">
        <template #label> <span class="body-0 mt-1">Use another card</span></template>
      </v-radio>
    </v-radio-group>

    <div class="stripe-payment pa-0" v-show="showStripeForm">
      <div class="loading" v-show="loading">
        <v-progress-circular indeterminate color="braap_orange"></v-progress-circular>
      </div>
      <div ref="paymentElement" class="payment-element">
        <!--Stripe.js injects the Payment Element-->
      </div>
    </div>
    <div
      class="payment-bt-wrapper d-flex mt-5"
      v-if="(!loading && select === 'new') || (savedCard && select === 'saved')"
    >
      <slot v-bind="{ inprogress, disabled, handleClick }">
        <v-btn
          color="braap_orange"
          :loading="inprogress"
          x-large
          :dark="!disabled || select === 'saved'"
          @click="handleClick"
          :disabled="disabled && select !== 'saved'"
          class="rounded-10 ml-auto body-0 px-7"
          >{{ buttonText }}</v-btn
        >
      </slot>
      <!-- <small>Powered by Stripe</small> -->
    </div>
  </div>
</template>

<script>
  export default {
    name: 'StripePayment',

    props: {
      buttonText: {
        type: String,
        default: 'PROCESS PAYMENT'
      },
      savedCard: {
        type: Object
      },
      publishableKey: {
        type: String,
        required: true
      },
      clientSecret: {
        type: String,
        required: true
      },
      callbackUrl: {
        type: String,
        required: true
      }
    },

    data() {
      return {
        select: 'new',
        elements: null,
        stripe: null,
        loading: true,
        inprogress: false,
        disabled: true,
        error: null,
        showStripeForm: false
      }
    },

    watch: {},
    created() {
      if (!this.savedCard) {
        this.showStripeForm = true
      } else {
        this.select = 'saved'
      }
    },
    computed: {
      returnUrl() {
        return `${window.location.protocol}//${window.location.host}/checkout/complete?url=${encodeURIComponent(
          this.callbackUrl
        )}`
      }
    },
    methods: {
      loadStripPaymentForm() {
        var $this = this

        this.showStripeForm = true

        this.stripe = window.Stripe(this.publishableKey, { locale: 'en' })
        const options = {
          clientSecret: this.clientSecret,
          fonts: [
            {
              family: 'axiforma',
              src: `url(${window.location.protocol}//${window.location.host}/fonts/axiforma-regular.otf)`,
              weight: '400'
            }
          ],
          appearance: {
            theme: 'stripe',
            labels: 'floating',
            variables: {
              fontFamily: 'axiforma',
              fontSizeBase: '14px'
            },
            rules: {
              '.Label': {
                marginTop: '10px'
              },
              '.Label--floating': {
                color: '#E58A00',
                marginTop: '-7px'
              },
              '.Label--invalid': {
                color: '#ff5252'
              },
              '.Input': {
                paddingTop: '0px',
                paddingBottom: '9px',
                marginTop: '21px',
                outline: 'none',
                borderRadius: '0px',
                borderColor: 'transparent',
                borderBottomColor: '#0000006b'
              },
              '.Input--invalid': {
                boxShadow: 'none',
                borderColor: 'transparent',
                borderBottomColor: '#ff5252',
                color: '#ff5252'
              },
              '.Input:focus': {
                outline: 'none',
                borderColor: 'transparent',
                boxShadow: 'none',
                borderBottomColor: '#E58A00'
              },
              '.Error': {
                color: '#ff5252'
              },
              '.TermsText': {
                border: '1px solid #c4c4c4',
                borderRadius: '10px',
                padding: '10px',
                fontSize: '12px',
                lineHeight: '20px'
              }
            }
          }
        }
        this.elements = this.stripe.elements(options)
        const paymentElement = this.elements.create('payment')
        paymentElement.on('ready', function() {
          $this.loading = false
          $this.$emit('ready')
        })
        paymentElement.on('change', function(event) {
          if (!$this.inprogress) {
            if (!event.complete) {
              $this.disabled = true
            } else {
              $this.disabled = false
            }
          }
        })
        paymentElement.mount(this.$refs.paymentElement)
      },
      change() {
        if (this.select === 'new') {
          this.showStripeForm = true
          if (!this.elements) {
            this.loadStripPaymentForm()
          }
        } else {
          this.showStripeForm = false
        }
      },
      handleClick() {
        this.inprogress = true
        this.$emit('on-submit', {
          confirmSetup: this.confirmSetup,
          confirmPayment: this.select === 'new' ? this.confirmPayment : this.confirmCardPayment
        })
      },
      stripeResponse(response, success, error) {
        var err = response.error
        if (err) {
          this.inprogress = false
          this.disabled = false

          let msg = ''
          if (err.type === 'card_error' || err.type === 'validation_error') {
            msg = err.message
          } else {
            msg = 'An unexpected error occured.'
          }
          if (error) error(msg)
        } else {
          const { paymentIntent, setupIntent } = response
          if (paymentIntent) {
            this.callback({ payment_intent: paymentIntent.id, client_secret: paymentIntent.clientSecret }, success)
          }
          if (setupIntent) {
            this.callback({ setup_intent: setupIntent.id, client_secret: setupIntent.clientSecret }, success)
          }
        }
      },
      confirmSetup({ success, error }) {
        var options = {
          elements: this.elements,
          confirmParams: {
            return_url: this.returnUrl
          },
          redirect: 'if_required'
        }
        this.stripe.confirmSetup(options).then(response => {
          this.stripeResponse(response, success, error)
        })
      },
      confirmCardPayment({ success, error }) {
        var data = {
          payment_method: this.savedCard.id
        }

        if (!this.stripe) this.stripe = window.Stripe(this.publishableKey, { locale: 'en' })

        this.stripe.confirmCardPayment(this.clientSecret, data).then(response => {
          this.stripeResponse(response, success, error)
        })
      },
      confirmPayment({ success, error }) {
        var options = {
          elements: this.elements,
          confirmParams: {
            return_url: this.returnUrl
          },
          redirect: 'if_required'
        }

        this.stripe.confirmPayment(options).then(response => {
          this.stripeResponse(response, success, error)
        })
      },
      callback(params, success) {
        this.$axios
          .get(this.callbackUrl, {
            params
          })
          .then(result => {
            if (result.success) {
              if (!result.data) this.$msg.warning(result.message)
              success()
            }
          })
      }
    }
  }
</script>
<style  lang="scss">
  .stripe-payment {
    padding: 10px;
    background-color: #fff;
    border-radius: 8px;

    .loading {
      display: flex;
      flex-direction: column;
      min-height: 100px;
      align-items: center;
      justify-content: center;
    }
    .payment-element {
      width: 100%;
    }
    .payment-bt-wrapper {
      // margin-top: 20px;
      // button {
      //   width: 100%;
      //   color: #fff;
      // }
      small {
        width: 100%;
        display: block;
        margin-top: 5px;
        color: #a4a4a4;
        text-align: right;
      }
    }
  }
</style>