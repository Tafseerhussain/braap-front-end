<template>
  <div class="hero-slider">
    <v-container class="relative">
      <v-row>
        <!-- <v-col :cols="10" offset="1" class="white--text text-center">
          <h1 class="hero-heading">Braap</h1>
          <p class="body-0" style="z-index: 1">
            Need service, repair, or maintenance delivered by a vast network of service companies and technicians,
            you’re in the right place.
          </p>
        </v-col> -->
        <v-col :cols="8" offset="2">
          <BraapSearch
            ref="braapSerach"
            v-intersect="{ handler: onIntersect }"
            class="hero-search white mt-10 mb-16"
            :large="true"
            :show-trending-search="true"
            @search="goToSearch"
          ></BraapSearch>

          <div class="d-flex align-center body-2 my-3">
            <span
              class="mr-5 white--text text-no-wrap"
              style="opacity: 0.5; transform: scale(1.1); transform-origin: left"
              >Recent Searches:</span
            >
            <router-link
              :to="{ name: 'SearchResult', params: { query } }"
              v-for="query in recent"
              :key="query"
              class="mr-5 white--text text-truncate"
              >{{ query }}</router-link
            >
          </div>
          <div class="d-flex align-center justify-center mt-10">
            <AnchorLink href="#trending-fixes">
              <v-btn x-large dark color="braap_orange" class="rounded-10 px-8 mr-7 body-0"
                >Trending <v-icon class="ml-1">mdi-arrow-down</v-icon></v-btn
              >
            </AnchorLink>
            <v-btn :to="{ name: 'Login' }" x-large dark color="braap_orange" class="rounded-10 px-8 body-0"
              >Sign In <v-icon class="ml-1">mdi-login</v-icon></v-btn
            >
          </div>
          <div class="white--text hero-bottom-text body-0 text-center">
            An intelligent solution built for service companies, technicians, enterprises, and owners of machines and
            assets to diagnose, fix, and maintain their stuff.
          </div>

          <AnchorLink href="#trending-fixes" class="home-move-down">
            <BraapFeaturesSvg></BraapFeaturesSvg>
          </AnchorLink>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import BraapSearch from '@/components/BraapSearch'
  import BraapFeaturesSvg from '@/assets/img/home/braap-features.svg'
  import AnchorLink from '@/components/Common/AnchorLink'

  export default {
    name: 'HeroBanner',
    components: {
      BraapSearch,
      BraapFeaturesSvg,
      AnchorLink
    },
    data() {
      return {
        recent: []
      }
    },
    created() {
      this.getRecentSearch()
    },
    methods: {
      onIntersect(entries) {
        if (!entries[0].isIntersecting) {
          this.$refs.braapSerach.hideMenu()
        }
      },
      goToSearch(query) {
        this.$router.push({ name: 'SearchResult', query: { query } })
      },
      getRecentSearch() {
        this.$axios.get('/api/search/getRecentSearch').then(result => {
          if (result && result.success) {
            this.recent = result.data.map(x => x.searchquery)
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .hero-slider {
    min-height: 100vh;
    padding: 170px 0 50px;
    background: url('/img/home/hero-bg.jpg') no-repeat;
    background-size: cover;
    background-position: bottom center;

    @keyframes moveUpDown {
      0% {
        top: 0;
      }
      50% {
        top: 20px;
      }
      100% {
        top: 0;
      }
    }

    .container {
      .hero-heading {
        font-size: 130px;
        opacity: 0.2;
      }

      .hero-search {
        width: 100%;
        z-index: 1;
        font-size: 18px;
      }

      .hero-bottom-text {
        margin-top: 150px;
      }

      .home-move-down {
        display: block;
        margin-top: 70px;
        text-align: center;
        position: relative;
        animation: moveUpDown 2s infinite;
      }
    }
  }
</style>
