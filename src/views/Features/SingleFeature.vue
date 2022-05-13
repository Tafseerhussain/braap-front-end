<template>
  <div class="single-feature">
    <single-feature-header :id="id" :key="id"></single-feature-header>
    <single-feature-detail :id="id"></single-feature-detail>
    <single-feature-more :id="id"></single-feature-more>
  </div>
</template>

<script>
  import SingleFeatureHeader from './SingleFeatureHeader.vue'
  import SingleFeatureDetail from './SingleFeatureDetail.vue'
  import SingleFeatureMore from './SingleFeatureMore.vue'
  export default {
    name: 'SingleFeature',
    components: {
      SingleFeatureHeader,
      SingleFeatureDetail,
      SingleFeatureMore
    },
    mounted() {
      this.$initSr()
    },
    updated() {
      this.$initSr()
    },
    data() {
      return {
        id: null
      }
    },
    created() {
      const { id } = this.$route.params
      this.id = id
    },
    watch: {
      $route(to, from) {
        if (to.params.id !== from.params.id) {
          this.id = to.params.id
        }
      }
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .single-feature {
    .arrow-link {
      display: block;
      visibility: visible;
      opacity: 1;
      transform: matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1);
      transition: opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s;
      .scroll-arrow {
        width: 30px;
        height: 30px;
        transform: rotate(45deg);
        border-right: 3px solid $braap_orange;
        border-bottom: 3px solid $braap_orange;
        animation: arrow-wave 1s infinite;
        animation-direction: alternate;
        &:nth-child(1) {
          animation-delay: 0.1s;
        }
        &:nth-child(2) {
          animation-delay: 0.2s;
          margin-top: -10px;
        }
        &:nth-child(3) {
          animation-delay: 0.3s;
          margin-top: -10px;
        }
      }
    }

    .section-left {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 400px;
      pointer-events: none;
      vertical-align: middle;
    }
    .section-waves {
      position: absolute;
      right: 0;
      top: 14%;
      pointer-events: none;
      vertical-align: middle;
    }
    .section-dots {
      position: absolute;
      left: 50%;
      top: 15%;
      pointer-events: none;
      vertical-align: middle;
    }
  }
</style>