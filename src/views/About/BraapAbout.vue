<template>
    <BraapBg2 class="braap-about white">
      <v-container class="about-container relative">
        <v-row>
          <v-col cols="12" md="6" class="braap-content">
            <div class="pr-12">
              <div class="page-title primary--text font-weight-bold">
                <span class="braap_orange--text">About</span>
                Braap
              </div>
              <p class="my-10">
                Our mission is to organize mechanical part information and automate the service process, so when
                something breaks finding the parts and someone to fix it is easy.
              </p>
              <p class="verb white--text py-1 font-weight-bold">verb</p>
            </div>
            <p class="my-10">
              “According to several sources and our own interpretation “Braap” defines a flow, a connection between a
              customer and technician. We explain it as the unison of working together to maintain, diagnose, and fix
              mechanical problems in a comprehensive yet simple collaborative environment.”
            </p>
          </v-col>
          <v-col cols="12" md="6">
            <div class="about-img my-0 mx-auto relative">
              <img src="/img/about/about.jpg" alt="about" />
              <img src="/img/about/about-top-right.png" class="about-top-right absolute fade-right-delay" />
              <img src="/img/about/about-bottom-left.png" class="about-bottom-left absolute fade-left-delay-600" />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </BraapBg2>
</template>

<script>
  import BraapBg2 from '../../components/layouts/BraapBg_2.vue'
  export default {
    components: {
      BraapBg2
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .braap-about {
    padding: 100px 0;
    .about-container {
      .verb {
        background: $braap_orange;
        display: inline-block;
        padding-left: 30px;
        padding-right: 30px;
        border-radius: 50px;
        font-style: italic;
        cursor: pointer;
      }

      .about-img {
        width: 70%;

        img {
          width: 100%;
          vertical-align: middle;
        }

        .about-top-right {
          position: absolute;
          right: -18%;
          top: 6%;
          height: 120px;
          width: auto !important;
        }

        .about-bottom-left {
          position: absolute;
          left: -16%;
          bottom: 10%;
          height: 165px;
          width: auto !important;
        }
      }
    }
  }
</style>