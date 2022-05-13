<template>
    <BraapBg1 class="feature-icon" id="feature-icon">
      <v-container class="icon-container relative">
        <v-row>
          <v-col cols="12" md="4" v-for="(l, index) in list" :key="index" style="padding: 10px !important">
            <feature-icon-card :icon="l.icon" :title="l.title" :id="l.id"></feature-icon-card>
          </v-col>
        </v-row>
      </v-container>
    </BraapBg1>
</template>

<script>
  import FeatureIconCard from './FeatureIconCard.vue'
  import FeatureData from './featuresData.js'
  import BraapBg1 from '../../components/layouts/BraapBg_1.vue'
  export default {
    name: 'FeatureIcon',
    data() {
      return {
        list: []
      }
    },
    components: {
      FeatureIconCard,
      BraapBg1
    },
    mounted() {
      this.getFeatureIconCardList()
    },
    methods: {
      getFeatureIconCardList() {
        setTimeout(() => {
          this.list = FeatureData
        }, 500)
      }
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .feature-icon {
    // .icon-container {
    //   z-index: 9;
    // }
    background: $braap-bg-grey;
    padding: 100px 0;
  }
</style>