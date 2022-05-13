<template>
  <div class="trending-fixes-container white">
    <div>
    </div>
    <v-container>
      <v-row>
        <v-col class="col-7 primary--text">
          <div class="section-title font-weight-bold"><span class="braap_orange--text">Trending</span> Fixes</div>
        </v-col>
        <v-col class="text-right col-5">
          <v-btn dark x-large color="braap_orange" class="rounded-10 px-7">
            <span class="text-h6 font-weight-regular text-capitalize" @click="$emit('on-open')">How Braap Works </span>
            <v-icon class="ml-2">$svg-eye</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <div ref="container" class="d-flex flex-wrap card-container mt-16">
        <template v-if="loading">
          <TrendingSkeleton :key="index" v-for="index in pageSize"></TrendingSkeleton>
        </template>
        <template v-else v-for="(l, index) in list">
          <TrendingCard :key="index" :trendingList="l"></TrendingCard>
        </template>
      </div>
    </v-container>
  </div>
</template>

<script>
  import TrendingCard from '@/components/Search/TrendingCard.vue'
  import TrendingSkeleton from '@/components/Search/TrendingSkeleton.vue'
  import mixins from '@/components/Search/mixins'
  export default {
    name: 'TrendingFixes',
    data() {
      return {
        list: [],
        loading: true,
        isOpen: false
      }
    },
    components: {
      TrendingCard,
      TrendingSkeleton
    },
    mixins: [mixins],
    mounted() {
      this.getTrendingFix()
    },
    methods: {
      getTrendingFix() {
        this.$axios.post('/api/search/TredingVehicles').then(result => {
          if (result && result.success) {
            this.list = result.data
            this.loading = false
          }
        })
      },
      onDialogBtnClicked() {
        this.isOpen = true
      }
    }
  }
</script>

<style lang="scss">
  .trending-fixes-container {
    padding-top: 150px;
    padding-bottom: 100px;
  }
</style>
