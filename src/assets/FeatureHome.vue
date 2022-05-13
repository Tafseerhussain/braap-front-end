<template>
  <div class="feature-home relative">
    <v-container>
      <v-row>
        <v-col class="col-12">
          <div class="font-weight-bold text-h3">
            <span class="braap_orange--text">Braap</span>
            Features
          </div>
        </v-col>
      </v-row>
      <!-- <v-row class="mt-16">
        <v-col
          class="col-4"
          v-for="(feature, index) in featureList"
          :key="index"
        >
          <feature-card></feature-card>
        </v-col>
      </v-row> -->
      <div class="d-flex justify-space-between mt-16">
        <div
          class="px-2 mt-4"
          v-for="(feature, index) in featureList"
          :key="index"
        >
          <feature-card
            :title="feature.title"
            :imgsrc="feature.src"
            :info="feature.info"
          ></feature-card>
        </div>
      </div>
      <div class="text-center mt-16">
        <v-btn color="braap_orange" x-large dark  class="all-features-btn rounded-10 px-8 text-capitalize body-0"
          ><span >View All Features</span><v-icon class="ml-2">mdi-arrow-right</v-icon></v-btn
        >
      </div>
    </v-container>
    <div class="top-left-img absolute">
      <img src="../../assets/section-top-left.png" alt="">
    </div>
  </div>
</template>

<script>
import FeatureCard from "./FeatureCard.vue";
// import tolet from "../../assets/section-top-left.png"
export default {
  name: "FeatureHome",
  data() {
    return {
      featureList: [],
    };
  },
  components: {
    FeatureCard,
  },
  mounted() {
    this.getFeatureList();
  },
  methods: {
    getFeatureList() {
      setTimeout(() => {
        this.featureList = [
          {
            title: "Automated job quoting and estimating",
            src: "/img/features/automated-job.jpg",
            info: [
              "100% job automation from quote to service",
              "Self-learning rate tracking",
              "Automated work scheduler",
            ],
          },
          {
            title: "Automated job quoting and estimating",
            src: "/img/features/consolidated.jpg",
            info: [
              "OEM,AFT,used manufactures and sellers",
              "Price comparison",
              "Best option selection",
            ],
          },
          {
            title: "Automated job quoting and estimating",
            src: "/img/features/curated-machine.jpg",
            info: [
              "Self-learning",
              "Diagnostic to part",
              "Professional sourced repair packages",
            ],
          },
        ];
      }, 500);
    },
  },
};
</script>

<style lang="scss">
.feature-home {
  background: #f7f7f7;
  padding: 80px 0;

  .all-features-btn {
    box-shadow: 0 3px 6px rgb(0 0 0 / 15%);
  }

  .top-left-img {
    top: 0;
    left: 0;
    img{
      height: 100px;
    }
  }
}
</style>
