<template>
  <div data-braap>
    <v-app>
      <TimelineChat ref="timeline"></TimelineChat>
    </v-app>
  </div>
</template>

<script>
  import TimelineChat from './TimelineChat.vue'

  export default {
    name: 'Index',
    components: {
      TimelineChat
    },
    created() {
      window.loadTimeline = (vehicleId) => {
        this.$refs.timeline.loadTimeline(vehicleId)
      }
    },
  }
</script>

<style lang="scss">
</style>
