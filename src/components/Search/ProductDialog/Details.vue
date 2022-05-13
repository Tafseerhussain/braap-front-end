<template>
  <v-card flat class="product-detail">
    <v-card-text class="pa-0">
      <div class="d-flex mx-n3">
        <div class="d-flex flex-column left-item mx-3" v-if="images && images.length > 0">
          <div>
            <div class="img-box rounded-10 d-flex flex-wrap justify-center align-center">
              <v-img class="mb-2" aspect-ratio="1" contain :src="currentImg">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0 grey lighten-2 rounded" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </div>
          </div>

          <div class="img-link d-flex flex-wrap my-5 mx-n1" v-if="images.length > 1" ref="imgContainer">
            <a
              class="d-flex align-center ma-1 pa-2 rounded"
              v-for="(img, index) in images"
              :key="index"
              @click="currentImg = img.link"
            >
              <v-img :max-width="imgWidth" :min-width="imgWidth" aspect-ratio="1" contain :src="img.link">
                <template v-slot:placeholder>
                  <v-row class="fill-height ma-0 grey lighten-2 rounded" align="center" justify="center">
                    <v-progress-circular indeterminate color="grey lighten-5"></v-progress-circular>
                  </v-row>
                </template>
              </v-img>
            </a>
          </div>
        </div>

        <div class="mx-3 right-item">
          <p class="mb-5">
            <small class="ml-auto font-weight-medium primary--text">{{ getPartStatus(part) }}</small>
            <img src="/icons/green-tick.svg" alt="" />
            <!-- <span class="ml-3 text-subtitle-1 braap_green--text">In Stock & Ships in 1 - 2 days</span> -->
            <small class="ml-3 text-subtitle-1 braap_green--text">
              {{ getStockStatus(part) }}: ships in {{ part.expected_ship_time ? part.expected_ship_time : '1-2' }} days
            </small>
          </p>
          <template v-if="part.description">{{ part.description }}</template>
          <div class="d-flex align-center mt-4 body-1 grey--text px-2 px-sm-0" v-else>
            <v-icon class="mr-2">mdi-reload</v-icon>Sorry we don’t have that information. Ask our technician.
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    name: 'product-details',
    components: {},
    props: {
      part: {
        type: Object
      }
    },
    data: function() {
      return {
        currentImg: null,
        imgWidth: 50
      }
    },
    mounted() {
      this.imgWidth = this.$refs.imgContainer.offsetWidth / 3 - 26.5
    },
    watch: {
      part(val) {
        if (val) {
          this.currentImg = val.media && val.media.length > 0 ? val.media[0].link : null
        }
      }
    },
    computed: {
      images() {
        return this.part ? this.part.media.filter((x, index) => index < 3) : []
        // return this.part ? this.part.media : []
      }
    },
    created() {
      console.log('detail created', this.part)
      if (this.part) {
        this.currentImg = this.part.media && this.part.media.length > 0 ? this.part.media[0].link : null
      }
    },
    methods: {
      getPartStatus(part) {
        var status = []
        if (part.part_condition) status.push(part.part_condition)
        if (part.origin) status.push(part.origin)
        return status.join(': ')
      },
      getStockStatus(part) {
        if (part.inventory_level && part.inventory_level < 5) {
          return 'Only ' + part.inventory_level + ' left in stock'
        } else return part.stock_status || 'In Stock'
      },
      closeDialog() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .product-detail {
    .left-item {
      flex-basis: 25%;
      .img-box {
        padding: 10px;
        border: 1px solid $braap_light_grey;
        display: inline-block;
        // width: 200px;
        // height: 200px;
      }
      .img-link {
        a {
          border: 1px solid $braap_light_grey;
        }
      }
    }
    .right-item {
      flex-basis: 75%;
      .detail-content {
        line-height: 27px;
      }
    }
    .empty-img {
      width: 50%;
    }
  }
</style>