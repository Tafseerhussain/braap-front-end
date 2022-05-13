<template>
  <v-card class="work-statistics section-wrapper rounded-10 pa-10 mb-5" v-if="show">
    <v-card-title class="text-h5 primary--text font-weight-medium pa-0 mb-3">
      <v-icon color="braap_orange" size="36" class="mr-2">mdi-account-clock-outline</v-icon>
      <span class="mt-1">Work Statistics</span>
    </v-card-title>
    <v-card-text class="pa-0 pt-4">
      <div class="d-flex align-center body-2 mb-3" v-if="statistics.minutesWorkedInBraap">
        <v-icon>mdi-chevron-right</v-icon>
        <span class="ml-1 flex-grow-1">Total hours worked in Braap</span>
        <span class="">{{ getWorkingString(statistics.minutesWorkedInBraap) }}</span>
      </div>
      <div class="d-flex align-center body-2 mb-3" v-if="statistics.minutesWorkedThisMonth">
        <v-icon>mdi-chevron-right</v-icon>
        <span class="ml-1 flex-grow-1">Total hours worked this month</span>
        <span class="">{{ getWorkingString(statistics.minutesWorkedThisMonth) }}</span>
      </div>
      <div class="d-flex align-center body-2 mb-3" v-if="statistics.minutesWorkedThisWeek">
        <v-icon>mdi-chevron-right</v-icon>
        <span class="ml-1 flex-grow-1">Total hours worked this week</span>
        <span class="">{{ getWorkingString(statistics.minutesWorkedThisWeek) }}</span>
      </div>
      <div class="d-flex align-center body-2 mb-3" v-if="statistics.minutesWorkedToday">
        <v-icon>mdi-chevron-right</v-icon>
        <span class="ml-1 flex-grow-1">Total hours worked today</span>
        <span class="">{{ getWorkingString(statistics.minutesWorkedToday) }}</span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'WorkStatistics',
    components: {},
    data: function() {
      return {
        statistics: {}
      }
    },
    watch: {},
    computed: {
      show() {
        return (
          this.statistics &&
          (this.statistics.minutesWorkedInBraap ||
            this.statistics.minutesWorkedThisMonth ||
            this.statistics.minutesWorkedThisWeek ||
            this.statistics.minutesWorkedToday)
        )
      }
    },
    created() {
      this.getWorkStatistics()
    },
    methods: {
      moment,
      getWorkingString(work) {
        var hour = work / 60
        var minute = work % 60
        var str = hour > 0 ? Math.floor(hour) + (hour > 1 ? ' hours' : ' hour') : ''
        str += minute > 0 ? (hour > 0 ? ' and ' : '') + minute + (minute > 1 ? ' minutes' : 'minute') : ''
        return str
      },
      getWorkStatistics() {
        this.$axios.post('/api/account/workStatistics').then(result => {
          if (result.success) {
            this.statistics = result.data
          }
        })
      }
    }
  }
</script>

<style lang="scss">
  .work-statistics {
    .v-card__text {
    }
  }
</style>
