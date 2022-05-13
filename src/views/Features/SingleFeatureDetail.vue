<template>
  <BraapBg1 class="single-feature-detail" id="single-feature-detail">
    <v-container class="detail-container braap-content relative">
      <div v-html="featureDetailList"></div>
    </v-container>
  </BraapBg1>
</template>

<script>
  import featuresData from './featuresData.js'
  import BraapBg1 from '../../components/layouts/BraapBg_1.vue'
  export default {
    name: 'SingleFeatureDetail',
    props: ['id'],
    data() {
      return {
        featureDetailList: null
      }
    },
    components: {
      BraapBg1
    },
    created() {
      this.getFeatureDetailList()
    },
    watch: {
      id() {
        this.getFeatureDetailList()
      }
    },
    methods: {
      getFeatureDetailList() {
        featuresData.forEach(item => {
          if (item.id === this.id) {
            this.featureDetailList = item.detail
            return
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .single-feature-detail {
    background: $braap-bg-grey;
    padding: 100px 0;
    .detail-container {
      p {
        margin-bottom: 30px;
      }
    }
  }
</style>