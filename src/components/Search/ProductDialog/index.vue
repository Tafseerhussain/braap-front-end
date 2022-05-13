<template>
  <v-dialog
    v-model="dialog"
    max-width="1200"
    scrollable
    overlay-color="rgba(0,0,0,0.5)"
    overlay-opacity="1"
    class="elevation-0"
    content-class=" rounded-10"
  >
    <v-card class="white product-detail-wrapper rounded-10 overflow-hidden relative">
      <v-btn absolute small right icon class="mr-n3 mt-1" style="z-index: 1" @click="closeDialog">
        <v-icon size="28">mdi-close-circle</v-icon>
      </v-btn>

      <v-progress-linear
        rounded
        absolute
        height="4"
        color="braap_orange"
        background-color="grey lighten-2"
        :value="progress"
        v-show="showProgress"
      ></v-progress-linear>

      <div class="dialog-container">
        <!--v-skeleton-loader START-->
        <v-row class="px-10 pt-8 ma-0" v-if="loading">
          <v-col cols="9" class="pa-0">
            <v-skeleton-loader class="flex-grow-1" type="list-item"></v-skeleton-loader>
          </v-col>
          <v-col cols="3" class="pa-0 d-flex flex-column justify-center align-end">
            <v-skeleton-loader style="width: 100px" type="list-item"></v-skeleton-loader>
          </v-col>
        </v-row>
        <!--v-skeleton-loader END-->

        <v-row class="px-10 pt-8 ma-0" v-else-if="!error">
          <v-col cols="9" class="pa-0">
            <div class="dialog-title primary--text font-weight-bold">
              {{ product_details.title }}
            </div>
          </v-col>
          <v-col cols="3" class="pa-0 d-flex flex-column justify-center">
            <div class="product-price braap_orange--text font-weight-black text-center" v-if="price">
              {{ price | currency }}
            </div>
          </v-col>
        </v-row>
      </div>

      <v-skeleton-loader type="divider" class="my-5 mx-10" v-if="loading"></v-skeleton-loader>
      <v-divider class="my-5 mx-10" v-else-if="!error"></v-divider>

      <!--v-skeleton-loader START-->
      <div v-if="loading" class="d-flex pt-2 px-10 body-0">
        <!-- <v-btn
          :dark="currentTab === 0"
          :color="currentTab === 0 ? 'braap_orange' : '#e6e6e6'"
          class="mb-2 mr-3 px-3"
          x-large
          elevation="0"
          @click="currentTab = 0"
          >Description</v-btn
        > -->
        <v-skeleton-loader
          class="mb-2 mr-3"
          v-for="x in 4"
          :key="x"
          type="image"
          style="width: 120px; height: 50px"
        ></v-skeleton-loader>
      </div>
      <!--v-skeleton-loader END-->
      <div v-else-if="!error" class="d-flex pt-2 px-10 body-0">
        <v-btn
          :dark="currentTab === 0"
          :color="currentTab === 0 ? 'braap_orange' : '#e6e6e6'"
          class="mb-2 mr-3 px-3"
          x-large
          elevation="0"
          @click="currentTab = 0"
          >Description</v-btn
        >
        <v-btn
          :dark="currentTab === 1"
          :color="currentTab === 1 ? 'braap_orange' : '#e6e6e6'"
          class="mb-2 mr-3 px-3"
          x-large
          elevation="0"
          @click="currentTab = 1"
          v-if="!viewOnly"
          >Related Parts</v-btn
        >
        <v-btn
          :dark="currentTab === 2"
          :color="currentTab === 2 ? 'braap_orange' : '#e6e6e6'"
          class="mb-2 mr-3 px-3"
          x-large
          elevation="0"
          @click="currentTab = 2"
          >Review</v-btn
        >
        <v-btn
          :dark="currentTab === 3"
          :color="currentTab === 3 ? 'braap_orange' : '#e6e6e6'"
          class="mb-2 mr-3 px-3"
          x-large
          elevation="0"
          @click="currentTab = 3"
          v-if="!viewOnly"
          >Price Comparison</v-btn
        >
      </div>

      <v-card-text class="px-10 pb-0 mt-10 mb-0">
        <!--v-skeleton-loader START-->
        <v-tabs-items v-if="loading" v-model="currentTab" class="overflow-visible">
          <v-tab-item>
            <v-card flat>
              <v-card-text class="px-0">
                <div class="d-flex flex-column flex-sm-row align-center align-sm-start pt-sm-6">
                  <div class="d-flex flex-column mr-sm-4 mb-4 mb-sm-0">
                    <v-skeleton-loader style="width: 200px" type="image"></v-skeleton-loader>
                  </div>
                  <div class="d-flex flex-column body-1 flex-grow-1 align-self-stretch px-2 px-sm-0">
                    <v-skeleton-loader
                      v-for="x in $vuetify.breakpoint.smAndUp ? 5 : 2"
                      :key="x"
                      type="paragraph"
                      class="mb-4"
                    ></v-skeleton-loader>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-tab-item>
        </v-tabs-items>
        <!--v-skeleton-loader END-->

        <v-tabs-items v-else-if="!error" v-model="currentTab" class="overflow-visible">
          <v-tab-item>
            <Details :part="part" @close="closeDialog"></Details>
          </v-tab-item>
          <v-tab-item>
            <RelatedParts
              ref="related"
              :parts="related_parts"
              @add="addToCart"
              @open="openProduct"
              @close="closeDialog"
            ></RelatedParts>
          </v-tab-item>
          <v-tab-item>
            <Reviews :review="reviews_results" :productId="productId" @close="closeDialog"></Reviews>
          </v-tab-item>
          <v-tab-item>
            <PriceComparision
              :onlineSellers="online_sellers"
              @select="selectPrice"
              @close="closeDialog"
              @addToCart="addToCart"
            ></PriceComparision>
          </v-tab-item>
        </v-tabs-items>

        <div class="d-flex flex-column align-center justify-center" style="height: 100%" v-else>
          <div class="d-flex justify-center">
            <img class="empty-img" src="/img/empty.png" />
          </div>
          <div class="d-flex flex-wrap align-center justify-center primary--text body-1 pt-6">
            <v-btn text color="braap_deep_blue" class="pr-2" @click="closeDialog"> Go back to results</v-btn>
            <span class="mx-1 d-none d-sm-block">|</span>Descriptions are sometimes not available.
          </div>
        </div>
      </v-card-text>

      <!-- Float Action Button -->
      <v-card-actions class="mb-8 mr-6 d-flex">
        <v-btn
          v-if="!loading && !error && currentTab != 1 && currentTab != 2 && !viewOnly"
          color="primary"
          class="body-0 rounded-10 px-8 ml-auto"
          dark
          x-large
          @click="addToCart"
          >Add To Cart</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
  import Details from './Details.vue'
  import RelatedParts from './RelatedParts.vue'
  import Reviews from './Reviews.vue'
  import PriceComparision from './PriceComparision.vue'
  export default {
    name: 'product-dialog',
    props: {
      viewOnly: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        progress: 0,
        showProgress: true,
        error: false,
        dialog: false,
        currentTab: 0,

        productId: null,
        part: {},
        input_part_price: 0,
        product_details: {},
        related_parts: [],
        reviews_results: null,
        online_sellers: [],
        selected_seller: null
      }
    },
    components: {
      Details,
      RelatedParts,
      Reviews,
      PriceComparision
    },
    watch: {
      dialog(val) {
        if (val) {
          this.$chat.hide()
          this.$scrollbar_hide()
        } else {
          this.$chat.show()
          this.$scrollbar_show()
        }
      },
      loading(val) {
        if (val) this.showProgress = val
        else {
          setTimeout(() => {
            this.showProgress = false
          }, 500)
        }
      }
    },
    computed: {
      price() {
        if (this.selected_seller) return this.selected_seller.braap_price
        if (this.input_part_price) return this.input_part_price
        if (this.online_sellers.length > 0) return this.online_sellers[0].braap_price
        return 0
      },
      loading() {
        return this.progress != 100
      }
    },
    created() {},
    mounted() {},
    methods: {
      getProductDetail(serp_productid) {
        console.log('id', serp_productid)
        this.progress = 30
        this.$axios.post(`/api/search/products/${serp_productid}`).then(result => {
          if (result.success && result.data && result.data.product_results) {
            this.part = this.createPartModel(result)
            this.product_details = result.data.product_results
            this.reviews_results = result.data.reviews_results
            this.online_sellers = result.data.online_sellers_desc || []
            this.progress = 50

            let relatedProductIds = []
            if (result.data.related_products && result.data.related_products.different_brand)
              relatedProductIds = result.data.related_products.different_brand
                .filter(x => x.partNumber)
                .filter((x, index) => index < 4)
                .map(x => x.partNumber)

            if (relatedProductIds.length > 0 && !this.viewOnly) {
              // get related product, only get first four
              Promise.all(relatedProductIds.map(x => this.getRelatedProductDetails(x))).then(data => {
                this.related_parts = data.filter(x => x)
                this.progress = 100
              })
            } else {
              this.progress = 100
            }
          } else {
            this.progress = 100
            this.error = true
          }
        })
      },
      getRelatedProductDetails(serp_productid) {
        return new Promise(resolve => {
          this.$axios.post(`/api/search/products/${serp_productid}`).then(result => {
            if (result.success && result.data && result.data.product_results) {
              let part = this.createPartModel(result)
              resolve(part)
            } else {
              resolve(null)
            }
            this.progress += 10
          })
        })
      },
      createPartModel(result) {
        let data = result.data
        let details = data.product_results
        return {
          ...details,
          part_name: details.title,
          thumbnail: details.media && details.media.length > 1 ? details.media[0].link : null,
          decimalprice:
            data.online_sellers_desc && data.online_sellers_desc.length > 0 ? data.online_sellers_desc[0].braap_price : 0,
          braap_supplier_id:
            data.online_sellers_desc && data.online_sellers_desc.length > 0 ? data.online_sellers_desc[0].id : null
        }
      },
      closeDialog() {
        this.dialog = false
        // this.$emit('update:productId', null)
      },
      addToCart(part) {
        if (!part) {
          // add current part
          if (this.selected_seller) {
            this.part.decimalprice = this.selected_seller.decimalprice
            this.part.braap_supplier_id = this.selected_seller.id
          }
          part = this.part
        }
        this.$emit('add-to-cart', part)
      },
      openProduct({ braap_part_number, part_price }) {
        this.error = false
        this.progress = 0
        this.currentTab = 0
        this.productId = braap_part_number
        this.input_part_price = part_price
        this.product_details = {}
        this.related_parts = []
        this.dialog = true
        this.getProductDetail(braap_part_number)
      },
      selectPrice(seller) {
        this.selected_seller = seller
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .product-detail-wrapper.v-card {
    // height: calc(100vh - 150px);
    height: 100vh;
    max-height: calc(100vh - 150px) !important;
    @media (max-width: 600px) {
      max-height: none !important;
    }
    .dialog-container {
      .dialog-title {
        font-size: 27px;
      }
      .product-price {
        font-size: 32px;
      }
      .active {
        color: #000;
        background: $braap_orange;
      }
    }
    .empty-div {
      width: 100%;
      height: 60px;
    }

    & > .v-card__text {
      &::-webkit-scrollbar {
        width: 3px;
      }
      &::-webkit-scrollbar-thumb {
        width: 1px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
      }
    }
  }
</style>