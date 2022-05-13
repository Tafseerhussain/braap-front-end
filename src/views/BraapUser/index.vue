<template>
  <div class="braap-user">
      <braap-user-header></braap-user-header>
      <who-use></who-use>
  </div>
</template>

<script>
import BraapUserHeader from './BraapUserHeader.vue'
import WhoUse from './WhoUse.vue'
export default {
    components: {
        BraapUserHeader,
        WhoUse
    }
}
</script>

<style lang="scss">

</style>