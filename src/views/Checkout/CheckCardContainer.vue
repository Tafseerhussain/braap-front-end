<template>
  <div class="check-card-container">
    <div class="body-0 primary--text">Amount due</div>
    <div class="price mt-1 mb-5 font-weight-black primary--text">{{ totalAmount | currency }}</div>
    <div class="py-5">
      <div class="d-flex justify-space-between primary--text mb-5">
        <div>Subtotal</div>
        <div>{{ total | currency }}</div>
      </div>
      <div class="d-flex justify-space-between primary--text mb-5">
        <div>Shipping</div>
        <div>{{ totalShipping | currency }}</div>
      </div>
      <div class="d-flex justify-space-between primary--text mb-5">
        <div>Taxes</div>
        <div>{{ totalTax | currency }}</div>
      </div>
      <div class="d-flex justify-space-between font-weight-medium primary--text mb-5 pt-5 border-top">
        <div>Total</div>
        <div>{{ totalAmount | currency }}</div>
      </div>
    </div>
    <template v-if="type === 'CHECKOUT'">
      <check-card v-for="machineObj in cartListItems" :key="machineObj.vehicleId" :machineObj="machineObj"></check-card>
    </template>
  </div>
</template>

<script>
  import { mapState } from 'vuex'
  import CheckCard from './CheckCard.vue'

  export default {
    name: 'CheckCardContainer',
    props: ['totalShipping', 'totalAmount', 'totalTax'],
    data() {
      return {
        isCheckOut: '',
        type: ''
      }
    },
    mounted() {
      const {
        params: { type }
      } = this.$route
      this.type = type
    },
    components: {
      CheckCard
    },
    computed: {
      ...mapState({
        cartListItems: state => state.cart.cartListItems
      }),
      total() {
        return this.totalAmount - (this.totalShipping || 0) - this.totalTax
      }
    }
  }
</script>

<style lang="scss">
  .check-card-container {
  }
</style>