<template>
  <div>
    <div v-for="d in machineObj.diagnostics" :key="d.diagnosticsId">
      <div class="cart-history-card pa-5 rounded-10 mb-5">
        <div class="d-flex mx-n3">
          <div class="img-container mx-3">
            <div class="rounded-10 pa-1">
              <img :src="d.diagnosticsImg" />
            </div>
          </div>

          <div class="info-container mx-3">
            <div class="primary--text body-0 font-weight-bold">
              {{ d.diagnosticsName }}
            </div>
            <div class="my-1 text-subtitle-2">ESTIMATING PRICE</div>
            <div class="text-caption">
              {{ d.describe }}
            </div>
          </div>

          <div class="count-container mx-3">
            <div class="text-center body-0">{{ d.diagnosticsCount }}</div>
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
            <div>{{ d.diagnosticsPrice | currency }}</div>
            <div>Subtotal > {{ (d.diagnosticsPrice * d.diagnosticsCount) | currency }}</div>
          </div>
        </div>
      </div>
      <div class="mt-n5 pt-5 cart-part-container">
        <cart-part-history-card v-for="p in d.parts" :key="p.part_number" :partObj="p"></cart-part-history-card>
      </div>
    </div>
  </div>
</template>

<script>
  import CartPartHistoryCard from './CartPartHistoryCard.vue'
  export default {
    name: 'CartHistoryCard',
    props: ['machineObj'],
    components: {
      CartPartHistoryCard
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .cart-history-card {
    width: 100%;
    border: 1px solid $braap_light_grey;
    background: #fbfbfb;

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
    .cart-part-container {
      overflow: hidden;
    }
  }
</style>