<template>
  <v-card
    class="card-wrapper px-4 pt-4 pb-14 rounded-10 part-card relative overflow-hidden skeleton d-flex flex-column"
  >
    <div class="d-flex justify-space-between align-center">
      <v-skeleton-loader class="" type="button" width="60"></v-skeleton-loader>
      <v-skeleton-loader class="" type="text" width="150"></v-skeleton-loader>
    </div>

    <v-skeleton-loader
      ref="img"
      type="image"
      :height="imgHeight"
      max-height="138"
      class="my-5"
      v-resize="setHeight"
    ></v-skeleton-loader>

    <v-skeleton-loader class="pt-5" type="text@2"></v-skeleton-loader>
    <v-skeleton-loader class="ml-auto mt-4" type="text" width="150"></v-skeleton-loader>
    <v-spacer></v-spacer>
    <v-skeleton-loader class="my-5" type="text@2"></v-skeleton-loader>
    <v-spacer></v-spacer>
    <v-skeleton-loader type="image" height="44" class="rounded-10 mt-1"></v-skeleton-loader>
    <v-skeleton-loader type="image" height="44" class="rounded-0 bottom-btn"></v-skeleton-loader>
  </v-card>
</template>

<script>
  export default {
    name: 'PartSkeleton',
    data() {
      return {
        imgHeight: 138
      }
    },
    mounted() {},
    methods: {
      setHeight() {
        this.$nextTick(() => {
          this.imgHeight = (this.$refs.img.$el.offsetWidth - 56) / 1.93
        })
      }
    }
  }
</script>

<style lang="scss">
  .card-wrapper {
    &.part-card.skeleton {
      .bottom-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        margin-left: -16px;
      }
    }
  }
</style>
