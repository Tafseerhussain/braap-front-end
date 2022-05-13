<template>
  <v-container class="feature-details white">
    <div class="feature-details-content">
      <v-row class="feature-deatils-row" v-for="(l, index) in list" :key="index" :id="l.id">
        <template v-if="l.direction === 'left'">
          <v-col cols="12" md="7">
            <feature-detail-card :id="l.id" :icon="l.icon" :title="l.title" :content="l.content"></feature-detail-card>
          </v-col>
          <v-col cols="12" md="5" class="feature-detail-card-img text-center">
            <img :src="l.img" class="fade-right-delay" />
          </v-col>
        </template>

        <template v-if="l.direction === 'right'">
          <v-col cols="12" md="5" class="feature-detail-card-img text-center">
            <img :src="l.img" class="fade-left-delay" />
          </v-col>
          <v-col cols="12" md="7">
            <feature-detail-card :id="l.id" :icon="l.icon" :title="l.title" :content="l.content"></feature-detail-card>
          </v-col>
        </template>
      </v-row>
    </div>
  </v-container>
</template>


<script>
  import FeatureDetailCard from './FeatureDetailCard.vue'
  import featureData from './featuresData'
  export default {
    name: 'FeatureDetail',
    data() {
      return {
        list: []
      }
    },
    components: {
      FeatureDetailCard
    },
    created() {
      this.getFeatureList()
    },
    methods: {
      getFeatureList() {
        this.list = featureData
      }
    }
  }
</script>

<style lang="scss">
  .feature-details {
    padding-bottom: 150px;
    .feature-details-content {
      .feature-deatils-row {
        padding-top: 120px;
        .feature-detail-card-img {
          img {
            vertical-align: middle;
          }
        }
      }
    }
  }
</style>