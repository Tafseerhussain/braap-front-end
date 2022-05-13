<template>
  <v-navigation-drawer v-model="drawer" fixed width="600" temporary right class="elevation-0 timeline-drawer">
    <TimelineChat ref="timeline" @close="drawer = false"></TimelineChat>
  </v-navigation-drawer>
</template>

<script>
  import TimelineChat from './TimelineChat.vue'

  export default {
    name: 'Drawer',
    components: {
      TimelineChat
    },
    data: function() {
      return {
        drawer: false,
        vehicleId: null
      }
    },
    watch: {
      drawer(val) {
        if (!val) {
          this.$emit('closed', this.vehicleId)
          this.$chat.show()
          this.$scrollbar_show()
        } else {
          this.$chat.hide()
          this.$scrollbar_hide()
        }
      }
    },
    created() {
      window.loadTimeline = this.loadTimeline
    },
    methods: {
      loadTimeline(vehicleId) {
        this.drawer = true
        this.vehicleId = vehicleId
        this.$refs.timeline.loadTimeline(vehicleId)
      },
      include() {
        var arr = []
        window.document.querySelectorAll('.v-menu__content').forEach(x => arr.push(x))
        return arr
      }
    }
  }
</script>

<style lang="scss">
  .timeline-drawer {
    position: relative;
    z-index: 101 !important;
    background-color: transparent !important;
    .v-navigation-drawer__border {
      display: none;
    }
  }
</style>
