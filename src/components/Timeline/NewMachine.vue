<template>
  <div class="new-machine">
    <a class="auto-pilot">
      <template v-if="autoPilot">
        <v-icon color="#3bb300" @click="setAutoPilot(false)">$svg-on</v-icon>
        <span @click="setAutoPilot(false)">Timeline auto pilot is on and helps streamline critical events.</span>
      </template>
      <template v-else>
        <v-icon color="#a4a4a4" @click="setAutoPilot(true)">$svg-on</v-icon>
        <span @click="setAutoPilot(true)">Timeline auto pilot is off.</span>
      </template>
    </a>
    <div class="event-ui">
      <div class="today-date">{{ today }}</div>
      <div class="separator"></div>
      <div class="event-item">
        <b>Build out the timeline. </b>
        <template v-if="autoPilot">
          <span
            >Note, auto pilot is on and will automatically set the first maintenance date in {{ autoPilotOnDays }}.
          </span>
          <a class="bt-off" @click.prevent="setAutoPilot(false)">Click here to turn off auto pilot.</a>
        </template>
        <template v-else>
          <span
            ><span
              >Auto pilot makes managing machines easy. Build the timeline by selecting from the below options.</span
            >
          </span>
          <a class="bt-on" @click.prevent="setAutoPilot(true)"><b> Click here to turn on auto pilot</b></a
          >, it has been off for {{ autoPilotOffDays }}.
        </template>
      </div>
      <div class="event-actions">
        <a class="action-bt" @click.prevent="setupMaintenance"
          ><v-icon class="icon">mdi-plus</v-icon>Setup maintenance schedule</a
        ><span> | </span> <a class="action-bt"><v-icon class="icon">mdi-plus</v-icon>Order parts</a><span> | </span>
        <a class="action-bt"><v-icon class="icon">mdi-plus</v-icon>Diagnose a problem</a>
      </div>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'NewMachine',
    props: {
      machine: {
        type: Object,
        default: function() {
          return {}
        }
      }
    },
    data() {
      return {
        filterOpen: false,
        isNewest: true,
        today: moment().format('MMM DD, YYYY'),
        vehicleId: null,
        autoPilot: false,
        autoPilotOffDate: null,
        createdDate: null
      }
    },
    watch: {
      machine(value) {
        if (value) {
          this.createdDate = value.createdDate
          this.autoPilotOffDate = value.autoPilotOffDate
          this.autoPilot = value.autoPilot
          this.vehicleId = value.vehicleId
        }
      }
    },
    created() {
      if (this.machine) {
        this.createdDate = this.machine.createdDate
        this.autoPilotOffDate = this.machine.autoPilotOffDate
        this.autoPilot = this.machine.autoPilot
        this.vehicleId = this.machine.vehicleId
      }
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
        var $this = this
        $this.$axios
          .post('/Timeline/UpdateAutoPilot', {
            vehicleId: $this.vehicleId,
            autoPilot: value
          })
          .then(function(result) {
            if (result && result.status === 200) {
              $this.autoPilot = value
              if (!$this.autoPilot) {
                $this.autoPilotOffDate = new Date()
              }
            }
          })
      },
      setupMaintenance() {
        var $this = this
        $this.$axios.post('/Timeline/SetupMaintenanceSchedule', { vehicleId: this.vehicleId }).then(result => {
          if (result && result.status === 200) {
            $this.$emit('setup', result.data)
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .new-machine {
    .today-date {
      font-weight: bold;
      color: #0070c1;
    }
    .auto-pilot {
      border: none;
      background: none;
      display: flex;
      align-items: center;
      padding: 0;
      margin-bottom: 15px;
    }
    .separator {
      height: 15px;
      margin-left: 30px;
      border-left: 1px solid #0070c1;
    }
    .event-item {
      padding-left: 28px;
      line-height: 22px;
      b {
        color: #404040;
      }
      .bt-off {
        color: #cecece;
        cursor: pointer;
      }
      .red-text {
        color: #e8343c;
        background-color: transparent;
      }
      .bt-on {
        color: #404040;
        cursor: pointer;
      }
    }

    .event-actions {
      display: flex;
      font-size: 12px;
      line-height: 16px;
      margin: 5px 0;
      padding-left: 28px;
      margin-top: 30px;

      span {
        margin: 0 6px;
      }
      .action-bt {
        display: flex;
        align-items: center;
        text-transform: uppercase;
        cursor: pointer;
        margin-right: 4px;
      }
    }
  }
</style>
