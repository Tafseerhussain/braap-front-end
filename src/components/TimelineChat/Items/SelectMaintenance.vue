<template>
  <Bubble :timestamp="activity.timestamp" align="right" :class="{ 'not-allowed': disabled }">
    <span class="body-1 d-block white--text">Select maintenance schedule</span>
    <template #bottom>
      <div class="d-flex justify-end flex-wrap mt-1 maintenance-options">
        <v-btn color="braap_green" :disabled="disabled" dark class="mb-1 ml-2" @click="on3Month">Every 3 months</v-btn>
        <v-btn color="braap_green" :disabled="disabled" dark class="mb-1 ml-2" @click="on6Month">Every 6 months</v-btn>
        <v-menu
          v-model="datePickerOpend"
          :close-on-content-click="false"
          transition="scale-transition"
          nudge-top="38"
          left
          top
          origin="bottom right"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="braap_green" :disabled="disabled" dark class="mb-1 ml-2" v-bind="attrs" v-on="on"
              >Select custom schedule</v-btn
            >
          </template>
          <v-date-picker
            color="primary"
            v-model="datePickerVal"
            :allowedDates="allowedDates"
            @input="maintenanceDateSelected"
          ></v-date-picker>
        </v-menu>
      </div>
    </template>
  </Bubble>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'SelectMaintenance',
    props: {
      vehicleId: {
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
      return {
        datePickerOpend: false,
        datePickerVal: ''
      }
    },
    created() {
      this.datePickerVal = moment()
        .add(1, 'day')
        .format('YYYY-MM-DD')
    },
    computed: {},
    methods: {
      moment,
      allowedDates: val => new Date(val) > new Date(),
      maintenanceDateSelected(val) {
        this.datePickerOpend = false
        this.addOrUpdateMaintenance({
          vehicleId: this.vehicleId,
          scheduleDate: moment(val).format(),
          intervalMonth: 6
        })
      },
      on3Month() {
        var date = moment()
          .set({ h: 0, m: 0, s: 0 })
          .add(3, 'M')
          .format()
        this.addOrUpdateMaintenance({
          vehicleId: this.vehicleId,
          scheduleDate: date,
          intervalMonth: 3
        })
      },
      on6Month() {
        var date = moment()
          .set({ h: 0, m: 0, s: 0 })
          .add(6, 'M')
          .format()
        this.addOrUpdateMaintenance({
          vehicleId: this.vehicleId,
          scheduleDate: date,
          intervalMonth: 6
        })
      },
      addOrUpdateMaintenance({ scheduleDate, vehicleId, intervalMonth }) {
        if (this.disabled) return
        this.$axios
          .post('/Timeline/SelectMaintenanceSchedule', {
            vehicleId,
            scheduleDate,
            intervalMonth,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.$emit('change', { event: 'select-maintenance', action: 'add', activity: result.data })
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .maintenance-options {
    max-width: 400px;
    .v-btn {
      text-transform: none !important;
    }
    .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
      background-color: $braap_green !important;
      color: #fff !important;
    }
  }
</style>
