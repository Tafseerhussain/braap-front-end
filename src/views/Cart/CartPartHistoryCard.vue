<template>
  <div class="cart-part-history-card pa-5 rounded-10 mb-5">
    <div class="d-flex mx-n3">
      <div class="img-container mx-3">
        <div class="rounded-10 pa-1">
          <img :src="partObj.part_img" />
        </div>
      </div>

      <div class="info-container mx-3">
        <div class="primary--text body-0 font-weight-bold">
          {{ partObj.part_name }}
        </div>
        <div class="my-1 text-subtitle-2">ESTIMATING PRICE</div>
        <div class="text-caption">
          {{ partObj.part_desc }}
        </div>
      </div>

      <div class="count-container mx-3">
        <div class="text-center body-0">{{ partObj.part_count }}</div>
      </div>

      <div class="action-container mx-3">
        <div class="d-flex justify-end">
          <div>
            <v-tooltip top color="primary" content-class="top">
              <template v-slot:activator="{ on, attrs }">
                <div v-bind="attrs" v-on="on" class="pb-2 body-1 primary--text">
                  <img src="/icons/eye-gray.svg" />
                </div>
              </template>
              <div class="text-center">Check Status</div>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex mx-n3 justify-end mt-3">
      <div class="price-container d-flex justify-space-between mx-3">
        <div>${{ Number(partObj.part_price).toFixed(2) }}</div>
        <div>Subtotal > ${{ subTotal }}</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'CartPartHistoryCard',
    props: ['partObj'],
    computed: {
      subTotal() {
        return Number(this.partObj.part_price * this.partObj.part_count).toFixed(2)
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .cart-part-history-card {
    width: 90%;
    margin-left: 10%;
    border: 1px solid $braap_light_grey;
    position: relative;
    background: #fbfbfb;

    &::before {
      content: '';
      border: 1px solid $braap_light_grey;
      border-top-color: transparent;
      border-right-color: transparent;
      width: 20px;
      height: calc(50% + 220px);
      position: absolute;
      bottom: 50%;
      left: -20px;
    }
    .img-container {
      flex-basis: 16.6%;
      div {
        border: 1px solid $braap_light_grey;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
    }

    .info-container {
      flex-basis: 50%;
    }

    .count-container {
      flex-basis: 16.6%;
    }

    .action-container {
      flex-basis: 16.6%;
      .btn-icon {
        cursor: pointer;
      }
      img {
        height: 20px;
      }
    }

    .price-container {
      flex-basis: 80%;
    }
  }
</style>