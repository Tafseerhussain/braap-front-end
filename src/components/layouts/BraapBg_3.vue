<template>
  <div class="braap-bg3 relative">
      <img src="img/about/braap-faded.png" class="braap-faded" />
      <slot></slot>
  </div>
</template>

<script>
export default {

}
</script>

<style lang="scss">
  .braap-bg3{
    .braap-faded {
      position: absolute;
      left: 35%;
      top: 0;
      height: 450px;
    }
  }
</style>