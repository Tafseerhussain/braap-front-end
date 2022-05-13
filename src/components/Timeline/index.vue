<template>
  <div data-braap>
    <v-app>
      <div class="timeline">
        <template v-if="!loading">
          <NewMachine v-if="showFirstWorkflow" :machine="machine" @setup="onSetup"></NewMachine>
          <template v-if="maintenance">
            <Header ref="header" :machine="machine" :username="username"></Header>
            <perfect-scrollbar class="event-container">
              <SetupMaintenance
                :maintenance="maintenance"
                :machine="machine"
                :username="username"
                @maintenanceUpdate="maintenanceUpdate"
              ></SetupMaintenance>
            </perfect-scrollbar>
          </template>
        </template>
        <template v-else>
          <v-skeleton-loader ref="skeleton" type="article" class="mx-auto"></v-skeleton-loader>
          <v-skeleton-loader ref="skeleton" type="list-item-two-line" class="mx-auto"></v-skeleton-loader>
          <v-skeleton-loader ref="skeleton" type="list-item-three-line" class="mx-auto"></v-skeleton-loader>
          <v-skeleton-loader ref="skeleton" type="list-item-two-line" class="mx-auto"></v-skeleton-loader>
        </template>
      </div>
    </v-app>
  </div>
</template>

<script>
  import Header from './Header.vue'
  import NewMachine from './NewMachine.vue'
  import SetupMaintenance from './SetupMaintenance.vue'

  export default {
    name: 'Timeline',
    components: {
      Header,
      NewMachine,
      SetupMaintenance
    },
    data: function() {
      return {
        loading: true,
        machine: null,
        maintenance: null,
        username: null
      }
    },
    computed: {
      showFirstWorkflow() {
        return this.machine && !this.maintenance
      }
    },
    created() {
      window.loadTimeline = this.loadTimeline
    },
    methods: {
      loadTimeline(vehicleId) {
        var $this = this
        $this.loading = true
        $this.$axios
          .get('/Timeline/GetTimeline', {
            params: { vehicleId: vehicleId }
          })
          .then(function(result) {
            if (result && result.status === 200 && result.data) {
              $this.usesrname = result.data.username
              $this.machine = result.data.machine
              $this.maintenance = result.data.maintenance
            }
            setTimeout(() => ($this.loading = false), 300)
          })
      },
      onSetup(maintenance) {
        this.maintenance = maintenance
      },
      maintenanceUpdate(maintenance) {
        this.maintenance = maintenance
        this.$refs.header.reloadJobs()
      }
    }
  }
</script>

<style lang="scss">
</style>
