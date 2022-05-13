<template>
  <div class="setup-maintenance">
    <div class="event-head">
      <div class="event-meta">
        <span class="time">{{ moment(createdTime).format('MMM D, YYYY h:mm A') }}</span>
        <span class="user">Created by {{ createdUser }}</span>
      </div>
      <template v-if="maintenanceDate">
        <div class="event-title" v-if="!canceled">
          Maintenance is set for {{ moment(maintenanceDate).format('MMM D, YYYY') }}.
        </div>
        <div class="event-title" v-else>
          Maintenance is set for <s>{{ moment(maintenanceDate).format('MMM D, YYYY') }}</s
          >.
        </div>
        <div class="event-actions" v-if="!canceled">
          <v-menu
            v-model="datePickerOpend"
            :close-on-content-click="false"
            transition="scale-transition"
            left
            bottom
            origin="center"
          >
            <template v-slot:activator="{ on, attrs }">
              <a class="action" v-bind="attrs" v-on="on">Change</a>
            </template>
            <v-date-picker
              color="#203862"
              v-model="datePickerVal"
              :allowedDates="allowedDates"
              @input="maintenanceDateSelected"
              :landscape="true"
            ></v-date-picker>
          </v-menu>

          <span> | </span> <a class="action" @click.prevent="cancel">Cancel</a><span> | </span>
          <a class="action" @click.prevent="openChat">Get Help</a>
        </div>
      </template>
      <template v-else>
        <div class="event-title">Select maintenance schedule</div>
        <div class="event-actions">
          <v-menu
            v-model="datePickerOpend"
            :close-on-content-click="false"
            transition="scale-transition"
            left
            bottom
            origin="center"
          >
            <template v-slot:activator="{ on, attrs }">
              <a class="action" v-bind="attrs" v-on="on">Select Date</a>
            </template>
            <v-date-picker
              color="#203862"
              v-model="datePickerVal"
              :allowedDates="allowedDates"
              @input="maintenanceDateSelected"
              :landscape="true"
            ></v-date-picker>
          </v-menu>

          <span> | </span> <a class="action" @click.prevent="on3Month">3 Months</a><span> | </span>
          <a class="action" @click.prevent="on6Month">6 Months</a>
        </div>
      </template>
    </div>
    <div class="notifications" v-show="showTimeZoneAlert">
      <div class="item line-indicator">
        <div class="n-text">
          <v-icon class="icon">$svg-exclamation</v-icon>
          <b>SET TIME ZONE</b>: Check the time. if it is incorrect set your time zone.
        </div>
        <div class="actions">
          <a class="action" @click.prevent="updateTimezone">Update</a><span> | </span>
          <a class="action" @click.prevent="cancelTimezoneAlert">Cancel</a>
        </div>
      </div>
    </div>
    <div class="event-history">
      <div class="event-item line-indicator" v-if="notice && notice.newDate">
        <div class="event-meta">
          <span class="time">{{ moment().format('MMM D, YYYY h:mm A') }}</span>
          <span class="user">Updated by {{ notice.updatedUser }}</span>
        </div>
        <div class="event-title">
          <v-icon class="icon">$svg-change</v-icon>
          <div class="content">
            <span
              ><s
                ><b>Original maintenance:</b>
                {{ moment(notice.oldDate).format('MMM D, YYYY') }}
              </s></span
            ><span
              ><b>New Maintenance date:</b>
              {{ moment(notice.newDate).format('MMM D, YYYY') }}
            </span>
          </div>
        </div>
      </div>
      <JobStatus ref="jobStatus" :machine="machine"></JobStatus>
      <MaintenancePayment :machine="machine" @payment="onPayment"></MaintenancePayment>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  import MaintenancePayment from './MaintenancePayment.vue'
  import JobStatus from './JobStatus.vue'

  export default {
    name: 'SetupMaintenance',
    props: {
      maintenance: {
        type: Object,
        default: function() {
          return {}
        }
      },
      machine: {
        type: Object,
        default: function() {
          return {}
        }
      },
      username: {
        type: String
      }
    },
    components: {
      MaintenancePayment,
      JobStatus
    },
    data() {
      return {
        datePickerOpend: false,
        datePickerVal: '',
        showTimeZoneAlert: false,
        notice: {
          updatedTime: '',
          updatedUser: 'Harris Wei',
          newDate: '',
          oldDate: ''
        },
        canceled: false
      }
    },
    computed: {
      maintenanceDate() {
        return this.maintenance.maintenanceDate
      },
      createdTime() {
        return this.maintenance.createdTime
      },
      createdUser() {
        return this.maintenance.createdUser
      },
      updatedTime() {
        return this.maintenance.updatedTime
      },
      updatedUser() {
        return this.maintenance.updatedUser
      },
      vehicleId() {
        return this.maintenance.vehicleId
      }
    },
    mounted() {
      if (this.maintenanceDate) this.datePickerVal = moment(this.maintenanceDate).format('YYYY-MM-DD')
      else
        this.datePickerVal = moment()
          .add(1, 'day')
          .format('YYYY-MM-DD')

      this.showTimeZoneAlert = !this.$cookie.get('BRAAP_TimezoneConfirmed')
    },
    methods: {
      moment,
      allowedDates: val => new Date(val) > new Date(),
      maintenanceDateSelected(val) {
        this.datePickerOpend = false
        if (this.maintenanceDate) {
          this.notice.updatedTime = new Date()
          this.notice.updatedUser = this.username
          this.notice.newDate = val
          this.notice.oldDate = this.maintenanceDate
        }
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
      cancel() {
        var $this = this
        this.canceled = true
        $this.$axios.post('/Timeline/DeleteMaintenanceSchedule', { vehicleId: $this.vehicleId }).then(result => {
          if (result && result.status === 200) {
            $this.$emit('maintenanceUpdate', { ...$this.maintenance, canceled: true })
          }
        })
      },
      addOrUpdateMaintenance({ scheduleDate, vehicleId, intervalMonth }) {
        var $this = this
        $this.$axios
          .post('/Timeline/SetupMaintenanceSchedule', {
            vehicleId,
            scheduleDate,
            intervalMonth
          })
          .then(result => {
            if (result && result.status === 200) {
              $this.$emit('maintenanceUpdate', result.data)
            }
          })
      },
      openChat() {
        window.$('#zsiq_agtpic').click()
        window.$('#zsiq_maintitle').click()

        window.$('#zsiq_byline').click()
      },
      updateTimezone() {
        this.$cookie.set('BRAAP_TimezoneConfirmed', true, 3650)
        this.showTimeZoneAlert = false
        window.location.href = '/Account'
      },
      cancelTimezoneAlert() {
        this.$cookie.set('BRAAP_TimezoneConfirmed', true, 3650)
        this.showTimeZoneAlert = false
      },
      onPayment() {
        this.$refs.jobStatus.getActiveJobStatus()
      }
    }
  }
</script>

<style lang="scss" scoped>
  .setup-maintenance {
    font-size: 12px;
    position: relative;
    padding-bottom: 10px;

    .action {
      color: #a4a4a4;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.3s;
      border-bottom: 1px solid transparent;
      &:hover {
        border-bottom: 1px solid #a4a4a4;
      }
    }

    .notifications {
      .item {
        display: flex;
        justify-content: space-between;
        padding: 20px 10px 5px 86px;
        position: relative;
        &:before {
          content: ' ';
          display: block;
          width: 1px;
          height: 15px;
          top: 0px;
          left: 110px;
          position: absolute;
          background-color: #a4a4a4;
        }
        .n-text {
          display: flex;
          align-items: center;
          .icon {
            margin-right: 5px;
          }
          b {
            color: #404040;
          }
        }
      }
    }
  }
</style>

