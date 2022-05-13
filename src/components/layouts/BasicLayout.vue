
<template>
  <div class="braap-wrapper">
    <site-header></site-header>
    <div class="braap-body">
      <keep-alive v-if="keepAlive">
        <router-view />
      </keep-alive>
      <router-view v-else />
    </div>
    <braap-footer></braap-footer>
  </div>
</template>

<script>
  import SiteHeader from './Header.vue'
  import BraapFooter from '../BraapFooter'

  export default {
    name: 'BasicLayout',
    components: {
      SiteHeader,
      BraapFooter
    },
    data: function() {
      return {}
    },
    computed: {
      keepAlive() {
        return this.$route.meta.keepAlive
      }
    },
    mounted() {},
    methods: {}
  }
</script>

<style lang="scss">
  .braap-wrapper {
    .braap-body {
      margin-top: 100px;
      min-height: 100vh;
      // z-index: 1;
      // position: relative;
    }
  }
</style>
