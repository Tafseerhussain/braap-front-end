<template>
  <div class="check-out">
    <v-row>
      <v-col cols="6" class="let-col white">
        <v-btn text class="mb-6 braap_orange--text font-weight-medium px-1 ml-n1" @click="back">
          <v-icon color="braap_orange">mdi-arrow-left</v-icon
          ><span class="mt-1 ml-1" style="font-size: 20px"> Back</span>
        </v-btn>
        <v-tabs-items v-model="step" style="background: transparent">
          <v-tab-item transition="scroll-x-reverse-transition" reverse-transition="scroll-x-transition">
            <ShippingAddress
              v-if="step === 0"
              @next="next"
              :shipping="totalShipping"
              @change="shippingChange"
            ></ShippingAddress>
          </v-tab-item>
          <v-tab-item transition="scroll-x-reverse-transition" reverse-transition="scroll-x-transition">
            <Payment v-if="step === 1" @next="next" :payment="payment" :card="card"></Payment>
          </v-tab-item>
        </v-tabs-items>
      </v-col>
      <v-col cols="6" class="right-col braap_bg_grey">
        <check-card-container
          :totalShipping="totalShipping"
          :totalAmount="totalAmount"
          :totalTax="totalTax"
        ></check-card-container>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import checkCardContainer from './CheckCardContainer.vue'
  import ShippingAddress from './ShippingAddress.vue'
  import Payment from './Payment'

  export default {
    name: 'CheckOut',
    components: {
      checkCardContainer,
      ShippingAddress,
      Payment
    },
    data() {
      return {
        step: 0,
        totalShipping: 0,
        totalAmount: 0,
        totalTax: 0,
        type: null, // SUBSCRIPTION | CHECKOUT,
        payment: {},
        card: {}
      }
    },
    created() {
      this.getOrderDetails()
    },
    methods: {
      back() {
        let prev = this.step - 1
        if (this.type === 'SUBSCRIPTION') {
          if (prev === 0) this.$router.go(-1)
        } else {
          if (prev < 0) {
            this.$router.go(-1)
          } else {
            this.step = this.step - 1
          }
        }
      },
      next({ payment, card }) {
        let next = this.step + 1
        if (next > 1) {
          this.$router.push({ name: 'CheckoutComplete' })
        } else if (next === 1) {
          // payment
          this.payment = payment
          this.card = card
        }
        this.step = next
      },
      shippingChange({ totalTax, totalAmount, totalShipping }) {
        this.totalShipping = totalShipping

        this.totalAmount = totalAmount
        this.totalTax = totalTax
      },
      getOrderDetails() {
        const {
          params: { totalAmount, totalShipping, totalTax }
        } = this.$route
        this.totalAmount = totalAmount
        this.totalShipping = totalShipping
        this.totalTax = totalTax

        const {
          params: { type }
        } = this.$route
        if (!type) this.$router.push({ name: 'Cart' })

        this.type = type
        if (this.type === 'SUBSCRIPTION') {
          // ignore shipping address selection, jump to payment step
          this.next({
            payment: { ...this.$route.params.payment },
            card: this.$route.params.card ? { ...this.$route.params.card } : null
          })
        }
        if (this.type === 'CHECKOUT') {
          // shipping address selection cannot be ignored, as we need shipping address to calculate tax.
          this.step = 0
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .check-out {
    .checkout-title {
      font-size: 40px;
    }
    .let-col {
      padding: 70px 100px 120px;
      background: #fcfcfc;
      min-height: 100vh;
    }
    .right-col {
      padding: 70px 100px 120px;
      background: #f7f7f7;
      min-height: 100vh;
      .price {
        font-size: 40px;
      }
      .border-top {
        border-top: 1px solid $braap_light_grey;
      }
    }
  }
</style>