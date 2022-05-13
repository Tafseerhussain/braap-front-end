<template>
  <BraapBg1 class="not-found white">
    <v-container class="relative">
      <div class="d-flex justify-center mt-12">
        <v-icon color="primary" class="braap-logo">$svg-braap-logo</v-icon>
      </div>
      <div class="d-flex justify-center mt-10">
        <span class="text-h2 font-weight-bold">Nothing Found</span>
      </div>
      <div class="d-flex mb-8">
        <BraapSearch class="braap-search mx-auto"></BraapSearch>
      </div>
      <div class="d-flex flex-column align-center">
        <!-- <NotFoundSvg class="mx-auto"></NotFoundSvg> -->
        <img src="../assets/img/404.png" style="max-width: 1000px" />
        <span class="text-h5 mt-12 mb-7">The Requested Page Does Not Exist</span>
      </div>
      <div class="d-flex justify-center">
        <v-btn to="/" large dark color="braap_orange" class="rounded-10 mr-5 body-1 py-6 px-7">Home Page</v-btn>
        <v-btn to="/contact" large dark color="primary" class="rounded-10 body-1 py-6 px-7">Contact Us</v-btn>
      </div>
    </v-container>
  </BraapBg1>
</template>

<script>
  import BraapSearch from '@/components/BraapSearch'
  // import NotFoundSvg from '@/assets/img/404.svg'
  import BraapBg1 from '../components/layouts/BraapBg_1'
  export default {
    name: 'NotFound',
    props: {},
    components: {
      BraapSearch,
      // NotFoundSvg,
      BraapBg1
    },
    data: function() {
      return {}
    },
    watch: {},
    mounted() {},
    methods: {}
  }
</script>

<style lang="scss">
  .not-found {
    min-height: 100vh;

    .text-h2 {
      font-size: 70px;
      line-height: 114px;
      color: rgba(0, 0, 0, 0.5);
    }
    .braap-logo {
      svg {
        width: 54px;
        height: 80px;
      }
    }
    .braap-search {
      max-width: 600px;
    }
  }
</style>
