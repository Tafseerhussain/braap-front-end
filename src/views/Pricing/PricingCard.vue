<template>
  <div class="pricing-card pa-10 mb-7 rounded-10">
    <div class="card-header relative">
      <v-row>
        <v-col cols="8">
          <div class="card-title text-uppercase primary--text font-weight-bold">{{ title }}</div>
          <div class="card-subtitle mt-5">
            <div class="braap_orange--text font-weight-medium">{{ price }}</div>
            <div class="text-h6 mt-2">{{ subTitle }}</div>
          </div>
        </v-col>
        <v-col cols="4">
          <img :src="img" class="header-img  fade-right-delay" />
        </v-col>
      </v-row>
      <!-- <div class="card-title text-uppercase primary--text font-weight-bold">{{ title }}</div>
      <div class="card-subtitle mt-5">
        <div class="braap_orange--text font-weight-medium">{{ price }}</div>
        <div class="text-h6 mt-2">{{ subTitle }}</div>
      </div>
      <img :src="img" class="header-img absolute fade-right-delay" /> -->
    </div>
    <div class="card-body braap-content mt-5">
      <v-row>
        <template v-if="isLarge">
          <v-col cols="12" md="6" class="pb-0 pb-md-3">
            <p class="mb-0" v-for="(item, index) in body1" :key="index">
              <span class="pointer relative braap_orange--text mr-1">⋅</span>{{ item }}
            </p>
          </v-col>
          <v-col cols="12" md="6" class="pt-0 pt-md-3">
            <p class="mb-0" v-for="(item, index) in body2" :key="index">
              <span class="pointer relative braap_orange--text mr-1">⋅</span>{{ item }}
            </p>
          </v-col>
        </template>
        <template v-else>
          <v-col cols="12">
            <p class="mb-0" v-for="(item, index) in body1" :key="index">
              <span class="pointer relative braap_orange--text mr-1">⋅</span>{{ item }}
            </p>
          </v-col>
        </template>
      </v-row>
    </div>
    <div class="card-footer text-right">
      <v-btn class="start-btn mt-7 rounded-10 body-0 px-8" depressed color="braap_orange" dark x-large
        >Get Started</v-btn
      >
    </div>
    <div></div>
  </div>
</template>

<script>
  export default {
    name: 'PricingCard',
    props: ['title', 'price', 'subTitle', 'img', 'body1', 'body2', 'isLarge']
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .pricing-card {
    border: 2px solid transparent;
    box-shadow: 0 4px 15px rgb(138 138 138 / 10%);
    transition: 0.3s;
    &:hover {
      border-color: $braap_orange;
    }
    .card-header {
      .card-title {
        font-size: 34px;
        padding-right: 140px;
      }
      .card-subtitle {
        font-size: 27px;
        margin-bottom: 10px;
      }
      .header-img {
        right: -10px;
        top: -10px;
        height: 120px;
      }
    }
    .card-body {
      .pointer {
        font-size: 40px;
        top: 5px;
      }
    }
  }
</style>