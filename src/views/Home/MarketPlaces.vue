<template>
  <BraapBg4 class="market-places white">
    <v-container class="py-0 relative">
      <v-row>
        <v-col class="col-12 text-center">
          <div class="section-title middle font-weight-bold primary--text">
            <span class="braap_orange--text">Market</span> Places
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="col-12">
          <VueSlickCarousel ref="slide" v-bind="settings" class="mt-16">
            <div class="pa-3" v-for="(slide, index) in slides" :key="index">
              <div class="market-slide d-flex align-center justify-center white rounded-10 relative mb-3">
                <div class="overlay absolute"></div>
                <span class="text absolute white--text body-1 text-center">{{ slide.text }}</span>
                <img :src="slide.img" alt="" />
              </div>
            </div>
          </VueSlickCarousel>
        </v-col>
      </v-row>
    </v-container>
  </BraapBg4>
</template>

<script>
  import VueSlickCarousel from 'vue-slick-carousel'
  import BraapBg4 from '../../components/layouts/BraapBg_4'
  export default {
    name: 'MarketPlaces',
    components: {
      VueSlickCarousel,
      BraapBg4
    },
    data() {
      return {
        slides: [
          {
            text: 'Fitness Equipment',
            img: '/img/home/icons/fitness.png'
          },
          {
            text: 'Lawn Equipment',
            img: '/img/home/icons/lawn.png'
          },
          {
            text: 'Medical Devices',
            img: '/img/home/icons/medical.png'
          },
          {
            text: 'Powersport',
            img: '/img/home/icons/powersport.png'
          },
          {
            text: 'Trailers',
            img: '/img/home/icons/trailer.png'
          },
          {
            text: 'Appliances',
            img: '/img/home/icons/appliances.png'
          },
          {
            text: 'Automotive',
            img: '/img/home/icons/automotive.png'
          },
          {
            text: 'Bikes',
            img: '/img/home/icons/bikes.png'
          },
          {
            text: 'Building Mechanics',
            img: '/img/home/icons/building-mechanics.png'
          },
          {
            text: 'Construction Equipment',
            img: '/img/home/icons/construction.png'
          },
          {
            text: 'Heating and Cooling',
            img: '/img/home/icons/cooling.png'
          }
        ],
        settings: {
          slidesToShow: 6,
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
    computed: {},
    methods: {}
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .market-places {
    padding: 80px 0 180px;

    .market-slide {
      padding: 50px 20px;
      box-shadow: var(--theme-shadow);
      overflow: hidden;

      img {
        height: 50px;
      }
      .text {
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: 0.3s;
      }
      .overlay {
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        top: 0;
        left: 0;
        opacity: 0;
        transition: 0.3s;
      }
      &:hover {
        .overlay,
        .text {
          opacity: 1;
        }
      }
    }

    .slick-arrow {
      background-size: 100%;
      background-repeat: no-repeat;
      width: 50px;
      height: 50px;
      position: absolute;
      top: 120%;
      opacity: 0.75;
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
  }
</style>
