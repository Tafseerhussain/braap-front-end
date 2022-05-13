<template>
  <div class="work-schedule">
    <v-card class="section-wrapper rounded-10 pa-10 mb-5">
      <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
        <div class="d-flex align-center">
          <v-icon color="braap_orange" size="36" class="mr-2">mdi-clock-time-four-outline</v-icon>
          <span class="mt-1">Hours & Schedule</span>
        </div>
      </v-card-title>
      <v-card-text class="pa-0 pt-4">
        <div class="d-flex align-center">
          <v-icon>mdi-chevron-right</v-icon>
          <span class="ml-1 flex-grow-1 body-2">Number of hours you can work a week.</span>
          <HourInput :value="weeklyHour" @on-change="weeklyHourChange"></HourInput>
        </div>
      </v-card-text>
    </v-card>

    <v-card class="section-wrapper rounded-10 pa-10 mb-5 pb-5">
      <v-card-title class="text-h5 primary--text font-weight-medium pa-0">
        <div class="d-flex align-center mb-3">
          <v-icon color="braap_orange" size="36" class="mr-2">mdi-timelapse</v-icon>
          <span class="mt-1">Ongoing Schedule</span>
        </div>

        <v-scale-transition origin="center">
          <v-btn
            fab
            color="primary"
            style="height: 48px; width: 48px"
            class="ml-auto"
            @click="dialog = true"
            transition="scale-transition"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-scale-transition>
      </v-card-title>

      <v-card-text class="pa-0 pt-4">
        <div class="d-flex align-center mb-5">
          <v-icon>mdi-chevron-right</v-icon>
          <span class="ml-1 flex-grow-1 body-2"
            >Select the weeks that you work more or less than
            {{ weeklyHour === 1 ? weeklyHour + ' hour' : weeklyHour + ' hours' }}.</span
          >
        </div>
        <v-dialog v-model="dialog" max-width="290" overlay-opacity="1" overlay-color="rgba(0,0,0,0.5)">
          <v-card class="pa-0 rounded-10">
            <v-card-text class="pa-0">
              <v-date-picker
                color="braap_orange"
                flat
                v-model="picker"
                class="rounded-10"
                :allowed-dates="allowedDates"
                show-adjacent-months
              ></v-date-picker>
            </v-card-text>
            <v-card-actions class="pa-0">
              <v-btn
                class="rounded-bl-10 rounded-br-10"
                elevation="0"
                block
                :dark="!!picker"
                tile
                color="braap_orange"
                x-large
                :disabled="!picker"
                @click="addShedule"
                >Add Week to schedule</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <v-slide-y-transition group>
          <div v-for="schedule in schedules" :key="schedule.id" class="d-flex align-center mb-5">
            <div class="flex-grow-1 body-2">
              <div>Week of {{ moment(schedule.week).format('MMM D, YYYY') }}</div>
              <div>Update number of hours you can work</div>
            </div>
            <HourInput :value="schedule.hours" @on-change="(val) => scheduleHourChange(schedule, val)"></HourInput>
          </div>
        </v-slide-y-transition>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
  import moment from 'moment'
  import HourInput from '@/components/Common/HourInput.vue'

  export default {
    name: 'WorkSchedule',
    components: {
      HourInput
    },
    data: function() {
      return {
        weeklyHour: 20,
        dialog: false,
        picker: null,
        schedules: []
      }
    },
    watch: {},
    computed: {},
    created() {
      this.getWeeklyHour()
      this.getWeekSchedule()
    },
    methods: {
      moment,
      allowedDates(val) {
        let date = moment(val)
        let allowed = date > moment() // greater than today
        allowed = allowed && moment(val).day() === 0 // must be sunday
        allowed = allowed && this.schedules.filter(x => x.week === date.format('YYYY-MM-DD')).length === 0 // must not be selected
        return allowed
      },
      getWeekSchedule() {
        this.$axios.post('/api/account/userHoursSchedules').then(result => {
          if (result.success) {
            this.schedules = result.data
          }
        })
      },
      getWeeklyHour() {
        this.$axios.post('/api/account/userHoursSchedules/workingHoursPerWeek').then(result => {
          if (result.success) {
            this.weeklyHour = result.data
          }
        })
      },
      weeklyHourChange(hour) {
        this.$axios.post(`/api/account/userHoursSchedules/workingHoursPerWeek/update/${hour}`).then(result => {
          if (result.data) {
            this.weeklyHour = hour
          }
        })
      },
      addShedule() {
        this.dialog = false
        let data = {
          week: this.picker,
          hours: this.weeklyHour
        }
        this.picker = null
        this.$axios.post('/api/account/userHoursSchedules/addOrUpdate', data).then(result => {
          if (result.success) {
            this.getWeekSchedule()
          }
        })
      },
      scheduleHourChange(schedule, hours) {
        this.$axios.post('/api/account/userHoursSchedules/addOrUpdate', { ...schedule, hours: hours })
      }
    }
  }
</script>

<style lang="scss">
  .work-schedule {
    width: 100%;

    .v-card__text {
    }
  }
</style>
