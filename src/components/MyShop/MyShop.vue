<template>
  <div data-braap>
    <v-app class="my-shop">
      <v-btn-toggle
        v-if="userType === 'TECH'"
        class="braap-primary-toggle px-3 px-sm-4 mt-2 mb-0"
        v-model="type"
        dense
        background-color="white"
      >
        <v-btn
          :color="type === 0 ? 'primary' : 'white'"
          :class="{ 'white--text': type === 0 }"
          class="px-4 text-capitalize"
        >
          Machine | Asset
        </v-btn>
        <v-btn
          :color="type === 1 ? 'primary' : 'white'"
          :class="{ 'white--text': type === 1 }"
          class="px-8 text-capitalize"
        >
          Customer
        </v-btn>
      </v-btn-toggle>
      <Charts></Charts>
      <QuickAction @open-timeline="openTimeline"></QuickAction>

      <v-btn-toggle
        v-if="userType === 'TECH'"
        class="braap-primary-toggle px-3 px-sm-4 mt-2 mb-0"
        v-model="currentTab"
        dense
        background-color="white"
      >
        <v-btn
          :color="currentTab === 0 ? 'primary' : 'white'"
          :class="{ 'white--text': currentTab === 0 }"
          class="px-4 text-capitalize"
        >
          Machine | Asset
        </v-btn>
        <v-btn
          :color="currentTab === 1 ? 'primary' : 'white'"
          :class="{ 'white--text': currentTab === 1 }"
          class="px-10 text-capitalize"
        >
          My Job
        </v-btn>
      </v-btn-toggle>
      <v-tabs-items v-model="currentTab">
        <v-tab-item>
          <MachineGrid v-model="selectedMachine" :userType="userType"></MachineGrid>
        </v-tab-item>
        <v-tab-item>
          <MachineForReview v-model="selectedMachine" :userType="userType"></MachineForReview>
        </v-tab-item>
      </v-tabs-items>
      <TimelineDrawer ref="timeline" @closed="selectedMachine = null"></TimelineDrawer>
      <BackTop></BackTop>
    </v-app>
  </div>
</template>

<script>
  import MachineGrid from './MachineGrid.vue'
  import MachineForReview from './MachineForReview.vue'
  import Charts from './Charts.vue'
  import QuickAction from './QuickAction.vue'
  import TimelineDrawer from '../TimelineChat/Drawer.vue'
  import BackTop from '../BackTop.vue'

  export default {
    name: 'MyShop',
    props: {},
    components: { Charts, MachineGrid, QuickAction, TimelineDrawer, BackTop, MachineForReview },
    data: function() {
      return {
        selectedMachine: null,
        type: 0,
        userType: 'CUSTOMER',
        currentTab: 0
      }
    },
    watch: {
      selectedMachine(val) {
        if (val) {
          this.$refs.timeline.loadTimeline(val)
        }
      },
      type(val) {
        if (val === 1) window.location.href = '/customer-contact'
      }
    },
    mounted() {
      this.userType = document.querySelector('#User_Type').value
      var id = this.$url.get('timeline')
      if (id) {
        this.selectedMachine = id
        this.$url.remove('timeline')
      }
    },
    methods: {
      openTimeline(id) {
        this.selectedMachine = id
      }
    }
  }
</script>

<style lang="scss">
  .my-shop {
    font-family: Roboto, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    letter-spacing: -0.3px;
  }
</style>
