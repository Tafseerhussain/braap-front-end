<template>
  <v-card class="card-wrapper px-5 pt-4 pb-12 rounded-10 trending-fix-card trending-skeleton relative overflow-hidden">
    <div class="d-flex align-center justify-space-between">
      <v-skeleton-loader class="mx-n5" type="button" width="60" height="24"></v-skeleton-loader>
      <v-skeleton-loader class="rounded-circle" type="button" width="35" height="35"></v-skeleton-loader>
    </div>
    <v-skeleton-loader class="pt-5 mb-2" type="text@2"></v-skeleton-loader>

    <div class="img-container">
      <v-skeleton-loader ref="img" :height="imgHeight" v-resize="setHeight" type="image"></v-skeleton-loader>
    </div>

    <v-skeleton-loader type="divider"></v-skeleton-loader>
    <div class="d-flex align-center justify-space-between pa-2">
      <div class="d-flex flex-column align-center pl-6">
        <v-skeleton-loader class="rounded-circle" type="button" width="35" height="35"></v-skeleton-loader>
      </div>
      <v-skeleton-loader type="image" width="82" height="36"></v-skeleton-loader>
    </div>
    <v-skeleton-loader type="divider"></v-skeleton-loader>
    <v-skeleton-loader class="py-3" type="text"></v-skeleton-loader>
    <!-- <v-skeleton-loader class="bottom-btn rounded-0 mx-n5 absolute" type="img" height="48"></v-skeleton-loader> -->
    <v-skeleton-loader type="image" height="48" class="rounded-0 bottom-btn mx-n5"></v-skeleton-loader>
  </v-card>
</template>

<script>
  export default {
    name: 'TrendingSkeleton',
    data() {
      return {
        imgHeight: 0
      }
    },
    mounted() {
      this.setHeight()
    },
    methods: {
      setHeight() {
        this.$nextTick(() => {
          this.imgHeight = this.$refs.img.$el.offsetWidth / 1.5
        })
      }
    }
  }
</script>

<style lang="scss">
  .card-wrapper {
    &.trending-fix-card.trending-skeleton {
      .bottom-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        margin-left: -16px;
      }
    }
  }
</style>