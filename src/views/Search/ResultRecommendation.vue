<template>
  <div class="result-recommendation white pt-15 pb-13">
    <v-container>
      <v-row>
        <v-col cols="5">
          <div class="section-title font-weight-bold primary--text">Recommendation</div>
        </v-col>
        <v-col cols="7">
          <div v-if="filter.query" class="showing-results braap_orange--text body-0">
            <span class="primary--text font-weight-bold">Showing Results for</span>
            {{ filter.query }}
          </div>
        </v-col>
      </v-row>

      <div ref="container" class="d-flex flex-wrap card-container mt-16">
        <template v-if="loading">
          <TrendingSkeleton :key="index" v-for="index in pageSize"></TrendingSkeleton>
        </template>
        <template v-else-if="list.length === 0">
          <div class="empty-results d-flex flex-column align-center braap-content flex-grow-1 px-2 mt-4">
            <img src="/img/empty.png" alt="empty" height="300" class="mb-5" />
            <p class="mb-0">No recommendations were found for your search.</p>
          </div>
        </template>
        <template v-for="(l, index) in list">
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
    name: 'ResultRecommendation',
    props: {
      filter: {
        type: Object,
        default() {
          return {}
        }
      },
      hasData: {
        type: Boolean
      }
    },
    data() {
      return {
        list: [],
        loading: false
      }
    },
    components: {
      TrendingCard,
      TrendingSkeleton
    },
    mixins: [mixins],
    created() {
      if (this.filter.query) this.getTrendingFix()
    },
    watch: {
      'filter.timestamp'() {
        if (this.filter.query) this.getTrendingFix()
      }
    },
    methods: {
      getTrendingFix() {
        this.loading = true
        this.$axios.post('/api/search/getTrendingVehicles', { ...this.filter }).then(result => {
          if (result && result.success) {
            this.list = result.data
            this.$emit('update:hasData', result.data.length > 0)
          }
          this.loading = false
        })
      }
    }
  }
</script>

<style lang="scss">
  .result-recommendation {
    .showing-results {
      text-align: right;
      position: relative;
      top: 50%;
      transform: translateY(-50%);
    }
  }
</style>