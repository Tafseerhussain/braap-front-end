<template>
  <BraapBg2 class="single-feature-header white">
    <v-container class="container relative">
      <v-row>
        <v-col cols="12" md="6">
          <div class="header-title font-weight-bold primary--text">{{ list.title }}</div>
          <div class="mt-7">
            <template v-for="(item, index) in list.content">
              <div class="mb-5 body-0" :key="index">
                <v-icon>$svg-green-arrow</v-icon>
                <span> {{ item }}</span>
              </div>
            </template>
          </div>
          <AnchorLink class="arrow-link mt-14" href="#single-feature-detail">
            <div class="fade-top-delay">
              <div class="scroll-arrow"></div>
              <div class="scroll-arrow"></div>
              <div class="scroll-arrow"></div>
            </div>
          </AnchorLink>
        </v-col>
        <v-col cols="12" md="6">
          <div class="header-img text-center">
            <img :src="list.img" class="fade-right-delay" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </BraapBg2>
</template>

<script>
  import featuresData from './featuresData.js'
  import BraapBg2 from '../../components/layouts/BraapBg_2.vue'
  import AnchorLink from '@/components/Common/AnchorLink.vue'
  export default {
    props: ['id'],
    data() {
      return {
        list: null
      }
    },
    components: {
      BraapBg2,
      AnchorLink
    },
    created() {
      this.getSingleFeatureList()
    },
    methods: {
      getSingleFeatureList() {
        featuresData.forEach(item => {
          if (item.id === this.id) {
            this.list = item
            return
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .single-feature-header {
    padding: 100px 0;
    .container {
      .header-title {
        font-size: 50px;
        line-height: 70px;
      }
      .header-img {
        height: 100%;
        img {
          max-height: 450px;
          width: auto;
        }
      }
    }
  }
</style>