<template>
  <div class="braap-bg1 relative">
    <div class="top-left-img absolute">
      <img src="../../assets/section-top-left.png" alt="img" />
    </div>
    <div class="top-right-img absolute">
      <img src="../../assets/section-top-right.png" alt="img" />
    </div>
    <div class="bottom-left-img absolute">
      <img src="../../assets/section-bottom-left.png" alt="img" />
    </div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'BraapBg_1'
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';
  .braap-bg1 {
    .top-left-img {
      top: 0;
      left: 0;
      img {
        height: 100px;
      }
    }

    .top-right-img {
      top: 0;
      right: 0;
      img {
        height: 200px;
      }
    }

    .bottom-left-img {
      bottom: 0;
      left: 0;
      img {
        height: 350px;
      }
    }
  }
</style>