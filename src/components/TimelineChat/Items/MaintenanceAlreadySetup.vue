<template>
  <div class="align-self-end maintenance-alert">
    <Bubble
      :timestamp="activity.timestamp"
      color="braap_red"
      align="right"
      :class="{ 'not-allowed': disabled || step2 }"
    >
      <span class="body-1 d-block white--text">
        Maintenance is already setup. The next scheduled date is {{ moment(nextScheduleDate).format('MMMM D, YYYY') }}.
        Do you want to move that date to today?
      </span>
      <template #bottom>
        <div class="d-flex justify-end flex-wrap mt-1 maintenance-options">
          <v-btn color="braap_green" :disabled="disabled || step2" dark class="mb-1 ml-2" @click="setForToday">
            Set for today
          </v-btn>
          <v-btn color="braap_green" :disabled="disabled || step2" dark class="mb-1 ml-2" @click="keepTheSame">
            Keep the same
          </v-btn>
        </div>
      </template>
    </Bubble>
    <Bubble v-if="step2" color="braap_red" align="right" :class="{ 'not-allowed': disabled }">
      <span class="body-1 d-block white--text">
        Would you like to update all the upcoming maintenance dates to this schedule or just add this one?
      </span>
      <v-btn v-if="!disabled" light class="close-bt" icon elevation="0" small @click="step2 = false">
        <v-icon light color="braap-grey">mdi-close-circle</v-icon>
      </v-btn>
      <template #bottom>
        <div class="d-flex justify-end flex-wrap mt-1 maintenance-options">
          <v-btn color="braap_green" :disabled="disabled" dark class="mb-1 ml-2" @click="updateAll"> Update all </v-btn>
          <v-btn color="braap_green" :disabled="disabled" dark class="mb-1 ml-2" @click="addThisOne">
            Add this one
          </v-btn>
        </div>
      </template>
    </Bubble>
  </div>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'MaintenanceAlreadySetup',
    props: {
      vehicleId: {
        type: String
      },
      nextScheduleDate: {
        type: String
      },
      orderId: {
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
        step2: false
      }
    },
    created() {},
    computed: {},
    methods: {
      moment,
      on6Month() {
        var date = moment()
          .set({ h: 0, m: 0, s: 0 })
          // .add(6, 'M')
          .format()
        return this.addOrUpdateMaintenance({
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
            isUpdateAll: true,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.mapOrderToJobWork(result.data)
            }
          })
      },
      keepTheSame() {
        this.$axios
          .post('/Timeline/AddMaintenanceCancelAlert', {
            vehicleId: this.vehicleId,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.mapOrderToJobWork(result.data)
            }
          })
      },
      setForToday() {
        this.step2 = true
        this.$root.scrollTimelineToBottom()
      },
      updateAll() {
        this.on6Month()
      },
      addThisOne() {
        this.$axios
          .post('/Timeline/AddMaintenanceDate', {
            vehicleId: this.vehicleId,
            activityId: this.activity.id,
            maintenanceDate: moment()
              .set({ h: 0, m: 0, s: 0 })
              .format()
          })
          .then(result => {
            if (result && result.status === 200) {
              this.mapOrderToJobWork(result.data)
            }
          })
      },
      mapOrderToJobWork(activity) {
        this.$axios
          .post('/Timeline/MapOrderToJobWork', {
            vehicleId: this.vehicleId,
            orderId: this.orderId,
            activityId: activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.$emit('reload')
            }
          })
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .maintenance-alert {
    max-width: 400px;
    .v-btn {
      text-transform: none !important;
    }
    .theme--dark.v-btn.v-btn--disabled.v-btn--has-bg {
      background-color: $braap_green !important;
      color: #fff !important;
    }
    .close-bt {
      position: absolute !important;
      top: 50%;
      margin-top: -14px;
      left: -30px;
    }
  }
</style>
