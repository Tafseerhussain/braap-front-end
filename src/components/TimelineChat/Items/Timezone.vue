<template>
  <Bubble align="right" color="braap_red">
    <span class="body-2 d-block white--text">
      If the time is not {{ moment().format('h:mm A on MMMM D, YYYY') }},
      <a class="white--text" href="/account">click here to set your time zone</a>.
    </span>
  </Bubble>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'Timezone',
    components: {
      Bubble
    },
    data: function() {
      return {}
    },
    mounted() {
      this.$cookie.set('BRAAP_TimezoneConfirmed', true)
    },
    methods: {
      moment
    }
  }
</script>

<style lang="scss">
</style>
