<template>
  <div class="braap-bg4 relative">
    <img src="/img/home/market-place-arrows.png" class="market-place-arrows" alt="arrows" />
    <img src="/img/home/market-place-circle.png" class="market-place-circle" alt="circles" />
    <img src="/img/home/market-place-top-right.png" class="market-place-top-right" alt="circle" />
    <img src="/img/home/market-place-waves.png" class="market-place-waves" alt="waves" />
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'BraapBg4'
  }
</script>

<style lang="scss">
  .braap-bg4 {
    .market-place-arrows {
      position: absolute;
      bottom: 15%;
      right: 20%;
    }

    .market-place-circle {
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
    }

    .market-place-top-right {
      position: absolute;
      right: 0;
      top: 3%;
      pointer-events: none;
    }

    .market-place-waves {
      position: absolute;
      left: 15%;
      top: 20%;
      pointer-events: none;
    }
  }
</style>