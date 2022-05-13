<template>
  <div class="payment-details">
    <h1 class="checkout-title font-weight-bold primary--text mb-3">Payment Details</h1>

    <div class="pt-5">
      <StripePayment
        ref="stripeCheckout"
        button-text="Confirm Payment"
        :saved-card="savedCard"
        :publishable-key="paymentForm.publishableKey"
        :client-secret="paymentForm.clientSecret"
        :callback-url="paymentForm.returnUrl"
        @on-submit="onConfirmPayment"
      ></StripePayment>
    </div>
  </div>
</template>

<script>
  import StripePayment from '@/components/Common/StripePayment.vue'

  export default {
    name: 'Payment',
    components: {
      StripePayment
    },
    props: {
      payment: {
        type: Object,
        required: true
      },
      card: {
        type: Object
      }
    },
    data() {
      return {
        select: '1',
        savedCard: null,
        paymentForm: {
          publishableKey: null,
          clientSecret: null,
          returnUrl: null
        }
      }
    },
    created() {
      if (this.payment) {
        this.paymentForm = { ...this.payment }
      }
      if (this.card) {
        this.savedCard = { ...this.card }
      } else {
        this.$nextTick(() => {
          this.$refs.stripeCheckout.loadStripPaymentForm(this.paymentForm)
        })
      }
    },
    methods: {
      onConfirmPayment({ confirmPayment }) {
        confirmPayment({
          success: () => {
            this.$emit('next', {})
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
  @import '@/styles/color.scss';
  .check-out {
  }
</style>