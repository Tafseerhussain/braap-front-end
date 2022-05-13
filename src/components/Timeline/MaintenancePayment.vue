<template>
  <div class="maintenance-payment" v-if="paymentState">
    <template v-if="paymentStatus=='succeeded'">
      <div class="event-item line-indicator">
        <div class="event-meta">
          <template v-if="!updatedTime">
            <span class="time">{{ moment(createdTime).format('MMM D, YYYY h:mm A') }}</span>
            <span class="user">Created by {{ createdUser }}</span>
          </template>
          <template v-else>
            <span class="time">{{ moment(updatedTime).format('MMM D, YYYY h:mm A') }}</span>
            <span class="user">Updated by {{ updatedUser }}</span>
          </template>
        </div>
        <div class="event-title">
          <v-icon class="icon">$svg-tick</v-icon>
          <div class="content color-40">
            <span>
              <b>CONFIRMATION:</b> 
              {{ successMsg }}
              <template v-if="autoPilotAlert">To automate this for future transactions turn on <a @click.prevent="turnOnAutoPilot">auto pilot</a>.</template>
              </span>
            <a ref="showDisclosureBtn" class="color-40" href="#" @click.prevent="showDisclosure = true">Read the billing disclosure.</a>
          </div>
        </div>
      </div>
      <div class="event-item line-indicator no-indicator" v-show="showDisclosure">
        <div class="event-meta">
        </div>
        <div class="event-title" v-click-outside="{
          handler: () => this.showDisclosure = false,
          closeConditional: () => this.showDisclosure,
          include: () => [this.$refs.showDisclosureBtn] 
        }">
          <div class="icon" src="" />
          <div class="content">
              <div class="disclosure color-40">
              <p>BRAAP ESTIMATE EXPLAINED</p>
              <p>
                This is an estimate based on our understanding of the service required. The price in the cart is our best
                estimate of the technician labor. We consider our experience and competitive pricing; while ensuring the
                highest quality. Once our technician reviews the diagnostic and analyzes the machine, Braap confirms the
                required parts. In some cases when we have questions or need to modify the diagnostic the service team will
                reach out to you. Watch your email and text messages.
              </p>
              <p>HOW BILLING WORKS</p>
              <p>
                <ul>
                  <li>(1) Deposit – An initial deposit of 30% of the expected labor1 is charged at checkout.</li>
                  <li>(2) Parts–When the parts are confirmed by our service team, we send an email to confirm the cost2.</li>
                  <li>(3) Completion – Once service is complete, we apply the deposit and invoice the remaining labor.</li>
                </ul>
              </p>
              <p class="color-a4">
                Disclosure: (1) Customers that do not complete Braap service pay a $100 fee for pickup and delivery. (2) If a customer does not respond to the price confirmation, Braap returns the machine not serviced.
              </p>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template v-else-if="paymentStatus=='pending' || paymentStatus=='failed'">
      <div class="event-item line-indicator">
        <div class="event-meta">
          <template v-if="!updatedTime">
            <span class="time">{{ moment(createdTime).format('MMM D, YYYY h:mm A') }}</span>
            <span class="user">Created by {{ createdUser }}</span>
          </template>
          <template v-else>
            <span class="time">{{ moment(updatedTime).format('MMM D, YYYY h:mm A') }}</span>
            <span class="user">Updated by {{ updatedUser }}</span>
          </template>
        </div>
        <div class="event-title">
          <v-icon class="icon">$svg-exclamation</v-icon>
          <div class="content color-40">
            <span>
              <b>ACTION REQUIRED: </b>
              <template v-if="paymentForm.error">{{ paymentForm.error }}</template>
              <template v-else-if="paymentState.initialMaintenanceDate">
                <span>The initial maintenance date of {{ moment(paymentState.initialMaintenanceDate).format('MMM DD, YYYY') }} was updated as this service requires an initail deposit. <a v-if="!showPaymentForm" @click.prevent="openPaymentForm">CLICK HERE TO MAKE PAYMENT</a></span>
              </template>
              <template v-else>
                <template v-if="autoPilot">
                  <span v-if="!cardOnFile">Payment method is not on file. <a v-if="!showPaymentForm" href="#" @click.prevent="openPaymentForm">CLICK HERE TO SETUP</a></span>
                  <span v-else>The credit card on file did not work because the "{{failedReason || 'unknow reason'}}". <a v-if="!showPaymentForm" href="#" @click.prevent="useNewCard">CLICK HERE TO MAKE PAYMENT</a></span>
                </template>
                <template v-else>
                  <span v-if="!cardOnFile">Auto pilot is off, and a payment method is not on file. <a v-if="!showPaymentForm" href="#" @click.prevent="useNewCard">CLICK HERE TO SETUP</a></span>
                  <span v-else>Auto pilot is off. <a v-if="!showPaymentForm" href="#" @click.prevent="openPaymentForm">CLICK HERE TO MAKE PAYMENT</a></span>
                </template>
              </template>
            </span>
          </div>
        </div>
      </div>
      <div class="event-item line-indicator no-indicator" v-show="showPaymentForm">
        <div class="event-meta">
        </div>
        <div class="event-title">
          <div class="icon"/>
          <div class="content color-40">
              <div class="saved-card" v-if="cardOnFile && !failedReason">
                We have card number ending in <b>{{ card.Last4 }}</b> expiration date <b>{{ card.Expire }}</b>. 
                <a href="#" v-show="!showStripForm && !paymentForm.loading" @click.prevent="useNewCard">Update billing information</a>
              </div>
              <div class="loading" v-show="paymentForm.loading">
                  <v-progress-circular indeterminate color="primary"></v-progress-circular>
              </div>
              <div ref="paymentElement" class="payment-element" v-show="showStripForm">
                  <!--Stripe.js injects the Payment Element-->
              </div>
              <div class="payment-bt-wrapper" v-show="!paymentForm.loading">
                  <v-btn color="success" :loading="paymentForm.inprogress" large elevation="2" @click="doPayment" :disabled="paymentForm.disabled">PROCESS PAYMENT</v-btn>
                  <small>Powered by Stripe</small>
              </div>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'MaintenancePayment',
    props: {
      machine: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        showDisclosure: false,
        stripe: null,
        showPaymentForm: false,
        showStripForm: false,
        paymentForm: {
          loading: true,
          disabled: true,
          inprogress: false,
          elements: null,
          publishableKey: null,
          clientSecret: null,
          error: null
        },
        paymentState: null,
        successMsg: 'Payment was processed.',
        autoPilotAlert: false
      }
    },
    computed: {
      autoPilot() {
        return this.machine.autoPilot
      },
      vehicleId() {
        return this.machine ? this.machine.vehicleId : null
      },
      failedReason() {
        return this.paymentState ? this.paymentState.failedReason : {}
      },
      paymentStatus() {
        return this.paymentState ? this.paymentState.paymentStatus : {}
      },
      card() {
        return this.paymentState ? this.paymentState.card : {}
      },
      cardOnFile() {
        return this.paymentState ? this.paymentState.cardOnFile : false
      },
      createdTime() {
        return this.paymentState ? this.paymentState.createdTime : new Date()
      },
      createdUser() {
        return this.paymentState ? this.paymentState.createdUser : ''
      },
      updatedTime() {
        return this.paymentState ? this.paymentState.updatedTime : ''
      },
      updatedUser() {
        return this.paymentState ? this.paymentState.updatedUser : ''
      }
    },
    mounted() {
      if (this.vehicleId) this.getPaymentState()
    },
    watch: {
      vehicleId() {
        if (this.vehicleId) this.getPaymentState()
      }
    },
    methods: {
      moment,
      openPaymentForm() {
        this.showPaymentForm = true
        if (this.cardOnFile && !this.failedReason) {
          this.getDepositOrder(false).then(() => {
            this.paymentForm.loading = false
            this.paymentForm.disabled = false
            this.showStripForm = false
          })
        } else {
          this.useNewCard()
        }
      },
      useNewCard() {
        this.showPaymentForm = true
        this.showStripForm = true
        this.paymentForm.loading = true
        this.getDepositOrder(true).then(this.loadStripPaymentForm)
      },
      getDepositOrder(saveCard) {
        var $this = this
        return this.$axios
          .post('/Timeline/CreateOrUpdateDepositeOrder', {
            jobId: this.paymentState.activeJobId,
            saveCard
          })
          .then(result => {
            if (result && result.status === 200) {
              $this.paymentForm.clientSecret = result.data.ClientSecret
              $this.paymentForm.publishableKey = result.data.PublishableKey
              $this.stripe = window.Stripe($this.paymentForm.publishableKey, { locale: 'en' })
              // if (callback) callback(result.data)
            }
          })
      },
      loadStripPaymentForm() {
        var $this = this
        const options = {
          clientSecret: $this.paymentForm.clientSecret,
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
        $this.paymentForm.elements = $this.stripe.elements(options)
        const paymentElement = $this.paymentForm.elements.create('payment')
        paymentElement.on('ready', function() {
          $this.paymentForm.loading = false
        })
        paymentElement.on('change', function(event) {
          if (!$this.paymentForm.inprogress) {
            if (!event.complete) {
              $this.paymentForm.disabled = true
            } else {
              $this.paymentForm.disabled = false
            }
          }
        })
        paymentElement.mount($this.$refs.paymentElement)
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
          this.$axios.post('/Timeline/PaymentDepositSuccess', { paymentIntentId: paymentIntent.id })
          this.paymentState.paymentStatus = 'succeeded'
          this.$emit('payment', this.paymentState)
          if (this.autoPilot) {
            this.successMsg = 'Auto pilot processed payment with card on file.'
          } else {
            this.successMsg = 'The payment was processed successfully.'
          }
        }
      },
      getPaymentState() {
        var $this = this
        $this.$axios
          .post('/Timeline/GetActiveJobPaymentState', {
            vehicleId: $this.vehicleId
          })
          .then(result => {
            if (result && result.status === 200) {
              $this.paymentState = result.data
            }
          })
      },
      turnOnAutoPilot() {
        var $this = this
        this.$axios
          .post('/Timeline/UpdateAutoPilot', {
            vehicleId: this.vehicleId,
            autoPilot: true
          })
          .then(function() {
            $this.autoPilotAlert = false
          })
      }
    }
  }
</script>

<style lang="scss">
  .maintenance-payment {
    .no-indicator {
      &:before {
        display: none !important;
      }
    }

    .disclosure {
      line-height: 1.5 li {
        list-style: none;
      }
    }

    a {
      text-decoration: underline;
    }

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
  }
</style>

