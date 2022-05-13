<template>
  <div class="single-fature-more relative bg-greey-img white">
    <v-container>
      <v-row>
        <v-col cols="12">
          <div class="font-weight-bold section-title primary--text">
            <span class="braap_orange--text">More</span>
            Features
          </div>
        </v-col>
      </v-row>
      <!-- <div class="d-flex justify-space-between mt-16">
        
      </div> -->
      <v-row>
        <v-col cols="12" md="4" class="mt-16" v-for="(feature, index) in featureList" :key="index">
          <div class="card-container px-2 mt-4">
            <feature-card
              :id="feature.id"
              :title="feature.title"
              :imgsrc="feature.img"
              :info="feature.content"
            ></feature-card>
          </div>
        </v-col>
      </v-row>
      <div class="text-center mt-16">
        <v-btn
          color="braap_orange"
          x-large
          depressed
          dark
          class="all-features-btn rounded-10 px-8 py-1 text-capitalize body-0"
          @click="onAllFeaturesBtnClicked"
          ><span>View All Features</span><v-icon class="ml-2">mdi-arrow-right</v-icon></v-btn
        >
      </div>
    </v-container>
  </div>
</template>

<script>
  import FeatureCard from './FeatureCard.vue'
  import featuresData from './featuresData.js'
  export default {
    name: 'FeatureHome',
    props: ['id'],
    data() {
      return {
        featureList: [],
        featureIndexArr: []
      }
    },
    components: {
      FeatureCard
    },
    created() {
      this.getFeatureList()
    },
    watch: {
      id() {
        this.getFeatureList()
      }
    },
    methods: {
      getFeatureList() {
        featuresData.forEach(item => {
          if (item.id === this.id) {
            this.featureIndexArr = item.moreFeature
            return
          }
        })
        const tempArr = []
        this.featureIndexArr.forEach(item => {
          tempArr.push(featuresData[item])
        })
        this.featureList = tempArr
      },
      onAllFeaturesBtnClicked() {
        this.$router.push({ name: 'Features' })
      }
    }
  }
</script>

<style lang="scss">
  .single-fature-more {
    padding: 80px 0;

    .all-features-btn {
      box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
    }

    .card-container {
      height: 100%;
    }
  }
</style>
