<template>
  <div class="white">
    <v-container class="braap-customer">
      <v-row>
        <v-col cols="12" class="text-center">
          <div class="section-title middle font-weight-bold primary--text">
            Reasons <span class="braap_orange--text">Why Customers</span> like Braap
          </div>
        </v-col>
      </v-row>
      <customer-reason></customer-reason>
    </v-container>
  </div>
</template>

<script>
import CustomerReason from './CustomerReason.vue'
  export default {
    name: 'BraapCustomer',
    components:{
      CustomerReason
    }
  }
</script>

<style lang="scss">
  .braap-customer {
    padding: 80px 0;
  }
</style>
