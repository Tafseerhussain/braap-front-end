<template>
  <div class="testimonials braap_bg_grey relative">
    <v-container class="py-0">
      <v-row>
        <v-col class="col-12 text-center">
          <div class="section-title middle font-weight-bold primary--text">
            What <span class="braap_orange--text">Clients say</span> about Braap
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="8" offset="2">
          <VueSlickCarousel ref="slide" v-bind="settings" class="mt-16">
            <div class="testimonial-slide d-flex flex-column text-center" v-for="(slide, index) in slides" :key="index">
              <div class="testimonial-img d-flex mx-auto">
                <img :src="slide.img" />
              </div>
              <div class="testimonial-head mx-auto font-weight-medium primary--text">
                {{ slide.name }}<br />
                <span class="body-1 font-weight-regular"> {{ slide.job }} </span>
              </div>
              <div class="testimonial-text px-10 mx-10">
                <img src="/icons/quote.svg" alt="quote" />
                {{ slide.text }}
              </div>
              <div class="testimonial-rating mt-5">
                <v-rating
                  :value="slide.rating"
                  size="28"
                  color="#FFC700"
                  background-color="#FFC700"
                  readonly
                  half-increments
                ></v-rating>
              </div>
            </div>
          </VueSlickCarousel>
        </v-col>
      </v-row>
      <v-row class="mt-8">
        <v-col class="col-12 text-center">
          <v-btn x-large dark color="braap_orange" class="rounded-10 px-8 body-0" @click="onUserLearnMoreClicked"
            >Learn More <v-icon class="ml-1">mdi-arrow-right</v-icon></v-btn
          >
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
  import VueSlickCarousel from 'vue-slick-carousel'

  export default {
    name: 'Testimonials',
    components: {
      VueSlickCarousel
    },
    data() {
      return {
        slides: [
          {
            text:
              'A service platform that gives technicians flexibility while streamlining the job for the customer and back office.',
            name: 'Tom R.',
            job: '(Field Technician)',
            rating: 5,
            img: '/img/home/testimonials/testimonial-1.png'
          },
          {
            text: 'Braap is ready to go from the moment you signup. There is no setup to get started!',
            name: 'Robin A.',
            job: '(Analyst)',
            rating: 5,
            img: '/img/home/testimonials/testimonial-2.png'
          },
          {
            text:
              'I have used other service platforms and nothing compares to Braap. I love the interactive shop, timeline, and mobile functionality. It does all the administrative work for me so I can do my job better.',
            name: 'Samuel M.',
            job: '(Technician)',
            rating: 5,
            img: '/img/home/testimonials/testimonial-3.png'
          },
          {
            text: 'Braap raised our customer response satisfaction rating and reduced our costs.',
            name: 'Jenny Q.',
            job: '(VP of Customer Relationships)',
            rating: 5,
            img: '/img/home/testimonials/testimonial-4.png'
          },
          {
            text:
              'My job used to be scheduling, ordering, customer follow up, and reporting. With Braap automation, now I can focus on delivering better service to my customers.',
            name: 'Zulu D.',
            job: '(Operations manager)',
            rating: 4.5,
            img: '/img/home/testimonials/testimonial-5.png'
          },
          {
            text:
              'We integrated Braap to our ERP system. We get all the Braap functionality, and our users did not need to learn a new system.',
            name: 'Henry P.',
            job: '(CTO/CIO)',
            rating: 5,
            img: '/img/home/testimonials/testimonial-6.png'
          },
          {
            text:
              'I wanted to grow our business. Braap’s augmented our team with logistics and technicians. Exciting way for us to grow one-step at a time.',
            name: ' Jackson T.',
            job: '(Owner)',
            rating: 4,
            img: '/img/home/testimonials/testimonial-7.png'
          }
        ],
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          speed: 500,
          infinite: true,
          dots: false,
          arrows: true,
          autoplay: true,
          autoplaySpeed: 5000,
          fade: true
        }
      }
    },
    computed: {},
    methods: {
      onUserLearnMoreClicked() {
        this.$router.push('/braap-user')
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .testimonials {
    padding: 80px 0;

    .testimonial-slide {
      .testimonial-head {
        font-size: 40px;
        line-height: 28.8px;
        margin: 30px 0 50px;
        span {
          opacity: 0.3;
        }
      }
      .testimonial-text {
        font-size: 20px;
        line-height: 40px;
        img {
          position: relative;
          top: -10px;
          display: inline-block;
        }
      }
    }

    .slick-arrow {
      background-size: 100%;
      background-repeat: no-repeat;
      width: 60px;
      height: 100px;
      position: absolute;
      top: 40%;
      opacity: 0.75;
      transition: 0.3s;
      z-index: 1;
      &::before {
        display: none;
      }
      &:hover {
        opacity: 1;
      }
    }
    .slick-prev {
      background-image: url('/img/home/slides/arrow-left.svg');
      left: 0;
    }
    .slick-next {
      background-image: url('/img/home/slides/arrow-right.svg');
      right: 0;
    }
  }
</style>
