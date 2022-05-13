<template>
  <div class="pricing-detail white mt-12 pb-12">
    <v-container>
      <v-row>
        <v-col cols="12" md="7" class="py-0">
          <pricing-card
            v-for="(pri, index) in largeData"
            :title="pri.title"
            :price="pri.price"
            :subTitle="pri.subTitle"
            :img="pri.img"
            :body1="pri.body1"
            :body2="pri.body2"
            :isLarge="pri.isLarge"
            :key="index"
          ></pricing-card>
        </v-col>
        <v-col cols="12" md="5" class="py-0">
          <pricing-card
            v-for="(pri, index) in smallData"
            :title="pri.title"
            :price="pri.price"
            :subTitle="pri.subTitle"
            :img="pri.img"
            :body1="pri.body1"
            :isLarge="pri.isLarge"
            :key="index"
          ></pricing-card>
        </v-col>
      </v-row>
      <v-row class="large-customer mx-n3 braap_bg_grey rounded-10">
        <v-col cols="8" class="braap-content py-0 d-flex align-center">
          <p class="mb-0">For our largest customers we offer tiered pricing.</p>
        </v-col>
        <v-col cols="4" class="py-0 text-right">
          <v-btn class="body-0 px-7 rounded-10" x-large dark color="braap_orange" @click="onContactBtnClicked">
            Contact us for details</v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import PricingCard from './PricingCard.vue'
  import PricingCardData from './pricingCardData.js'
  export default {
    name: 'PricingDetail',
    components: {
      PricingCard
    },
    computed: {
      largeData() {
        return PricingCardData.filter(item => {
          return item.isLarge
        })
      },
      smallData() {
        return PricingCardData.filter(item => {
          return !item.isLarge
        })
      }
    },
    methods: {
      onContactBtnClicked() {
        this.$router.push({ path: '/contact' })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .pricing-detail {
    .large-customer {
      margin-top: 50px;
      border: 1px solid $braap_light_grey !important;
      padding: 20px 30px;
    }
  }
</style>