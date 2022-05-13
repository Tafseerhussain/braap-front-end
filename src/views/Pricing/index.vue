<template>
  <div class="white">
      <pricing-header></pricing-header>
      <pricing-detail></pricing-detail>
      <pricing-footer></pricing-footer>
  </div>
</template>

<script>
import PricingHeader from './PricingHeader.vue'
import PricingDetail from './PricingDetail.vue'
import PricingFooter from './PricingFooter.vue'
export default {
    components: {
        PricingHeader,
        PricingDetail,
        PricingFooter
    },
    mounted(){
        this.$initSr()
    }
}
</script>

<style lang="scss">

</style>