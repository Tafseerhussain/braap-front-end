<template>
  <div class="d-flex flex-column">
    <Bubble :timestamp="activity.timestamp" align="right" :class="{ 'not-allowed': disabled }">
      <p class="ma-0" v-if="autoPilot">
        Auto pilot is on and will automatically set the first maintenance date in {{ autoPilotOnDays }}.
        <a class="white--text action" @click.prevent="setAutoPilot(false)">Click here to turn off auto pilot</a>.
      </p>
      <p class="ma-0" v-else>
        Auto pilot makes managing machines easy. Build the timeline by selecting from the below options.
        <a class="white--text action" @click.prevent="setAutoPilot(true)"><b> Click here to turn on auto pilot</b></a
        >, it has been off for {{ autoPilotOffDays }}.
      </p>
    </Bubble>
    <Bubble align="none" :class="{ 'not-allowed': disabled }" class="align-self-stretch mt-0">
      <a class="subtitle-1 d-block white--text action" @click="setupMaintenance">
        Click to setup the maintenance schedule
      </a>
    </Bubble>
  </div>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'AutoPilot',
    props: {
      vehicleId: {
        type: String
      },
      autoPilot: {
        type: Boolean
      },
      createdDate: {
        type: String
      },
      autoPilotOffDate: {
        type: String
      },
      activity: {
        type: Object,
        default: () => {}
      },
      disabled: {
        type: Boolean
      }
    },
    components: {
      Bubble
    },
    data: function() {
      return {}
    },
    computed: {
      autoPilotOnDays() {
        const counter = 30
        let days = counter - moment().diff(moment(this.createdDate), 'days')
        return days > 1 ? days.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ' days' : '1 day'
      },
      autoPilotOffDays() {
        let days = moment().diff(moment(this.autoPilotOffDate), 'days')
        return days > 1 ? days.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + ' days' : '1 day'
      }
    },
    methods: {
      setAutoPilot(value) {
        if (this.disabled) return
        this.$axios
          .post('/Timeline/UpdateAutoPilot', {
            vehicleId: this.vehicleId,
            autoPilot: value,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.$emit('change', { event: 'auto-pilot', action: 'update', activity: result.data })
            }
          })
      },
      setupMaintenance() {
        if (this.disabled) return
        this.$axios
          .post('/Timeline/SetupFirstMaintenanceSchedule', { vehicleId: this.vehicleId, activityId: this.activity.id })
          .then(result => {
            if (result && result.status === 200) {
              this.$emit('change', { event: 'setup-maintenance', action: 'add', activity: result.data })
            }
          })
      }
    }
  }
</script>

<style lang="scss">
</style>
