<template>
  <div class="home-page">
    <sticky-search-bar></sticky-search-bar>
    <home-header></home-header>
    <hero-banner></hero-banner>

    <trending-fixes id="trending-fixes" @on-open="open=true"></trending-fixes>
    <feature-home></feature-home>
    <market-places></market-places>
    <testimonials></testimonials>
    <customer-search></customer-search>
    <braap-blogs :isHome="true"></braap-blogs>
    <braap-customer></braap-customer>
    <braap-footer></braap-footer>

    <how-braap-works v-model="open"></how-braap-works>
  </div>
</template>

<script>
  import StickySearchBar from './StickySearchBar'
  import HomeHeader from './Header.vue'
  import HeroBanner from './HeroBanner.vue'
  import TrendingFixes from './TrendingFixes.vue'
  import FeatureHome from '../Features/FeatureHome.vue'
  import MarketPlaces from './MarketPlaces.vue'
  import Testimonials from './Testimonials.vue'
  import CustomerSearch from './CustomerSearch.vue'
  import BraapBlogs from '../Blog/BraapBlogs.vue'
  import BraapCustomer from './BraapCustomer.vue'
  import BraapFooter from '../../components/BraapFooter'
  import HowBraapWorks from './HowBraapWorks.vue'

  export default {
    components: {
      StickySearchBar,
      HomeHeader,
      HeroBanner,
      TrendingFixes,
      FeatureHome,
      MarketPlaces,
      Testimonials,
      CustomerSearch,
      BraapBlogs,
      BraapCustomer,
      BraapFooter,
      HowBraapWorks
    },
    data() {
      return {
        open: false
      }
    }
  }
</script>

<style lang="scss">
  .home-page {
    .braap-blogs {
      background: #f7f7f7;
    }
  }
</style>
