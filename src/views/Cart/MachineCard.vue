<template>
  <div class="machine-card mb-5">
    <div class="machine-name primary--text font-weight-bold text-h6 mb-2">
      {{ machineObj.vehicleFullname }}
    </div>
    <cart-diagnostics-card
      v-for="d in machineObj.works"
      :key="d.cartItemId"
      :diagnosticsObj="d"
      :machineObj="machineObj"
    ></cart-diagnostics-card>
  </div>
</template>

<script>
  import CartDiagnosticsCard from './CartDiagnosticsCard.vue'
  export default {
    name: 'MachineCard',
    components: {
      CartDiagnosticsCard
    },
    props: ['machineObj'],
    methods: {}
  }
</script>

<style lang="scss">
  .machine-card {
  }
</style>