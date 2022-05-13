<template>
  <v-card
    class="card-wrapper px-4 pt-4 pb-12 rounded-10 relative overflow-hidden d-flex flex-column machine-asset skeleton"
  >
    <div class="d-flex justify-space-between align-center">
      <v-skeleton-loader class="" type="button" width="60"></v-skeleton-loader>
      <v-skeleton-loader class="" type="text" width="150"></v-skeleton-loader>
    </div>

    <v-skeleton-loader class="pt-5" type="text@2"></v-skeleton-loader>

    <v-skeleton-loader
      ref="img"
      type="image"
      :height="imgHeight"
      max-height="228"
      class="rounded-10 mt-7"
      v-resize="setHeight"
    ></v-skeleton-loader>

    <v-spacer></v-spacer>
    <v-divider></v-divider>
    <div class="d-flex justify-space-between align-center px-10 mb-4 mt-4">
      <v-skeleton-loader class="" type="button" width="60"></v-skeleton-loader>
      <v-skeleton-loader class="" type="button" width="60"></v-skeleton-loader>
    </div>
    <v-divider></v-divider>

    <v-skeleton-loader class="mt-7 mb-3" type="text"></v-skeleton-loader>
    <v-skeleton-loader type="image" height="44" class="rounded-0 bottom-btn"></v-skeleton-loader>
  </v-card>
</template>

<script>
  export default {
    name: 'MachineAssetSkeleton',
    props: {},
    data: function() {
      return {
        imgHeight: 228
      }
    },
    mounted() {},
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
    &.machine-asset.skeleton {
      .v-skeleton-loader__image {
        height: 100%;
      }
      .bottom-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        margin-left: -16px;
      }
    }
  }
</style>