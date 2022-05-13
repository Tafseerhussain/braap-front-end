<template>
  <div class="feature-container white">
    <braap-feature></braap-feature>
    <feature-icon></feature-icon>
    <feature-detail></feature-detail>
  </div>
</template>

<script>
  import BraapFeature from './BraapFeature.vue'
  import FeatureIcon from './FeatureIcon.vue'
  import FeatureDetail from './FeatureDetails.vue'

  export default {
    components: {
      BraapFeature,
      FeatureIcon,
      FeatureDetail
    },
    mounted() {
      this.$initSr()
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .feature-container {
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
  }
</style>
