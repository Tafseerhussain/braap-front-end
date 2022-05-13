<template>
  <div class="mt-14 pt-13 white customer-reason">
    <v-row class="justify-center">
      <v-col class="col-3 text-center" @mouseenter="onMouseEntered(1)" @mouseleave="onMouseLeaved">
        <div class="rounded-10 relative text-center py-4 py-lg-8 px-4 card mb-0">
          <p class="process-text body-0 ma-0">Automated Quoting, Dispatch, Part Ordering</p>
        </div>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="col-3 text-center">
        <div
          class="rounded-10 relative text-center py-4 py-lg-8 px-4 card"
          @mouseenter="onMouseEntered(2)"
          @mouseleave="onMouseLeaved"
        >
          <p class="process-text body-0 ma-0">No Setup Required</p>
        </div>
        <div
          class="rounded-10 relative text-center py-4 py-lg-8 px-4 card card-left"
          @mouseenter="onMouseEntered(3)"
          @mouseleave="onMouseLeaved"
        >
          <p class="process-text body-0 ma-0">Structures customer and technician diagnostic collaboration.</p>
        </div>
        <div
          class="rounded-10 relative text-center py-4 py-lg-8 px-4 card mb-0"
          @mouseenter="onMouseEntered(4)"
          @mouseleave="onMouseLeaved"
        >
          <p class="process-text body-0 ma-0">Automates the back office with flexible workflows.</p>
        </div>
      </v-col>
      <v-col class="col-6 text-center relative" width="40%">
        <img v-show="hover === 0" src="/img/points/all-points.svg" class="process-center pc1" />
        <img v-show="hover === 1" src="/img/points/top.svg" class="process-center hover1" />
        <img v-show="hover === 2" src="/img/points/top-left.svg" class="process-center hover1" />
        <img v-show="hover === 3" src="/img/points/left.svg" class="process-center hover1" />
        <img v-show="hover === 4" src="/img/points/bottom-left.svg" class="process-center hover1" />
        <img v-show="hover === 5" src="img/points/top-right.svg" class="process-center hover1" />
        <img v-show="hover === 6" src="/img/points/right.svg" class="process-center hover1" />
        <img v-show="hover === 7" src="/img/points/bottom-right.svg" class="process-center hover1" />
        <img v-show="hover === 8" src="/img/points/bottom.svg" class="process-center hover1 pb-1" />
      </v-col>
      <v-col class="col-3 text-center">
        <div
          class="rounded-10 relative text-center py-4 py-lg-8 px-4 card"
          @mouseenter="onMouseEntered(5)"
          @mouseleave="onMouseLeaved"
        >
          <p class="process-text body-0 ma-0">Comprehensive, yet simple to use.</p>
        </div>
        <div
          class="rounded-10 relative text-center py-4 py-lg-8 px-4 card card-right"
          @mouseenter="onMouseEntered(6)"
          @mouseleave="onMouseLeaved"
        >
          <p class="process-text body-0 ma-0">Features built for service teams and technicians</p>
        </div>
        <div
          class="rounded-10 relative text-center py-4 py-lg-8 px-4 card mb-0"
          @mouseenter="onMouseEntered(7)"
          @mouseleave="onMouseLeaved"
        >
          <p class="process-text body-0 ma-0">Seamlessly integrates to ERP systems and vendor parts systems.</p>
        </div>
      </v-col>
    </v-row>
    <v-row class="justify-center">
      <v-col class="col-3 text-center">
        <div
          class="rounded-10 relative text-center py-4 py-lg-8 px-4 card mb-0"
          @mouseenter="onMouseEntered(8)"
          @mouseleave="onMouseLeaved"
        >
          <p class="process-text body-0 ma-0">Growing Global Augmented Workforce.</p>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  export default {
    name: 'CustomerReason',
    data() {
      return {
        hover: 0
      }
    },
    methods: {
      onMouseEntered(val) {
        this.hover = val
      },
      onMouseLeaved() {
        this.hover = 0
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .customer-reason {
    .card {
      @media (min-width: 1200px) {
        margin-bottom: 65px;
      }

      @media (min-width: 1264px) {
        margin-bottom: 30px;
      }

      @media (min-width: 1400px) {
        margin-bottom: 65px;
      }

      @media (min-width: 1650px) {
        margin-bottom: 120px;
      }

      @media (min-width: 2000px) {
        margin-bottom: 160px;
      }

      box-shadow: var(--theme-shadow);
      word-wrap: break-word;
      margin-bottom: 30px;
      cursor: pointer;
      &:hover {
        background-color: $braap_orange;
        .process-text {
          color: #fff;
        }
      }
      .process-text {
        color: #696969;
      }
    }

    .card-left {
      position: relative;
      left: 50%;
    }
    .card-right {
      position: relative;
      right: 50%;
    }

    .process-center {
      width: 88%;
      position: absolute;
      top: 7%;
      left: 50%;
      pointer-events: none;
      transition: 0.3s;
      transform: translateX(-50%);
    }
  }
</style>
