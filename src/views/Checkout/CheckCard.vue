<template>
  <div>
    <div class="check-card" v-for="d in machineObj.works" :key="d.vehicleWorkId">
      <div>
        <check-detail-card :value="d"></check-detail-card>
      </div>
      <check-detail-card v-for="p in d.parts" :key="p.cartItemId" :value="p"></check-detail-card>
    </div>
  </div>
</template>

<script>
  import CheckDetailCard from './CheckDetailCard.vue'
  export default {
    name: 'CheckCard',
    props: ['machineObj'],
    components: {
      CheckDetailCard
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .check-card {
  }
</style>