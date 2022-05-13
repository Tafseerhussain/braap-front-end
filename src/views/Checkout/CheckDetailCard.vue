<template>
  <div class="check-detail-card pa-5 mb-5 d-flex rounded-10 relative">
    <div class="img-container rounded-10 px-2">
      <img v-if="isDiagnosticsCount" class="rounded-10" src="/img/search/parts-icon.png" />
      <img v-else class="rounded-10" :src="value.partImage" />
    </div>
    <div class="detial-container px-2">
      <div class="font-weight-bold primary--text body-0">{{ name }}</div>
      <div class="my-1 body-2 primary--text">ESTIMATING PRICE</div>
      <div class="primary--text font-weight-medium">× {{ count }}</div>
    </div>
    <v-spacer></v-spacer>
    <div class="price-container px-2">
      <div class="mb-3 primary--text">{{ price | currency }}</div>
      <div class="primary--text">Subtotal >{{ total | currency }}</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CheckDetailCard',
    props: ['value'],
    computed: {
      name() {
        return this.value.workName ? this.value.workName : this.value.partName
      },
      count() {
        return this.value.workQty ? this.value.workQty : this.value.partQty
      },
      price() {
        return this.value.workPrice ? this.value.workPrice : this.value.partPrice
      },
      total() {
        return this.price * this.count
      },
      // imgSrc() {
      //   return this.value.diagnosticsImg ? this.value.diagnosticsImg : this.value.part_img
      // },
      isDiagnosticsCount() {
        if (this.value.workName) {
          return true
        } else {
          return false
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .check-detail-card {
    background: white;
    border: 1px solid $braap_light_grey !important;
    .img-container {
      flex-basis: 16.6%;

      img {
        border: 1px solid #dee2e6;
        padding: 4.5px;
        width: 100%;
        height: auto;
      }
    }
    .detial-container {
      flex-basis: 58.3%;
    }
    .price-container {
      flex-basis: 25%;
    }
  }
</style>