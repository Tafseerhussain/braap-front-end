<template>
  <v-card class="feature-card pa-10 d-flex flex-column justify-space-between rounded-10" flat height="100%">
    <div class="feature-card-img text-center">
      <img :src="imgsrc" />
    </div>

    <div class="feature-title text-center mt-7 mb-5 font-weight-medium text-h5 primary--text">
      {{ title }}
    </div>

    <div class="feature-pointer text-center text-subtitle1">
      <p class="ma-0">{{ info[0] }}</p>
      <p class="ma-0">{{ info[1] }}</p>
      <p class="ma-0">{{ info[2] }}</p>
    </div>
    <v-spacer></v-spacer>
    <div class="learn-btn body-0 text-center mt-10 braap_orange--text" @click="onLearnBtnClicked">
      Learn More <v-icon class="braap_orange--text">mdi-arrow-right</v-icon>
    </div>
  </v-card>
</template>

<script>
  export default {
    name: 'FeatureCard',
    props: ['id','title', 'imgsrc', 'info'],
    methods: {
      onLearnBtnClicked() {
        this.$router.push({ name: 'SingleFeature', params: { id: this.id } })
      }
    }
  }
</script>

<style lang="scss">
  .feature-card {
    background: #fff;
    border: 2px solid transparent;
    box-shadow: 0 4px 15px rgb(138 138 138 / 10%);
    transition: border 0.3s;
    &:hover {
      border: 2px solid #e58a00;
    }

    .feature-card-img {
      img {
        height: 200px;
      }
    }

    .feature-title {
      line-height: 36px;
    }

    .feature-pointer {
      p {
        line-height: 40px;
        color: #696969;
      }
    }

    .learn-btn {
      cursor: pointer;
    }
  }
</style>
