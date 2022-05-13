<template>
  <div class="customer-search white">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="section-title font-weight-bold primary--text">
            Our
            <span class="braap_orange--text">Customer</span>
            Also Searched
          </div>
        </v-col>
      </v-row>
      <div class="d-flex mt-10 justify-space-between">
        <div v-for="sl in searchList" :key="sl.title" class="search-list-item">
          <div class="mt-5 mb-7 primary--text font-weight-medium text-h5">{{ sl.title }}</div>
          <div v-for="(c, index) in sl.content" :key="index" class="mb-5">
            <a href="javascript:;" class="search-link body-0 braap_grey--text">{{ c }}</a>
          </div>
        </div>
      </div>
    </v-container>
  </div>
</template>

<script>
  import customerSearchData from './customerSearchData'
  export default {
    name: 'CustomerSearch',
    data() {
      return {
        searchList: null
      }
    },
    created() {
      this.searchList = customerSearchData
    }
  }
</script>

<style lang="scss">
@import '@/styles/color.scss';
  .customer-search {
    padding: 100px 0;
    .search-list-item {
      flex-basis: 33.3%;
      .search-link:hover {
        color: $braap_orange !important;
      }
    }
  }
</style>