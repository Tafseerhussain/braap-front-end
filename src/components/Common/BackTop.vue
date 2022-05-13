<template>
  <div v-scroll="onScroll">
    <transition name="scale-transition">
      <v-btn
        fixed
        bottom
        right
        fab
        dark
        color="braap_grey"
        transition="scale-transition"
        v-show="showBackToTop"
        class="mr-n1 mb-15 backtop"
        @click="backTop"
      >
        <v-icon large>mdi-chevron-up</v-icon>
      </v-btn>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'BackTop',
    data: function() {
      return {
        showBackToTop: false
      }
    },
    mounted() {
      var scrollTop = document.documentElement.scrollTop
      if (scrollTop > 200) {
        this.showBackToTop = true
      } else {
        this.showBackToTop = false
      }
    },
    methods: {
      onScroll() {
        var scrollTop = document.documentElement.scrollTop
        if (scrollTop > 200) {
          this.showBackToTop = true
        } else {
          this.showBackToTop = false
        }
      },
      backTop() {
        this.$vuetify.goTo('body', { duration: 300, easing: 'easeInOutCubic', offset: 0 })
      }
    }
  }
</script>

<style lang="scss">
  .backtop.v-btn--fab.v-size--default {
    width: 60px;
    height: 60px;
  }
</style>
