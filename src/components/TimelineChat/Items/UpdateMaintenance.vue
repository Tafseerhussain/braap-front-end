<template>
  <div class="align-self-stretch">
    <Bubble
      ref="bubble"
      :timestamp="activity.timestamp"
      align="left"
      :class="{ 'not-allowed': disabled }"
      class="maintenance"
      :editable="!disabled"
    >
      <div class="maintenance-wrapper">
        <span v-if="!isUpdateAll" class="body-1 d-block white--text">
          First maintenance date is set for <br />{{ moment(scheduleDate).format('MMMM D, YYYY') }}
        </span>
        <span v-else class="body-1 d-block white--text">
          Updating all future maintenace dates to reflect the new cycle starting on
          {{ moment(scheduleDate).format('MMMM D, YYYY') }}
        </span>
      </div>
      <template #action>
        <v-menu
          v-model="datePickerOpend"
          :close-on-content-click="false"
          transition="scale-transition"
          right
          top
          origin="bottom left"
        >
          <template v-slot:activator="{ on, attrs }">
            <a v-bind="attrs" v-on="on">Change date</a>
          </template>
          <v-date-picker
            color="primary"
            v-model="datePickerVal"
            :allowedDates="(val) => allowedDates(val, scheduleDate)"
            @input="maintenanceDateSelected"
          ></v-date-picker> </v-menu
        >&nbsp;| <a @click="cancelMaintenance">Cancel</a>
      </template>
      <template #bottom>
        <div class="mt-1 d-flex flex-column align-self-stretch">
          <div class="ml-auto" style="max-width: 360px">
            <div class="mb-2 grey--text body-2 ml-auto">Future Maintenance Dates</div>
            <div class="d-flex flex-wrap justify-start ml-auto future-jobs">
              <div class="mb-1" v-for="(job, index) in filteredJobs" :key="job.id">
                <div class="d-flex align-center">
                  <v-chip color="braap_orange" dark class="rounded mr-1" :class="{ 'ml-6': index % 2 === 1 }">{{
                    moment(job.date).format('YYYY')
                  }}</v-chip>
                  <v-chip color="braap_orange" dark class="rounded mr-1">{{
                    moment(job.date).format('MMM DD')
                  }}</v-chip>
                  <v-icon v-if="!disabled" small class="mr-1" @click="job.show = !job.show">mdi-cog-outline</v-icon>
                  <div v-else class="mr-5"></div>
                </div>
                <v-expand-transition>
                  <div class="actions mt-0 mb-2 body-2" :class="{ 'ml-6': index % 2 === 1 }" v-show="job.show">
                    <v-menu
                      v-model="job.open"
                      :close-on-content-click="false"
                      transition="scale-transition"
                      right
                      top
                      origin="bottom left"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <a v-bind="attrs" v-on="on">Change date</a>
                      </template>
                      <v-date-picker
                        color="primary"
                        v-model="job.dateVal"
                        :allowedDates="(val) => allowedDates(val, job.dateVal)"
                        @input="updateJob(job)"
                      ></v-date-picker>
                    </v-menu>
                    | <a @click="removeJob(job)">Cancel</a>
                  </div>
                </v-expand-transition>
              </div>
            </div>
            <div class="text-right mr-8 body-2 grey-text">
              <a v-if="jobs.length > 8 && !showAllJob" @click="moreJob(true)">More</a>
              <a v-if="jobs.length > 8 && showAllJob" @click="moreJob(false)">Less</a>
            </div>
          </div>
        </div>
      </template>
    </Bubble>
    <Bubble align="left">
      <span class="body-1">The maintenance schedule is automated and setup through the end of the machine life.</span>
    </Bubble>
  </div>
</template>

<script>
  import Bubble from './Bubble.vue'
  import moment from 'moment'

  export default {
    name: 'UpdateMaintenance',
    props: {
      vehicleId: {
        type: String
      },
      scheduleDate: {
        type: String
      },
      intervalMonth: {
        type: Number
      },
      futureJobs: {
        type: Array,
        default: () => []
      },
      activity: {
        type: Object,
        default: () => {}
      },
      disabled: {
        type: Boolean
      },
      isUpdateAll: {
        type: Boolean
      }
    },
    components: {
      Bubble
    },
    data: function() {
      return {
        datePickerOpend: false,
        datePickerVal: '',
        editSchedule: '',
        jobs: [],
        showAllJob: false
      }
    },
    created() {
      this.datePickerVal = moment(this.scheduleDate).format('YYYY-MM-DD')
      this.jobs = this.futureJobs.map(x => {
        return {
          ...x,
          dateVal: moment(x.date).format('YYYY-MM-DD'),
          show: false,
          open: false
        }
      })
    },
    watch: {
      scheduleDate(val) {
        this.datePickerVal = moment(val).format('YYYY-MM-DD')
      },
      futureJobs(val) {
        this.jobs = val.map(x => {
          return {
            ...x,
            dateVal: moment(x.date).format('YYYY-MM-DD'),
            show: false,
            open: false
          }
        })
      }
    },
    computed: {
      filteredJobs() {
        return this.showAllJob ? this.jobs : this.jobs.filter((x, index) => index < 8)
      }
    },
    methods: {
      moment,
      allowedDates(val, current) {
        let date = moment(val).add('7', 'h')
        let allowed = date > moment() // greater than today
        allowed = allowed && date >= moment(current).add(-14, 'd') // greater than 14 days before
        allowed = allowed && date <= moment(current).add(14, 'd') // less than 14 days after
        return allowed
      },
      maintenanceDateSelected(val) {
        this.datePickerOpend = false
        this.updateMaintenance({
          vehicleId: this.vehicleId,
          scheduleDate: moment(val).format(),
          intervalMonth: this.intervalMonth
        })
      },
      updateMaintenance({ scheduleDate, vehicleId, intervalMonth }) {
        if (this.disabled) return
        this.$axios
          .post('/Timeline/UpdateMaintenanceSchedule', {
            vehicleId,
            scheduleDate,
            intervalMonth,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              this.$refs.bubble.closeAction()
              this.$emit('change', { event: 'update-maintenance', action: 'update', activity: result.data })
            }
          })
      },
      cancelMaintenance() {
        this.$axios
          .post('/Timeline/CancelMaintenanceSchedule', { vehicleId: this.vehicleId, activityId: this.activity.id })
          .then(result => {
            if (result && result.status === 200) {
              this.$emit('change', {
                event: 'cancel-maintenance',
                action: 'remove',
                activity: this.activity
              })
            }
          })
      },
      openChat() {
        window.$('#zsiq_agtpic').click()
        window.$('#zsiq_maintitle').click()

        window.$('#zsiq_byline').click()
      },
      updateJob(job) {
        this.$axios
          .post('/Timeline/UpdateMaintenanceDate', {
            id: job.id,
            maintenanceDate: job.dateVal,
            activityId: this.activity.id
          })
          .then(result => {
            if (result && result.status === 200) {
              job.open = false
              job.show = false
              job.date = moment(job.dateVal).format('YYYY-MM-DD')
            }
          })
      },
      removeJob(job) {
        this.$axios.post('/Timeline/RemoveMaintenanceDate', { id: job.id, activityId: this.activity.id }).then(result => {
          if (result && result.status === 200) {
            job.open = false
            job.show = false
            this.jobs.splice(this.jobs.indexOf(job), 1)
          }
        })
      },
      moreJob(showAll) {
        this.showAllJob = showAll
        this.$emit('height-change')
      }
    }
  }
</script>

<style lang="scss">
  @import '@/styles/color.scss';

  .maintenance {
    .future-jobs {
      .v-chip {
        width: 68px;
        justify-content: center;
      }
    }
    .actions {
      // font-size: 12px;
      color: $braap_grey;
      a {
        color: $braap_grey;
        border-bottom: 1px solid transparent;
        transition: all 0.35s;
        text-decoration: none !important;

        &:hover {
          border-bottom: 1px solid $braap_grey;
        }
      }
    }
  }
</style>
