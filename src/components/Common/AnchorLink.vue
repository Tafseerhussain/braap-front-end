<template>
  <a @click.prevent="scroll" class="text-decoration-none">
    <slot></slot>
  </a>
</template>

<script>
  export default {
    name: 'AnchorLink',
    props: {
      selector: {
        type: String
      }
    },
    data: function() {
      return {}
    },
    mounted() {},
    methods: {
      scroll() {
        let data = this.selector || this.$el.attributes.href.value
        this.$vuetify.goTo(data, { duration: 300, easing: 'easeInOutCubic', offset: 0 })
      }
    }
  }
</script>

<style lang="scss">
</style>
