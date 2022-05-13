<template>
  <BraapBg2 class="braap-feature">
    <v-container class="relative">
      <v-row class="row">
        <v-col cols="12" md="6" class="py-0 pr-13 relative col-card braap-content">
          <div class="page-title primary--text font-weight-bold">
            <span class="braap_orange--text">Braap</span> Features
          </div>
          <p class="my-10 body-0">
            The intelligent machine learning engine behind Braap's service platform provides today’s technicians with
            the tools they always wanted.
          </p>
          <AnchorLink href="#feature-icon">
            <v-btn color="braap_orange" class="rounded-10 body-0 px-8" x-large dark>View More Features</v-btn>
          </AnchorLink>
          <AnchorLink href="#feature-icon" class="arrow-link mt-12">
            <div class="fade-top-delay">
              <div class="scroll-arrow"></div>
              <div class="scroll-arrow"></div>
              <div class="scroll-arrow"></div>
            </div>
          </AnchorLink>
        </v-col>
        <v-col cols="12" md="6" class="py-0 px-3">
          <div class="text-center feature-img">
            <img width="75%" src="../../assets/img/features/feature.png" class="fade-right-delay" />
          </div>
        </v-col>
      </v-row>
    </v-container>
  </BraapBg2>
</template>

<script>
  import BraapBg2 from '../../components/layouts/BraapBg_2.vue'
  import AnchorLink from '@/components/Common/AnchorLink.vue'
  export default {
    name: 'BraapFeature',
    components: {
      BraapBg2,
      AnchorLink
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .braap-feature {
    @keyframes arrow-wave {
      0% {
        opacity: 0;
      }
      50% {
        opacity: 0.5;
      }
      100% {
        opacity: 1;
      }
    }

    padding-top: 100px;
    padding-bottom: 150px;
    .col-card {
      a {
        text-decoration: none;
      }
    }

    .feature-img {
      width: 75%;
      margin-left: 12.5%;
    }
  }
</style>