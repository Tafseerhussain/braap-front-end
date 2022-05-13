<template>
  <div class="work-history">
    <v-row class="ma-0">
      <v-col cols="6" class="left">
        <div class="d-flex flex-column mx-n2">
          <div class="full-name primary--text font-weight-bold px-2">
            {{ vehicle.fullName }}
          </div>

          <v-tabs-items v-model="currentTab" class="px-2">
            <v-tab-item>
              <HistoryWork ref="requiredWork" :vehicleId="vehicleId"> </HistoryWork>
            </v-tab-item>
          </v-tabs-items>
        </div>
      </v-col>
      <v-col cols="6" class="right">
        <div class="flex-grow-1">
          <HistoryImages ref="image" class="" :vehicleId="vehicleId"></HistoryImages>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script>
  import HistoryWork from './HistoryWork.vue'
  import HistoryImages from './HistoryImages.vue'

  export default {
    name: 'WorkHistory',
    components: {
      HistoryWork,
      HistoryImages
    },
    data: function() {
      return {
        currentTab: 0,
        vehicleId: '',
        vehicle: {}
      }
    },
    computed: {},
    created() {
      const {
        params: { id }
      } = this.$route
      this.vehicleId = id
      this.getVehicle(id)
    },
    mounted() {},
    destroyed() {},
    watch: {},
    methods: {
      getVehicle(id) {
        this.$axios.post('/api/vehicle/' + id).then(result => {
          if (result.success && result.data) {
            this.vehicle = result.data
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .work-history {
    .left {
      background: #fcfcfc;
      padding: 50px;
      min-height: 100vh;
    }
    .right {
      background: #f7f7f7;
      padding: 50px;
      min-height: 100vh;
    }

    .full-name {
      font-size: 32px;
      line-height: 53px;
    }

    .workplace-tab {
      .v-btn:not(.v-btn--round).v-size--x-large {
        height: 76px;
      }
      .v-btn.v-btn {
        border: 0px;
      }
    }

    .theme--light.v-tabs-items {
      background: transparent;
    }
  }
</style>
