<template>
  <v-card flat class="related-parts">
    <v-card-text class="pa-0">
      <VueSlickCarousel ref="slide" class="card-container mt-n2" v-bind="settings" v-if="parts.length > 0">
        <div class="slide-item" v-for="part in parts" :key="part.braap_part_number">
          <PartCard :value="part" class="mb-0 overflow-hidden" @open-detail="openProduct" @select="selectPart">
          </PartCard>
        </div>
      </VueSlickCarousel>
      <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%">
        <div class="d-flex justify-center">
          <img class="empty-img" src="/img/empty.png" />
        </div>
        <div class="d-flex flex-wrap align-center justify-center primary--text body-1 pt-6">
          <v-btn text color="braap_deep_blue" class="pr-2" @click="closeDialog"> Go back to results</v-btn>
          <span class="mx-1 d-none d-sm-block">|</span>Related parts are sometimes not available.
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import PartCard from './PartCardSmall.vue'
  import VueSlickCarousel from 'vue-slick-carousel'

  export default {
    name: 'RelatedParts',
    components: { PartCard, VueSlickCarousel },
    props: {
      parts: {
        type: Array
      }
    },
    data: function() {
      return {
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          speed: 500,
          infinite: true,
          dots: false,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 3000
        }
      }
    },
    watch: {},
    computed: {},
    created() {},
    mounted() {},
    methods: {
      openProduct(part) {
        this.$emit('open', part)
      },
      selectPart(part) {
        this.$emit('add', part)
      },
      closeDialog() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
  .product-detail-wrapper.v-card {
    .card-container {
      margin: 0px;
      .slide-item {
        padding: 10px;
        .card-wrapper {
          padding-bottom: 20px !important;
          width: 100%;
          margin: 0px !important;
        }
      }
    }

    .related-parts {
      .slick-arrow {
        background-size: 100%;
        background-repeat: no-repeat;
        width: 50px;
        height: 50px;
        position: absolute;
        top: 110%;
        opacity: 0.85;
        transition: 0.3s;
        &::before {
          display: none;
        }
        &:hover {
          opacity: 1;
        }
      }
      .slick-prev {
        background-image: url('/icons/arrow-left-circle.svg');
        left: 44%;
      }
      .slick-next {
        background-image: url('/icons/arrow-right-circle.svg');
        right: 44%;
      }

      .empty-img {
        width: 80%;
      }
    }
  }
</style>