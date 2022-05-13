<template>
  <v-card flat class="product-reviews">
    <v-card-text class="pa-0">
      <template v-if="ratings.length > 0 && reviews.length > 0">
        <div class="d-flex py-5 mx-n3">
          <div class="left-item mx-3">
            <div class="font-weight-bold text-h6 primary--text text-center">Rating Overview</div>
            <div class="my-3 font-weight-black text-center reviews-score primary--text">
              {{ Number(avgRating).toFixed(1) }}
            </div>
            <div class="text-center">
              <v-rating
                :value="avgRating"
                size="28"
                color="braap_yellow"
                background-color="braap_yellow"
                readonly
                half-increments
              ></v-rating>
            </div>
            <div class="mt-3 mb-5 text-subtitle-1 braap_grey--text text-center">
              {{ totalReviews | number }} {{ totalReviews > 1 ? 'ratings' : 'rating' }}
            </div>
            <div>
              <div
                v-for="rating in ratings"
                :key="rating.stars"
                class="d-flex align-center text-no-wrap braap_grey--text text-subtitle-1"
              >
                <div class="d-flex justify-space-between align-center star-item" style="height: 29px">
                  <span style="width: 14px; height: 20px; line-height: 22px">{{ rating.stars }}</span>
                  <v-icon color="braap_grey" size="18">mdi-star</v-icon>
                </div>
                <v-progress-linear
                  color="braap_yellow"
                  rounded
                  height="12"
                  background-color="braap_bg_grey"
                  :value="(rating.amount / totalReviews) * 100"
                  class="mx-4 progress"
                ></v-progress-linear>
                <v-spacer></v-spacer>
              </div>
            </div>
          </div>
          <div class="right-item mx-3">
            <div v-for="(review, index) in reviews" :key="index">
              <div class="body-0 primary--text">{{ review.title }}</div>
              <div class="py-1">
                <v-rating
                  :value="review.rating"
                  size="16"
                  color="braap_yellow"
                  background-color="braap_yellow"
                  readonly
                  half-increments
                ></v-rating>
              </div>
              <div class="d-flex align-center">
                <img class="calender-img" src="/icons/calender.svg" />
                <span class="ml-1 mt-1 text-caption">{{ review.date }}</span>
              </div>
              <div class="my-3 braap_grey--text">
                {{ review.content }}
              </div>
              <div class="primary--text font-weight-medium">
                {{ review.source }}
              </div>
              <v-divider class="my-5"></v-divider>
            </div>
            <v-btn
              @click="loadMore"
              v-if="!loaded"
              :loading="loading"
              color="primary rounded-10 px-9 body-0"
              dark
              x-large
              >View More</v-btn
            >
          </div>
        </div>
      </template>
      <div v-else class="d-flex flex-column align-center justify-center" style="height: 100%">
        <div class="d-flex justify-center">
          <img class="empty-img" src="/img/empty.png" />
        </div>
        <div class="d-flex flex-wrap align-center justify-center primary--text body-1 pt-6">
          <v-btn text color="braap_deep_blue" class="pr-2" @click="closeDialog"> Go back to results</v-btn>
          <span class="mx-1 d-none d-sm-block">|</span>Reviews are sometimes not available.
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  export default {
    data: function() {
      return {
        reviews: [],
        loaded: false,
        loading: false
      }
    },
    props: {
      productId: {
        type: String
      },
      review: {
        type: Object
      }
    },
    created() {
      if (this.review) {
        this.reviews = this.review.reviews
      }
    },
    watch: {
      review(val) {
        if (val) {
          this.reviews = val.reviews
        }
      }
    },
    computed: {
      ratings() {
        const innerRatings = this.review ? this.review.ratings : []
        return innerRatings.reverse()
      },
      totalReviews() {
        let val = 0
        this.ratings.forEach(x => {
          val += x.amount
        })
        return val
      },
      avgRating() {
        let val = 0
        this.ratings.forEach(x => {
          val += x.stars * x.amount
        })
        return Math.round((val / this.totalReviews) * 10) / 10
      }
    },
    methods: {
      loadMore() {
        this.loading = true
        this.$axios.post(`/api/search/products/${this.productId}/reviews/list`).then(result => {
          if (result.success && result.data && result.data.reviews_results) {
            if (result.data.reviews_results.reviews.length > 1) this.reviews = result.data.reviews_results.reviews
          }
          this.loaded = true
        })
      },
      closeDialog() {
        this.$emit('close')
      }
    }
  }
</script>

<style lang="scss">
  .product-reviews {
    .left-item {
      flex-basis: 33.3%;
    }
    .right-item {
      flex-basis: 66.6%;
    }
    .empty-img {
      width: 80%;
    }
    .reviews-score {
      font-size: 40px;
    }
    .calender-img {
      height: 16px;
    }
    .star-item {
      flex-basis: 8%;
    }
  }
</style>