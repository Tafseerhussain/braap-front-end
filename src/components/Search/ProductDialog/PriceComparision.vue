<template>
  <v-card flat class="product-price">
    <v-card-text class="pa-0">
      <template v-if="sellers.length > 0">
        <div class="braap-table px-3 pt-3 pb-3 body-1">
          <v-row class="white primary--text">
            <v-col cols="5" class="body-0">Supplier</v-col>
            <v-col cols="3" class="text-right body-0">Price</v-col>
            <v-col cols="4" class="text-center body-0">{{ current === 0 ? 'Best Price' : 'Selected Price' }}</v-col>
          </v-row>
          <v-row @click="select(seller, index)" v-for="(seller, index) in sellers" :key="index">
            <v-col cols="5">
              <div class="d-flex align-center">
                <v-checkbox
                  large
                  hide-details
                  class="ma-0 pa-0"
                  color="braap_orange"
                  :ripple="false"
                  :value="current === index"
                ></v-checkbox>
                {{ seller.name }}
              </div>
            </v-col>
            <v-col cols="3" class="text-right">{{ seller.braap_price | currency }}</v-col>
            <v-col cols="4" class="text-center d-block">
              <v-icon v-if="current === index" color="braap_green">mdi-check</v-icon>
            </v-col>
          </v-row>
        </div>
      </template>
      <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%">
        <div class="d-flex justify-center">
          <img class="empty-img" src="/img/empty.png" />
        </div>
        <div class="d-flex flex-wrap align-center justify-center primary--text body-1 pt-6">
          <v-btn text color="braap_deep_blue" class="pr-2" @click="closeDialog"> Go back to results</v-btn>
          <span class="mx-1 d-none d-sm-block">|</span>Price comparisons are sometimes not available.
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'product-price',
    components: {},
    props: {
      onlineSellers: {
        type: Array
      }
    },
    data: function() {
      return {
        current: -1
      }
    },
    watch: {},
    computed: {
      sellers() {
        if (this.onlineSellers) {
          let data = [...this.onlineSellers]
          data.sort((x, y) => {
            return x.braap_price - y.braap_price
          })
          return data
        } else {
          return []
        }
      }
    },
    created() {},
    mounted() {
      this.current = 0
    },
    methods: {
      select(seller, index) {
        this.current = index
        this.$emit('select', seller)
      },
      closeDialog() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .product-price {
    .empty-img {
      width: 80%;
    }
  }
</style>