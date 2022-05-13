<template>
  <div class="feature-detail-card py-12 px-10 rounded-10 relative">
    <bottom-right-svg class="bg-svg absolute"></bottom-right-svg>
    <div class="d-flex">
      <!-- <v-icon class="icon pr-3 braap_orange--text"> {{ icon }} </v-icon> -->
      <img :src="icon" alt="icon" class="icon">
      <div class="card-title font-weight-bold primary--text ml-3">{{ title }}</div>
    </div>
    <div class="card-content mt-10">
      <template v-for="(c, index) in content">
        <div class="mb-6 body-0" :key="index">
          <v-icon>$svg-green-arrow</v-icon>
          <span> {{ c }}</span>
        </div>
      </template>
      <a class="learn-more braap_orange--text body-0 mt-7" @click="showSingleFeature">
        <span>Learn More</span>
        <v-icon class="braap_orange--text ml-1">mdi-arrow-right</v-icon>
      </a>
    </div>
  </div>
</template>

<script>
  import BottomRightSvg from '../../assets/icons/bottom-right.svg'
  export default {
    name: 'FeatureDetailCard',
    props: ['id','icon', 'title', 'content'],
    components: {
      BottomRightSvg
    },
    methods: {
      showSingleFeature() {
        this.$router.push({
          name: 'SingleFeature',
          params: { id: this.id }
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '../../styles/color.scss';
  .feature-detail-card {
    border: 2px solid transparent;
    transition: 0.3s;
    box-shadow: 0 4px 15px rgb(138 138 138 / 10%);
    &:hover {
      border-color: $braap_orange;
    }
    .bg-svg {
      position: absolute;
      right: 0;
      bottom: 0;

      pointer-events: none;
    }
    .icon {
        max-width: 50px;
        max-height: 50px;
    }
    .card-title {
      font-size: 27px;
    }

    .card-content {
      .learn-more {
        text-decoration: none;
        display: inline-block;
      }
    }
  }
</style>