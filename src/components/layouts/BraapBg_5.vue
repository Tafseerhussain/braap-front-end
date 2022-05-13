<template>
  <div class="braap-bg5 relative">
    <img src="/img/about/braap-faded.png" class="braap-faded" />
    <slot></slot>
  </div>
</template>

<script>
  export default {}
</script>

<style lang="scss">
  .braap-bg5 {
    .braap-faded {
      position: absolute;
      right: 10%;
      top: 15%;
      height: 190px;
    }
  }
</style>