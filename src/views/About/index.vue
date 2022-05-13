<template>
  <div>
      <braap-about></braap-about>
      <braap-story></braap-story>
  </div>
</template>

<script>
import BraapAbout from './BraapAbout.vue'
import BraapStory from './BraapStory.vue'
export default {
    components:{
        BraapAbout,
        BraapStory
    },
    mounted(){
        this.$initSr()
    }
}
</script>

<style lang="scss">

</style>