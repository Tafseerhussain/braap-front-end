<template>
  <div class="braap-white-bg1 relative">
    <img class="section-left" src="../../assets/img/features/section-left.png" />
    <img class="section-waves" src="../../assets/img/features/section-waves.png" />
    <img class="section-dots" src="../../assets/img/features/section-dots.png" />
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'BraapBg_2.vue'
  }
</script>

<style lang="scss">
  .braap-white-bg1 {
    .section-left {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 400px;
      pointer-events: none;
      vertical-align: middle;
    }

    .section-waves {
      position: absolute;
      right: 0;
      top: 14%;
      pointer-events: none;
      vertical-align: middle;
    }

    .section-dots {
      position: absolute;
      left: 50%;
      top: 15%;
      pointer-events: none;
      vertical-align: middle;
    }
  }
</style>