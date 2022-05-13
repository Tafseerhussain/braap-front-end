<template>
  <BraapBg1 class="feature-home">
    <v-container class="relative">
      <v-row>
        <v-col class="col-12">
          <div class="font-weight-bold section-title primary--text">
            <span class="braap_orange--text">Braap</span>
            Features
          </div>
        </v-col>
      </v-row>
      <!-- <div class="d-flex justify-space-between mt-16">
        <div class="px-2 mt-4" v-for="(feature, index) in featureList" :key="index">
          <feature-card :title="feature.title" :imgsrc="feature.src" :info="feature.info"></feature-card>
        </div>
      </div> -->
      <v-row>
        <v-col cols="4" class="mt-16" v-for="(feature, index) in featureList" :key="index">
          <div class="card-container px-2 mt-4">
            <feature-card :id="feature.id" :title="feature.title" :imgsrc="feature.img" :info="feature.content"></feature-card>
          </div>
        </v-col>
      </v-row>
      <div class="text-center mt-16">
        <v-btn
          color="braap_orange"
          x-large
          dark
          class="all-features-btn rounded-10 px-8 text-capitalize body-0"
          @click="onAllFeaturesBtnClicked"
        >
          <span>View All Features</span><v-icon class="ml-2">mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </BraapBg1>
</template>

<script>
  import FeatureCard from './FeatureCard.vue'
  import featuresData from './featuresData.js'
  import BraapBg1 from '../../components/layouts/BraapBg_1.vue'
  export default {
    name: 'FeatureHome',
    data() {
      return {
        featureList: []
      }
    },
    components: {
      FeatureCard,
      BraapBg1
    },
    mounted() {
      this.getFeatureList()
    },
    methods: {
      getFeatureList() {
        setTimeout(() => {
          this.featureList = featuresData.slice(0, 3)
        }, 500)
      },
      onAllFeaturesBtnClicked() {
        this.$router.push({ name: 'Features' })
      }
    }
  }
</script>

<style lang="scss">
  .feature-home {
    background: #f7f7f7;
    padding: 80px 0;

    .all-features-btn {
      box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
    }

    .card-container {
      height: 100%;
    }
  }
</style>
