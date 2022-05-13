<template>
  <div class="braap-cart">
    <div class="cart-header primary white--text justify-center font-weight-bold d-flex align-center">
      <img class="header-img" src="/icons/cart-white.svg" />
      <div class="ml-3">Cart</div>
    </div>
    <cart-content></cart-content>
  </div>
</template>

<script>
  import CartContent from './CartContent.vue'
  export default {
    name: 'BraapCart',
    components: {
      CartContent
    }
  }
</script>

<style lang="scss">
  .braap-cart {
    .cart-header {
      padding: 100px 0;
      font-size: 50px;
      .header-img {
        height: 50px;
      }
    }
  }
</style>