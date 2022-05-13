<template>
  <v-card
    class="card-wrapper px-4 pt-4 pb-14 rounded-10 video-card relative overflow-hidden skeleton d-flex flex-column"
  >
    <div>
      <v-skeleton-loader
        ref="img"
        type="image"
        :height="imgHeight"
        max-height="260"
        class="rounded-10"
        v-resize="setHeight"
      ></v-skeleton-loader>
    </div>
    <v-spacer></v-spacer>
    <v-skeleton-loader class="pt-6 pb-2" type="text@2"></v-skeleton-loader>
    <v-spacer></v-spacer>
    <v-skeleton-loader type="image" height="44" class="rounded-10 mt-1"></v-skeleton-loader>
    <v-skeleton-loader type="image" height="44" class="rounded-0 bottom-btn"></v-skeleton-loader>
  </v-card>
</template>

<script>
  export default {
    name: 'VideoSkeleton',
    props: {},
    components: {},
    data: function() {
      return {
        imgHeight: 260
      }
    },
    watch: {},
    mounted() {},
    methods: {
      setHeight() {
        this.$nextTick(() => {
          this.imgHeight = this.$refs.img.$el.offsetWidth / 1.33
        })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  @import './style.scss';

  .card-wrapper {
    &.video-card.skeleton {
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
